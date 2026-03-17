"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Upload, Youtube, ArrowRight, Wand2, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhaseIndicator } from './PhaseIndicator';
import { RecordTab } from './RecordTab';
import { UploadTab } from './UploadTab';
import { YoutubeTab } from './YoutubeTab';
import { TranscriptionProgress } from './TranscriptionProgress';
import { TranscriptViewer } from './TranscriptViewer';
import { AnalysisCard } from './AnalysisCard';
import { BlogConfigPanel } from './BlogConfigPanel';
import { useTranscription } from '@/hooks/useTranscription';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useWorkspace } from '@/context/WorkspaceContext';

export const VoicePage: React.FC = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { activeWorkspace } = useWorkspace();
    const [phase, setPhase] = useState(1);
    const [activeTab, setActiveTab] = useState('record');
    const [showCleaningModal, setShowCleaningModal] = useState(false);

    const {
        recordingId,
        uploadProgress,
        uploadStatus,
        transcriptionStatus,
        transcript,
        analysis,
        isPolling,
        isCleaning,
        error,
        uploadAudio,
        startTranscription,
        cleanTranscript,
        updateTranscript
    } = useTranscription();

    // Blog config state
    const [blogTitle, setBlogTitle] = useState('');
    const [focusKeyword, setFocusKeyword] = useState('');
    const [tone, setTone] = useState('conversational');
    const [wordCount, setWordCount] = useState(1200);
    const [preserveVoice, setPreserveVoice] = useState(true);
    const [includesQuotes, setIncludesQuotes] = useState(true);
    const [addSeo, setAddSeo] = useState(true);

    useEffect(() => {
        if (analysis) {
            setBlogTitle(analysis.suggestedTitle || '');
            setFocusKeyword(analysis.suggestedFocusKeyword || '');
            setTone(analysis.speakerTone || 'conversational');
        }
    }, [analysis]);

    const handleAudioComplete = async (blob: Blob | File) => {
        try {
            setPhase(2);
            const id = await uploadAudio(blob, activeTab === 'record' ? 'browser_recording' : 'file_upload', activeWorkspace?.id);
            await startTranscription({ recordingId: id, niche: 'general' });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (transcriptionStatus === 'complete' && phase === 2) {
            setPhase(3);
        }
    }, [transcriptionStatus, phase]);

    const handleGenerate = async () => {
        if (!recordingId) return;

        const generationSettings = {
            recordingId,
            blogTitle,
            focusKeyword,
            tone,
            wordCount,
            preserveVoice,
            includeQuotes: includesQuotes,
            addSeoEnhancements: addSeo,
            source: 'voice'
        };

        localStorage.setItem('pending_voice_generation', JSON.stringify(generationSettings));
        router.push('/generating?source=voice');
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold tracking-tight mb-4 font-syne italic">Voice Studio</h1>
                <p className="text-white/40 text-lg max-w-xl mx-auto font-medium">
                    Speak naturally. We'll turn your spoken words into a polished, SEO-optimized blog post in seconds.
                </p>
            </div>

            <PhaseIndicator currentPhase={phase} />

            <div className="min-h-[500px]">
                {phase === 1 && (
                    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <Tabs defaultValue="record" onValueChange={setActiveTab} className="w-full flex flex-col items-center">
                            <TabsList className="grid w-full grid-cols-3 bg-white/5 p-1 h-16 rounded-2xl border border-white/10 mb-12">
                                <TabsTrigger value="record" className="rounded-xl data-[state=active]:bg-accent data-[state=active]:text-black font-bold flex gap-2">
                                    <Mic className="w-4 h-4" /> Record
                                </TabsTrigger>
                                <TabsTrigger value="upload" className="rounded-xl data-[state=active]:bg-accent data-[state=active]:text-black font-bold flex gap-2">
                                    <Upload className="w-4 h-4" /> Upload
                                </TabsTrigger>
                                <TabsTrigger value="youtube" className="rounded-xl data-[state=active]:bg-accent data-[state=active]:text-black font-bold flex gap-2">
                                    <Youtube className="w-4 h-4" /> YouTube
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="record" className="w-full">
                                <RecordTab onComplete={handleAudioComplete} />
                            </TabsContent>
                            <TabsContent value="upload" className="w-full">
                                <UploadTab onComplete={handleAudioComplete} />
                            </TabsContent>
                            <TabsContent value="youtube" className="w-full">
                                <YoutubeTab />
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

                {phase === 2 && (
                    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
                        <TranscriptionProgress
                            status={transcriptionStatus}
                            error={error}
                            duration={0}
                            wordCount={0}
                            language="detecting..."
                        />
                        {transcriptionStatus === 'failed' && (
                            <div className="flex justify-center mt-8">
                                <Button variant="outline" onClick={() => setPhase(1)}>Try Another Way</Button>
                            </div>
                        )}
                    </div>
                )}

                {phase === 3 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-right-5 duration-500">
                        <div className="lg:col-span-7 flex flex-col h-[700px]">
                            <TranscriptViewer
                                rawTranscript={transcript || ''}
                                cleanedTranscript={analysis?.cleanedTranscript}
                                duration={0}
                                wordCount={transcript?.split(/\s+/).length || 0}
                                isCleaning={isCleaning}
                                onClean={(level) => recordingId && cleanTranscript({
                                    recordingId,
                                    llmProvider: 'openai',
                                    apiKey: 'managed',
                                    country: 'India',
                                    cleaningLevel: level
                                })}
                                onUpdate={updateTranscript}
                            />
                        </div>

                        <div className="lg:col-span-5 flex flex-col gap-8 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
                            {analysis ? (
                                <div className="space-y-8">
                                    <AnalysisCard analysis={analysis} />
                                    <BlogConfigPanel
                                        title={blogTitle}
                                        onTitleChange={setBlogTitle}
                                        keyword={focusKeyword}
                                        onKeywordChange={setFocusKeyword}
                                        tone={tone}
                                        onToneChange={setTone}
                                        wordCount={wordCount}
                                        onWordCountChange={setWordCount}
                                        preserveVoice={preserveVoice}
                                        onPreserveVoiceChange={setPreserveVoice}
                                        includesQuotes={includesQuotes}
                                        onIncludesQuotesChange={setIncludesQuotes}
                                        addSeo={addSeo}
                                        onAddSeoChange={setAddSeo}
                                    />
                                    <Button
                                        size="lg"
                                        onClick={handleGenerate}
                                        className="w-full h-16 bg-accent text-black font-bold text-lg rounded-2xl hover:scale-[1.02] transition-transform flex gap-3 shadow-[0_0_30px_rgba(232,255,71,0.1)]"
                                    >
                                        <Wand2 className="w-5 h-5" />
                                        Generate Blog from Voice
                                    </Button>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-white/5 bg-white/5 rounded-3xl">
                                    <Sparkles className="w-12 h-12 text-accent mb-4 opacity-50" />
                                    <h4 className="text-xl font-bold mb-2">Transcribed!</h4>
                                    <p className="text-sm text-white/40 mb-6">
                                        Click "Clean Transcript ✨" to let AI refine your spoken words and prepare them for generation.
                                    </p>
                                    <Button
                                        onClick={() => setShowCleaningModal(true)}
                                        className="bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20"
                                    >
                                        Clean with AI ✨
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {phase > 1 && phase < 4 && (
                <div className="fixed bottom-10 left-10">
                    <Button
                        variant="ghost"
                        onClick={() => setPhase(prev => prev - 1)}
                        className="text-white/40 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Phase {phase - 1}
                    </Button>
                </div>
            )}
        </div>
    );
};
