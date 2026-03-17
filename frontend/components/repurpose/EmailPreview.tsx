"use client";

import React, { useRef, useEffect } from 'react';

interface EmailPreviewProps {
    html: string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ html }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(html);
                doc.close();
            }
        }
    }, [html]);

    return (
        <div className="w-full h-full bg-white rounded-lg overflow-hidden border border-white/10 shadow-2xl">
            <iframe
                ref={iframeRef}
                title="Email Preview"
                className="w-full h-full border-none"
                sandbox="allow-popups allow-popups-to-escape-sandbox"
            />
        </div>
    );
};
