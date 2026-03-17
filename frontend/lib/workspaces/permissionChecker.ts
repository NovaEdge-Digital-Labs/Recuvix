export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer';

export type Permission =
    | 'generate_blog'
    | 'view_blogs'
    | 'edit_any_blog'
    | 'delete_any_blog'
    | 'invite_members'
    | 'remove_members'
    | 'change_roles'
    | 'approve_blogs'
    | 'buy_credits'
    | 'view_credits'
    | 'manage_assets'
    | 'manage_wp'
    | 'manage_gsc'
    | 'manage_settings'
    | 'delete_workspace'
    | 'transfer_ownership';

export const PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
    owner: [
        'generate_blog',
        'view_blogs',
        'edit_any_blog',
        'delete_any_blog',
        'invite_members',
        'remove_members',
        'change_roles',
        'approve_blogs',
        'buy_credits',
        'view_credits',
        'manage_assets',
        'manage_wp',
        'manage_gsc',
        'manage_settings',
        'delete_workspace',
        'transfer_ownership',
    ],
    admin: [
        'generate_blog',
        'view_blogs',
        'edit_any_blog',
        'invite_members',
        'remove_members',
        'change_roles',
        'view_credits',
        'manage_assets',
        'manage_wp',
        'manage_gsc',
    ],
    member: [
        'generate_blog',
        'view_blogs',
    ],
    viewer: [
        'view_blogs',
    ],
};

export function checkPermission(role: WorkspaceRole | null, permission: Permission): boolean {
    if (!role) return false;
    return PERMISSIONS[role]?.includes(permission) ?? false;
}

export function roleRank(role: WorkspaceRole): number {
    const ranks: Record<WorkspaceRole, number> = {
        owner: 4,
        admin: 3,
        member: 2,
        viewer: 1,
    };
    return ranks[role] || 0;
}

export function canManageRole(requesterRole: WorkspaceRole, targetRole: WorkspaceRole): boolean {
    if (requesterRole === 'owner') return true;
    if (requesterRole === 'admin') {
        // Admin can manage members and viewers, but not other admins or owner
        return roleRank(targetRole) < 3;
    }
    return false;
}
