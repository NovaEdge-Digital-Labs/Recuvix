"use client";

import { useState, useEffect, useCallback } from "react";

interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description?: string
    image?: string
    order_id: string
    handler: (response: any) => void
    prefill?: {
        name?: string
        email?: string
        contact?: string
    }
    notes?: Record<string, string>
    theme?: {
        color?: string
    }
}

export function useRazorpay() {
    const [isLoading, setIsLoading] = useState(false)

    const loadScript = useCallback(() => {
        return new Promise((resolve) => {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.async = true
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)
            document.body.appendChild(script)
        })
    }, [])

    const openCheckout = useCallback(async (options: RazorpayOptions) => {
        setIsLoading(true)
        const isLoaded = await loadScript()

        if (!isLoaded) {
            alert('Razorpay SDK failed to load. Are you online?')
            setIsLoading(false)
            return
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.on('payment.failed', function (response: any) {
            console.error('Payment failed:', response.error)
            // We don't alert here, the parent can handle failure if needed
        })
        rzp.open()
        setIsLoading(false)
    }, [loadScript])

    return { openCheckout, isLoading }
}
