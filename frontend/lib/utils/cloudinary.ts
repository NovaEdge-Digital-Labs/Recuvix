/**
 * Cloudinary image transformation utility
 */
export function getOptimizedImageUrl(url: string, width?: number, height?: number) {
    if (!url || !url.includes('res.cloudinary.com')) return url;

    // Split at /upload/
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;

    const [base, path] = parts;
    const transforms: string[] = ['f_auto', 'q_auto'];

    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);

    const transformQuery = transforms.join(',');

    return `${base}/upload/${transformQuery}/${path}`;
}
