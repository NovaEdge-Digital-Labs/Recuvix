import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
    difficulty: "Easy" | "Medium" | "Hard" | "Very Hard";
    score: number;
    className?: string;
}

const config = {
    Easy: { bg: "bg-[#0d2818]", text: "text-[#44ff88]", border: "border-[#1a4a2a]" },
    Medium: { bg: "bg-[#0d1a2e]", text: "text-[#60a5fa]", border: "border-[#1a3a5a]" },
    Hard: { bg: "bg-[#2a2008]", text: "text-[#fbbf24]", border: "border-[#4a3a10]" },
    "Very Hard": { bg: "bg-[#2a0d0d]", text: "text-[#ff6b6b]", border: "border-[#4a1a1a]" },
};

export function DifficultyBadge({ difficulty, score, className }: DifficultyBadgeProps) {
    const { bg, text, border } = config[difficulty];

    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
            bg, text, border, className
        )}>
            {difficulty} {score}
        </div>
    );
}
