import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

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
            className={`fixed w-full z-50 transition-all duration-300 border-b ${isScrolled
                ? 'backdrop-blur-lg'
                : 'bg-transparent'
                }`}
            style={
                isScrolled
                    ? { backgroundColor: 'rgba(253,246,238,0.92)', borderColor: '#8b5e3c55' }
                    : { borderColor: '#8b5e3c30' }
            }
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <span className="font-display font-bold text-2xl tracking-tight transition-colors duration-300" style={{ color: '#3b2a1a' }}>
                            NOBAR<span style={{ color: '#c9956a' }}>.</span>JKT48
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="relative group px-3 py-2 text-sm font-medium transition-colors"
                                    style={{ color: '#7a5c3e' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#3b2a1a'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#7a5c3e'}
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full box-border" style={{ backgroundColor: '#8b5e3c' }} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="focus:outline-none"
                            style={{ color: '#7a5c3e' }}
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
                        className="md:hidden backdrop-blur-xl border-b"
                        style={{ backgroundColor: 'rgba(253,246,238,0.97)', borderColor: '#c9956a30' }}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="block px-3 py-2 rounded-md text-base font-medium transition-colors"
                                    style={{ color: '#7a5c3e' }}
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
