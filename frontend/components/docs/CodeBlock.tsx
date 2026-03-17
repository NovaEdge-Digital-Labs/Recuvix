'use client';

import React, { useState, useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
    children: string;
    language?: string;
    filename?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, language = 'text', filename }) => {
    const [copied, setCopied] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState('');

    useEffect(() => {
        if (language && hljs.getLanguage(language)) {
            try {
                const highlighted = hljs.highlight(children.trim(), { language }).value;
                setHighlightedCode(highlighted);
            } catch (err) {
                setHighlightedCode(children.trim());
            }
        } else {
            setHighlightedCode(children.trim());
        }
    }, [children, language]);

    const handleCopy = () => {
        navigator.clipboard.writeText(children.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-6 overflow-hidden border rounded-lg bg-[#0d0d0d] border-[#1a1a1a]">
            {(filename || language) && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-[#1a1a1a] bg-[#0d0d0d]">
                    <div className="flex items-center gap-3">
                        {filename && (
                            <span className="text-xs font-mono text-[#666]">{filename}</span>
                        )}
                        {language && language !== 'text' && (
                            <span className="px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[10px] font-bold text-[#444] uppercase tracking-wider">
                                {language}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-xs text-[#666] hover:text-[#f0f0f0] transition-colors"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-green-500">Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            )}
            <div className="relative p-4 overflow-x-auto font-mono text-sm leading-relaxed">
                {!filename && !language && (
                    <button
                        onClick={handleCopy}
                        className="absolute top-4 right-4 p-1 rounded hover:bg-[#1a1a1a] text-[#666] hover:text-[#f0f0f0] transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                )}
                <pre className="!m-0">
                    <code
                        className={`hljs ${language}`}
                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    />
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;
