'use client';

import { useWorkspace } from '@/context/WorkspaceContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    Building2,
    ChevronDown,
    Plus,
    Settings,
    Users,
    Check,
    LayoutDashboard
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useState } from 'react';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';

export function WorkspaceSwitcher() {
    const { workspaces, activeWorkspace, setActiveWorkspace, isLoading } = useWorkspace();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="h-9 w-40 animate-pulse bg-muted rounded-md" />
        );
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost" className="relative h-10 w-full justify-start gap-2 px-2 hover:bg-accent focus-visible:ring-0">
                        <Avatar className="h-6 w-6 border shadow-sm">
                            <AvatarImage src={activeWorkspace?.avatar_url || ''} />
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                {activeWorkspace?.name?.charAt(0) || <Building2 className="h-3 w-3" />}
                            </AvatarFallback>
                        </Avatar>
                        <span className="flex-1 truncate text-left text-sm font-medium">
                            {activeWorkspace?.name || 'Select Workspace'}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="start" sideOffset={8}>
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Workspaces</DropdownMenuLabel>
                        {workspaces.map((ws) => (
                            <DropdownMenuItem
                                key={ws.id}
                                onClick={() => setActiveWorkspace(ws.id)}
                                className="flex items-center gap-2 py-2 cursor-pointer"
                            >
                                <Avatar className="h-6 w-6 border">
                                    <AvatarImage src={ws.avatar_url || ''} />
                                    <AvatarFallback className="text-[10px]">
                                        {ws.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="flex-1 truncate text-sm">
                                    {ws.name}
                                </span>
                                {activeWorkspace?.id === ws.id && (
                                    <Check className="h-4 w-4 text-primary" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex items-center gap-2 py-2 cursor-pointer text-primary focus:text-primary"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-primary/20 bg-primary/5">
                            <Plus className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">Create New Workspace</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Link href="/workspaces">
                            <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer">
                                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">All Workspaces</span>
                            </DropdownMenuItem>
                        </Link>
                        {activeWorkspace && (
                            <Link href={`/workspace/${activeWorkspace.slug}/settings`}>
                                <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer">
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">Workspace Settings</span>
                                </DropdownMenuItem>
                            </Link>
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <CreateWorkspaceModal
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />
        </>
    );
}
