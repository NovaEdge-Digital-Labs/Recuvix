"use client";

import { useState } from "react";
import { Settings, History } from "lucide-react";
import { ModelPill } from "./ModelPill";
import { SettingsPanel } from "./SettingsPanel";
import Link from "next/link";
import { HistoryQuickPanel } from "../history/HistoryQuickPanel";
import { useAuth } from "@/context/AuthContext";
import { AuthButtons } from "@/components/nav/AuthButtons";
import { UserAvatarMenu } from "@/components/nav/UserAvatarMenu";
import { CreditBalanceWidget } from "../credits/CreditBalanceWidget";
import { WorkspaceSwitcher } from "../workspaces/WorkspaceSwitcher";
import { useTenant } from "@/context/TenantContext";
import { TenantNavLogo } from "../wl/TenantNavLogo";
import { MobileNav } from "./MobileNav";

export function NavBar() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const { user, isLoading } = useAuth();
    const { isFeatureEnabled, isAdmin, isTenantMode } = useTenant();

    const navItems = [
        { href: "/research", label: "Research", feature: "keyword_research" },
        {
            href: "/calendar",
            label: "Calendar",
            feature: "content_calendar",
            badge: { text: "New", className: "bg-accent text-white" }
        },
        { href: "/tracker", label: "Performance Tracker", feature: "tracker" },
        { href: "/competitor", label: "Competitor Analyzer", feature: "competitor_analyzer" },
        { href: "/history", label: "History" },
        {
            href: "/bulk",
            label: "Bulk",
            feature: "bulk_generation",
            badge: { text: "Beta", className: "bg-[#e8ff47] text-black" }
        },
        {
            href: "/voice",
            label: "Voice Studio",
            feature: "voice_studio",
            className: "text-accent font-bold",
            badge: { text: "Hot", className: "bg-accent/20 text-accent" }
        },
        { href: "/multilingual", label: "Multilingual", feature: "multilingual" },
        { href: "/repurpose", label: "Repurpose", feature: "repurpose" },
        ...(isTenantMode && isAdmin ? [
            {
                href: "/partner",
                label: "Dashboard",
                className: "text-accent font-bold"
            },
            {
                href: "/partner/settings",
                label: "Partner Settings",
                className: "text-muted-foreground font-medium"
            }
        ] : []),
    ].filter(item => !item.feature || isFeatureEnabled(item.feature));

    return (
        <>
            <nav className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background px-4 md:px-8">
                <div className="flex items-center gap-6">
                    <TenantNavLogo />

                    <div className="h-6 w-px bg-border hidden md:block" />

                    <div className="w-48 hidden md:block">
                        <WorkspaceSwitcher />
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium transition-colors hover:text-foreground ${item.className || "text-muted-foreground"}`}
                            >
                                {item.label}
                                {item.badge && (
                                    <span className={`ml-1.5 text-[9px] px-1 rounded font-bold uppercase ${item.badge.className}`}>
                                        {item.badge.text}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {user && (
                        <div className="hidden md:flex items-center gap-3">
                            <button
                                onClick={() => setIsHistoryOpen(true)}
                                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-card transition-colors flex items-center gap-2 group"
                                title="View History"
                            >
                                <History size={18} className="group-hover:rotate-12 transition-transform" />
                            </button>
                            <CreditBalanceWidget />
                            <ModelPill />
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-card transition-colors"
                            >
                                <Settings size={18} />
                            </button>
                        </div>
                    )}

                    {!isLoading && (
                        <div className="hidden md:block">
                            {user ? <UserAvatarMenu /> : <AuthButtons />}
                        </div>
                    )}

                    <MobileNav navItems={navItems} />
                </div>
            </nav>

            <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <HistoryQuickPanel isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </>
    );
}

