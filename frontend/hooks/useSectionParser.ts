"use client";

import { useCallback } from "react";
import { BlogSection } from "@/lib/types/editor";

export function useSectionParser() {
    const parseHtml = useCallback((html: string): BlogSection[] => {
        if (!html) return [];

        const sections: BlogSection[] = [];
        const h2Pattern = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;

        let match;
        const matches: { start: number; end: number; h2Html: string; h2Text: string }[] = [];

        while ((match = h2Pattern.exec(html)) !== null) {
            matches.push({
                start: match.index,
                end: h2Pattern.lastIndex,
                h2Html: match[0],
                h2Text: match[1].replace(/<[^>]*>/g, "").trim(),
            });
        }

        if (matches.length === 0) return [];

        matches.forEach((match, index) => {
            const sectionStart = match.start;
            const nextMatch = matches[index + 1];
            const sectionEnd = nextMatch ? nextMatch.start : html.length;

            const fullSectionHtml = html.substring(sectionStart, sectionEnd);
            const contentHtml = html.substring(match.end, sectionEnd);

            const wordCount = contentHtml.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
            const hasTable = /<table\b[^>]*>/i.test(contentHtml);
            const hasList = /<(?:ul|ol)\b[^>]*>/i.test(contentHtml);

            sections.push({
                index,
                h2Text: match.h2Text,
                h2Html: match.h2Html,
                contentHtml,
                fullSectionHtml,
                wordCount,
                hasTable,
                hasList,
                startOffset: sectionStart,
                endOffset: sectionEnd,
            });
        });

        return sections;
    }, []);

    const getSectionHtml = useCallback((html: string, index: number): string => {
        const sections = parseHtml(html);
        return sections[index]?.fullSectionHtml || "";
    }, [parseHtml]);

    const replaceSectionHtml = useCallback((fullHtml: string, index: number, newSectionHtml: string): string => {
        const sections = parseHtml(fullHtml);
        const section = sections[index];

        if (!section) return fullHtml;

        const before = fullHtml.substring(0, section.startOffset);
        const after = fullHtml.substring(section.endOffset);

        return before + newSectionHtml + after;
    }, [parseHtml]);

    return {
        parseHtml,
        getSectionHtml,
        replaceSectionHtml,
    };
}
