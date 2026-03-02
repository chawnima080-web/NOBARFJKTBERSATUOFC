import React, { useState, useEffect } from 'react';
import { Settings, Users, Ticket, Save, Plus, Trash2, Calendar, Layout, RefreshCw, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { members } from '../data/members';

const Admin = () => {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        title: 'NOBAR JKT48',
        subtitle: 'LIVE STREAMING EXPERIENCE',
        date: '2026-02-28T19:00:00',
        streamUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'
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
            setSaveStatus('Berhasil disimpan ke Cloud!');
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

    /* ── Shared input style ── */
    const inputStyle = {
        width: '100%',
        backgroundColor: '#fdf6ee',
        border: '1px solid #c9956a50',
        borderRadius: '0.5rem',
        padding: '0.75rem',
        color: '#3b2a1a',
        outline: 'none',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
    };

    /* ── Shared card style ── */
    const cardStyle = {
        backgroundColor: '#f0e6d3',
        border: '1px solid #c9956a30',
        borderRadius: '1rem',
        padding: '1.5rem',
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fdf6ee' }}>
                <Loader2 className="animate-spin" size={48} style={{ color: '#8b5e3c' }} />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 p-6" style={{ backgroundColor: '#fdf6ee', color: '#3b2a1a' }}>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-display font-bold" style={{ color: '#3b2a1a' }}>ADMIN PANEL</h1>
                            <div
                                className={`px-2 py-0.5 rounded text-[10px] font-mono border`}
                                style={isConnected
                                    ? { backgroundColor: 'rgba(122,158,126,0.1)', color: '#7a9e7e', border: '1px solid rgba(122,158,126,0.3)' }
                                    : { backgroundColor: 'rgba(201,89,60,0.1)', color: '#c9596a', border: '1px solid rgba(201,89,60,0.3)' }
                                }
                            >
                                {isConnected ? 'ONLINE' : 'OFFLINE'}
                            </div>
                        </div>
                        <p className="font-mono text-xs mt-1" style={{ color: '#a0785a' }}>MANAGEMENT WEB NOBAR JKT48</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {saveStatus && <span className="font-mono text-sm animate-pulse" style={{ color: '#7a9e7e' }}>{saveStatus}</span>}
                        <button
                            onClick={clearChat}
                            className="px-4 py-3 rounded-xl font-bold flex items-center gap-2 text-sm transition-all"
                            style={{ backgroundColor: 'rgba(201,149,106,0.1)', border: '1px solid rgba(201,149,106,0.4)', color: '#8b5e3c' }}
                        >
                            <Trash2 size={16} /> HAPUS CHAT
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 text-white transition-all"
                            style={{ backgroundColor: '#8b5e3c', boxShadow: '0 0 20px rgba(139,94,60,0.2)' }}
                        >
                            <Save size={18} /> SIMPAN PERUBAHAN
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── EVENT SETTINGS ── */}
                    <div className="lg:col-span-2 space-y-8">
                        <div style={cardStyle}>
                            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2" style={{ color: '#c9956a' }}>
                                <Layout size={20} style={{ color: '#3b2a1a' }} /> PENGATURAN EVENT
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-mono uppercase mb-2" style={{ color: '#a0785a' }}>Judul Show</label>
                                        <input
                                            type="text"
                                            value={settings.title}
                                            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono uppercase mb-2" style={{ color: '#a0785a' }}>Sub-Judul</label>
                                        <input
                                            type="text"
                                            value={settings.subtitle}
                                            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono uppercase mb-2" style={{ color: '#a0785a' }}>Waktu Show (Countdown)</label>
                                        <input
                                            type="datetime-local"
                                            value={settings.date ? settings.date.substring(0, 16) : ''}
                                            onChange={(e) => setSettings({ ...settings, date: e.target.value })}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-xs font-mono uppercase" style={{ color: '#a0785a' }}>Streaming URL (YouTube/HLS)</label>
                                            <button
                                                onClick={() => setSettings({ ...settings, streamUrl: '' })}
                                                className="text-[10px] uppercase font-bold transition-opacity hover:opacity-70"
                                                style={{ color: '#c9956a' }}
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
                                        <p className="text-[10px] mt-2" style={{ color: '#a0785a' }}>Gunakan link YouTube biasa atau link streaming m3u8.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── LINEUP SELECTION ── */}
                        <div style={cardStyle}>
                            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2" style={{ color: '#8b5e3c' }}>
                                <Users size={20} style={{ color: '#3b2a1a' }} /> SELEKSI MEMBER (LINEUP)
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {members.map(member => (
                                    <div
                                        key={member.id}
                                        onClick={() => toggleMember(member.id)}
                                        className="cursor-pointer group relative p-2 rounded-lg border transition-all"
                                        style={selectedLineup.includes(member.id)
                                            ? { border: '1px solid #8b5e3c', backgroundColor: 'rgba(139,94,60,0.1)' }
                                            : { border: '1px solid #c9956a20', backgroundColor: '#fdf6ee', filter: 'grayscale(60%)' }
                                        }
                                    >
                                        <img src={member.image} alt="" className="w-full aspect-square object-cover rounded mb-2" />
                                        <p className="text-[10px] font-bold truncate text-center" style={{ color: '#3b2a1a' }}>{member.name}</p>
                                        {selectedLineup.includes(member.id) && (
                                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8b5e3c' }}>
                                                <Plus size={10} className="text-white rotate-45" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-4 rounded-lg border flex justify-between items-center" style={{ backgroundColor: '#fdf6ee', border: '1px solid #c9956a30' }}>
                                <p className="text-sm font-mono" style={{ color: '#7a5c3e' }}>
                                    Total Member Terpilih: <span className="font-bold" style={{ color: '#8b5e3c' }}>{selectedLineup.length}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── TICKET MANAGEMENT ── */}
                    <div className="space-y-8">

                        {/* Public Tickets */}
                        <div style={cardStyle}>
                            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2" style={{ color: '#7a9e7e' }}>
                                <Users size={20} style={{ color: '#3b2a1a' }} /> TIKET PUBLIK (NO-KICK)
                            </h2>
                            <p className="text-[10px] mb-4 uppercase tracking-wider" style={{ color: '#a0785a' }}>Tiket ini bisa dipakai 1000+ orang sekaligus tanpa conflict.</p>

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
                                    className="p-3 rounded-lg transition-all"
                                    style={{ backgroundColor: 'rgba(122,158,126,0.15)', border: '1px solid rgba(122,158,126,0.4)', color: '#7a9e7e' }}
                                >
                                    <Plus size={24} />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                {publicTickets.map(ticket => (
                                    <div key={ticket} className="flex items-center justify-between p-3 rounded-lg group" style={{ backgroundColor: 'rgba(122,158,126,0.07)', border: '1px solid rgba(122,158,126,0.25)' }}>
                                        <span className="font-mono text-sm tracking-widest" style={{ color: '#3b2a1a' }}>{ticket}</span>
                                        <button
                                            onClick={() => removePublicTicket(ticket)}
                                            className="opacity-0 group-hover:opacity-100 transition-all"
                                            style={{ color: '#c9956a' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Regular Tickets */}
                        <div style={cardStyle}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-display font-bold flex items-center gap-2" style={{ color: '#8b5e3c' }}>
                                    <Ticket size={20} style={{ color: '#3b2a1a' }} /> TIKET REGULER
                                </h2>
                                <div className="flex gap-2">
                                    {[10, 50].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => generateBulkTickets(n)}
                                            className="text-[10px] px-3 py-1 rounded-md transition-all"
                                            style={{ backgroundColor: '#fdf6ee', border: '1px solid #c9956a30', color: '#7a5c3e' }}
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
                                    className="p-3 rounded-lg transition-all"
                                    style={{ backgroundColor: 'rgba(139,94,60,0.1)', border: '1px solid rgba(139,94,60,0.4)', color: '#8b5e3c' }}
                                >
                                    <Plus size={24} />
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {tickets.map(ticket => (
                                    <div key={ticket} className="flex items-center justify-between p-3 rounded-lg group transition-all" style={{ backgroundColor: '#fdf6ee', border: '1px solid #c9956a25' }}>
                                        <span className="font-mono text-sm tracking-widest" style={{ color: '#3b2a1a' }}>{ticket}</span>
                                        <button
                                            onClick={() => removeTicket(ticket)}
                                            className="opacity-0 group-hover:opacity-100 transition-all"
                                            style={{ color: '#c9956a' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => { if (window.confirm('Hapus semua tiket reguler?')) setTickets([]); }}
                                className="w-full mt-6 p-3 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all"
                                style={{ border: '1px solid rgba(201,149,106,0.5)', color: '#8b5e3c', backgroundColor: 'transparent' }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#8b5e3c'; e.currentTarget.style.color = 'white'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#8b5e3c'; }}
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
