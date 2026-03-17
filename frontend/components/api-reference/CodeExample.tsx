'use client';

import React, { useState, useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import { Copy, Check } from 'lucide-react';

interface CodeExampleProps {
    examples: {
        curl?: string;
        typescript?: string;
        python?: string;
        javascript?: string;
    };
}

const CodeExample: React.FC<CodeExampleProps> = ({ examples }) => {
    const [activeLang, setActiveLang] = useState<'curl' | 'typescript' | 'python' | 'javascript'>('curl');
    const [copied, setCopied] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState('');

    const currentCode = examples[activeLang] || '';

    useEffect(() => {
        const langMap = {
            curl: 'bash',
            typescript: 'typescript',
            python: 'python',
            javascript: 'javascript'
        };

        if (currentCode) {
            const highlighted = hljs.highlight(currentCode, {
                language: langMap[activeLang]
            }).value;
            setHighlightedCode(highlighted);
        }
    }, [currentCode, activeLang]);

    const handleCopy = () => {
        navigator.clipboard.writeText(currentCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const langs = Object.keys(examples) as ('curl' | 'typescript' | 'python' | 'javascript')[];

    return (
        <div className="border border-[#111] bg-[#0a0a0a] rounded-xl overflow-hidden flex flex-col mb-6">
            <div className="px-4 py-2 border-b border-[#111] flex items-center justify-between">
                <div className="flex gap-4">
                    {langs.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            className={`text-[10px] font-mono uppercase tracking-widest transition-colors ${activeLang === lang ? 'text-[#e8ff47]' : 'text-[#444] hover:text-[#666]'
                                }`}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleCopy}
                    className="text-[#444] hover:text-[#f0f0f0] transition-colors"
                >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
            </div>
            <div className="p-4 overflow-x-auto max-h-[400px] custom-scrollbar">
                <pre className="!m-0">
                    <code
                        className={`hljs ${activeLang === 'curl' ? 'bash' : activeLang}`}
                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    />
                </pre>
            </div>
        </div>
    );
};

export default CodeExample;
