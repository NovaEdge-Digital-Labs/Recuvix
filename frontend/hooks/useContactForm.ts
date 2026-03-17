'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export type ContactTopic = 'support' | 'billing' | 'feature' | 'bug' | 'enterprise' | 'other'
export type Priority = 'low' | 'medium' | 'high' | 'critical'

export function useContactForm(initialEmail?: string) {
    const [selectedTopic, setSelectedTopic] = useState<ContactTopic>('support')
    const [name, setName] = useState('')
    const [email, setEmail] = useState(initialEmail || '')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [priority, setPriority] = useState<Priority>('medium')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [ticketId, setTicketId] = useState('')

    const charCount = message.length

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    topic: selectedTopic,
                    subject,
                    message,
                    priority,
                }),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send message')
            }

            setSubmitted(true)
            setTicketId(result.ticketId)
            toast.success('Message sent successfully!')
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong')
        } finally {
            setIsSubmitting(false)
        }
    }

    return {
        selectedTopic,
        setSelectedTopic,
        name,
        setName,
        email,
        setEmail,
        subject,
        setSubject,
        message,
        setMessage,
        priority,
        setPriority,
        charCount,
        isSubmitting,
        submitted,
        ticketId,
        handleSubmit,
    }
}
