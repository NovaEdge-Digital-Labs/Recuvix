import React from 'react';
import { X } from 'lucide-react';

interface TagChipProps {
    label: string;
    onRemove?: () => void;
    onClick?: () => void;
    active?: boolean;
}

export const TagChip: React.FC<TagChipProps> = ({ label, onRemove, onClick, active }) => {
    return (
        <div
            onClick={onClick}
            className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-colors cursor-pointer
        ${active
                    ? 'bg-accent text-black border border-accent'
                    : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500'}
      `}
        >
            <span>{label}</span>
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="hover:text-black hover:bg-black/10 rounded-full p-px"
                >
                    <X size={10} />
                </button>
            )}
        </div>
    );
};
