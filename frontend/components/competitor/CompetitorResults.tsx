import React, { useState } from 'react';
import {
    ArrowLeft,
    Download,
    PenBox,
    LayoutDashboard,
    FileText,
    Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContentScoreGauges } from './ContentScoreGauges';
import { EEATBreakdown } from './EEATBreakdown';
import { ContentInventory } from './ContentInventory';
import { GapAnalysisTabs } from './GapAnalysisTabs';
import { BriefHeader } from './BriefHeader';
import { WinStrategy } from './WinStrategy';
import { BriefOutlineSection } from './BriefOutlineSection';
import { UniqueAnglesPanel } from './UniqueAnglesPanel';
import { AvoidListPanel } from './AvoidListPanel';
import { CompetitorStructureCompare } from './CompetitorStructureCompare';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CompetitorResultsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any; // ScrapedData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analysis: any; // CompetitorAnalysis
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    brief: any; // CompetitorBrief
    onReset: () => void;
    onGenerate: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUpdateBrief: (sectionKey: string, value: any) => void;
}

export const CompetitorResults = ({
    data,
    analysis,
    brief,
    onReset,
    onGenerate,
    onUpdateBrief
}: CompetitorResultsProps) => {
    const [activeTab, setActiveTab] = useState('analysis');

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 pb-24">
            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onReset}
                        className="p-2 text-slate-500 hover:text-white transition-colors bg-slate-900 border border-slate-800 rounded-lg"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                            <span>Analysis Report</span>
                            <span>•</span>
                            <span className="text-[#e8ff47]">{data.url.split('/')[2]}</span>
                        </div>
                        <h1 className="text-xl font-bold font-syne text-white truncate max-w-[300px] md:max-w-md">
                            {data.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="h-9 border-slate-800 text-slate-400 hover:text-white bg-slate-900 text-xs shadow-none">
                        <Download className="w-3.5 h-3.5 mr-2" />
                        PDF
                    </Button>
                    <Button
                        onClick={onGenerate}
                        className="h-9 bg-[#e8ff47] text-black hover:bg-[#e8ff47]/90 text-xs font-bold shadow-lg shadow-[#e8ff47]/10"
                    >
                        <PenBox className="w-3.5 h-3.5 mr-2" />
                        Write Superior Blog
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <div className="flex justify-center">
                    <TabsList className="bg-slate-900 border border-slate-800 p-1 rounded-xl h-11">
                        <TabsTrigger
                            value="analysis"
                            className="rounded-lg px-6 data-[state=active]:bg-slate-800 data-[state=active]:text-[#e8ff47] text-xs font-bold transition-all"
                        >
                            <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                            Gap Analysis
                        </TabsTrigger>
                        <TabsTrigger
                            value="brief"
                            className="rounded-lg px-6 data-[state=active]:bg-slate-800 data-[state=active]:text-[#e8ff47] text-xs font-bold transition-all"
                        >
                            <FileText className="w-3.5 h-3.5 mr-2" />
                            Content Brief
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="analysis" className="mt-0 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Scores & EEAT */}
                        <div className="space-y-8">
                            <ContentScoreGauges
                                competitorScore={analysis.competitorScore}
                                opportunityScore={analysis.opportunityScore}
                            />
                            <EEATBreakdown
                                score={analysis.eeatScore}
                            />
                            <ContentInventory data={data} />
                        </div>

                        {/* Right Two Columns: Gaps & History */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold font-syne text-white flex items-center">
                                        <Target className="w-4 h-4 text-[#e8ff47] mr-2" />
                                        Strategic Content Gaps
                                    </h2>
                                </div>
                                <GapAnalysisTabs
                                    analysis={analysis}
                                    onAddKeyword={(kw) => onUpdateBrief('secondaryKeywords', kw)}
                                    onAddQuestion={(q) => onUpdateBrief('outline_add', q)}
                                />
                            </div>

                            <CompetitorStructureCompare
                                competitorH2s={data.h2s}
                                yourH2s={brief.outline.map((s: { h2: string }) => s.h2)}
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="brief" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Brief Content */}
                        <div className="lg:col-span-8 space-y-6">
                            <BriefHeader
                                brief={brief}
                                competitorWordCount={data.wordCount}
                                onUpdateTitle={(title) => onUpdateBrief('superiorTitle', title)}
                            />

                            <WinStrategy strategy={brief.winStrategy} />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wider">
                                        Superior Content Outline
                                    </h3>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {brief.outline.length} SECTIONS PLANNED
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {brief.outline.map((section: { id: string; h2: string; instructions: string; competitorHas: boolean; priority: "Must" | "Should" | "Could" }) => (
                                        <BriefOutlineSection key={section.id} section={section} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Tools */}
                        <div className="lg:col-span-4 space-y-6">
                            <UniqueAnglesPanel
                                angles={brief.uniqueAngles}
                                dataToInclude={brief.dataToInclude}
                            />
                            <AvoidListPanel avoidList={brief.avoidList} />

                            <div className="p-6 bg-[#e8ff47]/5 border border-[#e8ff47]/20 rounded-2xl">
                                <h4 className="text-sm font-bold text-[#e8ff47] mb-2 font-syne uppercase">Ready to Win?</h4>
                                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                                    Our AI is ready to execute this brief using {brief.targetWordCount}+ words,
                                    verified stats, and the {brief.secondaryKeywords.length} keywords identified.
                                </p>
                                <Button
                                    onClick={onGenerate}
                                    className="w-full bg-[#e8ff47] text-black hover:bg-[#e8ff47]/90 font-bold py-6 text-sm flex items-center justify-center gap-2"
                                >
                                    Confirm & Write Blog
                                </Button>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};
