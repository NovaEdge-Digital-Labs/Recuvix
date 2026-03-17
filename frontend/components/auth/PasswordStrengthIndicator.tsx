"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface StrengthIndicatorProps {
    strength: 0 | 1 | 2 | 3 | 4; // 0: None, 1: Weak, 2: Fair, 3: Strong, 4: Very Strong
}

export function PasswordStrengthIndicator({ strength }: StrengthIndicatorProps) {
    const getStrengthLabel = () => {
        switch (strength) {
            case 1: return "Weak";
            case 2: return "Fair";
            case 3: return "Strong";
            case 4: return "Very Strong";
            default: return "";
        }
    };

    const getColorClass = (index: number) => {
        if (index >= strength) return "bg-white/10";

        switch (strength) {
            case 1: return "bg-red-500";
            case 2: return "bg-orange-500";
            case 3: return "bg-yellow-500";
            case 4: return "bg-green-500";
            default: return "bg-white/10";
        }
    };

    return (
        <div className="mt-2 space-y-2">
            <div className="flex gap-1.5 h-1">
                {[0, 1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex-1 rounded-full transition-all duration-300",
                            getColorClass(i)
                        )}
                    />
                ))}
            </div>
            <div className="flex justify-between items-center px-0.5">
                <span className={cn(
                    "text-[10px] font-medium uppercase tracking-wider",
                    strength === 1 && "text-red-500",
                    strength === 2 && "text-orange-500",
                    strength === 3 && "text-yellow-500",
                    strength === 4 && "text-green-500",
                    strength === 0 && "text-white/20"
                )}>
                    {getStrengthLabel() || "Password Strength"}
                </span>
            </div>
        </div>
    );
}
