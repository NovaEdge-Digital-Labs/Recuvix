import React from 'react';
import { Check } from 'lucide-react';

interface PhaseIndicatorProps {
    currentPhase: number;
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({ currentPhase }) => {
    const phases = ['Input', 'Transcribe', 'Review', 'Generate'];

    return (
        <div className="flex items-center justify-center gap-2 mb-12">
            {phases.map((phase, i) => (
                <React.Fragment key={phase}>
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${i + 1 < currentPhase
                                    ? 'bg-accent border-accent text-black'
                                    : i + 1 === currentPhase
                                        ? 'border-accent text-accent shadow-[0_0_15px_rgba(232,255,71,0.2)]'
                                        : 'border-white/10 text-white/20'
                                }`}
                        >
                            {i + 1 < currentPhase ? <Check className="w-4 h-4 stroke-[3px]" /> : i + 1}
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-widest ${i + 1 <= currentPhase ? 'text-white' : 'text-white/20'
                            }`}>
                            {phase}
                        </span>
                    </div>
                    {i < phases.length - 1 && (
                        <div className={`w-8 h-[2px] rounded-full mx-2 ${i + 1 < currentPhase ? 'bg-accent' : 'bg-white/10'
                            }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};
