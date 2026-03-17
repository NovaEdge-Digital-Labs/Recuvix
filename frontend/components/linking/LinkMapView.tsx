import React, { useEffect } from 'react';
import { LinkMapCanvas } from './LinkMapCanvas';
import { LinkingStatsRow } from './LinkingStatsRow';
import { LinkMapLegend } from './LinkMapLegend';
import { OrphanList } from './OrphanList';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Loader2, Zap } from 'lucide-react';

interface LinkMapViewProps {
    engine: any; // useLinkingEngine return type
    onSelectBlog: (id: string) => void;
}

export function LinkMapView({ engine, onSelectBlog }: LinkMapViewProps) {
    const {
        graphData,
        isLoadingGraph,
        fetchGraphData,
        analyseEntireLibrary,
        isAnalysing,
        orphans = []
    } = engine;

    useEffect(() => {
        fetchGraphData();
    }, [fetchGraphData]);

    if (isLoadingGraph && !graphData) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-4">
                <Loader2 className="h-10 w-10 text-accent animate-spin" />
                <p className="text-sm font-medium text-zinc-500 italic">Generating link network map...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 transition-all animate-in fade-in duration-700">
            {/* Stats Cards */}
            {graphData && <LinkingStatsRow stats={graphData.stats} />}

            {/* Primary Map Display */}
            <div className="relative group">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-black/40 backdrop-blur-md border-zinc-800 text-zinc-400 hover:text-accent"
                        onClick={fetchGraphData}
                        disabled={isLoadingGraph}
                    >
                        <RefreshCcw className={`h-3.5 w-3.5 mr-2 ${isLoadingGraph ? 'animate-spin' : ''}`} />
                        Refresh Map
                    </Button>

                    <Button
                        size="sm"
                        className="bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 font-bold"
                        onClick={analyseEntireLibrary}
                        disabled={isAnalysing}
                    >
                        <Zap className="h-3.5 w-3.5 mr-2" />
                        Analyse Library
                    </Button>
                </div>

                <div className="absolute top-4 right-4 z-10">
                    <LinkMapLegend />
                </div>

                {graphData ? (
                    <LinkMapCanvas
                        data={graphData}
                        onNodeClick={onSelectBlog}
                    />
                ) : (
                    <div className="h-[600px] bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center">
                        <p className="text-zinc-700 italic">Map could not be loaded.</p>
                    </div>
                )}
            </div>

            {/* Orphans Section */}
            <OrphanList
                orphans={graphData?.orphans || []}
                onAnalyse={onSelectBlog}
            />
        </div>
    );
}
