import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function AuthCard({ children, className, ...props }: AuthCardProps) {
    return (
        <div className="flex items-center justify-center min-h-[80vh] p-4">
            <div
                className={cn(
                    "w-full max-w-[420px] bg-[#0d0d0d] border border-white/5 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden",
                    className
                )}
                {...props}
            >
                {/* Subtle accent glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/5 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
