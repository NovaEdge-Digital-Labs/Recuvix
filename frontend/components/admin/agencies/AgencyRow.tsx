import React from 'react';
import { Building2, Users, ExternalLink, Globe, CreditCard, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface AgencyRowProps {
    agency: any;
    onViewDetails: (agency: any) => void;
}

export const AgencyRow = ({ agency, onViewDetails }: AgencyRowProps) => {
    const statusColors: Record<string, string> = {
        active: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        trial: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        suspended: 'text-red-500 bg-red-500/10 border-red-500/20',
        pending: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
    };

    return (
        <tr className="border-b border-zinc-900/50 hover:bg-zinc-900/20 transition-colors group">
            <td className="py-4 pl-4 pr-3 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-sm font-bold border border-zinc-800 text-zinc-400">
                        {agency.name?.[0] || 'A'}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-bold text-white flex items-center gap-2">
                            {agency.name}
                            <button
                                onClick={() => window.open(`http://${agency.subdomain}.recuvix.com`, '_blank')}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-accent"
                            >
                                <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="text-xs text-zinc-500 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {agency.customDomain || `${agency.subdomain}.recuvix.com`}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
                <div className="text-sm text-white font-medium">{agency.ownerEmail}</div>
                <div className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">Owner</div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider w-fit ${statusColors[agency.licenceStatus] || statusColors.pending}`}>
                        {agency.licenceStatus}
                    </span>
                    <div className="text-[10px] text-zinc-500 italic">
                        Plan: {agency.licencePlan}
                    </div>
                </div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-white font-medium">
                    <Users className="w-3.5 h-3.5 text-zinc-500" />
                    {agency.totalUsers}
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">Total Members</div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <div className="text-sm font-bold text-emerald-500">₹{agency.revenueThisMonth.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-zinc-600" />
                        Gross Rev
                    </div>
                </div>
            </td>
            <td className="px-3 py-4 whitespace-nowrap text-right pr-4">
                <button
                    onClick={() => onViewDetails(agency)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
                >
                    View Dashboard
                </button>
            </td>
        </tr>
    );
};
