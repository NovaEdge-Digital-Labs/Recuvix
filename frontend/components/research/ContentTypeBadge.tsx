import { cn } from "@/lib/utils";

interface ContentTypeBadgeProps {
    type: string;
    className?: string;
}

const config: Record<string, string> = {
    "Listicle": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "How-To Guide": "bg-teal-500/10 text-teal-400 border-teal-500/20",
    "Comparison": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Case Study": "bg-orange-500/10 text-orange-400 border-orange-500/20",
    "Ultimate Guide": "bg-accent text-black border-accent",
    "News/Trend": "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

export function ContentTypeBadge({ type, className }: ContentTypeBadgeProps) {
    const styles = config[type] || config["News/Trend"];

    return (
        <div className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
            styles, className
        )}>
            {type}
        </div>
    );
}
