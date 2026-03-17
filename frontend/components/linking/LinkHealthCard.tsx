import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    ArrowUpRight,
    ArrowDownLeft,
    Link as LinkIcon,
    ExternalLink,
    ShieldCheck,
    ShieldAlert,
    Info
} from 'lucide-react';

interface LinkHealthCardProps {
    outboundLinks: any[];
    inboundLinks: any[];
    onRemove: (id: string) => void;
}

export function LinkHealthCard({ outboundLinks, inboundLinks, onRemove }: LinkHealthCardProps) {
    const total = outboundLinks.length + inboundLinks.length;

    const getHealthStatus = () => {
        if (total >= 5) return { label: 'Good', icon: ShieldCheck, color: 'text-green-500', bg: 'bg-green-500/10' };
        if (total >= 2) return { label: 'Fair', icon: Info, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
        return { label: 'Needs Attention', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' };
    };

    const health = getHealthStatus();

    return (
        <Card className="border-zinc-800 bg-zinc-950 p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Link Health</h3>
                <Badge className={`${health.bg} ${health.color} border-zinc-800 flex gap-1.5`}>
                    <health.icon className="h-3 w-3" /> {health.label}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Outbound */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                        <ArrowUpRight className="h-3.5 w-3.5 text-accent" />
                        OUTBOUND LINKS ({outboundLinks.length})
                    </div>

                    <ScrollArea className="h-[180px] pr-4">
                        {outboundLinks.length > 0 ? (
                            <div className="space-y-2">
                                {outboundLinks.map((link) => (
                                    <div key={link.id} className="group flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-medium text-zinc-200">"{link.anchor_text}"</span>
                                            <span className="text-[10px] text-zinc-500 truncate max-w-[150px]">To: {link.target_title}</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-zinc-500 hover:text-red-400"
                                                onClick={() => onRemove(link.id)}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-700">
                                <LinkIcon className="h-6 w-6 opacity-20 mb-2" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">No outbound links</span>
                            </div>
                        )}
                    </ScrollArea>
                </div>

                {/* Inbound */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                        <ArrowDownLeft className="h-3.5 w-3.5 text-blue-500" />
                        INBOUND LINKS ({inboundLinks.length})
                    </div>

                    <ScrollArea className="h-[180px] pr-4">
                        {inboundLinks.length > 0 ? (
                            <div className="space-y-2">
                                {inboundLinks.map((link, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-medium text-zinc-200">From: {link.source_title}</span>
                                            <span className="text-[10px] text-zinc-500">Using "{link.anchor_text}"</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-zinc-700">
                                <LinkIcon className="h-6 w-6 opacity-20 mb-2" />
                                <span className="text-[10px] uppercase font-bold tracking-widest">No inbound links</span>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </Card>
    );
}

// Helper X component because button/X were missing
const X = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
);
const Button = ({ children, variant, size, className, onClick }: any) => (
    <button onClick={onClick} className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${variant === 'ghost' ? 'hover:bg-zinc-800' : ''} ${size === 'icon' ? 'h-9 w-9' : 'h-10 px-4 py-2'} ${className}`}>
        {children}
    </button>
);
