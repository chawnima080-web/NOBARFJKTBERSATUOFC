import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

/* Tiny crescent for logo accent */
const MiniCrescent = () => (
    <svg width="18" height="18" viewBox="0 0 100 100" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>
        <path
            d="M60 15 A35 35 0 1 0 60 85 A22 22 0 1 1 60 15 Z"
            fill="#d4a843"
            style={{ filter: 'drop-shadow(0 0 4px #d4a843)' }}
        />
    </svg>
);

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Event Details', path: '/details' },
        { name: 'Members', path: '/members' },
        { name: 'Streaming', path: '/streaming' },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 border-b`}
            style={
                isScrolled
                    ? {
                        backgroundColor: 'rgba(5,13,26,0.95)',
                        borderColor: 'rgba(212,168,67,0.35)',
                        boxShadow: '0 4px 30px rgba(212,168,67,0.08)',
                        backdropFilter: 'blur(16px)',
                    }
                    : {
                        backgroundColor: 'transparent',
                        borderColor: 'rgba(212,168,67,0.15)',
                    }
            }
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-1">
                        <span
                            className="font-display font-bold text-2xl tracking-tight"
                            style={{
                                background: 'linear-gradient(to right, #f9e6a0, #d4a843)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                textShadow: 'none',
                                filter: 'drop-shadow(0 0 8px rgba(212,168,67,0.4))',
                            }}
                        >
                            NOBAR
                        </span>
                        <span style={{ color: '#d4a843', fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: '1.5rem' }}>.</span>
                        <span
                            className="font-display font-bold text-2xl tracking-tight"
                            style={{
                                background: 'linear-gradient(to right, #d4a843, #f0c060)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            JKT48
                        </span>
                        <MiniCrescent />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="relative group px-3 py-2 text-sm font-medium transition-colors duration-200"
                                    style={{ color: '#d4c4a0', fontFamily: 'Lato, sans-serif', letterSpacing: '0.05em' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#f0c060'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#d4c4a0'}
                                >
                                    {link.name}
                                    <span
                                        className="absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                                        style={{ background: 'linear-gradient(to right, #d4a843, #f0c060)' }}
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="focus:outline-none"
                            style={{ color: '#d4a843' }}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b"
                        style={{
                            backgroundColor: 'rgba(5,13,26,0.97)',
                            borderColor: 'rgba(212,168,67,0.2)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block px-4 py-3 text-base font-medium transition-colors border-l-2"
                                    style={{ color: '#d4c4a0', borderColor: 'transparent', fontFamily: 'Lato, sans-serif' }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#f0c060'; e.currentTarget.style.borderColor = '#d4a843'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#d4c4a0'; e.currentTarget.style.borderColor = 'transparent'; }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
