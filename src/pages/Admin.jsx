import React, { useState, useEffect } from 'react';
import { Settings, Users, Ticket, Save, Plus, Trash2, Layout, RefreshCw, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { members } from '../data/members';
import GoldenParticles from '../components/GoldenParticles';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        title: 'NOBAR JKT48',
        subtitle: 'LIVE STREAMING EXPERIENCE',
        date: '2026-02-28T19:00:00',
        streamUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
        priceLabel: 'TIKET NOBAR',
        priceAmount: '',
        priceNote: 'per orang',
    });
    const [selectedLineup, setSelectedLineup] = useState([1, 5, 20]);
    const [tickets, setTickets] = useState(['TRIAL-JKT48']);
    const [publicTickets, setPublicTickets] = useState([]);
    const [newTicket, setNewTicket] = useState('');
    const [newPublicTicket, setNewPublicTicket] = useState('');
    const [saveStatus, setSaveStatus] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connectedRef = ref(db, '.info/connected');
        const connectedUnsubscribe = onValue(connectedRef, (snap) => {
            setIsConnected(snap.val() === true);
        });

        const loadingTimeout = setTimeout(() => setLoading(false), 5000);

        const settingsRef = ref(db, 'settings');
        const unsubSettings = onValue(settingsRef, (snap) => {
            const data = snap.val();
            if (data) setSettings(prev => ({ ...prev, ...data }));
            setLoading(false);
        });

        const lineupRef = ref(db, 'lineup');
        const unsubLineup = onValue(lineupRef, (snap) => {
            const data = snap.val();
            if (data) setSelectedLineup(Array.isArray(data) ? data : []);
        });

        const ticketsRef = ref(db, 'tickets');
        const unsubTickets = onValue(ticketsRef, (snap) => {
            const data = snap.val();
            if (data) setTickets(Array.isArray(data) ? data : []);
        });

        const publicTicketsRef = ref(db, 'publicTickets');
        const unsubPublic = onValue(publicTicketsRef, (snap) => {
            const data = snap.val();
            if (data) setPublicTickets(Array.isArray(data) ? data : []);
        });

        return () => {
            connectedUnsubscribe();
            unsubSettings();
            unsubLineup();
            unsubTickets();
            unsubPublic();
            clearTimeout(loadingTimeout);
        };
    }, []);

    const handleSave = async () => {
        setSaveStatus('Menyimpan...');
        const saveTimeout = setTimeout(() => {
            setSaveStatus('Gagal: Timeout (Cek Rules/Koneksi)');
        }, 10000);

        try {
            await Promise.all([
                set(ref(db, 'settings'), settings),
                set(ref(db, 'lineup'), selectedLineup),
                set(ref(db, 'tickets'), tickets),
                set(ref(db, 'publicTickets'), publicTickets)
            ]);
            clearTimeout(saveTimeout);
            setSaveStatus('✦ Berhasil disimpan ke Cloud!');
        } catch (error) {
            clearTimeout(saveTimeout);
            setSaveStatus('Gagal: ' + error.message);
        }
        setTimeout(() => setSaveStatus(''), 5000);
    };

    const toggleMember = (id) => {
        if (selectedLineup.includes(id)) {
            setSelectedLineup(selectedLineup.filter(mId => mId !== id));
        } else {
            setSelectedLineup([...selectedLineup, id]);
        }
    };

    const addTicket = () => {
        if (newTicket && !tickets.includes(newTicket)) {
            setTickets([...tickets, newTicket]);
            setNewTicket('');
        }
    };

    const removeTicket = (t) => setTickets(tickets.filter(ticket => ticket !== t));

    const addPublicTicket = () => {
        if (newPublicTicket && !publicTickets.includes(newPublicTicket)) {
            setPublicTickets([...publicTickets, newPublicTicket]);
            setNewPublicTicket('');
        }
    };

    const removePublicTicket = (t) => setPublicTickets(publicTickets.filter(ticket => ticket !== t));

    const generateBulkTickets = (count) => {
        const newBatch = [];
        for (let i = 0; i < count; i++) {
            const code = 'JKT48-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            if (!tickets.includes(code) && !newBatch.includes(code)) newBatch.push(code);
        }
        setTickets([...tickets, ...newBatch]);
    };

    const clearChat = async () => {
        if (window.confirm('Hapus semua riwayat chat di database?')) {
            try {
                await remove(ref(db, 'chats'));
                alert('Riwayat chat berhasil dihapus!');
            } catch (error) {
                console.error('Clear chat error:', error);
            }
        }
    };

    /* ── Shared styles (Ramadan dark) ── */
    const inputStyle = {
        width: '100%',
        background: 'rgba(5,13,26,0.7)',
        border: '1px solid rgba(212,168,67,0.3)',
        padding: '0.75rem',
        color: '#f9e6a0',
        outline: 'none',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        transition: 'border-color 0.2s',
    };

    const cardStyle = {
        background: 'rgba(10,22,40,0.75)',
        border: '1px solid rgba(212,168,67,0.2)',
        boxShadow: '0 4px 30px rgba(212,168,67,0.05)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem',
        position: 'relative',
    };

    /* Gold corner accent helper */
    const GoldCorners = () => (
        <>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 16, height: 16, borderTop: '1px solid rgba(212,168,67,0.5)', borderLeft: '1px solid rgba(212,168,67,0.5)' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderTop: '1px solid rgba(212,168,67,0.5)', borderRight: '1px solid rgba(212,168,67,0.5)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 16, height: 16, borderBottom: '1px solid rgba(212,168,67,0.5)', borderLeft: '1px solid rgba(212,168,67,0.5)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderBottom: '1px solid rgba(212,168,67,0.5)', borderRight: '1px solid rgba(212,168,67,0.5)' }} />
        </>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #020810 0%, #060f1c 100%)' }}>
                <GoldenParticles count={80} />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin" size={48} style={{ color: '#d4a843' }} />
                    <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#d4a84388' }}>Memuat Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen pt-24 pb-16 px-6 relative"
            style={{ background: 'linear-gradient(180deg, #020810 0%, #060f1c 60%, #020810 100%)', color: '#f5e6c8' }}
        >
            {/* Particle background */}
            <GoldenParticles count={80} style={{ position: 'fixed' }} />

            {/* Starfield pattern */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(212,168,67,0.06) 1px, transparent 0)',
                    backgroundSize: '50px 50px',
                    zIndex: 0,
                }}
            />

            {/* Top glow */}
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,67,0.12) 0%, transparent 70%)', zIndex: 0 }}
            />

            <div className="max-w-6xl mx-auto relative z-10">

                {/* ── HEADER ── */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1
                                className="text-4xl font-display font-bold"
                                style={{
                                    background: 'linear-gradient(90deg, #f9e6a0, #d4a843)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                ADMIN PANEL
                            </h1>
                            <div
                                className="px-2 py-0.5 text-[10px] font-mono border"
                                style={isConnected
                                    ? { backgroundColor: 'rgba(109,212,168,0.08)', color: '#6dd4a8', border: '1px solid rgba(109,212,168,0.3)' }
                                    : { backgroundColor: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }
                                }
                            >
                                {isConnected ? '✦ ONLINE' : '✦ OFFLINE'}
                            </div>
                        </div>
                        <p className="font-mono text-xs mt-1 tracking-widest" style={{ color: '#d4a84355' }}>
                            ✦ MANAGEMENT WEB NOBAR JKT48 ✦
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {saveStatus && (
                            <span className="font-mono text-sm animate-pulse" style={{ color: '#d4a843' }}>
                                {saveStatus}
                            </span>
                        )}
                        <button
                            onClick={clearChat}
                            className="px-4 py-3 font-bold flex items-center gap-2 text-sm transition-all"
                            style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.3)', color: '#d4a84399' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.6)'; e.currentTarget.style.color = '#d4a843'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)'; e.currentTarget.style.color = '#d4a84399'; }}
                        >
                            <Trash2 size={16} /> HAPUS CHAT
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-8 py-3 font-bold flex items-center gap-2 transition-all"
                            style={{ background: 'linear-gradient(135deg, #d4a843, #a07820)', color: '#050d1a', boxShadow: '0 0 20px rgba(212,168,67,0.2)' }}
                        >
                            <Save size={18} /> SIMPAN
                        </button>
                    </div>
                </div>

                {/* ── MAIN GRID ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── LEFT: EVENT SETTINGS + LINEUP ── */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Event Settings Card */}
                        <div style={cardStyle}>
                            <GoldCorners />
                            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2" style={{ color: '#f0c060' }}>
                                <Layout size={20} style={{ color: '#d4a843' }} /> PENGATURAN EVENT
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-mono uppercase mb-2" style={{ color: '#d4a84388' }}>Judul Show</label>
                                        <input
                                            type="text"
                                            value={settings.title}
                                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono uppercase mb-2" style={{ color: '#d4a84388' }}>Sub-Judul</label>
                                        <input
                                            type="text"
                                            value={settings.subtitle}
                                            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono uppercase mb-2" style={{ color: '#d4a84388' }}>Waktu Show (Countdown)</label>
                                        <input
                                            type="datetime-local"
                                            value={settings.date ? settings.date.substring(0, 16) : ''}
                                            onChange={(e) => setSettings({ ...settings, date: e.target.value })}
                                            style={{ ...inputStyle, colorScheme: 'dark' }}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-xs font-mono uppercase" style={{ color: '#d4a84388' }}>Streaming URL (YouTube/HLS)</label>
                                            <button
                                                onClick={() => setSettings({ ...settings, streamUrl: '' })}
                                                className="text-[10px] uppercase font-bold transition-opacity hover:opacity-70"
                                                style={{ color: '#d4a843' }}
                                            >
                                                Kosongkan
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={settings.streamUrl || ''}
                                            onChange={(e) => setSettings({ ...settings, streamUrl: e.target.value })}
                                            placeholder="Paste link YouTube atau .m3u8..."
                                            style={inputStyle}
                                        />
                                        <p className="text-[10px] mt-2" style={{ color: '#d4a84355' }}>Gunakan link YouTube biasa atau link streaming m3u8.</p>
                                    </div>

                                    {/* Price */}
                                    <div style={{ borderTop: '1px dashed rgba(212,168,67,0.15)', paddingTop: '1rem' }}>
                                        <label className="block text-xs font-mono uppercase mb-3" style={{ color: '#d4a84388' }}>
                                            💰 HARGA (kosongkan = sembunyikan)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm" style={{ color: '#d4a84388' }}>Rp</span>
                                            <input
                                                type="number"
                                                value={settings.priceAmount || ''}
                                                onChange={(e) => setSettings({ ...settings, priceAmount: e.target.value })}
                                                placeholder="50000"
                                                style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lineup Selection Card */}
                        <div style={cardStyle}>
                            <GoldCorners />
                            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2" style={{ color: '#f0c060' }}>
                                <Users size={20} style={{ color: '#d4a843' }} /> SELEKSI MEMBER (LINEUP)
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {members.map(member => (
                                    <div
                                        key={member.id}
                                        onClick={() => toggleMember(member.id)}
                                        className="cursor-pointer group relative p-2 transition-all"
                                        style={selectedLineup.includes(member.id)
                                            ? { border: '1px solid rgba(212,168,67,0.6)', background: 'rgba(212,168,67,0.1)' }
                                            : { border: '1px solid rgba(212,168,67,0.1)', background: 'rgba(5,13,26,0.5)', filter: 'grayscale(60%)' }
                                        }
                                    >
                                        <img src={member.image} alt="" className="w-full aspect-square object-cover mb-2" />
                                        <p className="text-[10px] font-bold truncate text-center" style={{ color: '#f9e6a0' }}>{member.name}</p>
                                        {selectedLineup.includes(member.id) && (
                                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #d4a843, #a07820)' }}>
                                                <Plus size={10} className="text-white rotate-45" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-4 border flex justify-between items-center" style={{ background: 'rgba(5,13,26,0.5)', border: '1px solid rgba(212,168,67,0.12)' }}>
                                <p className="text-sm font-mono" style={{ color: '#d4c4a077' }}>
                                    Total Member Terpilih: <span className="font-bold" style={{ color: '#d4a843' }}>{selectedLineup.length}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: TICKET MANAGEMENT ── */}
                    <div className="space-y-8">

                        {/* Public Tickets */}
                        <div style={cardStyle}>
                            <GoldCorners />
                            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2" style={{ color: '#6dd4a8' }}>
                                <Users size={20} style={{ color: '#d4a843' }} /> TIKET PUBLIK
                            </h2>
                            <p className="text-[10px] mb-4 uppercase tracking-wider" style={{ color: '#d4a84355' }}>
                                Tiket ini bisa dipakai banyak orang sekaligus tanpa conflict.
                            </p>

                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newPublicTicket}
                                    onChange={(e) => setNewPublicTicket(e.target.value.toUpperCase())}
                                    placeholder="KODE PUBLIK..."
                                    style={{ ...inputStyle, flex: 1 }}
                                    onKeyDown={(e) => e.key === 'Enter' && addPublicTicket()}
                                />
                                <button
                                    onClick={addPublicTicket}
                                    className="p-3 transition-all"
                                    style={{ background: 'rgba(109,212,168,0.1)', border: '1px solid rgba(109,212,168,0.35)', color: '#6dd4a8' }}
                                >
                                    <Plus size={24} />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                {publicTickets.map(ticket => (
                                    <div key={ticket} className="flex items-center justify-between p-3 group" style={{ background: 'rgba(109,212,168,0.05)', border: '1px solid rgba(109,212,168,0.18)' }}>
                                        <span className="font-mono text-sm tracking-widest" style={{ color: '#f9e6a0' }}>{ticket}</span>
                                        <button
                                            onClick={() => removePublicTicket(ticket)}
                                            className="opacity-0 group-hover:opacity-100 transition-all"
                                            style={{ color: '#f87171' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Regular Tickets */}
                        <div style={cardStyle}>
                            <GoldCorners />
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-display font-bold flex items-center gap-2" style={{ color: '#f0c060' }}>
                                    <Ticket size={20} style={{ color: '#d4a843' }} /> TIKET REGULER
                                </h2>
                                <div className="flex gap-2">
                                    {[10, 50].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => generateBulkTickets(n)}
                                            className="text-[10px] px-3 py-1 transition-all font-mono"
                                            style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.25)', color: '#d4a84388' }}
                                        >
                                            +{n} AUTO
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newTicket}
                                    onChange={(e) => setNewTicket(e.target.value.toUpperCase())}
                                    placeholder="KODE BARU..."
                                    style={{ ...inputStyle, flex: 1 }}
                                    onKeyDown={(e) => e.key === 'Enter' && addTicket()}
                                />
                                <button
                                    onClick={addTicket}
                                    className="p-3 transition-all"
                                    style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.4)', color: '#d4a843' }}
                                >
                                    <Plus size={24} />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {tickets.map(ticket => (
                                    <div key={ticket} className="flex items-center justify-between p-3 group transition-all" style={{ background: 'rgba(5,13,26,0.5)', border: '1px solid rgba(212,168,67,0.1)' }}>
                                        <span className="font-mono text-sm tracking-widest" style={{ color: '#f9e6a0' }}>{ticket}</span>
                                        <button
                                            onClick={() => removeTicket(ticket)}
                                            className="opacity-0 group-hover:opacity-100 transition-all"
                                            style={{ color: '#f87171' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => { if (window.confirm('Hapus semua tiket reguler?')) setTickets([]); }}
                                className="w-full mt-6 p-3 text-xs font-mono flex items-center justify-center gap-2 transition-all"
                                style={{ border: '1px solid rgba(248,113,113,0.3)', color: 'rgba(248,113,113,0.5)', backgroundColor: 'transparent' }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.5)'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(248,113,113,0.5)'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; }}
                            >
                                <RefreshCw size={14} /> RESET SEMUA REGULER
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
