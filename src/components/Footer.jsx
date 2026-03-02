import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="border-t py-12 relative overflow-hidden" style={{ backgroundColor: '#f0e6d3', borderColor: '#c9956a30' }}>
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(to right, #c9956a, #8b5e3c, #c9956a)', opacity: 0.6 }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="font-display font-bold text-2xl tracking-tight mb-4 block" style={{ color: '#3b2a1a' }}>
                            NOBAR<span style={{ color: '#c9956a' }}>.</span>JKT48
                        </Link>
                        <p className="text-sm max-w-sm font-light" style={{ color: '#7a5c3e' }}>
                            Experience the future of live streaming. Join the community and watch alongside thousands of fans worldwide.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold uppercase tracking-wider mb-4 text-sm" style={{ color: '#3b2a1a' }}>Links</h3>
                        <ul className="space-y-2 text-sm" style={{ color: '#7a5c3e' }}>
                            <li><Link to="/details" className="hover:underline transition-colors" style={{ color: '#7a5c3e' }}>Event Details</Link></li>
                            <li><Link to="/members" className="hover:underline transition-colors" style={{ color: '#7a5c3e' }}>Member Profiles</Link></li>
                            <li><Link to="/faq" className="hover:underline transition-colors" style={{ color: '#7a5c3e' }}>FAQ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold uppercase tracking-wider mb-4 text-sm" style={{ color: '#3b2a1a' }}>Follow Us</h3>
                        <div className="flex space-x-4" style={{ color: '#a0785a' }}>
                            <a href="#" className="transition-colors hover:opacity-70"><Instagram size={20} /></a>
                            <a href="#" className="transition-colors hover:opacity-70"><Twitter size={20} /></a>
                            <a href="#" className="transition-colors hover:opacity-70"><Youtube size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center text-xs" style={{ borderColor: '#c9956a30', color: '#a0785a' }}>
                    <p>&copy; 2026 Nobar JKT48. All rights reserved.</p>
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
