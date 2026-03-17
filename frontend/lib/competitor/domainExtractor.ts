export function getDomainName(url: string): string {
    try {
        const parsed = new URL(url);
        return parsed.hostname.replace('www.', '');
    } catch {
        return url;
    }
}

export function getFaviconUrl(url: string): string {
    try {
        const parsed = new URL(url);
        return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=64`;
    } catch {
        return '';
    }
}
