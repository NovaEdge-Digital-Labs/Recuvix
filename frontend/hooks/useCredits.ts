"use client";
import { useState, useEffect, useCallback } from 'react'
import useSWR from 'swr'
import { useAuth } from '@/context/AuthContext'
import { useRazorpay } from './useRazorpay'
import { CreditPack, creditPacks } from '@/lib/config/creditPacks'
import { toast } from 'sonner'

export const useCredits = () => {
    const { user } = useAuth()
    const { openCheckout } = useRazorpay()

    const fetcher = (url: string) => fetch(url).then(r => r.json());
    const { data, error, mutate } = useSWR(user ? '/api/credits/balance' : null, fetcher, {
        revalidateOnFocus: true,
        dedupingInterval: 5000,
    });

    const [balance, setBalance] = useState<number | null>(null);
    const [stats, setStats] = useState<{ total_purchased: number; total_used: number } | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isManagedMode, setIsManagedMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (data) {
            setBalance(data.balance);
            setStats({
                total_purchased: data.total_purchased,
                total_used: data.total_used,
            });
            setTransactions(data.recent_transactions || []);
            setIsManagedMode(data.managed_mode_enabled);
            setIsLoading(false);
        } else if (error) {
            console.error('Failed to fetch credit balance:', error);
            setIsLoading(false);
        }
    }, [data, error]);

    const fetchBalance = useCallback(() => {
        mutate();
    }, [mutate]);

    const buyPack = async (packId: string) => {
        if (!user) {
            toast.error('Please login to purchase credits')
            return
        }

        try {
            const pack = creditPacks.find(p => p.id === packId)
            if (!pack) throw new Error('Invalid pack')

            // 1. Create Order
            const orderRes = await fetch('/api/credits/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packId })
            })
            const orderData = await orderRes.json()

            if (orderData.error) throw new Error(orderData.error)

            // 2. Open Razorpay
            await openCheckout({
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Recuvix Credits',
                description: `Purchase ${pack.name} Pack (${pack.credits} credits)`,
                order_id: orderData.id,
                prefill: {
                    name: user.email?.split('@')[0],
                    email: user.email || '',
                },
                theme: {
                    color: '#3b82f6', // brand blue
                },
                handler: async (response: any) => {
                    // 3. Verify Payment
                    try {
                        toast.loading('Verifying payment...', { id: 'payment-verify' })
                        const verifyRes = await fetch('/api/credits/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                            })
                        })
                        const verifyData = await verifyRes.json()

                        if (verifyData.success) {
                            toast.success('Credits added successfully!', { id: 'payment-verify' })
                            fetchBalance() // Refresh balance
                        } else {
                            throw new Error(verifyData.error || 'Verification failed')
                        }
                    } catch (err: any) {
                        toast.error(err.message || 'Payment verification failed', { id: 'payment-verify' })
                    }
                }
            })
        } catch (error: any) {
            toast.error(error.message || 'Failed to initiate purchase')
        }
    }

    return {
        balance,
        stats,
        transactions,
        isManagedMode,
        isLoading,
        fetchBalance,
        buyPack
    }
}

export default useCredits;
