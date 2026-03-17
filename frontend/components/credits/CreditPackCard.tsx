"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditPack } from "@/lib/config/creditPacks";
import { cn } from "@/lib/utils";

interface CreditPackCardProps {
    pack: CreditPack;
    onBuy: (packId: string) => void;
    isLoading?: boolean;
}

export function CreditPackCard({ pack, onBuy, isLoading }: CreditPackCardProps) {
    const isBestValue = pack.id === 'agency';
    const isPopular = pack.id === 'pro';

    return (
        <Card
            // We use style here because it beats any CSS classes hiding in the Card component
            style={{ overflow: 'visible' }}
            className={cn(
                "relative flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(232,255,71,0.1)] hover:-translate-y-1 bg-zinc-900/40 border-zinc-800 backdrop-blur-md mt-10",
                isPopular && "border-[#E8FF47]/50 shadow-[0_0_20px_rgba(232,255,71,0.05)] scale-105 z-20",
                isBestValue && "border-[#E8FF47]/30 z-10"
            )}
        >
            {/* MOST POPULAR TAG */}
            {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-[100] w-full flex justify-center">
                    <Badge className="px-4 py-1.5 bg-[#E8FF47] text-zinc-950 hover:bg-[#E8FF47]/90 border-none font-bold whitespace-nowrap shadow-xl">
                        MOST POPULAR
                    </Badge>
                </div>
            )}

            {/* BEST VALUE TAG */}
            {isBestValue && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-[100] w-full flex justify-center">
                    <Badge className="px-4 py-1.5 bg-zinc-800 text-[#E8FF47] border border-[#E8FF47]/30 hover:bg-zinc-700 font-bold backdrop-blur-sm whitespace-nowrap shadow-xl">
                        BEST VALUE
                    </Badge>
                </div>
            )}

            <CardHeader className="relative pt-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-white">{pack.name}</CardTitle>
                    <div className="p-2 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                        <span className="text-2xl">💰</span>
                    </div>
                </div>
                <CardDescription className="text-zinc-400">
                    {pack.credits} Credits for managed generation
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <div className="mb-6">
                    <span className="text-4xl font-bold text-white">₹{pack.price}</span>
                    <span className="ml-1 text-zinc-500">/ pack</span>
                    <p className="mt-2 text-sm text-zinc-500">
                        ~₹{(pack.price / pack.credits).toFixed(1)} per generation
                    </p>
                </div>

                <ul className="space-y-3">
                    {pack.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-zinc-400">
                            <Check className="w-4 h-4 mt-0.5 text-[#E8FF47] shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                    <li className="flex items-start gap-3 text-sm text-zinc-400">
                        <Check className="w-4 h-4 mt-0.5 text-[#E8FF47] shrink-0" />
                        <span>Priority processing</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-zinc-400">
                        <Check className="w-4 h-4 mt-0.5 text-[#E8FF47] shrink-0" />
                        <span>24/7 Support</span>
                    </li>
                </ul>
            </CardContent>

            <CardFooter>
                <Button
                    onClick={() => onBuy(pack.id)}
                    disabled={isLoading}
                    className={cn(
                        "w-full font-bold h-11 transition-all",
                        isPopular
                            ? "bg-[#E8FF47] text-zinc-950 hover:bg-[#E8FF47]/90 shadow-[0_0_20px_rgba(232,255,71,0.2)]"
                            : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                    )}
                >
                    {isLoading ? "Processing..." : "Buy Credits"}
                </Button>
            </CardFooter>
        </Card>
    );
}