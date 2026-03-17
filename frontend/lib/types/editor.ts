export type EditType =
    | "full_regen"
    | "section_regen"
    | "section_edit"
    | "section_expand"
    | "section_simplify"
    | "tone_change";

export interface EditHistoryEntry {
    id: string;
    type: EditType;
    description: string;
    htmlBefore: string;
    htmlAfter: string;
    instruction: string;
    sectionH2?: string;
    createdAt: string;
}

export interface RecuvixCurrentBlog {
    id: string;
    originalHtml: string;
    currentHtml: string;
    currentMarkdown: string;
    editHistory: EditHistoryEntry[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    seoMeta: any;
    thumbnailUrl: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generationInput: any;
    topic: string;
    focusKeyword: string;
    country: string;
    wordCount: number;
    source?: 'standard' | 'voice' | 'repurpose';
    createdAt: string;
    lastEditedAt: string;
}

export interface BlogSection {
    index: number;
    h2Text: string;
    h2Html: string;            // the h2 element HTML
    contentHtml: string;       // everything after H2 until next H2
    fullSectionHtml: string;   // h2 + content combined
    wordCount: number;
    hasTable: boolean;
    hasList: boolean;
    startOffset: number;       // char offset in full HTML
    endOffset: number;
}
