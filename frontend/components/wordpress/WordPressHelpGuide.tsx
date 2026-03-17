import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

export function WordPressHelpGuide({ siteUrl }: { siteUrl?: string }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-white/70 hover:bg-white/5 transition-colors"
            >
                <span>How to get an Application Password</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isOpen && (
                <div className="p-4 pt-0 text-sm text-white/50 space-y-3 border-t border-white/10">
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Log into your WordPress admin</li>
                        <li>Go to <b>Users → Profile</b> (or Users → Your Profile)</li>
                        <li>Scroll down to <b>&ldquo;Application Passwords&rdquo;</b></li>
                        <li>Type <b>&ldquo;Recuvix&rdquo;</b> as the application name</li>
                        <li>Click <b>&ldquo;Add New Application Password&rdquo;</b></li>
                        <li>Copy the generated password and paste it above</li>
                    </ol>

                    {siteUrl && (
                        <a
                            href={`${siteUrl.replace(/\/$/, "")}/wp-admin/profile.php#application-passwords-section`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-accent hover:underline mt-2"
                        >
                            Open your WordPress profile <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}
