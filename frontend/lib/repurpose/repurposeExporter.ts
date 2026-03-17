import JSZip from 'jszip';
import { RepurposeFormat } from './repurposePromptBuilder';
import { RepurposeContent } from './repurposeContentParser';

export async function exportRepurposedToZip(
    blogTitle: string,
    blogSlug: string,
    generatedContent: Record<string, RepurposeContent>
): Promise<Blob> {
    const zip = new JSZip();
    const dateStr = new Date().toISOString().split('T')[0];
    const root = zip.folder(`recuvix-repurposed-${blogSlug}-${dateStr}`);

    if (!root) throw new Error('Failed to create ZIP folder');

    const summaryLines: string[] = [
        `# Repurposed Content Summary: ${blogTitle}`,
        `Generated on: ${new Date().toLocaleString()}`,
        '',
        '## Formats Included:',
    ];

    Object.entries(generatedContent).forEach(([format, data]) => {
        let filename = '';
        let content = '';

        switch (format as RepurposeFormat) {
            case 'linkedin':
                filename = 'linkedin-post.txt';
                content = data.content;
                break;
            case 'twitter':
                filename = 'twitter-thread.txt';
                content = data.tweets?.join('\n\n---\n\n') || data.content;
                break;
            case 'email':
                root.file('email-newsletter.html', data.html || data.content);
                filename = 'email-newsletter.txt';
                content = data.textVersion || data.content;
                break;
            case 'youtube':
                filename = 'youtube-script.txt';
                content = data.content;
                break;
            case 'instagram':
                filename = 'instagram-caption.txt';
                content = data.content;
                break;
            case 'facebook':
                filename = 'facebook-post.txt';
                content = data.content;
                break;
            case 'whatsapp':
                filename = 'whatsapp-message.txt';
                content = data.content;
                break;
            case 'pinterest':
                filename = 'pinterest-pin.txt';
                content = data.pinTitle ? `${data.pinTitle}\n\n${data.description}` : data.content;
                break;
        }

        if (filename && content) {
            root.file(filename, content);
            summaryLines.push(`- ${format.charAt(0).toUpperCase() + format.slice(1)}`);
        }
    });

    root.file('summary.md', summaryLines.join('\n'));

    return await zip.generateAsync({ type: 'blob' });
}
