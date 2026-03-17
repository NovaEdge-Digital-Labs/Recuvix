import React from 'react';
import { Check, Loader2, X } from 'lucide-react';
import { getDomainName } from '@/lib/competitor/domainExtractor';

interface StepProps {
    number: number;
    label: string;
    subLabel?: string;
    status: 'pending' | 'active' | 'complete';
}

const Step = ({ label, subLabel, status }: StepProps) => {
    return (
        <div className="flex items-start space-x-4">
            <div className="relative flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${status === 'complete' ? 'bg-[#e8ff47] border-[#e8ff47] text-black' :
                    status === 'active' ? 'bg-slate-900 border-[#e8ff47] text-[#e8ff47] shadow-[0_0_15px_rgba(232,255,71,0.2)]' :
                        'bg-slate-900 border-slate-800 text-slate-600'
                    }`}>
                    {status === 'complete' ? <Check className="w-4 h-4" /> :
                        status === 'active' ? <div className="w-2 h-2 rounded-full bg-[#e8ff47] animate-pulse" /> :
                            null}
                </div>
                <div className="w-0.5 h-12 bg-slate-800 my-1" />
            </div>
            <div className="pt-1">
                <h3 className={`text-sm font-bold transition-colors ${status === 'pending' ? 'text-slate-600' : 'text-white'}`}>
                    {label}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                    {status === 'active' ? subLabel : status === 'complete' ? 'Completed' : 'Waiting...'}
                </p>
            </div>
        </div>
    );
};

interface CompetitorProgressProps {
    url: string;
    currentStep: number;
    onCancel: () => void;
}

export const CompetitorProgress = ({ url, currentStep, onCancel }: CompetitorProgressProps) => {
    const domain = getDomainName(url);

    return (
        <div className="max-w-xl mx-auto py-20 px-4">
            <div className="mb-12 text-center">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full mb-6">
                    <div className="w-2 h-2 rounded-full bg-[#e8ff47] animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px]">{url}</span>
                </div>
                <h2 className="text-3xl font-bold font-syne text-white mb-2">Analyzing Deep Gaps</h2>
                <p className="text-slate-500 text-xs">Usually takes about 30-40 seconds to complete full AI audit.</p>
            </div>

            <div className="space-y-2 mb-12">
                <Step
                    number={1}
                    label="Fetching competitor page"
                    subLabel={`Connecting to ${domain}...`}
                    status={currentStep > 1 ? 'complete' : currentStep === 1 ? 'active' : 'pending'}
                />
                <Step
                    number={2}
                    label="Extracting content structure"
                    subLabel="Mapping sections and word counts..."
                    status={currentStep > 2 ? 'complete' : currentStep === 2 ? 'active' : 'pending'}
                />
                <Step
                    number={3}
                    label="Running AI gap analysis"
                    subLabel="Scoring EEAT and finding missing keywords..."
                    status={currentStep > 3 ? 'complete' : currentStep === 3 ? 'active' : 'pending'}
                />
                <Step
                    number={4}
                    label="Building your content brief"
                    subLabel="Designing winning outline and ranking strategy..."
                    status={currentStep === 4 ? 'active' : 'pending'}
                />
            </div>

            <div className="flex flex-col items-center space-y-6">
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl w-full">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Analysis in Progress</span>
                        <Loader2 className="w-4 h-4 text-[#e8ff47] animate-spin" />
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#e8ff47] transition-all duration-1000 ease-out"
                            style={{ width: `${(currentStep / 4) * 100}%` }}
                        />
                    </div>
                </div>

                <button
                    onClick={onCancel}
                    className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center space-x-1"
                >
                    <X className="w-3 h-3" />
                    <span>Cancel Analysis</span>
                </button>
            </div>
        </div>
    );
};
