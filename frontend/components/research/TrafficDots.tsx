import { cn } from "@/lib/utils";

interface TrafficDotsProps {
    potential: "Low" | "Medium" | "High" | "Very High";
    className?: string;
}

export function TrafficDots({ potential, className }: TrafficDotsProps) {
    const fillCount = { "Low": 1, "Medium": 2, "High": 3, "Very High": 4 }[potential];

    return (
        <div className={cn("flex gap-1", className)}>
            {[1, 2, 3, 4].map((i) => (
                <div
                    key={i}
                    className={cn(
                        "w-2 h-2 rounded-full",
                        i <= fillCount ? "bg-accent" : "bg-border"
                    )}
                />
            ))}
        </div>
    );
}
