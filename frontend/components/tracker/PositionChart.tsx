"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";

const LineChart = dynamic(() => import("recharts").then((m) => m.LineChart), { ssr: false });
const Line = dynamic(() => import("recharts").then((m) => m.Line), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });
const Legend = dynamic(() => import("recharts").then((m) => m.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });
import { GSCKeywordSnapshot } from "@/lib/tracker/snapshotManager";

interface PositionChartProps {
    snapshots: GSCKeywordSnapshot[];
    focusKeyword: string;
}

export function PositionChart({ snapshots, focusKeyword }: PositionChartProps) {
    const chartData = useMemo(() => {
        // Group snapshots by date
        const dateGroups = snapshots.reduce((acc, curr) => {
            if (!acc[curr.date]) acc[curr.date] = {};
            // Store position for each keyword on that date
            acc[curr.date][curr.keyword] = curr.position;
            return acc;
        }, {} as Record<string, Record<string, number>>);

        // Get top 3 secondary keywords (+ focus keyword) to show on chart
        const allKeywords = Array.from(new Set(snapshots.map(s => s.keyword)));
        const secondaryKeywords = allKeywords
            .filter(k => k !== focusKeyword)
            .slice(0, 3);

        const keywordsToShow = [focusKeyword, ...secondaryKeywords];

        // Convert to recharts format
        return Object.keys(dateGroups)
            .sort((a, b) => a.localeCompare(b))
            .map(date => {
                const item: Record<string, string | number> = { date };
                keywordsToShow.forEach(kw => {
                    if (dateGroups[date][kw]) {
                        item[kw] = dateGroups[date][kw];
                    }
                });
                return item;
            });
    }, [snapshots, focusKeyword]);

    const allKeywords = Array.from(new Set(snapshots.map(s => s.keyword)));
    const secondaryKeywords = allKeywords
        .filter(k => k !== focusKeyword)
        .slice(0, 3);
    const keywordsToShow = [focusKeyword, ...secondaryKeywords];

    const colors = ["#e8ff47", "#60a5fa", "#34d399", "#f472b6"];

    return (
        <div className="w-full h-[320px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                        tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                        reversed={true}
                        domain={[1, 'auto']}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: "#1c1c1c", border: "1px solid #333", borderRadius: "12px", fontSize: "12px" }}
                        itemStyle={{ padding: "0px" }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} />

                    {keywordsToShow.map((kw, index) => (
                        <Line
                            key={kw}
                            type="monotone"
                            dataKey={kw}
                            stroke={colors[index] || "#8884d8"}
                            strokeWidth={kw === focusKeyword ? 3 : 2}
                            dot={{ r: 4, strokeWidth: 2, fill: "#000" }}
                            activeDot={{ r: 6 }}
                            name={kw === focusKeyword ? `${kw} (Focus)` : kw}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
