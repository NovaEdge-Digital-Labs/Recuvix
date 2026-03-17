import React from "react";
import { WordPressIcon } from "./WordPressIcon";
import { Trash2, Edit2 } from "lucide-react";
import { WPConnection } from "../../lib/wordpress/wpTypes";

interface WordPressSiteCardProps {
    connection: WPConnection;
    isDefault: boolean;
    onEdit: () => void;
    onRemove: () => void;
    onSetDefault: () => void;
}

export function WordPressSiteCard({
    connection,
    isDefault,
    onEdit,
    onRemove,
    onSetDefault
}: WordPressSiteCardProps) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between group">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2171b1]/10 flex items-center justify-center text-[#2171b1]">
                    <WordPressIcon className="w-6 h-6" />
                </div>
                <div>
                    <h4 className="font-medium text-white">{connection.siteTitle || connection.label || "My Blog"}</h4>
                    <p className="text-xs text-white/50">
                        {connection.siteUrl.replace(/^https?:\/\//, "")} · Connected as: {connection.username}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {isDefault ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/70 px-2 py-1 rounded">
                        Default
                    </span>
                ) : (
                    <button
                        onClick={onSetDefault}
                        className="text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors"
                    >
                        Set Default
                    </button>
                )}

                <div className="h-4 w-[1px] bg-white/10 mx-1" />

                <button
                    onClick={onEdit}
                    className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded transition-all"
                    title="Edit Connection"
                >
                    <Edit2 className="w-4 h-4" />
                </button>

                <button
                    onClick={onRemove}
                    className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/5 rounded transition-all"
                    title="Remove Connection"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
