import React from 'react';
import { Sparkles, Search, ChevronDown, Check } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';

interface UniqueAnglesPanelProps {
    angles: string[];
    dataToInclude: string[];
}

export const UniqueAnglesPanel = ({ angles, dataToInclude }: UniqueAnglesPanelProps) => {
    return (
        <div className="space-y-4">
            <Collapsible.Root defaultOpen className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <Collapsible.Trigger className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-[#e8ff47]" />
                        <h3 className="text-sm font-bold text-white">Unique Angles to Include</h3>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                </Collapsible.Trigger>
                <Collapsible.Content className="p-4 pt-0 border-t border-slate-800/50">
                    <ul className="space-y-3 mt-4">
                        {angles.map((angle, i) => (
                            <li key={i} className="flex items-start space-x-3 text-xs text-slate-300">
                                <div className="mt-0.5 p-0.5 bg-green-500/10 rounded flex-shrink-0">
                                    <Check className="w-3 h-3 text-green-400" />
                                </div>
                                <span>{angle}</span>
                            </li>
                        ))}
                    </ul>
                </Collapsible.Content>
            </Collapsible.Root>

            <Collapsible.Root defaultOpen className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
                <Collapsible.Trigger className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-blue-400" />
                        <h3 className="text-sm font-bold text-white">Data & Stats to Find</h3>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                </Collapsible.Trigger>
                <Collapsible.Content className="p-4 pt-0 border-t border-slate-800/50">
                    <ul className="space-y-4 mt-4">
                        {dataToInclude.map((item, i) => (
                            <li key={i} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                                <span className="text-xs text-slate-300 pr-4">{item}</span>
                                <a
                                    href={`https://www.google.com/search?q=${encodeURIComponent(item)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded transition-colors"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    );
};
