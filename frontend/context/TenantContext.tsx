'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export interface TenantConfig {
    id: string;
    slug: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        card: string;
        border: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    logoUrl: string | null;
    faviconUrl: string | null;
    features: Record<string, boolean>;
    custom_domain: string | null;
}

interface TenantContextType {
    tenant: TenantConfig | null;
    isTenantMode: boolean;
    tenantName: string;
    tenantLogo: string | null;
    primaryColor: string;
    isFeatureEnabled: (feature: string) => boolean;
    isAdmin: boolean;
    userRole: string | null;
    isLoading: boolean;
    refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({
    children,
    tenant
}: {
    children: ReactNode;
    tenant: TenantConfig | null;
}) {
    const supabase = createClient();
    const router = useRouter();
    const [userRole, setUserRole] = React.useState<string | null>(null);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const isTenantMode = !!tenant;
    const tenantName = tenant?.name || 'Recuvix';
    const tenantLogo = tenant?.logoUrl || null;
    const primaryColor = tenant?.colors.primary || '#e8ff47';

    React.useEffect(() => {
        if (tenant) {
            fetchUserRole();
        }
    }, [tenant?.id]);

    const fetchUserRole = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !tenant) return;

        const { data, error } = await (supabase
            .from('wl_tenant_users')
            .select('role')
            .eq('tenant_id', tenant.id)
            .eq('user_id', user.id)
            .single() as any);

        if (data && !error) {
            setUserRole(data.role);
            setIsAdmin(['owner', 'admin'].includes(data.role));
        }
        setIsLoading(false);
    };

    const isFeatureEnabled = (feature: string) => {
        if (!tenant) return true; // Platform has all features
        return tenant.features[feature] !== false;
    };

    const refreshTenant = async () => {
        router.refresh();
        // Give it a moment to refresh headers and re-render
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const value = {
        tenant,
        isTenantMode,
        tenantName,
        tenantLogo,
        primaryColor,
        isFeatureEnabled,
        isAdmin,
        userRole,
        isLoading,
        refreshTenant
    };

    return (
        <TenantContext.Provider value={value}>
            {children}
        </TenantContext.Provider>
    );
}

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
};
