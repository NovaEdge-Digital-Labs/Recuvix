"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Settings,
    Database,
    History,
    PlusCircle,
    ChevronLeft,
    LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/context/WorkspaceContext';

interface SidebarItemProps {
    href: string;
    icon: LucideIcon;
    label: string;
    active?: boolean;
}

function SidebarItem({ href, icon: Icon, label, active }: SidebarItemProps) {
    return (
        <Link href={href} className="w-full block mb-1">
            <Button
                variant="ghost"
                className={cn(
                    "w-full justify-start gap-3 h-10 px-3",
                    active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
            >
                <Icon className="size-4 shrink-0" />
                <span className="truncate">{label}</span>
            </Button>
        </Link>
    );
}

export function WorkspaceSidebar() {
    const pathname = usePathname();
    const { activeWorkspace } = useWorkspace();

    if (!activeWorkspace) return null;

    const slug = activeWorkspace.slug;
    const baseUrl = `/workspace/${slug}`;

    const items = [
        { href: baseUrl, icon: LayoutDashboard, label: 'Dashboard' },
        { href: `${baseUrl}/blogs`, icon: History, label: 'Blogs' },
        { href: `${baseUrl}/members`, icon: Users, label: 'Members' },
        { href: `${baseUrl}/brand`, icon: Database, label: 'Brand Assets' },
        { href: `${baseUrl}/credits`, icon: PlusCircle, label: 'Credits' },
        { href: `${baseUrl}/settings`, icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className="w-64 border-r bg-card flex flex-col h-[calc(100vh-64px)] sticky top-16">
            <div className="flex-1 py-4 px-3 space-y-1">
                <div className="px-3 mb-4">
                    <Link href="/workspaces">
                        <Button variant="link" className="p-0 h-auto text-xs text-muted-foreground hover:text-primary gap-1">
                            <ChevronLeft className="size-3" />
                            Back to all workspaces
                        </Button>
                    </Link>
                </div>

                {items.map((item) => (
                    <SidebarItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        active={pathname === item.href}
                    />
                ))}
            </div>

            <div className="p-4 border-t bg-muted/30">
                <div className="flex items-center gap-3 px-2 mb-2">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {activeWorkspace.credits_balance}
                    </div>
                    <div>
                        <p className="text-xs font-medium">Credits</p>
                        <p className="text-[10px] text-muted-foreground">Available to team</p>
                    </div>
                </div>
                <Link href={`${baseUrl}/credits`}>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                        Buy More
                    </Button>
                </Link>
            </div>
        </aside>
    );
}
