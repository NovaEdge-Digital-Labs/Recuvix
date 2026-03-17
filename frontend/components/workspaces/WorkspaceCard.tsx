import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Users, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface WorkspaceCardProps {
    workspace: {
        id: string;
        name: string;
        slug: string;
        description?: string | null;
        avatar_url?: string | null;
        plan: string;
        max_members: number;
        credits_balance: number;
        created_at: string;
    };
    memberCount: number;
    role: string;
    isActive?: boolean;
    onSwitch?: (id: string) => void;
}

export function WorkspaceCard({
    workspace,
    memberCount,
    role,
    isActive,
    onSwitch
}: WorkspaceCardProps) {
    const isOwner = role === 'owner';
    const isAdmin = role === 'admin';

    return (
        <Card className={`group transition-all hover:shadow-md ${isActive ? 'border-primary ring-1 ring-primary' : ''}`}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarImage src={workspace.avatar_url || ''} alt={workspace.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                        <Building2 className="h-6 w-6" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                            {workspace.name}
                        </CardTitle>
                        {isActive && (
                            <Badge variant="default" className="text-[10px] h-4 bg-primary px-1">Active</Badge>
                        )}
                    </div>
                    <CardDescription className="truncate text-xs">
                        {workspace.slug}
                    </CardDescription>
                </div>
                <Badge variant="outline" className="capitalize text-[10px] h-5">
                    {role}
                </Badge>
            </CardHeader>
            <CardContent className="pt-4">
                {workspace.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                        {workspace.description}
                    </p>
                )}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-xs">{memberCount} / {workspace.max_members}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm justify-end">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-xs">{workspace.credits_balance} cr</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="pt-2 border-t bg-muted/30 flex justify-between gap-2 rounded-b-lg">
                <div className="text-[10px] text-muted-foreground">
                    Created {formatDistanceToNow(new Date(workspace.created_at))} ago
                </div>
                <div className="flex gap-2">
                    {(isOwner || isAdmin) && (
                        <Link href={`/workspace/${workspace.slug}/settings`}>
                            <Button variant="ghost" size="sm" className="h-8 text-xs">
                                Settings
                            </Button>
                        </Link>
                    )}
                    {isActive ? (
                        <Link href={`/workspace/${workspace.slug}`}>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                Dashboard <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => onSwitch?.(workspace.id)}
                        >
                            Switch To
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
