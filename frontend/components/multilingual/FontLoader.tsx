import React from "react";
import Head from "next/head";

export function FontLoader() {
    return (
        <Head>
            {/* Google Fonts for Multilingual Support */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Noto+Sans+KR:wght@400;700&family=Noto+Sans+SC:wght@400;700&family=Noto+Sans+TC:wght@400;700&family=Noto+Sans+Devanagari:wght@400;700&family=Noto+Sans+Arabic:wght@400;700&family=Noto+Sans:wght@400;700&display=swap"
                rel="stylesheet"
            />
            <style>{`
        .font-japanese { font-family: 'Noto Sans JP', sans-serif; }
        .font-korean { font-family: 'Noto Sans KR', sans-serif; }
        .font-chinese { font-family: 'Noto Sans SC', sans-serif; }
        .font-hindi { font-family: 'Noto Sans Devanagari', sans-serif; }
        .font-arabic { font-family: 'Noto Sans Arabic', sans-serif; }
        
        /* RTL support classes */
        .direction-rtl { direction: rtl; }
        .direction-ltr { direction: ltr; }
      `}</style>
        </Head>
    );
}
