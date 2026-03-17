import { cn } from "@/lib/utils";

interface SearchVolumeBarProps {
    range: string;
    className?: string;
}

export function SearchVolumeBar({ range, className }: SearchVolumeBarProps) {
    const getFillWidth = (r: string) => {
        if (r.includes("< 100")) return "10%";
        if (r.includes("100-1K")) return "25%";
        if (r.includes("1K-10K")) return "45%";
        if (r.includes("10K-100K")) return "70%";
        if (r.includes("> 100K")) return "90%";
        return "5%";
    };

    const width = getFillWidth(range);

    return (
        <div className={cn("w-full h-1 bg-border rounded-full overflow-hidden", className)}>
            <div
                className="h-full bg-accent transition-all duration-500 ease-out"
                style={{ width }}
            />
        </div>
    );
}
