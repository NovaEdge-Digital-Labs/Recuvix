"use client";

import React, { useState } from 'react';
import { Send, Eye, TestTube, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ComposeTab = () => {
    const [subject, setSubject] = useState('');
    const [previewText, setPreviewText] = useState('');
    const [content, setContent] = useState('');
    const [isPreview, setIsPreview] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [testEmail, setTestEmail] = useState('');

    const handleSendTest = async () => {
        if (!subject || !content) {
            alert('Please fill in subject and content');
            return;
        }
        setIsSending(true);
        try {
            const res = await fetch('/api/newsletter/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    previewText,
                    content,
                    isTest: true,
                    testEmail
                })
            });
            const data = await res.json();
            if (data.success) alert('Test email sent!');
            else alert('Error: ' + data.error);
        } catch (err) {
            alert('Failed to send test');
        } finally {
            setIsSending(false);
        }
    };

    const handleSendToAll = async () => {
        if (!confirm(`Are you sure you want to send this to all active subscribers?`)) return;

        setIsSending(true);
        try {
            const res = await fetch('/api/newsletter/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    previewText,
                    content,
                    isTest: false
                })
            });
            const data = await res.json();
            if (data.success) alert(`Newsletter sent to ${data.recipientCount} subscribers!`);
            else alert('Error: ' + data.error);
        } catch (err) {
            alert('Failed to send newsletter');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[600px]">
            {/* Editor Side */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-400">Subject Line</label>
                        <Input
                            placeholder="e.g. Weekly Product Update"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="bg-zinc-950 border-zinc-800"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-400">Preview Text (Email Subtitle)</label>
                        <Input
                            placeholder="A short summary that appears in the inbox"
                            value={previewText}
                            onChange={(e) => setPreviewText(e.target.value)}
                            className="bg-zinc-950 border-zinc-800 text-zinc-400"
                        />
                    </div>
                    <div className="space-y-1.5 h-full">
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-zinc-400">HTML Content</label>
                            <span className="text-[10px] text-zinc-500">Variables: {'{{name}}'}, {'{{unsubscribe_url}}'}</span>
                        </div>
                        <Textarea
                            placeholder="<h1>Hello {{name}}!</h1><p>Welcome to our update...</p>"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="bg-zinc-950 border-zinc-800 min-h-[400px] font-mono text-sm"
                        />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-accent">Sending to all subscribers</p>
                        <p className="text-xs text-zinc-400 mt-1">Make sure you've sent a test email and checked the preview carefully. This action cannot be undone.</p>
                    </div>
                </div>
            </div>

            {/* Preview / Actions Side */}
            <div className="flex flex-col gap-6">
                <div className="flex-1 rounded-2xl border border-white/5 bg-zinc-950 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Inbox Preview</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto bg-black flex items-center justify-center">
                        {content ? (
                            <div className="w-full max-w-[600px] bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden shadow-2xl">
                                <div className="p-4 border-b border-zinc-900 bg-zinc-900/50">
                                    <p className="text-xs text-zinc-500">From: Recuvix Newsletter</p>
                                    <p className="text-sm font-medium text-white mt-1">{subject || '(No Subject)'}</p>
                                </div>
                                <div className="p-4 bg-zinc-950 text-white min-h-[300px]">
                                    <div dangerouslySetInnerHTML={{ __html: content.replace(/{{name}}/g, 'John Doe') }} />
                                </div>
                            </div>
                        ) : (
                            <p className="text-zinc-600 italic">Enter some HTML to see a preview...</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 space-y-3">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Test Send</p>
                        <Input
                            placeholder="admin@example.com"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                            className="bg-black border-zinc-800"
                        />
                        <Button
                            onClick={handleSendTest}
                            disabled={isSending}
                            variant="secondary"
                            className="w-full h-11 font-bold"
                        >
                            <TestTube className="w-4 h-4 mr-2" />
                            Send Test
                        </Button>
                    </div>
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-white/5 flex flex-col justify-between gap-3">
                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Production Launch</p>
                        <Button
                            onClick={handleSendToAll}
                            disabled={isSending}
                            variant="default"
                            className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-bold"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Send to All
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComposeTab;
