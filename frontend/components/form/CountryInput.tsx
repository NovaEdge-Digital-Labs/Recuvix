"use client";

import { Input } from "@/components/ui/input";

interface CountryInputProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    label?: string;
}

export const COUNTRIES = [
    "United States (US)",
    "United Kingdom (UK)",
    "Canada (CA)",
    "Australia (AU)",
    "India (IN)",
    "Global",
];

export function CountryInput({ value, onChange, className, label = "Target Audience Country" }: CountryInputProps) {
    return (
        <div className={className}>
            <label className="block text-sm font-medium mb-1.5">{label}</label>
            <Input
                list="countries"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-background"
                placeholder="Target country"
            />
            <datalist id="countries">
                {COUNTRIES.map((c) => (
                    <option key={c} value={c} />
                ))}
            </datalist>
        </div>
    );
}
