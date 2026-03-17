import React from 'react';
import {
    Settings2,
    Trash2,
    Play,
    Calendar,
    Users,
    Clock,
    ShieldCheck,
    ShieldAlert
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

interface CreditRuleCardProps {
    rule: any;
    onEdit: (rule: any) => void;
    onDelete: (id: string) => void;
    onTrigger: (id: string) => void;
}

export const CreditRuleCard = ({ rule, onEdit, onDelete, onTrigger }: CreditRuleCardProps) => {
    const getTriggerText = (trigger: string) => {
        switch (trigger) {
            case 'signup': return 'User Signup';
            case 'purchase': return 'Any Purchase';
            case 'manual': return 'Manual Only';
            case 'recurring': return 'Recurring';
            default: return trigger;
        }
    };

    return (
        <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 space-y-6 group hover:border-zinc-800 transition-all flex flex-col">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${rule.is_active ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                        <Settings2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">{rule.name}</h3>
                        <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            Expires in {rule.credits_expire_days || '∞'} days
                        </div>
                    </div>
                </div>
                <div className={`text-xl font-black ${rule.is_active ? 'text-accent' : 'text-zinc-700'}`}>
                    +{rule.credits_amount}
                </div>
            </div>

            <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                    Condition
                </div>
                <div className="p-3 bg-zinc-900/40 rounded-xl border border-zinc-900/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Trigger</span>
                        <span className="text-zinc-300 font-bold">{getTriggerText(rule.trigger_event)}</span>
                    </div>
                    {rule.condition_country && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500">Country</span>
                            <span className="text-zinc-300 font-bold uppercase">{rule.condition_country}</span>
                        </div>
                    )}
                    {rule.condition_min_blogs !== null && (
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500">Min Blogs</span>
                            <span className="text-zinc-300 font-bold">{rule.condition_min_blogs}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTrigger(rule.id)}
                    className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white text-[10px] font-bold h-8"
                >
                    <Play className="w-3 h-3 mr-1.5" />
                    Test Rule
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(rule.id)}
                    className="bg-zinc-900 border-zinc-800 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-bold h-8"
                >
                    <Trash2 className="w-3 h-3 mr-1.5" />
                    Delete
                </Button>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-zinc-600" />
                    <span className="text-[10px] text-zinc-600 font-bold uppercase">
                        {format(new Date(rule.created_at), 'MMM dd, yyyy')}
                    </span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">
                        {rule.total_granted_count || 0} Uses
                    </span>
                </div>
            </div>
        </div>
    );
};
