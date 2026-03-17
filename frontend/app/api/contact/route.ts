import { Resend } from 'resend'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/utils/rateLimiter'

const ContactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    topic: z.enum(['support', 'billing', 'feature', 'bug', 'enterprise', 'other']),
    subject: z.string().min(5).max(200),
    message: z.string().min(20).max(2000),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
})

export async function POST(request: NextRequest) {
    try {
        // Rate limit: 3 contact submissions per hour per IP
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
        if (!checkRateLimit(ip, 'contact_form', 3, 3600000)) {
            return Response.json({ error: 'Too many messages. Please wait before submitting again.' }, { status: 429 });
        }

        const body = await request.json()
        const parsed = ContactSchema.safeParse(body)

        if (!parsed.success) {
            return Response.json(
                { error: 'Invalid form data', details: parsed.error.format() },
                { status: 400 })
        }

        const data = parsed.data

        // Get user if logged in
        const supabase = await createServerSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()

        // Save to DB using admin client to bypass RLS and triggers
        const { data: message, error: dbError } = await (supabaseAdmin
            .from('contact_messages' as any) as any)
            .insert({
                user_id: user?.id || null,
                name: data.name,
                email: data.email,
                topic: data.topic,
                subject: data.subject,
                message: data.message,
                priority: data.priority,
                ip_address: request.headers.get('x-forwarded-for') || 'unknown',
                user_agent: request.headers.get('user-agent') || 'unknown',
            })
            .select('ticket_id')
            .single()

        if (dbError) {
            console.error('Database Error:', dbError)
            return Response.json(
                { error: 'Failed to save message' },
                { status: 500 })
        }

        // Send email via Resend
        const resend = new Resend(process.env.RESEND_API_KEY)

        // To support team
        await resend.emails.send({
            from: 'Contact Form <noreply@recuvix.in>',
            to: 'support@recuvix.in',
            subject: `[${message.ticket_id}] [${data.topic.toUpperCase()}] ${data.subject}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Ticket:</strong> ${message.ticket_id}</p>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Topic:</strong> ${data.topic}</p>
        <p><strong>Priority:</strong> ${data.priority}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <hr/>
        <p>${data.message.replace(/\n/g, '<br/>')}</p>
        ${user ? `<p><strong>User ID:</strong> ${user.id}</p>` : ''}
      `,
        })

        // Auto-reply to user
        await resend.emails.send({
            from: 'Recuvix Support <support@recuvix.in>',
            to: data.email,
            subject: `We received your message — ${message.ticket_id}`,
            html: `
        <p>Hi ${data.name},</p>
        <p>We received your message and will get back to you within 4 hours on business days.</p>
        <p><strong>Ticket ID:</strong> ${message.ticket_id}<br/>Reference this ID in any follow-up emails.</p>
        <p><strong>Your message:</strong></p>
        <blockquote>${data.message.replace(/\n/g, '<br/>')}</blockquote>
        <p>— The Recuvix Team</p>
      `,
        })

        return Response.json({
            success: true,
            ticketId: message.ticket_id,
        })
    } catch (error) {
        console.error('Contact API Error:', error)
        return Response.json(
            { error: 'Internal server error' },
            { status: 500 })
    }
}
