import React from 'react';
import { motion } from 'framer-motion';

/* ─── SVGs ───────────────────────────────────────────── */
const CrescentMoon = ({ size = 80, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
        <defs>
            <radialGradient id="moonGrad" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#f9e6a0" />
                <stop offset="60%" stopColor="#d4a843" />
                <stop offset="100%" stopColor="#a07820" />
            </radialGradient>
        </defs>
        <path d="M60 15 A35 35 0 1 0 60 85 A22 22 0 1 1 60 15 Z" fill="url(#moonGrad)" />
    </svg>
);

const Star = ({ size = 14, opacity = 0.8 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path
            d="M10 0 L12.35 7.27 L20 7.27 L13.82 11.77 L16.18 19.04 L10 14.54 L3.82 19.04 L6.18 11.77 L0 7.27 L7.65 7.27 Z"
            fill="#d4a843"
            opacity={opacity}
        />
    </svg>
);

const IslamicStar = ({ size = 24, opacity = 0.5 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <polygon
            points="20,2 23.5,13 34,8.5 26.5,17 38,20 26.5,23 34,31.5 23.5,27 20,38 16.5,27 6,31.5 13.5,23 2,20 13.5,17 6,8.5 16.5,13"
            fill="#d4a843"
            opacity={opacity}
        />
    </svg>
);

const Lantern = ({ height = 90, className = '' }) => (
    <svg height={height} width={height * 0.6} viewBox="0 0 60 100" fill="none" className={className}>
        <defs>
            <radialGradient id="lanternGlowInner" cx="50%" cy="55%" r="45%">
                <stop offset="0%" stopColor="#f9e6a0" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#d4a843" stopOpacity="0.3" />
            </radialGradient>
        </defs>
        <line x1="30" y1="0" x2="30" y2="12" stroke="#d4a843" strokeWidth="2" />
        <rect x="18" y="10" width="24" height="6" rx="3" fill="#d4a843" />
        <ellipse cx="30" cy="55" rx="20" ry="33" fill="url(#lanternGlowInner)" />
        <ellipse cx="30" cy="55" rx="20" ry="33" stroke="#d4a843" strokeWidth="1.5" />
        {[15, 22, 30, 38, 45].map(x => (
            <line key={x} x1={x} y1="22" x2={x} y2="88" stroke="#d4a84360" strokeWidth="1" />
        ))}
        <line x1="10" y1="55" x2="50" y2="55" stroke="#d4a843" strokeWidth="1" />
        <rect x="18" y="84" width="24" height="6" rx="3" fill="#d4a843" />
        <line x1="25" y1="90" x2="22" y2="100" stroke="#d4a843" strokeWidth="1.5" />
        <line x1="30" y1="90" x2="30" y2="100" stroke="#d4a843" strokeWidth="1.5" />
        <line x1="35" y1="90" x2="38" y2="100" stroke="#d4a843" strokeWidth="1.5" />
    </svg>
);

/* ─── Arabesque Divider (static — no animation) ─── */
export const ArabesqueDivider = ({ className = '' }) => (
    <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #d4a843aa)' }} />
        <div className="flex items-center gap-2">
            <IslamicStar size={10} opacity={0.7} />
            <span className="text-lg" style={{ color: '#d4a843' }}>✦</span>
            <CrescentMoon size={22} />
            <span className="text-lg" style={{ color: '#d4a843' }}>✦</span>
            <IslamicStar size={10} opacity={0.7} />
        </div>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #d4a843aa)' }} />
    </div>
);

const CornerArabesque = ({ position = 'tl', size = 80 }) => {
    const rotations = { tl: '0deg', tr: '90deg', br: '180deg', bl: '270deg' };
    return (
        <svg width={size} height={size} viewBox="0 0 80 80" style={{ transform: `rotate(${rotations[position]})`, opacity: 0.3 }}>
            <defs>
                <linearGradient id={`cgr-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4a843" />
                    <stop offset="100%" stopColor="#f0c060" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d="M0,0 Q40,0 40,40 Q40,20 20,20 Q0,20 0,0 Z" fill={`url(#cgr-${position})`} />
            <path d="M5,0 Q35,5 30,30" stroke="#d4a843" strokeWidth="0.8" fill="none" />
            <circle cx="4" cy="4" r="2" fill="#d4a843" />
        </svg>
    );
};

/* ─── Scattered stars: pure CSS animation, no motion ── */
const STARS = [
    { x: '5%', y: '8%', size: 10, dur: '3.2s', delay: '0s' },
    { x: '15%', y: '3%', size: 8, dur: '2.8s', delay: '0.5s' },
    { x: '28%', y: '12%', size: 14, dur: '3.5s', delay: '1.2s' },
    { x: '42%', y: '5%', size: 9, dur: '4.0s', delay: '0.3s' },
    { x: '58%', y: '9%', size: 11, dur: '3.1s', delay: '1.8s' },
    { x: '72%', y: '4%', size: 7, dur: '2.5s', delay: '0.9s' },
    { x: '85%', y: '14%', size: 12, dur: '3.8s', delay: '0.6s' },
    { x: '93%', y: '6%', size: 8, dur: '3.3s', delay: '2.1s' },
    { x: '8%', y: '22%', size: 6, dur: '4.2s', delay: '1.5s' },
    { x: '78%', y: '20%', size: 10, dur: '3.0s', delay: '0.4s' },
    { x: '3%', y: '50%', size: 8, dur: '3.6s', delay: '0.7s' },
    { x: '96%', y: '55%', size: 9, dur: '2.9s', delay: '1.1s' },
];

/* ─── Main Component ─────────────────────────────────── */
const RamadanOrnaments = () => (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">

        {/* CSS-animated stars — no React re-renders */}
        {STARS.map((s, i) => (
            <div
                key={i}
                style={{
                    position: 'absolute',
                    left: s.x,
                    top: s.y,
                    animation: `starTwinkle ${s.dur} ${s.delay} infinite ease-in-out`,
                }}
            >
                <Star size={s.size} />
            </div>
        ))}

        {/* Crescent Moon — only 1 motion element */}
        <motion.div
            className="absolute top-16 right-8 md:right-20"
            style={{ willChange: 'transform' }}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
            <CrescentMoon size={100} />
        </motion.div>

        {/* ── Lanterns — 6 total, graduated left→right small→large ── */}

        {/* Far left — BESAR (baru) */}
        <motion.div
            className="absolute top-0 origin-top"
            style={{ left: '0%', willChange: 'transform', opacity: 0.92 }}
            animate={{ rotate: [-6, 6, -6] }}
            transition={{ duration: 5.3, repeat: Infinity, ease: 'easeInOut', delay: 0.0 }}
        >
            <Lantern height={130} />
        </motion.div>

        {/* Left — paling kecil */}
        <motion.div
            className="absolute top-0 origin-top hidden md:block"
            style={{ left: '8%', willChange: 'transform', opacity: 0.75 }}
            animate={{ rotate: [-4, 4, -4] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        >
            <Lantern height={58} />
        </motion.div>

        {/* Left — kecil */}
        <motion.div
            className="absolute top-0 origin-top"
            style={{ left: '10%', willChange: 'transform', opacity: 0.85 }}
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 5.0, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
            <Lantern height={75} />
        </motion.div>

        {/* Center-left — sedang */}
        <motion.div
            className="absolute top-0 origin-top hidden md:block"
            style={{ left: '32%', willChange: 'transform', opacity: 0.7 }}
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
        >
            <Lantern height={88} />
        </motion.div>

        {/* Right — besar */}
        <motion.div
            className="absolute top-0 origin-top"
            style={{ right: '14%', willChange: 'transform', opacity: 0.9 }}
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
            <Lantern height={118} />
        </motion.div>

        {/* Far right — paling besar */}
        <motion.div
            className="absolute top-0 origin-top"
            style={{ right: '2%', willChange: 'transform', opacity: 0.95 }}
            animate={{ rotate: [4, -4, 4] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}
        >
            <Lantern height={145} />
        </motion.div>

        {/* Corner Arabesques — static */}
        <div className="absolute top-16 left-0">
            <CornerArabesque position="tl" size={90} />
        </div>
        <div className="absolute top-16 right-0">
            <CornerArabesque position="tr" size={90} />
        </div>

        {/* Soft center glow — static */}
        <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 70%)' }}
        />
    </div>
);

export { CrescentMoon, Star, IslamicStar, Lantern };
export default RamadanOrnaments;
