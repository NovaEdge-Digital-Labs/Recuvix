'use client';

import { toast } from 'sonner';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-react';

/**
 * Typed helper functions for consistent toast notifications.
 * Wraps Sonner toast with Recuvix-styled icons and defaults.
 */

export const toastSuccess = (message: string, description?: string) => {
    return toast.success(message, {
        description,
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    });
};

export const toastError = (message: string, description?: string) => {
    return toast.error(message, {
        description,
        icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    });
};

export const toastInfo = (message: string, description?: string) => {
    return toast.info(message, {
        description,
        icon: <Info className="h-5 w-5 text-blue-500" />,
    });
};

export const toastWarning = (message: string, description?: string) => {
    return toast.warning(message, {
        description,
        icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    });
};

export const toastLoading = (message: string, description?: string) => {
    return toast.loading(message, {
        description,
        icon: <Loader2 className="h-5 w-5 animate-spin text-[#e8ff47]" />,
    });
};

export const dismissToast = (id?: string | number) => {
    return toast.dismiss(id);
};

// ToastProvider is just a dummy wrapper if we want to add context later,
// but for now, layout.tsx already has <Toaster />.
export function ToastProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
