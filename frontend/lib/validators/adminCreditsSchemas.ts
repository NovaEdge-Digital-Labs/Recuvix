import { z } from 'zod';

export const grantSingleSchema = z.object({
    userId: z.string().uuid(),
    credits: z.number().min(1).max(10000),
    reason: z.string().min(5),
    note: z.string().optional(),
    ruleId: z.string().uuid().optional(),
    expiresInDays: z.number().nullable().optional(),
});

export const grantBulkSchema = z.object({
    userIds: z.array(z.string().uuid()).optional(),
    // Filters
    filterCountry: z.string().optional(),
    filterMinBlogs: z.number().optional(),
    filterMaxBlogs: z.number().optional(),
    filterNoPurchase: z.boolean().optional(),
    filterJoinedAfter: z.string().optional(),
    filterTenantId: z.string().uuid().optional(),
    filterLabel: z.string().optional(),
    // Grant details
    credits: z.number().min(1).max(10000),
    reason: z.string().min(5),
    note: z.string().optional(),
    ruleId: z.string().uuid().optional(),
    expiresInDays: z.number().nullable().optional(),
    skipIfAlreadyGranted: z.boolean().optional().default(true),
    dryRun: z.boolean().optional().default(false),
});

export const revokeGrantSchema = z.object({
    grantId: z.string().uuid(),
    reason: z.string().min(5),
});

export const updateUserAdminSchema = z.object({
    adminNote: z.string().optional(),
    userLabel: z.enum(['vip', 'agency', 'flagged', 'influencer', 'none']).nullable().optional(),
    isSuspended: z.boolean().optional(),
    suspendedReason: z.string().optional(),
});

export const creditRuleSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    rule_type: z.enum([
        'signup_bonus',
        'manual_all',
        'manual_segment',
        'manual_specific',
        'referral_bonus',
        'milestone_bonus'
    ]),
    credits_amount: z.number().positive(),
    condition_country: z.string().nullable().optional(),
    condition_min_blogs: z.number().nullable().optional(),
    condition_max_blogs: z.number().nullable().optional(),
    condition_has_byok: z.boolean().nullable().optional(),
    condition_joined_after: z.string().nullable().optional(),
    condition_joined_before: z.string().nullable().optional(),
    condition_no_previous_purchase: z.boolean().nullable().optional(),
    condition_tenant_id: z.string().uuid().nullable().optional(),
    max_grants_per_user: z.number().int().min(1).default(1),
    total_budget_credits: z.number().int().positive().nullable().optional(),
    credits_expire_days: z.number().int().positive().nullable().optional(),
    is_active: z.boolean().default(true),
    auto_apply: z.boolean().default(false),
});
