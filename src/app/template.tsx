'use client';

import { motion } from 'framer-motion';

/**
 * Antigravity transition principle:
 * Elements don't appear — they arrive, carrying velocity from their prior state.
 * Exit: the element escapes orbit (launches upward, gaining speed as it leaves).
 * Enter: the element decelerates into position, as if catching a gravity well.
 * Spring physics preserve momentum continuity between states.
 */
export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(12px)' }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)',
                transition: {
                    duration: 0.75,
                    ease: [0.16, 1, 0.3, 1], // fast-out-slow-in: element decelerates into orbit
                    opacity: { duration: 0.5 },
                    filter: { duration: 0.5 },
                },
            }}
            exit={{
                opacity: 0,
                y: -50,
                scale: 1.02,
                filter: 'blur(16px)',
                transition: {
                    duration: 0.4,
                    ease: [0.4, 0, 1, 1], // slow-out-fast-in: element escapes orbit, gains speed
                },
            }}
        >
            {children}
        </motion.div>
    );
}
