'use client'
import { useEffect, useState } from 'react'

export function useLegalTOC(sectionIds: string[]) {
    const [activeId, setActiveId] = useState(
        sectionIds[0])

    useEffect(() => {
        const observers: IntersectionObserver[] = []

        sectionIds.forEach(id => {
            const el = document.getElementById(id)
            if (!el) return

            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveId(id)
                    }
                },
                { rootMargin: '-20% 0px -70% 0px' }
            )
            obs.observe(el)
            observers.push(obs)
        })

        return () => observers.forEach(o => o.disconnect())
    }, [sectionIds])

    return activeId
}
