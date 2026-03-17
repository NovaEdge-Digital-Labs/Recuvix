import React from 'react';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';

interface AvoidListPanelProps {
    avoidList: string[];
}

export const AvoidListPanel = ({ avoidList }: AvoidListPanelProps) => {
    return (
        <Collapsible.Root className="bg-slate-900 border border-red-500/20 rounded-xl overflow-hidden backdrop-blur-sm">
            <Collapsible.Trigger className="w-full flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <h3 className="text-sm font-bold text-white">What to Avoid</h3>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500" />
            </Collapsible.Trigger>
            <Collapsible.Content className="p-4 pt-0 border-t border-slate-800/50">
                <ul className="space-y-3 mt-4">
                    {avoidList.map((item, i) => (
                        <li key={i} className="flex items-start space-x-3 text-xs text-slate-300">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </Collapsible.Content>
        </Collapsible.Root>
    );
};
