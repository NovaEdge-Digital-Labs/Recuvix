import { supabaseAdmin } from '@/lib/supabase/admin';
import { Database } from '@/lib/supabase/database';

export type NewsletterSubscriber = any;
export type NewsletterSend = any;

export async function getNewsletterSubscribers() {
    const { data, error } = await (supabaseAdmin as any)
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function subscribeUser(subscriber: { email: string; name?: string; source?: string }) {
    const { data, error } = await (supabaseAdmin as any)
        .from('newsletter_subscribers')
        .upsert(
            {
                email: subscriber.email,
                name: subscriber.name,
                source: subscriber.source || 'website',
                status: 'active'
            },
            { onConflict: 'email' }
        )
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function unsubscribeUserByToken(token: string) {
    const { data, error } = await (supabaseAdmin as any)
        .from('newsletter_subscribers')
        .update({
            status: 'unsubscribed',
            unsubscribed_at: new Date().toISOString()
        })
        .eq('unsubscribe_token', token)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function createNewsletterSend(send: any) {
    const { data, error } = await (supabaseAdmin as any)
        .from('newsletter_sends')
        .insert(send)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getNewsletterHistory() {
    const { data, error } = await (supabaseAdmin as any)
        .from('newsletter_sends')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
}

export async function getActiveSubscribers() {
    const { data, error } = await (supabaseAdmin as any)
        .from('newsletter_subscribers')
        .select('email, name, unsubscribe_token')
        .eq('status', 'active');

    if (error) throw error;
    return data || [];
}
