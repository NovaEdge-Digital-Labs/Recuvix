import React, { useState } from 'react';
import { Search, Globe, ChevronRight, Clipboard, CheckCircle2, AlertCircle, History, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { getFaviconUrl } from '@/lib/competitor/domainExtractor';

interface CompetitorInputProps {
    onAnalyze: (url: string, country: string, niche?: string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    history: any[];
    onLoadHistory: (id: string) => void;
    onDeleteHistory: (id: string) => void;
    isLoading: boolean;
}

const EXAMPLES = [
    { name: 'HubSpot', url: 'https://blog.hubspot.com/marketing/digital-marketing' },
    { name: 'Neil Patel', url: 'https://neilpatel.com/blog/seo-strategy/' },
    { name: 'Backlinko', url: 'https://backlinko.com/seo-techniques' },
];

export const CompetitorInput = ({ onAnalyze, history, onLoadHistory, onDeleteHistory, isLoading }: CompetitorInputProps) => {
    const [url, setUrl] = useState('');
    const [country, setCountry] = useState('US');
    const [niche, setNiche] = useState('');
    const [showOptional, setShowOptional] = useState(false);

    const isValidUrl = url.startsWith('https://');

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text.startsWith('http')) setUrl(text);
        } catch {
            console.error('Failed to read clipboard');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValidUrl && !isLoading) {
            onAnalyze(url, country, niche);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="text-center mb-10">
                <span className="text-[10px] font-mono text-[#e8ff47] uppercase tracking-[0.3em] mb-4 block">
                    Competitor Analyzer
                </span>
                <h1 className="text-4xl md:text-5xl font-bold font-syne text-white mb-4">
                    Outrank Any Blog
                </h1>
                <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                    Paste a competitor&apos;s blog URL. We&apos;ll analyze it completely and generate a brief to create a superior post.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                    <div className={`relative flex items-center bg-slate-900 border ${url && !isValidUrl ? 'border-red-500/50' : url && isValidUrl ? 'border-green-500/50' : 'border-slate-800'} rounded-2xl h-[70px] transition-all shadow-2xl`}>
                        <div className="pl-6 text-slate-500">
                            <Globe className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="https://competitor.com/blog/post-url"
                            className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder:text-slate-600 text-lg"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <div className="pr-2 flex items-center">
                            {url && isValidUrl ? (
                                <div className="p-2 text-green-400">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                            ) : url && !isValidUrl ? (
                                <div className="p-2 text-red-400">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                            ) : null}
                            <button
                                type="button"
                                onClick={handlePaste}
                                className="p-3 text-slate-500 hover:text-white transition-colors"
                                title="Paste from clipboard"
                            >
                                <Clipboard className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    {url && !isValidUrl && (
                        <div className="absolute top-full mt-2 left-6 text-[10px] uppercase tracking-wider text-red-400 font-mono">
                            Please enter a valid URL starting with https://
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => setShowOptional(!showOptional)}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center space-x-1"
                    >
                        <ChevronRight className={`w-3 h-3 transition-transform ${showOptional ? 'rotate-90' : ''}`} />
                        <span>Optional Context</span>
                    </button>

                    {showOptional && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider pl-1">Target Country</label>
                                <input
                                    type="text"
                                    placeholder="US (e.g. US, IN, UK)"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#e8ff47] outline-none"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value.toUpperCase())}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider pl-1">Your Niche</label>
                                <input
                                    type="text"
                                    placeholder="e.g. SaaS Marketing"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-[#e8ff47] outline-none"
                                    value={niche}
                                    onChange={(e) => setNiche(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={!isValidUrl || isLoading}
                    className="w-full h-[60px] bg-[#e8ff47] text-black font-bold text-lg rounded-2xl hover:bg-[#e8ff47]/90 disabled:opacity-50 shadow-xl shadow-[#e8ff47]/10 transition-all hover:scale-[1.01]"
                >
                    {isLoading ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            <span>Analyzing...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Search className="w-5 h-5" />
                            <span>Analyze & Find Gaps</span>
                        </div>
                    )}
                </Button>
            </form>

            <div className="mt-12 text-center">
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-4">
                    Try an example:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {EXAMPLES.map((ex) => (
                        <button
                            key={ex.name}
                            onClick={() => setUrl(ex.url)}
                            className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400 hover:border-[#e8ff47]/50 hover:text-white transition-all"
                        >
                            {ex.name}
                        </button>
                    ))}
                </div>
            </div>

            {history.length > 0 && (
                <div className="mt-20 border-t border-slate-800 pt-10">
                    <div className="flex items-center space-x-2 mb-6 text-slate-300">
                        <History className="w-4 h-4" />
                        <h3 className="text-sm font-bold font-syne">Recent Analyses</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {history.slice(0, 4).map((item) => (
                            <div
                                key={item.id}
                                className="group relative flex items-center p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all"
                            >
                                <button
                                    onClick={() => onLoadHistory(item.id)}
                                    className="flex-1 flex items-center space-x-3 text-left"
                                >
                                    <img src={getFaviconUrl(item.url)} alt="" className="w-5 h-5 rounded" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-white truncate pr-4">{item.pageTitle}</p>
                                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">{item.domain}</p>
                                    </div>
                                </button>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1.5 text-slate-500 hover:text-white"
                                    >
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                    <button
                                        onClick={() => onDeleteHistory(item.id)}
                                        className="p-1.5 text-slate-500 hover:text-red-400"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
