'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Settings, History, LogOut, ChevronRight, LayoutDashboard } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { WorkspaceSwitcher } from '../workspaces/WorkspaceSwitcher';
import { useAuth } from '@/context/AuthContext';
import { CreditBalanceWidget } from '../credits/CreditBalanceWidget';
import { ModelPill } from '../navigation/ModelPill';
import { TenantNavLogo } from '../wl/TenantNavLogo';

interface MobileNavProps {
    navItems: Array<{
        href: string;
        label: string;
        className?: string;
        badge?: { text: string; className: string };
    }>;
}

export function MobileNav({ navItems }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { user, signOut } = useAuth();

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={
                <button className="lg:hidden p-2 text-muted-foreground hover:text-foreground">
                    <Menu size={24} />
                </button>
            } />
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background border-l border-white/10 p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-white/5 text-left">
                    <div className="flex items-center justify-between">
                        <TenantNavLogo />
                        <button onClick={() => setIsOpen(false)} className="text-muted-foreground">
                            <X size={20} />
                        </button>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    {/* User Profile / Auth Section */}
                    <div className="p-6 border-b border-white/5 space-y-4">
                        {user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                                        {user.email?.[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                        <p className="text-xs text-muted-foreground">Free Plan</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                                        <CreditBalanceWidget />
                                    </div>
                                    <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
                                        <ModelPill />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center h-10 rounded-xl bg-white/5 text-white text-sm font-medium"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center h-10 rounded-xl bg-accent text-black text-sm font-bold"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Workspace Switcher */}
                    {user && (
                        <div className="p-6 border-b border-white/5">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Current Workspace</p>
                            <WorkspaceSwitcher />
                        </div>
                    )}

                    {/* Nav Items */}
                    <div className="p-4">
                        <p className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Navigation</p>
                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors hover:bg-white/5 ${item.className || "text-muted-foreground hover:text-white"}`}
                                >
                                    <span>{item.label}</span>
                                    {item.badge ? (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${item.badge.className}`}>
                                            {item.badge.text}
                                        </span>
                                    ) : (
                                        <ChevronRight size={14} className="opacity-20" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                {user && (
                    <div className="p-6 bg-white/[0.02] border-t border-white/5 space-y-2">
                        <Link
                            href="/app"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white transition-colors"
                        >
                            <LayoutDashboard size={18} />
                            Dashboard
                        </Link>
                        <button className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white transition-colors w-full text-left">
                            <Settings size={18} />
                            Settings
                        </button>
                        <button
                            onClick={() => { signOut(); setIsOpen(false); }}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 transition-colors w-full text-left"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
