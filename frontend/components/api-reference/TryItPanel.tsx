'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Send, Terminal, Loader2, Braces, RefreshCw } from 'lucide-react'
import ResponseViewer from './ResponseViewer'

interface TryItPanelProps {
    method: string
    path: string
    initialBody: string
    isStreaming: boolean
}

const TryItPanel: React.FC<TryItPanelProps> = ({ method, path, initialBody, isStreaming }) => {
    const [token, setToken] = useState('')
    const [requestBody, setRequestBody] = useState(initialBody)
    const [status, setStatus] = useState<'idle' | 'loading' | 'streaming' | 'success' | 'error'>('idle')
    const [response, setResponse] = useState<any>(null)
    const [statusCode, setStatusCode] = useState(200)
    const [streamedText, setStreamedText] = useState('')
    const [chunkCount, setChunkCount] = useState(0)
    const [isInvalidJson, setIsInvalidJson] = useState(false)

    const getTokenFromSession = async () => {
        try {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.access_token) {
                setToken(session.access_token)
            }
        } catch (err) {
            console.error('Failed to get session token:', err)
        }
    }

    const handleJsonChange = (val: string) => {
        setRequestBody(val)
        try {
            JSON.parse(val)
            setIsInvalidJson(false)
        } catch (e) {
            setIsInvalidJson(true)
        }
    }

    const formatJson = () => {
        try {
            const obj = JSON.parse(requestBody)
            setRequestBody(JSON.stringify(obj, null, 2))
            setIsInvalidJson(false)
        } catch (e) {
            setIsInvalidJson(true)
        }
    }

    const sendRequest = async () => {
        setStatus('loading')
        setResponse(null)
        setStreamedText('')
        setChunkCount(0)

        try {
            const options: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }

            if (method !== 'GET') {
                options.body = requestBody
            }

            const res = await fetch(`https://recuvix.in${path}`, options)
            setStatusCode(res.status)

            if (!res.ok) {
                const errData = await res.json()
                setResponse(errData)
                setStatus('error')
                return
            }

            if (isStreaming) {
                setStatus('streaming')
                const reader = res.body?.getReader()
                const decoder = new TextDecoder()

                while (true) {
                    const { done, value } = await reader!.read()
                    if (done) break

                    const chunk = decoder.decode(value)
                    const lines = chunk.split('\n')

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6))
                                setChunkCount(prev => prev + 1)
                                if (data.type === 'chunk') {
                                    setStreamedText(prev => prev + data.text)
                                }
                                if (data.type === 'done') {
                                    setResponse(data)
                                    setStatus('success')
                                }
                            } catch (e) {
                                // Ignore non-json data
                            }
                        }
                    }
                }
            } else {
                const data = await res.json()
                setResponse(data)
                setStatus('success')
            }
        } catch (err: any) {
            setResponse({ error: err.message })
            setStatus('error')
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-[#0a0a0a] border border-[#111] rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-[#0d0d0d] border-b border-[#111] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-[#444]" />
                        <span className="text-[10px] font-mono font-bold text-[#444] uppercase tracking-widest">Try It</span>
                    </div>
                    <div className="px-2 py-0.5 rounded bg-[#111] text-[10px] font-mono text-[#666]">Production</div>
                </div>

                <div className="p-4 space-y-4">
                    {/* Auth */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono font-bold text-[#444] uppercase tracking-wider">Bearer Token</label>
                            <button
                                onClick={getTokenFromSession}
                                className="text-[10px] font-medium text-[#e8ff47] hover:underline"
                            >
                                Use Current Session
                            </button>
                        </div>
                        <input
                            type="password"
                            placeholder="Paste your JWT token..."
                            className="w-full bg-[#050505] border border-[#111] rounded-lg px-3 py-2 text-xs font-mono text-[#999] outline-none focus:border-[#222]"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </div>

                    {/* Body */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-mono font-bold text-[#444] uppercase tracking-wider">Request Body</label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={formatJson}
                                    className="text-[10px] font-medium text-[#666] hover:text-[#999] flex items-center gap-1"
                                >
                                    <Braces className="w-3 h-3" />
                                    Format
                                </button>
                                <button
                                    onClick={() => handleJsonChange(initialBody)}
                                    className="text-[10px] font-medium text-[#666] hover:text-[#999] flex items-center gap-1"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    Reset
                                </button>
                            </div>
                        </div>
                        <textarea
                            className={`w-full h-48 bg-[#050505] border rounded-lg p-3 text-xs font-mono text-[#999] outline-none transition-colors custom-scrollbar resize-none ${isInvalidJson ? 'border-red-500/50' : 'border-[#111] focus:border-[#222]'
                                } `}
                            value={requestBody}
                            onChange={(e) => handleJsonChange(e.target.value)}
                            spellCheck={false}
                        />
                    </div>

                    <button
                        disabled={status === 'loading' || status === 'streaming' || isInvalidJson}
                        onClick={sendRequest}
                        className="w-full py-3 rounded-lg bg-[#e8ff47] text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#d4eb3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {status === 'loading' || status === 'streaming' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        )}
                        {status === 'loading' ? 'Sending...' : status === 'streaming' ? 'Streaming...' : 'Send Request'}
                    </button>
                </div>
            </div>

            <ResponseViewer
                status={status}
                data={response}
                statusCode={statusCode}
                streamedText={streamedText}
                chunkCount={chunkCount}
            />
        </div>
    )
}

export default TryItPanel
