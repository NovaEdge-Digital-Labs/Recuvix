import React from 'react';

interface AudioLevelMeterProps {
    level: number; // 0-1
}

export const AudioLevelMeter: React.FC<AudioLevelMeterProps> = ({ level }) => {
    return (
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2 relative">
            <div
                className="h-full bg-accent transition-all duration-75"
                style={{ width: `${Math.min(level * 100, 100)}%` }}
            />
            {level < 0.01 && (
                <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 text-[10px] text-white/40">
                    Waiting for sound...
                </div>
            )}
        </div>
    );
};
