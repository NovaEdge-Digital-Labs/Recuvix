import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends emails in batches of 100 as per Resend limits.
 */
export async function sendNewsletterBatch(emails: { to: string; subject: string; html: string }[]) {
    const BATCH_SIZE = 100;
    const results = [];

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
        const batch = emails.slice(i, i + BATCH_SIZE).map(email => ({
            from: 'Recuvix <newsletter@recuvix.com>',
            ...email
        }));

        try {
            const data = await resend.batch.send(batch);
            results.push(data);

            // 100ms delay between batches to respect rate limits
            if (i + BATCH_SIZE < emails.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error) {
            console.error(`Error sending batch starting at index ${i}:`, error);
            results.push({ error });
        }
    }

    return results;
}
