import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CursorAnimation = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);

        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    if (isTouch) return null;

    return (
        <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-50 hidden md:block">
            {/* Main cursor ring - brown */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full blur-sm"
                style={{ border: '1px solid #8b5e3c', backgroundColor: 'rgba(139,94,60,0.15)' }}
                animate={{
                    x: mousePosition.x - 16,
                    y: mousePosition.y - 16,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5
                }}
            />
            {/* Dot - brown */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 rounded-full"
                style={{ backgroundColor: '#8b5e3c', boxShadow: '0 0 6px #c9956a' }}
                animate={{
                    x: mousePosition.x - 4,
                    y: mousePosition.y - 4,
                }}
                transition={{
                    type: "spring",
                    stiffness: 1500,
                    damping: 15,
                    mass: 0.1
                }}
            />
            {/* Soft warm glow */}
            <motion.div
                className="fixed top-0 left-0 w-32 h-32 rounded-full blur-xl"
                style={{ backgroundColor: 'rgba(201,149,106,0.07)' }}
                animate={{
                    x: mousePosition.x - 64,
                    y: mousePosition.y - 64,
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    mass: 1
                }}
            />
        </div>
    );
};

export default CursorAnimation;
