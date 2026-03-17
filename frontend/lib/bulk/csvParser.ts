import { BulkTopic } from "@/lib/validators/bulkSchemas";
import { nanoid } from "nanoid";

export interface CsvParseResult {
    topics: Partial<BulkTopic>[];
    errors: Array<{ row: number; message: string }>;
    warnings: Array<{ row: number; message: string }>;
}

export function parseBulkCsv(csvText: string): CsvParseResult {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== "");
    const result: CsvParseResult = {
        topics: [],
        errors: [],
        warnings: [],
    };

    if (lines.length < 2) {
        result.errors.push({ row: 0, message: "CSV is empty or missing data rows" });
        return result;
    }

    const header = lines[0].toLowerCase().split(/[;,]/);
    const dataRows = lines.slice(1);

    // Map column names
    const colMap: Record<string, number> = {};
    header.forEach((h, i) => {
        const cleaned = h.trim();
        if (cleaned === "topic" || cleaned === "title") colMap.topic = i;
        if (cleaned === "focus_keyword" || cleaned === "keyword") colMap.focusKeyword = i;
        if (cleaned === "country" || cleaned === "target_country") colMap.country = i;
        if (cleaned === "word_count" || cleaned === "words") colMap.wordCount = i;
        if (cleaned === "tone") colMap.tone = i;
        if (cleaned === "notes") colMap.notes = i;
        if (cleaned === "secondary_keywords" || cleaned === "keywords") colMap.secondaryKeywords = i;
    });

    if (colMap.topic === undefined) {
        result.errors.push({ row: 1, message: "Required column 'topic' or 'title' not found" });
        return result;
    }

    dataRows.slice(0, 20).forEach((line, index) => {
        const rowNum = index + 2;
        const values = line.split(/[;,]/);

        const topicName = values[colMap.topic]?.trim();

        if (!topicName) {
            result.errors.push({ row: rowNum, message: "Topic is required" });
            return;
        }

        const wordCountRaw = colMap.wordCount !== undefined ? parseInt(values[colMap.wordCount]) : undefined;
        let wordCount: number | undefined = undefined;
        if (wordCountRaw !== undefined && !isNaN(wordCountRaw)) {
            if (wordCountRaw < 300 || wordCountRaw > 5000) {
                result.warnings.push({ row: rowNum, message: "Word count out of range (300-5000), using default" });
            } else {
                wordCount = wordCountRaw;
            }
        }

        const secondaryKeywords = colMap.secondaryKeywords !== undefined
            ? (values[colMap.secondaryKeywords] || "").split("|").map(k => k.trim()).filter(k => k !== "")
            : [];

        result.topics.push({
            id: nanoid(),
            topic: topicName,
            focusKeyword: colMap.focusKeyword !== undefined ? values[colMap.focusKeyword]?.trim() : "",
            secondaryKeywords,
            country: colMap.country !== undefined ? values[colMap.country]?.trim() : undefined,
            wordCount,
            tone: colMap.tone !== undefined ? values[colMap.tone]?.trim() : undefined,
            notes: colMap.notes !== undefined ? values[colMap.notes]?.trim() : undefined,
            sourceType: "csv",
            status: "queued"
        });
    });

    if (dataRows.length > 20) {
        result.warnings.push({ row: 0, message: "Only the first 20 topics were imported" });
    }

    return result;
}
