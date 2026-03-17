"use client";

import React, { useState, useEffect } from 'react';
import { useLinkingEngine } from '@/hooks/useLinkingEngine';
import { BlogAnalyserView } from './BlogAnalyserView';
import { LinkMapView } from './LinkMapView';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
    ClipboardList,
    Network,
    Sparkles,
    Search,
    BookOpen
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

interface LinkingPageProps {
    workspaceId?: string;
}

export function LinkingPage({ workspaceId }: LinkingPageProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const blogIdFromUrl = searchParams.get('blogId');

    const [activeTab, setActiveTab] = useState('analyser');
    const engine = useLinkingEngine(workspaceId);

    // Auto-select blog from URL and switch to analyser
    useEffect(() => {
        if (blogIdFromUrl && engine.allBlogs.length > 0) {
            engine.selectBlog(blogIdFromUrl);
            setActiveTab('analyser');
        }
    }, [blogIdFromUrl, engine.allBlogs.length]);

    const handleSelectFromMap = (id: string) => {
        engine.selectBlog(id);
        setActiveTab('analyser');

        // Update URL without refresh
        router.push(`/linking?blogId=${id}`, { scroll: false });
    };

    return (
        <div className="min-h-screen bg-[#070708] text-zinc-100 pb-20">
            {/* Header section */}
            <div className="relative border-b border-zinc-900 bg-zinc-950/20 backdrop-blur-xl">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-[1400px] mx-auto px-6 py-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
                                <Sparkles className="h-3 w-3" /> SEO Intelligence
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-4xl font-black italic tracking-tighter text-zinc-100 sm:text-5xl">
                                    INTERNAL <span className="text-accent underline decoration-accent/20">LINKING</span> STUDIO
                                </h1>
                                <p className="text-zinc-500 font-medium max-w-xl">
                                    Connect your content library to boost search engine authority and improve user navigation.
                                </p>
                            </div>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
                            <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 h-12">
                                <TabsTrigger
                                    value="analyser"
                                    className="flex gap-2 items-center px-6 h-full data-[state=active]:bg-zinc-800 data-[state=active]:text-accent font-bold italic text-sm"
                                >
                                    <ClipboardList className="h-4 w-4" /> Blog Analyser
                                </TabsTrigger>
                                <TabsTrigger
                                    value="map"
                                    className="flex gap-2 items-center px-6 h-full data-[state=active]:bg-zinc-800 data-[state=active]:text-accent font-bold italic text-sm"
                                >
                                    <Network className="h-4 w-4" /> Link Map
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-[1400px] mx-auto px-6 py-10">
                <Tabs value={activeTab} className="w-full">
                    <TabsContent value="analyser" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <BlogAnalyserView engine={engine} />
                    </TabsContent>
                    <TabsContent value="map" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                        <LinkMapView engine={engine} onSelectBlog={handleSelectFromMap} />
                    </TabsContent>
                </Tabs>
            </main>

            {/* Empty State / Quick Help footer */}
            <div className="max-w-[1400px] mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 group hover:border-zinc-800 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors">
                        <Search className="h-5 w-5 text-accent opacity-50" />
                    </div>
                    <h4 className="font-bold text-zinc-200 mb-2 italic">How it works?</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Our engine scans your blogs' focus keywords, topics, and headings to find natural opportunities to link related content together.
                    </p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 group hover:border-zinc-800 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors">
                        <Sparkles className="h-5 w-5 text-accent opacity-50" />
                    </div>
                    <h4 className="font-bold text-zinc-200 mb-2 italic">Why Internal Link?</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        Deep internal linking distributes PageRank across your entire site, helping search engines crawl and index all your pages faster.
                    </p>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-950/40 border border-zinc-900 group hover:border-zinc-800 transition-colors">
                    <div className="h-10 w-10 rounded-xl bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-zinc-800 transition-colors">
                        <BookOpen className="h-5 w-5 text-accent opacity-50" />
                    </div>
                    <h4 className="font-bold text-zinc-200 mb-2 italic">Manual Review</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        We never inject links without your approval. Review the context and anchor text to ensure every link feels natural for your readers.
                    </p>
                </div>
            </div>
        </div>
    );
}
