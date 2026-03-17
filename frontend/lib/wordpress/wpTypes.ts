export interface WPCategory {
    id: number;
    name: string;
    slug: string;
    count: number;
}

export interface WPTag {
    id: number;
    name: string;
    slug: string;
    count: number;
}

export interface WPAuthor {
    id: number;
    name: string;
    slug: string;
    avatarUrl: string;
}

export interface WPConnection {
    id: string; // nanoid()
    label: string;
    siteUrl: string;
    username: string;
    appPassword: string;
    connected: boolean;
    lastTestedAt: string;
    wordpressVersion: string;
    siteTitle: string;
    siteDescription: string;
    defaultStatus: "draft" | "publish";
    defaultCategory: number | null;
    defaultAuthorId: number | null;
    categories: WPCategory[];
    authors: WPAuthor[];
    connectedAt: string;
}

export interface WPPublishHistory {
    id: string;
    connectionId: string;
    siteUrl: string;
    postId: number;
    postUrl: string;
    postEditUrl: string;
    blogTitle: string;
    publishedAs: "draft" | "publish";
    publishedAt: string;
    featuredImageId: number | null;
}

export interface WPPublishResult {
    postId: number;
    postUrl: string;
    postEditUrl: string;
    title: string;
    status: "draft" | "publish";
    warning?: string;
}

export type WordPressErrorCode =
    | "INVALID_CREDENTIALS"
    | "REST_DISABLED"
    | "NOT_WORDPRESS"
    | "UNREACHABLE"
    | "CORS_BLOCK_RETRY" // Added as potential CORS issue
    | "APP_PASSWORDS_DISABLED";

export interface StepStatus {
    step: number;
    label: string;
    status: "pending" | "loading" | "done" | "failed" | "skipped";
    error?: string;
}
