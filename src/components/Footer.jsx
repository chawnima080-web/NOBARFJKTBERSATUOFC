import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';

const ArabesqueDivider = () => (
    <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.5))' }} />
        <span style={{ color: '#d4a843', fontSize: 14 }}>✦</span>
        <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
            <path d="M60 15 A35 35 0 1 0 60 85 A22 22 0 1 1 60 15 Z" fill="#d4a843" opacity="0.8" />
        </svg>
        <span style={{ color: '#d4a843', fontSize: 14 }}>✦</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.5))' }} />
    </div>
);

const Footer = () => {
    return (
        <footer
            className="border-t py-14 relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #0a1628 0%, #050d1a 100%)',
                borderColor: 'rgba(212,168,67,0.2)',
            }}
        >
            {/* Gold gradient top line */}
            <div
                className="absolute top-0 left-0 w-full h-px"
                style={{ background: 'linear-gradient(to right, transparent, #d4a843, #f0c060, #d4a843, transparent)' }}
            />

            {/* Subtle background ornament stars */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {[
                    { top: '15%', left: '5%' }, { top: '40%', right: '4%' },
                    { top: '70%', left: '12%' }, { bottom: '15%', right: '8%' },
                ].map((pos, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 20 20" fill="#d4a843" style={{ position: 'absolute', opacity: 0.18, ...pos }}>
                        <path d="M10 0 L12.35 7.27 L20 7.27 L13.82 11.77 L16.18 19.04 L10 14.54 L3.82 19.04 L6.18 11.77 L0 7.27 L7.65 7.27 Z" />
                    </svg>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand column */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="font-display font-bold text-2xl tracking-tight mb-3 block">
                            <span
                                style={{
                                    background: 'linear-gradient(to right, #f9e6a0, #d4a843)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                NOBAR<span style={{ color: '#d4a843' }}>.</span>JKT48
                            </span>
                        </Link>

                        {/* Ramadan tagline */}
                        <p
                            className="text-sm mb-3 font-sans tracking-widest uppercase"
                            style={{ color: '#d4a84388', letterSpacing: '0.2em' }}
                        >
                            ✦ Ramadan Mubarak ✦
                        </p>

                        <p className="text-sm font-light leading-relaxed max-w-xs" style={{ color: '#d4c4a080' }}>
                            Experience the future of live streaming. Nonton bareng ribuan fans di seluruh Indonesia.
                        </p>

                        <ArabesqueDivider />
                    </div>

                    {/* Links */}
                    <div>
                        <h3
                            className="font-display font-semibold uppercase tracking-wider mb-4 text-sm"
                            style={{ color: '#f0c060' }}
                        >
                            Links
                        </h3>
                        <ul className="space-y-3 text-sm font-sans" style={{ color: '#d4c4a070' }}>
                            <li>
                                <Link
                                    to="/details"
                                    className="hover:opacity-100 transition-all duration-200"
                                    style={{ color: '#d4c4a070' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#d4a843'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#d4c4a070'}
                                >
                                    Event Details
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/members"
                                    className="hover:opacity-100 transition-all duration-200"
                                    style={{ color: '#d4c4a070' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#d4a843'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#d4c4a070'}
                                >
                                    Member Profiles
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3
                            className="font-display font-semibold uppercase tracking-wider mb-4 text-sm"
                            style={{ color: '#f0c060' }}
                        >
                            Follow Us
                        </h3>
                        <div className="flex space-x-4" style={{ color: '#d4a843' }}>
                            <a
                                href="#"
                                className="transition-all duration-200 hover:scale-110"
                                style={{ color: '#d4a84399' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#d4a843'}
                                onMouseLeave={e => e.currentTarget.style.color = '#d4a84399'}
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="#"
                                className="transition-all duration-200 hover:scale-110"
                                style={{ color: '#d4a84399' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#d4a843'}
                                onMouseLeave={e => e.currentTarget.style.color = '#d4a84399'}
                            >
                                <Twitter size={20} />
                            </a>
                            <a
                                href="#"
                                className="transition-all duration-200 hover:scale-110"
                                style={{ color: '#d4a84399' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#d4a843'}
                                onMouseLeave={e => e.currentTarget.style.color = '#d4a84399'}
                            >
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center text-xs font-sans"
                    style={{ borderColor: 'rgba(212,168,67,0.12)', color: '#d4a84355' }}
                >
                    <p>© 2026 Nobar JKT48. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/privacy" className="hover:opacity-70 transition-opacity">Privacy Policy</Link>
                        <Link to="/terms" className="hover:opacity-70 transition-opacity">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
