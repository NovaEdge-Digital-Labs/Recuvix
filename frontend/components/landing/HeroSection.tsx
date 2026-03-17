'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const Universe3D = dynamic(
    () => import('./Universe3D'),
    { ssr: false }
)

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3
        }
    }
}

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8
        }
    }
}

export function HeroSection() {
    return (
        <section className="hero-section">
            <Universe3D />

            {/* Gradient orbs */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />

            {/* Content */}
            <motion.div
                className="hero-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="hero-headline" variants={itemVariants}>
                    <div className="hero-line">
                        WRITE ONCE.
                    </div>
                    <div className="hero-line">
                        <span className="text-accent">RANK</span>
                        {' '}EVERYWHERE.
                    </div>
                </motion.div>

                <motion.p className="hero-serif" variants={itemVariants}>
                    AI blog generation that actually ranks.
                </motion.p>

                <motion.p className="hero-body" variants={itemVariants}>
                    Generate fully humanized, SEO-optimized blogs
                    from a single topic. Images, thumbnails, meta
                    tags — all included. In 12 languages.
                </motion.p>

                <motion.div className="hero-cta-row" variants={itemVariants}>
                    <button className="btn-primary magnetic">
                        Generate Your First Blog →
                    </button>
                    <button className="btn-secondary">
                        Watch Demo ▶
                    </button>
                </motion.div>

                <motion.div className="hero-social-proof" variants={itemVariants}>
                    <div className="avatars">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`avatar av-${i}`} />
                        ))}
                    </div>
                    <div className="proof-text">
                        <div className="stars">★★★★★ 4.9</div>
                        <div className="proof-label">
                            TRUSTED BY 2,400+ BLOGGERS AND AGENCIES
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Floating badge */}
            <motion.div
                className="hero-badge"
                initial={{ opacity: 0, x: 50, rotate: 5 }}
                animate={{ opacity: 1, x: 0, rotate: -3 }}
                transition={{ delay: 1.2, duration: 0.8 }}
            >
                <span>✓ No monthly fees</span>
                <span>1 credit = 1 blog</span>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="scroll-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 2, duration: 1 }}
            >
                <span>SCROLL TO EXPLORE</span>
                <div className="scroll-line" />
            </motion.div>

        </section>
    );
}
