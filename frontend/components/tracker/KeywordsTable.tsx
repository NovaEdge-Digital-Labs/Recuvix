"use client";

import { useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { GSCKeywordSnapshot } from "@/lib/tracker/snapshotManager";
import { ArrowUp, ArrowDown, Sparkles, Zap, TrendingUp } from "lucide-react";

interface KeywordsTableProps {
    snapshots: GSCKeywordSnapshot[];
}

export function KeywordsTable({ snapshots }: KeywordsTableProps) {
    const keywordData = useMemo(() => {
        // Get latest snapshot per keyword
        const latestDate = Array.from(new Set(snapshots.map(s => s.date))).sort((a, b) => b.localeCompare(a))[0];
        const previousDate = Array.from(new Set(snapshots.map(s => s.date))).sort((a, b) => b.localeCompare(a))[1];

        const currentKeywords = snapshots.filter(s => s.date === latestDate);
        const previousKeywords = snapshots.filter(s => s.date === previousDate);

        return currentKeywords.map(curr => {
            const prev = previousKeywords.find(p => p.keyword === curr.keyword);
            const delta = prev ? prev.position - curr.position : null; // positive = better rank

            let status: "snippet" | "win" | "rank" | "none" = "none";
            if (curr.position <= 3) status = "rank";
            else if (curr.position <= 10 && curr.impressions > 500) status = "snippet";
            else if (curr.position <= 20 && curr.impressions > 200) status = "win";

            return { ...curr, delta, status };
        }).sort((a, b) => a.position - b.position);
    }, [snapshots]);

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 border-border hover:bg-muted/50">
                        <TableHead className="w-[200px]">Keyword</TableHead>
                        <TableHead className="text-center">Position</TableHead>
                        <TableHead className="text-center">Change</TableHead>
                        <TableHead className="text-center">Impressions</TableHead>
                        <TableHead className="text-center">Clicks</TableHead>
                        <TableHead className="text-center">CTR</TableHead>
                        <TableHead className="text-right">Opportunity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {keywordData.map((kw) => (
                        <TableRow key={kw.keyword} className="border-border hover:bg-muted/20">
                            <TableCell className="font-medium">{kw.keyword}</TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-lg font-bold">{kw.position.toFixed(1)}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {kw.delta !== null && (
                                    <div className={`flex items-center justify-center gap-0.5 text-xs font-bold ${kw.delta > 0 ? "text-green-500" : kw.delta < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                                        {kw.delta > 0 ? <ArrowUp className="w-3 h-3" /> : kw.delta < 0 ? <ArrowDown className="w-3 h-3" /> : null}
                                        {Math.abs(kw.delta).toFixed(1)}
                                    </div>
                                )}
                                {kw.delta === null && <span className="text-muted-foreground text-xs">—</span>}
                            </TableCell>
                            <TableCell className="text-center text-muted-foreground">{kw.impressions.toLocaleString()}</TableCell>
                            <TableCell className="text-center">{kw.clicks}</TableCell>
                            <TableCell className="text-center font-medium">{(kw.ctr * 100).toFixed(1)}%</TableCell>
                            <TableCell className="text-right">
                                {kw.status === "rank" && (
                                    <Badge className="bg-green-500 hover:bg-green-500 border-none">
                                        <TrendingUp className="w-3 h-3 mr-1" /> Ranking
                                    </Badge>
                                )}
                                {kw.status === "snippet" && (
                                    <Badge className="bg-primary hover:bg-primary border-none text-primary-foreground">
                                        <Sparkles className="w-3 h-3 mr-1" /> Featured Snippet
                                    </Badge>
                                )}
                                {kw.status === "win" && (
                                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
                                        <Zap className="w-3 h-3 mr-1" /> Quick Win
                                    </Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
