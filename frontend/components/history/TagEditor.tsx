import React, { useState } from 'react';
import { TagChip } from './TagChip';
import { Plus, Check } from 'lucide-react';

interface TagEditorProps {
    tags: string[];
    suggestions: string[];
    onAdd: (tag: string) => void;
    onRemove: (tag: string) => void;
}

export const TagEditor: React.FC<TagEditorProps> = ({ tags, suggestions, onAdd, onRemove }) => {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleAdd = () => {
        const trimmed = input.trim().toLowerCase();
        if (trimmed && !tags.includes(trimmed)) {
            onAdd(trimmed);
            setInput('');
        }
    };

    const filteredSuggestions = suggestions.filter(s =>
        !tags.includes(s) && s.includes(input.toLowerCase())
    );

    return (
        <div className="w-64 space-y-4 p-4 bg-card border border-slate-800 rounded-xl shadow-2xl">
            <div className="space-y-2">
                <label className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">Active Tags</label>
                <div className="flex flex-wrap gap-2">
                    {tags.length > 0 ? (
                        tags.map(tag => (
                            <TagChip key={tag} label={tag} onRemove={() => onRemove(tag)} />
                        ))
                    ) : (
                        <span className="text-[11px] text-muted-foreground italic">No tags added</span>
                    )}
                </div>
            </div>

            <div className="space-y-2 relative">
                <label className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">Add Tag</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        placeholder="Type tag..."
                        className="flex-1 bg-background border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-accent transition-colors"
                    />
                    <button
                        onClick={handleAdd}
                        className="p-1.5 bg-slate-800 hover:bg-accent hover:text-black rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                {showSuggestions && input && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-slate-800 rounded-lg shadow-xl overflow-hidden max-h-32 overflow-y-auto">
                        {filteredSuggestions.map(s => (
                            <button
                                key={s}
                                onClick={() => {
                                    onAdd(s);
                                    setInput('');
                                    setShowSuggestions(false);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                    onClick={() => { }} // Close popover logic would be outside
                    className="text-[11px] text-muted-foreground/80 hover:text-white transition-colors flex items-center gap-1"
                >
                    <Check size={12} /> Done
                </button>
            </div>
        </div>
    );
};
