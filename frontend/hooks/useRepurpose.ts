import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { RepurposeFormat, RepurposeParams } from '@/lib/repurpose/repurposePromptBuilder';
import { RepurposeContent } from '@/lib/repurpose/repurposeContentParser';
import { generateMultipleFormats, generateRepurposedContent } from '@/lib/repurpose/repurposeEngine';
import { htmlToPlainText } from '@/lib/repurpose/htmlToPlainText';
import { exportRepurposedToZip } from '@/lib/repurpose/repurposeExporter';

export type FormatStatus = 'idle' | 'generating' | 'complete' | 'failed' | 'saved';

export interface FormatState {
    status: FormatStatus;
    streamedText: string;
    error: string | null;
    characterCount: number;
}

export const useRepurpose = (blogIdParam?: string) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { apiConfig } = useAppContext();
    const { user } = useAuth();
    const supabase = createClient();

    const blogId = blogIdParam || searchParams.get('blogId');

    // --- State ---
    const [blog, setBlog] = useState<any>(null);
    const [selectedFormats, setSelectedFormats] = useState<RepurposeFormat[]>([]);
    const [formatStates, setFormatStates] = useState<Record<string, FormatState>>({});
    const [generatedContent, setGeneratedContent] = useState<Record<string, RepurposeContent>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [customInstruction, setCustomInstruction] = useState('');
    const [activeTab, setActiveTab] = useState<RepurposeFormat | null>(null);
    const [isLoadingBlog, setIsLoadingBlog] = useState(!!blogId);

    const abortControllerRef = useRef<AbortController | null>(null);

    // --- Initial Load ---
    useEffect(() => {
        if (!blogId) return;

        const loadBlog = async () => {
            setIsLoadingBlog(true);
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq('id', blogId)
                    .single();

                if (error) throw error;
                setBlog(data);

                // Load existing repurposed content if any
                if ((data as any).repurposed_content) {
                    const content = (data as any).repurposed_content as Record<string, RepurposeContent>;
                    setGeneratedContent(content);

                    const initialStates: Record<string, FormatState> = {};
                    Object.keys(content).forEach((format) => {
                        initialStates[format] = {
                            status: 'saved',
                            streamedText: content[format].content,
                            error: null,
                            characterCount: content[format].content.length,
                        };
                    });
                    setFormatStates(initialStates);
                }
            } catch (err) {
                console.error('Failed to load blog:', err);
                toast.error('Failed to load blog for repurposing');
            } finally {
                setIsLoadingBlog(false);
            }
        };

        loadBlog();
    }, [blogId, supabase]);

    // --- Selection Actions ---
    const toggleFormat = useCallback((format: RepurposeFormat) => {
        setSelectedFormats((prev) =>
            prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
        );
    }, []);

    const selectSocialPack = useCallback(() => {
        setSelectedFormats(['linkedin', 'twitter', 'instagram', 'facebook']);
    }, []);

    const selectContentPack = useCallback(() => {
        setSelectedFormats(['email', 'youtube']);
    }, []);

    const selectAll = useCallback(() => {
        setSelectedFormats(['linkedin', 'twitter', 'email', 'youtube', 'instagram', 'facebook', 'whatsapp', 'pinterest']);
    }, []);

    const clearAll = useCallback(() => {
        setSelectedFormats([]);
    }, []);

    // --- Generation ---
    const saveToSupabase = useCallback(async (format: RepurposeFormat, content: RepurposeContent) => {
        if (!blogId) return;
        try {
            const response = await fetch('/api/repurpose/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogId,
                    format,
                    content,
                    model: apiConfig.selectedModel,
                }),
            });
            if (!response.ok) throw new Error('Failed to save to cloud');

            setFormatStates(prev => ({
                ...prev,
                [format]: { ...prev[format], status: 'saved' }
            }));
        } catch (err) {
            console.error(`Failed to save ${format} to cloud:`, err);
        }
    }, [blogId, apiConfig.selectedModel]);

    const generateSelected = useCallback(async () => {
        if (!blog || selectedFormats.length === 0) return;
        if (!apiConfig.apiKey) {
            toast.error('Please configure your API key in settings first');
            return;
        }

        setIsGenerating(true);
        abortControllerRef.current = new AbortController();

        const params: RepurposeParams = {
            blogTitle: blog.title,
            blogPlainText: htmlToPlainText(blog.blog_html || ''),
            focusKeyword: blog.focus_keyword || '',
            country: blog.country || 'Global',
            authorName: user?.user_metadata?.full_name,
            wordCount: blog.word_count || 0,
            customInstruction,
        };

        // Initialize states for new generation
        const newStates = { ...formatStates };
        selectedFormats.forEach(f => {
            newStates[f] = { status: 'generating', streamedText: '', error: null, characterCount: 0 };
        });
        setFormatStates(newStates);
        if (!activeTab && selectedFormats.length > 0) setActiveTab(selectedFormats[0]);

        try {
            await generateMultipleFormats(
                selectedFormats,
                params,
                apiConfig as any,
                (format, text) => {
                    setFormatStates(prev => ({
                        ...prev,
                        [format]: { ...prev[format], streamedText: text, characterCount: text.length }
                    }));
                },
                async (format, content) => {
                    setGeneratedContent(prev => ({ ...prev, [format]: content }));
                    setFormatStates(prev => ({ ...prev, [format]: { ...prev[format], status: 'complete' } }));
                    await saveToSupabase(format, content);
                },
                (format, error) => {
                    setFormatStates(prev => ({ ...prev, [format]: { ...prev[format], status: 'failed', error } }));
                },
                abortControllerRef.current.signal
            );
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                toast.error('Generation failed');
            }
        } finally {
            setIsGenerating(false);
        }
    }, [blog, selectedFormats, apiConfig, customInstruction, user, activeTab, formatStates, saveToSupabase]);

    const regenerateFormat = useCallback(async (format: RepurposeFormat) => {
        if (!blog) return;
        if (!apiConfig.apiKey) {
            toast.error('Please configure your API key in settings first');
            return;
        }

        setFormatStates(prev => ({
            ...prev,
            [format]: { status: 'generating', streamedText: '', error: null, characterCount: 0 }
        }));
        setActiveTab(format);

        const params: RepurposeParams = {
            blogTitle: blog.title,
            blogPlainText: htmlToPlainText(blog.blog_html || ''),
            focusKeyword: blog.focus_keyword || '',
            country: blog.country || 'Global',
            authorName: user?.user_metadata?.full_name,
            wordCount: blog.word_count || 0,
            customInstruction,
        };

        const abortController = new AbortController();

        try {
            await generateRepurposedContent(
                format,
                params,
                apiConfig as any,
                (text) => {
                    setFormatStates(prev => ({
                        ...prev,
                        [format]: { ...prev[format], streamedText: text, characterCount: text.length }
                    }));
                },
                async (content) => {
                    setGeneratedContent(prev => ({ ...prev, [format]: content }));
                    setFormatStates(prev => ({ ...prev, [format]: { ...prev[format], status: 'complete' } }));
                    await saveToSupabase(format, content);
                },
                (error) => {
                    setFormatStates(prev => ({ ...prev, [format]: { ...prev[format], status: 'failed', error } }));
                },
                abortController.signal
            );
        } catch (err: any) {
            if (err.name !== 'AbortError') toast.error(`Failed to regenerate ${format}`);
        }
    }, [blog, apiConfig, customInstruction, user, saveToSupabase]);

    const cancelGeneration = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsGenerating(false);
        }
    }, []);

    const updateContent = useCallback(async (format: RepurposeFormat, updates: Partial<RepurposeContent>) => {
        if (!blogId) return;

        // Update local state
        setGeneratedContent(prev => ({
            ...prev,
            [format]: { ...prev[format], ...updates, edited: true }
        }));

        try {
            const response = await fetch('/api/repurpose/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    blogId,
                    format,
                    updatedContent: updates,
                }),
            });
            if (!response.ok) throw new Error('Failed to update in cloud');
            toast.success('Changes saved');
        } catch (err) {
            console.error(`Failed to update ${format}:`, err);
            toast.error('Failed to save changes');
        }
    }, [blogId]);

    const downloadAll = useCallback(async () => {
        if (!blog || Object.keys(generatedContent).length === 0) {
            toast.error('No content to download');
            return;
        }

        try {
            const blob = await exportRepurposedToZip(blog.title, blog.slug || 'blog', generatedContent);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `recuvix-repurposed-${blog.slug || 'blog'}.zip`;
            link.click();
            URL.revokeObjectURL(url);
            toast.success('Download started');
        } catch (err) {
            console.error('Download failed:', err);
            toast.error('Failed to create ZIP');
        }
    }, [blog, generatedContent]);

    const completedCount = Object.values(formatStates).filter(s => s.status === 'complete' || s.status === 'saved').length;
    const totalCount = selectedFormats.length;

    return {
        blog,
        isLoadingBlog,
        selectedFormats,
        formatStates,
        generatedContent,
        isGenerating,
        completedCount,
        totalCount,
        customInstruction,
        activeTab,
        toggleFormat,
        selectSocialPack,
        selectContentPack,
        selectAll,
        clearAll,
        generateSelected,
        regenerateFormat,
        cancelGeneration,
        updateContent,
        setActiveTab,
        setCustomInstruction,
        downloadAll,
    };
};
