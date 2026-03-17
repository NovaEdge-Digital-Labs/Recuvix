'use client'

import React from 'react';
import { useContactForm, ContactTopic } from '@/hooks/useContactForm';

const TOPICS = [
    { id: 'support', label: '🛠 Technical Support' },
    { id: 'billing', label: '💳 Billing' },
    { id: 'feature', label: '💡 Feature Request' },
    { id: 'bug', label: '🐛 Bug Report' },
    { id: 'enterprise', label: '🏢 Enterprise / White Label' },
    { id: 'other', label: '💬 Other' },
];

export function ContactForm() {
    const {
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
    } = useContactForm();

    if (submitted) {
        return (
            <div className="contact-success">
                <span className="success-icon">✓</span>
                <div>
                    <strong className="text-[#22c55e] block mb-1">Message received!</strong>
                    <p className="text-[#888] text-[14px]">
                        We'll reply to {email} within 4 hours on business days (Mon-Fri, 9am-6pm IST).
                    </p>
                    <div className="mt-4 p-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded font-mono text-[12px] text-[#666]">
                        Your reference: <span className="text-[#e8ff47]">#{ticketId}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="topic-chips">
                <p>What's this about?</p>
                <div className="chips-row">
                    {TOPICS.map(topic => (
                        <button
                            key={topic.id}
                            type="button"
                            className={`chip ${selectedTopic === topic.id ? 'chip-active' : ''}`}
                            onClick={() => setSelectedTopic(topic.id as ContactTopic)}
                        >
                            {topic.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="form-row">
                <div className="form-field">
                    <label>Your name</label>
                    <input
                        type="text"
                        placeholder="Rahul Sharma"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-field">
                    <label>Email address</label>
                    <input
                        type="email"
                        placeholder="rahul@agency.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="form-field">
                <label>Subject</label>
                <input
                    type="text"
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
            </div>

            <div className="form-field">
                <label>Message</label>
                <textarea
                    rows={6}
                    placeholder="Describe your issue or question in detail. For bugs: include steps to reproduce, which browser you're using, and any error messages you see."
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 2000))}
                    required
                />
                <div className="char-count">
                    {charCount}/2000
                </div>
            </div>

            {(selectedTopic === 'bug' || selectedTopic === 'enterprise') && (
                <div className="form-field">
                    <label>Priority</label>
                    <div className="priority-chips">
                        {['Low', 'Medium', 'High', 'Critical'].map(p => (
                            <button
                                key={p}
                                type="button"
                                className={`priority-chip ${priority === p.toLowerCase() ? `priority-active priority-${p.toLowerCase()}` : ''}`}
                                onClick={() => setPriority(p.toLowerCase() as any)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                type="submit"
                className="contact-submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Sending...' : 'Send Message →'}
            </button>
        </form>
    );
}
