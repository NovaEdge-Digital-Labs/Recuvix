import React from 'react';
import {
    FileText, Clock, Layers, Image as ImageIcon,
    Link as LinkIcon, ExternalLink, CheckCircle2, XCircle
} from 'lucide-react';

interface ContentInventoryProps {
    data: {
        wordCount: number;
        readingTimeMinutes: number;
        h2s: string[];
        imageCount: number;
        internalLinks: number;
        externalLinks: number;
        hasFaq: boolean;
        hasTable: boolean;
        hasSchemaMarkup: boolean;
        hasVideo: boolean;
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatBadge = ({ icon: Icon, value, label }: { icon: any; value: string | number; label: string }) => (
    <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
        <Icon className="w-4 h-4 text-[#e8ff47]" />
        <div>
            <div className="text-sm font-bold text-white leading-none">{value}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{label}</div>
        </div>
    </div>
);

const FeatureBadge = ({ has, label }: { has: boolean; label: string }) => (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-colors ${has
        ? 'bg-green-500/10 border-green-500/20 text-green-400'
        : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
        {has ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        <span>{has ? 'Has' : 'No'} {label}</span>
    </div>
);

export const ContentInventory = ({ data }: ContentInventoryProps) => {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-slate-400 text-xs font-mono uppercase tracking-widest mb-6">Content Inventory</h3>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <StatBadge icon={FileText} value={data.wordCount} label="Words" />
                <StatBadge icon={Clock} value={`${data.readingTimeMinutes}m`} label="Read Time" />
                <StatBadge icon={Layers} value={data.h2s.length} label="Sections" />
                <StatBadge icon={ImageIcon} value={data.imageCount} label="Images" />
                <StatBadge icon={LinkIcon} value={data.internalLinks} label="Internal" />
                <StatBadge icon={ExternalLink} value={data.externalLinks} label="External" />
            </div>

            <div className="flex flex-wrap gap-2">
                <FeatureBadge has={data.hasFaq} label="FAQ" />
                <FeatureBadge has={data.hasTable} label="Comparison Table" />
                <FeatureBadge has={data.hasSchemaMarkup} label="Schema Markup" />
                <FeatureBadge has={data.hasVideo} label="Video Content" />
            </div>
        </div>
    );
};
