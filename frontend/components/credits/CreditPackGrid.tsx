"use client";

import { CreditPackCard } from "./CreditPackCard";
import { creditPacks } from "@/lib/config/creditPacks";
import { useCredits } from "@/hooks/useCredits";

export function CreditPackGrid() {
    const { buyPack } = useCredits();

    return (
        <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-2 lg:grid-cols-4">
            {creditPacks.map((pack) => (
                <CreditPackCard
                    key={pack.id}
                    pack={pack}
                    onBuy={buyPack}
                />
            ))}
        </div>
    );
}
