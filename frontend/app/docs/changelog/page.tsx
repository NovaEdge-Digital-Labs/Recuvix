import DocsLayout from "@/components/docs/DocsLayout";

export default function ChangelogPage() {
    const updates = [
        {
            date: "March 17, 2026",
            version: "v1.0.0",
            title: "Public Launch",
            changes: [
                "Official launch of Recuvix AI documentation site.",
                "Introduced Managed Mode with credit-based generation.",
                "Added support for Grok 3 AI model.",
                "Launched Voice-to-Blog studio with enhanced transcription accuracy."
            ]
        },
        {
            date: "March 10, 2026",
            version: "v0.9.5-beta",
            title: "Beta Improvements",
            changes: [
                "Enhanced internal linking suggestion engine.",
                "Improved WordPress direct publish reliability.",
                "Added 3 new multilingual models (Arabic, Japanese, Korean)."
            ]
        }
    ];

    return (
        <DocsLayout
            title="Changelog"
            description="Stay up to date with the latest features, improvements, and bug fixes."
            breadcrumbs={[
                { label: "Resources", href: "/docs" },
                { label: "Changelog", href: "/docs/changelog" }
            ]}
        >
            <div className="space-y-12 mt-8">
                {updates.map((update, i) => (
                    <div key={i} className="relative pl-8 border-l border-[#1a1a1a]">
                        {/* Timeline Dot */}
                        <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] rounded-full bg-[#e8ff47] shadow-[0_0_10px_rgba(232,255,71,0.5)]" />

                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[11px] font-mono text-[#444] uppercase tracking-widest">{update.date}</span>
                            <span className="px-2 py-0.5 rounded bg-[#111] border border-[#222] text-[10px] font-mono text-[#e8ff47]">
                                {update.version}
                            </span>
                        </div>

                        <h3 className="text-white mt-0 text-xl font-bold">{update.title}</h3>
                        <ul className="mt-4 space-y-3">
                            {update.changes.map((change, j) => (
                                <li key={j} className="text-[#666] text-sm leading-relaxed">{change}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </DocsLayout>
    );
}
