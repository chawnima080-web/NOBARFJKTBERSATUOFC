import { useEffect, useRef } from 'react';

/**
 * CursorAnimation — zero-React-rerender custom cursor.
 *
 * PERFORMANCE NOTES:
 *  • Uses useRef + direct DOM style mutation instead of useState + motion.div
 *  • mousemove only stores raw coords — no setState, no re-render
 *  • requestAnimationFrame lerps the ring & glow for the spring feel
 *  • Inner dot follows mouse directly with no delay (transforms via rAF)
 *  • No Framer Motion dependency = no JS animation overhead on every move
 */

const lerp = (a, b, t) => a + (b - a) * t;

const CursorAnimation = () => {
    const ringRef = useRef(null);
    const dotRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouch) return;

        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        // Lerp positions for ring and glow (spring-like)
        let rx = mx, ry = my;   // ring
        let gx = mx, gy = my;   // glow
        let rafId;

        const onMove = (e) => {
            mx = e.clientX;
            my = e.clientY;
        };

        window.addEventListener('mousemove', onMove, { passive: true });

        const tick = () => {
            // Ring: medium lag
            rx = lerp(rx, mx, 0.18);
            ry = lerp(ry, my, 0.18);
            // Glow: slow lag
            gx = lerp(gx, mx, 0.07);
            gy = lerp(gy, my, 0.07);

            if (dotRef.current) {
                dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
            }
            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
            }
            if (glowRef.current) {
                glowRef.current.style.transform = `translate(${gx - 64}px, ${gy - 64}px)`;
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
            {/* Soft glow (slowest) */}
            <div
                ref={glowRef}
                style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: 128, height: 128,
                    borderRadius: '50%',
                    background: 'rgba(212,168,67,0.06)',
                    filter: 'blur(24px)',
                    willChange: 'transform',
                    pointerEvents: 'none',
                }}
            />
            {/* Ring (medium lag) */}
            <div
                ref={ringRef}
                style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: 32, height: 32,
                    borderRadius: '50%',
                    border: '1px solid rgba(212,168,67,0.6)',
                    background: 'rgba(212,168,67,0.06)',
                    willChange: 'transform',
                    pointerEvents: 'none',
                }}
            />
            {/* Dot (instant, follows exactly) */}
            <div
                ref={dotRef}
                style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: '#d4a843',
                    boxShadow: '0 0 6px #f0c060',
                    willChange: 'transform',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};

export default CursorAnimation;
