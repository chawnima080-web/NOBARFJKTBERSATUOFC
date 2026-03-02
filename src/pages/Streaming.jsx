import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Users, Play, Maximize, Volume2, Settings, Ticket, Lock, AlertTriangle, RotateCcw } from 'lucide-react';
import { nanoid } from 'nanoid';
import { db } from '../lib/firebase';
import { ref, onValue, set, onDisconnect, serverTimestamp, push, limitToLast, query } from 'firebase/database';

const Streaming = () => {
    const navigate = useNavigate();
    // 1. Core State
    const [currentTickets, setCurrentTickets] = useState([]);
    const [publicTickets, setPublicTickets] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // For instant player refresh
    const [settings, setSettings] = useState(null);
    const [startTime, setStartTime] = useState(null);

    // 2. Global Sync Listener
    useEffect(() => {
        const ticketsRef = ref(db, 'tickets');
        const unsubTickets = onValue(ticketsRef, (snap) => {
            const data = snap.val();
            setCurrentTickets(Array.isArray(data) ? data : []);
            setDataLoaded(true); // Always mark loaded after first response
        });

        const publicTicketsRef = ref(db, 'publicTickets');
        const unsubPublic = onValue(publicTicketsRef, (snap) => {
            const data = snap.val();
            setPublicTickets(Array.isArray(data) ? data : []);
            setDataLoaded(true); // Always mark loaded after first response
        });

        const settingsRef = ref(db, 'settings');
        const unsubSettings = onValue(settingsRef, (snap) => {
            const data = snap.val();
            if (data) {
                setSettings(data);
                const newStartTime = data.date ? new Date(data.date).getTime() : null;
                setStartTime(newStartTime);

                const newUrl = data.streamUrl || '';
                setUrl(prev => {
                    if (prev !== newUrl) {
                        setLoading(true);
                        setTimeout(() => setLoading(false), 2000);
                        return newUrl;
                    }
                    return prev;
                });
            }
        });

        const chatRef = query(ref(db, 'chats'), limitToLast(50));
        const unsubscribeChat = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const chatList = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
                setMessages(chatList);
            }
        });

        return () => {
            unsubTickets();
            unsubPublic();
            unsubSettings();
            unsubscribeChat();
        };
    }, []);  // Empty deps — subscribe once, listeners auto-update

    const [ticketInput, setTicketInput] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authError, setAuthError] = useState('');
    const [activeTicket, setActiveTicket] = useState(() => {
        return localStorage.getItem('active_jkt_ticket') || null;
    });
    const [userName, setUserName] = useState(() => {
        const ticket = localStorage.getItem('active_jkt_ticket');
        return ticket ? localStorage.getItem(`jkt_name_${ticket}`) || '' : '';
    });
    const [tempName, setTempName] = useState('');
    const [viewerCount, setViewerCount] = useState(0);
    const [sessionId] = useState(() => {
        // CRITICAL: Use sessionStorage (NOT localStorage) so Chrome Sync
        // cannot share the same ID across devices. sessionStorage is
        // isolated per-tab and per-device, guaranteeing true uniqueness.
        let id = sessionStorage.getItem('jkt_device_session_id');
        if (!id) {
            id = nanoid();
            sessionStorage.setItem('jkt_device_session_id', id);
        }
        return id;
    });
    const [sessionConflict, setSessionConflict] = useState(false);
    const [activeTimeOffset, setActiveTimeOffset] = useState(0);
    const [serverTimeOffset, setServerTimeOffset] = useState(0);
    const [isActivated, setIsActivated] = useState(false); // Track first user interaction
    // Detect touch device - overlay only needed on mobile
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // 3. Server Time Offset Listener
    useEffect(() => {
        const offsetRef = ref(db, ".info/serverTimeOffset");
        const unsub = onValue(offsetRef, (snap) => {
            setServerTimeOffset(snap.val() || 0);
        });
        return () => unsub();
    }, []);

    // 4. Authorization Effect
    useEffect(() => {
        if (!dataLoaded) return;
        const allValidTickets = [...currentTickets, ...publicTickets];
        const urlParams = new URLSearchParams(window.location.search);
        const ticketFromUrl = urlParams.get('ticket');
        const storedTicket = localStorage.getItem('active_jkt_ticket');
        const targetTicket = ticketFromUrl || storedTicket;

        if (targetTicket && allValidTickets.includes(targetTicket)) {
            if (!sessionConflict && (!isAuthorized || activeTicket !== targetTicket)) {
                handleAuthorization(targetTicket);
            }
        } else if (isAuthorized) {
            setIsAuthorized(false);
            setActiveTicket(null);
            setUserName('');
            localStorage.removeItem('active_jkt_ticket');
        }
    }, [currentTickets, publicTickets, isAuthorized, sessionConflict, activeTicket, dataLoaded]);

    // 5. Cleanup Effect (Local Storage)
    useEffect(() => {
        if (!dataLoaded) return;
        const allValidTickets = [...currentTickets, ...publicTickets];
        if (allValidTickets.length > 0) {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('jkt_name_')) {
                    const ticketId = key.replace('jkt_name_', '');
                    if (!allValidTickets.includes(ticketId)) {
                        localStorage.removeItem(key);
                    }
                }
            });
        }
    }, [currentTickets, publicTickets, dataLoaded]);

    // 6. Presence & Heartbeat Logic — counts ALL valid watchers
    useEffect(() => {
        if (!isAuthorized || !activeTicket || sessionConflict || !dataLoaded) return;

        const allValidTickets = [...currentTickets, ...publicTickets];

        // Write MY presence to Firebase
        const presenceRef = ref(db, `presence/${activeTicket}_${sessionId}`);
        const updatePresence = () => {
            set(presenceRef, {
                id: sessionId,
                ticket: activeTicket,
                timestamp: serverTimestamp()
            });
        };

        updatePresence();
        onDisconnect(presenceRef).remove();

        // HEARTBEAT every 10s to stay "online"
        const presenceHeartbeat = setInterval(updatePresence, 10000);

        // Listen to ALL presence entries and count anyone with a valid ticket
        const globalPresenceRef = ref(db, 'presence');
        const unsubscribePresence = onValue(globalPresenceRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const uniqueSessions = new Set();
                Object.values(data).forEach(entry => {
                    // Count anyone watching with ANY valid ticket (not just same ticket)
                    if (entry && typeof entry === 'object' && entry.id &&
                        entry.ticket && allValidTickets.includes(entry.ticket)) {
                        uniqueSessions.add(entry.id);
                    }
                });
                setViewerCount(uniqueSessions.size > 0 ? uniqueSessions.size : 1);
            } else {
                setViewerCount(1);
            }
        });

        // Public tickets: no session locking needed
        if (publicTickets.includes(activeTicket)) {
            return () => {
                unsubscribePresence();
                clearInterval(presenceHeartbeat);
            };
        }

        // Private tickets: enforce single-device session lock
        const sessionRef = ref(db, `sessions/${activeTicket}`);
        let lockInterval;

        const updateLock = async () => {
            if (sessionConflict) return;
            try {
                await set(sessionRef, { id: sessionId, timestamp: serverTimestamp() });
            } catch (e) {
                console.error("Lock failed:", e);
            }
        };

        const unsubscribeSession = onValue(sessionRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            if (data.id !== sessionId) {
                const now = Date.now() + serverTimeOffset;
                const lastSeen = data.timestamp || 0;
                if (Math.abs(now - lastSeen) < 35000) {
                    setSessionConflict(true);
                    if (lockInterval) clearInterval(lockInterval);
                } else {
                    updateLock();
                }
            }
        });

        updateLock();
        lockInterval = setInterval(updateLock, 15000);
        onDisconnect(sessionRef).remove();

        return () => {
            unsubscribePresence();
            unsubscribeSession();
            clearInterval(presenceHeartbeat);
            if (lockInterval) clearInterval(lockInterval);
        };
    }, [isAuthorized, activeTicket, sessionId, sessionConflict, publicTickets, currentTickets, dataLoaded, serverTimeOffset]);

    const handleAuthorization = (ticket) => {
        setIsAuthorized(true);
        setActiveTicket(ticket);
        setAuthError('');
        setSessionConflict(false);
        const savedName = localStorage.getItem(`jkt_name_${ticket}`);
        if (activeTicket !== ticket || !userName) {
            setUserName(savedName || '');
        }
        setTempName('');
        localStorage.setItem('active_jkt_ticket', ticket);
        // Clean up URL to keep it pretty
        navigate(`/streaming?ticket=${ticket}`, { replace: true });
    };

    const handleTicketSubmit = (e) => {
        e.preventDefault();
        const allValidTickets = [...currentTickets, ...publicTickets];
        const trimmedTicket = ticketInput.trim();
        if (allValidTickets.includes(trimmedTicket)) {
            handleAuthorization(trimmedTicket);
        } else {
            setAuthError('Ticket ID tidak valid atau sudah kedaluwarsa.');
        }
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        const trimmedName = tempName.trim();
        if (trimmedName.length >= 2) {
            setUserName(trimmedName);
            if (activeTicket) {
                localStorage.setItem(`jkt_name_${activeTicket}`, trimmedName);
            }
        } else {
            setAuthError('Nama minimal 2 karakter.');
        }
    };

    // UI States
    const [url, setUrl] = useState('');
    const [quality, setQuality] = useState('hd1080');
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [volume, setVolume] = useState(0.8);
    const [loading, setLoading] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const [autoQuality, setAutoQuality] = useState(false); // false = Manual, true = Auto
    const [messages, setMessages] = useState([
        { user: 'Admin', text: 'Selamat datang di live nobar! Acara akan segera dimulai.' },
    ]);
    const [input, setInput] = useState('');
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    useEffect(() => {
        if (showControls) {
            const timer = setTimeout(() => setShowControls(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showControls]);

    // Deter Inspection & Right-Click
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.keyCode === 123 ||
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
                (e.ctrlKey && e.keyCode === 85)
            ) {
                e.preventDefault();
                return false;
            }
        };

        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // --- ACTIVATION & UNMUTE LOGIC ---
    const activatePlayer = () => {
        const iframe = document.getElementById('yt-player-iframe');
        if (iframe) {
            // Send commands to unlock audio and force play
            const commands = [
                { func: 'playVideo', args: [] },
                { func: 'unMute', args: [] },
                { func: 'setVolume', args: [volume * 100] }
            ];
            commands.forEach(cmd => {
                iframe.contentWindow.postMessage(JSON.stringify({
                    event: 'command',
                    func: cmd.func,
                    args: cmd.args
                }), '*');
            });
            setIsActivated(true);
            setLoading(false);
        }
    };


    // Handle Volume PostMessage & Persistent Unmute
    useEffect(() => {
        const iframe = document.getElementById('yt-player-iframe');
        if (iframe && isPlayerReady) {
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'setVolume',
                args: [volume * 100]
            }), '*');

            if (isActivated) {
                iframe.contentWindow.postMessage(JSON.stringify({
                    event: 'command',
                    func: 'unMute',
                    args: []
                }), '*');
            }
        }
    }, [volume, isPlayerReady, isActivated]);

    // Force quality when autoQuality is OFF
    useEffect(() => {
        if (!isPlayerReady || autoQuality) return;
        const iframe = document.getElementById('yt-player-iframe');
        if (iframe) {
            // setPlaybackQuality forces YouTube to hold the selected resolution
            iframe.contentWindow.postMessage(JSON.stringify({
                event: 'command',
                func: 'setPlaybackQuality',
                args: [quality]
            }), '*');
        }
    }, [isPlayerReady, autoQuality, quality]);

    const getVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|live\/)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getVideoId(url?.trim());

    // --- REAL-TIME SYNC LOGIC ---
    useEffect(() => {
        if (startTime && !loading) {
            const now = Date.now() + serverTimeOffset;
            const diff = Math.floor((now - startTime) / 1000);
            setActiveTimeOffset(diff > 0 ? diff : 0);
        }
    }, [startTime, url, refreshKey, serverTimeOffset]);

    const handleRefresh = (e) => {
        if (e) e.stopPropagation();
        setLoading(true);
        setIsPlayerReady(false);
        setActiveTimeOffset(0); // Reset offset to force recalculation
        setRefreshKey(prev => prev + 1);
        // Force re-activation requirement on full manual refresh
        setIsActivated(false);
        setTimeout(() => setLoading(false), 2000);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            const newMessage = {
                user: userName || 'Guest',
                text: input,
                timestamp: serverTimestamp()
            };
            try {
                await push(ref(db, 'chats'), newMessage);
                setInput('');
            } catch (error) {
                console.error("Chat send failed:", error);
            }
        }
    };

    // Auto-scroll chat
    useEffect(() => {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [messages]);

    // --- RENDER LOGIC ---

    if (sessionConflict) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center p-6 text-center" style={{ backgroundColor: '#fdf6ee' }}>
                <div className="w-full max-w-md p-8 rounded-2xl" style={{ backgroundColor: '#f0e6d3', border: '1px solid #c9956a40' }}>
                    <AlertTriangle className="mx-auto mb-6" size={48} style={{ color: '#c9956a' }} />
                    <h2 className="text-2xl font-display mb-2" style={{ color: '#3b2a1a' }}>SESSION CONFLICT</h2>
                    <p className="text-sm mb-6" style={{ color: '#7a5c3e' }}>Ticket ini sedang digunakan di perangkat lain.</p>
                    <button
                        onClick={async () => {
                            const sessionRef = ref(db, `sessions/${activeTicket}`);
                            await set(sessionRef, { id: sessionId, timestamp: serverTimestamp() });
                            setTimeout(() => window.location.reload(), 500);
                        }}
                        className="w-full py-3 rounded-xl font-bold text-white"
                        style={{ backgroundColor: '#8b5e3c' }}
                    >
                        MASUK PAKSA (AMBIL ALIH)
                    </button>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center p-6" style={{ backgroundColor: '#fdf6ee' }}>
                <div className="w-full max-w-md p-8 rounded-2xl text-center" style={{ backgroundColor: '#f0e6d3', border: '1px solid #c9956a30' }}>
                    <Lock className="mx-auto mb-6" size={48} style={{ color: '#8b5e3c' }} />
                    <h2 className="text-2xl font-display mb-2" style={{ color: '#3b2a1a' }}>ACCESS PROTECTED</h2>
                    <p className="text-sm mb-8" style={{ color: '#7a5c3e' }}>Masukkan Ticket ID Anda.</p>
                    <form onSubmit={handleTicketSubmit} className="space-y-4">
                        <div className="relative">
                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: '#a0785a' }} />
                            <input
                                type="text"
                                value={ticketInput}
                                onChange={(e) => setTicketInput(e.target.value)}
                                placeholder="TICKET ID..."
                                className="w-full rounded-xl py-3 pl-10 pr-4 outline-none"
                                style={{ backgroundColor: '#fdf6ee', border: '1px solid #c9956a50', color: '#3b2a1a' }}
                            />
                        </div>
                        {authError && <p className="text-xs" style={{ color: '#c9956a' }}>{authError}</p>}
                        <button className="w-full py-3 rounded-xl font-bold text-white" style={{ backgroundColor: '#8b5e3c' }}>MASUK</button>
                    </form>
                </div>
            </div>
        );
    }

    if (!userName) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center p-6" style={{ backgroundColor: '#fdf6ee' }}>
                <div className="w-full max-w-md p-8 rounded-2xl text-center" style={{ backgroundColor: '#f0e6d3', border: '1px solid #c9956a30' }}>
                    <Users className="mx-auto mb-6" size={48} style={{ color: '#c9956a' }} />
                    <h2 className="text-2xl font-display mb-2" style={{ color: '#3b2a1a' }}>SIAPA NAMA ANDA?</h2>
                    <p className="text-sm mb-8" style={{ color: '#7a5c3e' }}>Nama di live chat.</p>
                    <form onSubmit={handleNameSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="NAMA..."
                            maxLength={20}
                            className="w-full rounded-xl py-3 px-4 outline-none text-center font-bold"
                            style={{ backgroundColor: '#fdf6ee', border: '1px solid #c9956a50', color: '#3b2a1a' }}
                        />
                        {authError && <p className="text-xs" style={{ color: '#c9956a' }}>{authError}</p>}
                        <button className="w-full py-3 rounded-xl font-bold text-white" style={{ backgroundColor: '#c9956a' }}>START WATCHING</button>
                    </form>
                    <button onClick={() => { localStorage.removeItem('active_jkt_ticket'); window.location.reload(); }} className="text-[10px] mt-8 uppercase tracking-widest" style={{ color: '#a0785a' }}>GANTI TIKET</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 flex flex-col md:flex-row h-screen overflow-hidden select-none" style={{ backgroundColor: '#fdf6ee', color: '#3b2a1a' }}>
            <div id="main-player-container" className="flex-grow bg-black flex flex-col relative group overflow-hidden">
                <div className="flex-grow relative h-full w-full">
                    <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
                        {videoId ? (
                            <iframe
                                id="yt-player-iframe"
                                key={refreshKey}
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playlist=${videoId}&loop=1&rel=0&showinfo=0&controls=0&modestbranding=1&iv_load_policy=3&disablekb=1&enablejsapi=1&origin=${window.location.origin}&vq=${quality}&start=${activeTimeOffset}&playsinline=1`}
                                className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                title="YouTube Stream"
                                onLoad={() => {
                                    setIsPlayerReady(true);
                                    // Loading overlay will be hidden by activatePlayer click
                                }}
                            />
                        ) : (
                            <div className="text-white/20 font-mono text-[10px]">SIGNAL NOT DETECTED</div>
                        )}
                    </div>

                    {/* INTERACTION OVERLAY (All Devices - Fixes Autoplay/Sound) */}
                    {!isActivated && (
                        <div
                            className="absolute inset-0 z-[40] bg-black flex flex-col items-center justify-center gap-4 cursor-pointer"
                            onClick={activatePlayer}
                        >
                            {(loading || !isPlayerReady) && (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-4 rounded-full animate-spin" style={{ borderColor: '#c9956a20', borderTopColor: '#8b5e3c' }}></div>
                                    <div className="font-mono text-[10px] animate-pulse uppercase tracking-[0.2em]" style={{ color: '#c9956a' }}>Resolving Signal...</div>
                                    <div className="text-[8px] uppercase tracking-widest mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>{isTouchDevice ? 'Tap screen to activate audio' : 'Click anywhere to activate audio'}</div>
                                </div>
                            )}
                            {!loading && isPlayerReady && (
                                isTouchDevice ? (
                                    // Mobile: original style
                                    <div className="backdrop-blur-md px-6 py-3 rounded-full border animate-bounce" style={{ backgroundColor: 'rgba(139,94,60,0.2)', borderColor: 'rgba(139,94,60,0.4)' }}>
                                        <div className="font-bold text-[10px] uppercase tracking-[0.2em]" style={{ color: '#c9956a' }}>TAP TO START WATCHING</div>
                                    </div>
                                ) : (
                                    // Desktop: ping style
                                    <div className="flex flex-col items-center gap-6">
                                        <div className="relative">
                                            <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: 'rgba(139,94,60,0.2)' }}></div>
                                            <div className="relative backdrop-blur-md px-8 py-4 rounded-full border" style={{ backgroundColor: 'rgba(139,94,60,0.2)', borderColor: 'rgba(139,94,60,0.4)' }}>
                                                <div className="font-bold text-[11px] uppercase tracking-[0.3em]" style={{ color: '#c9956a' }}>
                                                    ▶  CLICK TO START WATCHING
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-[9px] uppercase tracking-widest animate-pulse" style={{ color: 'rgba(255,255,255,0.3)' }}>Click anywhere</div>
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    <div
                        className={`absolute inset-0 z-30 transition-all duration-500 ${showControls ? 'opacity-100 bg-black/20' : 'opacity-0 md:group-hover:opacity-100'}`}
                        onClick={() => setShowControls(!showControls)}
                    >
                        {/* Status Signal */}
                        <div className="absolute top-4 left-4">
                            <div className="text-white font-bold flex items-center gap-2 text-[9px] tracking-[0.4em] backdrop-blur-xl px-3 py-1.5 rounded-full border" style={{ backgroundColor: 'rgba(139,94,60,0.2)', borderColor: 'rgba(139,94,60,0.4)' }}>
                                <span className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)] ${videoId ? 'bg-red-500' : 'bg-gray-500'}`}></span>
                                SIGNAL: {videoId ? 'LIVE' : 'OFFLINE'}
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-between items-end gap-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                            <div className="flex flex-col gap-2">
                                <div className="font-bold text-[9px] tracking-[0.4em] uppercase" style={{ color: '#c9956a' }}>{settings?.title || 'Nobar JKT48'}</div>
                                <button
                                    onClick={handleRefresh}
                                    className="flex items-center gap-2.5 px-4 py-2 rounded-full transition-all group"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#c9956a' }}
                                >
                                    <RotateCcw size={16} className="group-hover:rotate-[-45deg] transition-transform" />
                                    <span className="text-[10px] font-bold tracking-[0.2em] pt-0.5">REFRESH LIVE</span>
                                </button>
                            </div>

                            <div className="flex items-center gap-3 sm:gap-6 backdrop-blur-md p-3 sm:p-4 rounded-2xl" style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(201,149,106,0.2)' }}>
                                <div className="relative">
                                    <button onClick={(e) => { e.stopPropagation(); setShowQualityMenu(!showQualityMenu); }} className="flex flex-col items-center transition-colors" style={{ color: showQualityMenu ? '#8b5e3c' : autoQuality ? '#7a9e7e' : 'rgba(255,255,255,0.7)' }}>
                                        <Settings size={20} />
                                        <span className="text-[8px] mt-1 font-mono uppercase tracking-widest">
                                            {autoQuality ? 'AUTO' : quality === 'large' ? '480p' : quality === 'medium' ? '360p' : quality.replace('hd', '') + 'p'}
                                        </span>
                                    </button>

                                    {showQualityMenu && (
                                        <div className="absolute bottom-full mb-4 right-0 rounded-xl p-2 min-w-[160px] z-50 shadow-2xl backdrop-blur-xl" style={{ backgroundColor: '#f0e6d3', border: '1px solid #c9956a30' }}>
                                            <div className="text-[8px] font-mono px-3 py-1 uppercase tracking-widest" style={{ color: '#a0785a' }}>Select Resolution</div>

                                            {/* Auto Quality Toggle */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setAutoQuality(prev => !prev); }}
                                                className={`w-full text-left px-4 py-2.5 rounded-lg text-[10px] font-bold transition-all flex items-center justify-between`}
                                                style={autoQuality ? { backgroundColor: 'rgba(122,158,126,0.2)', color: '#7a9e7e', border: '1px solid rgba(122,158,126,0.3)' } : { color: '#7a5c3e' }}
                                            >
                                                <span>Auto Quality</span>
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: autoQuality ? '#7a9e7e' : '#c9956a50' }}></span>
                                            </button>

                                            <div className="border-t my-1" style={{ borderColor: '#c9956a20' }}></div>

                                            {[
                                                { label: '1440p QHD', value: 'hd1440' },
                                                { label: '1080p Ultra', value: 'hd1080' },
                                                { label: '720p HD', value: 'hd720' },
                                                { label: '480p SD', value: 'large' },
                                                { label: '360p Data Saver', value: 'medium' }
                                            ].map((q) => (
                                                <button
                                                    key={q.value}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setQuality(q.value);
                                                        setAutoQuality(false);
                                                        setShowQualityMenu(false);
                                                        setLoading(true);
                                                        setIsPlayerReady(false);
                                                        setRefreshKey(prev => prev + 1);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 rounded-lg text-[10px] font-bold transition-all"
                                                    style={!autoQuality && quality === q.value
                                                        ? { backgroundColor: '#8b5e3c', color: 'white' }
                                                        : { color: '#7a5c3e' }}
                                                >
                                                    {q.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="hidden sm:flex items-center gap-3">
                                    <Volume2 size={20} style={{ color: 'rgba(255,255,255,0.7)' }} />
                                    <input
                                        type="range"
                                        min="0" max="1" step="0.1"
                                        value={volume}
                                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="w-24 h-1 rounded-lg appearance-none cursor-pointer"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.1)', accentColor: '#8b5e3c' }}
                                    />
                                </div>

                                <button
                                    className="p-2 rounded-lg transition-colors"
                                    style={{ border: '1px solid rgba(139,94,60,0.2)', color: '#c9956a' }}
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        const playerEl = document.getElementById('main-player-container');
                                        if (document.fullscreenElement) {
                                            document.exitFullscreen();
                                        } else if (playerEl) {
                                            await playerEl.requestFullscreen();
                                            if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape').catch(() => { });
                                        }
                                    }}
                                >
                                    <Maximize size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="border-t p-3 flex items-center justify-between z-40 px-6" style={{ backgroundColor: 'rgba(253,246,238,0.95)', borderColor: '#c9956a30' }}>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: '#a0785a' }}>Signal: Active</span>
                        </div>
                        <div className="h-3 w-px" style={{ backgroundColor: '#c9956a30' }} />
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: '#8b5e3c' }}>Live Channel</span>
                    </div>
                    <div className="text-[9px] font-mono uppercase tracking-[0.2em]" style={{ color: '#a0785a' }}>Latency: Optimized</div>
                </div>
            </div>

            {/* Chat Section */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col h-[50vh] md:h-full" style={{ backgroundColor: '#f0e6d3', borderLeft: '1px solid #c9956a30' }}>
                <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: '#c9956a25' }}>
                    <h3 className="font-bold tracking-widest text-xs uppercase" style={{ color: '#3b2a1a' }}>LIVE CHAT</h3>
                    <div className="flex items-center text-xs font-bold gap-1 px-2 py-1 rounded" style={{ color: '#7a9e7e', backgroundColor: 'rgba(122,158,126,0.1)' }}>
                        <Users size={12} /> {viewerCount.toLocaleString()}
                    </div>
                </div>
                <div id="chat-messages" className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar scroll-smooth" style={{ backgroundColor: '#fdf6ee' }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className="text-sm">
                            <span className="font-bold mr-2" style={{ color: msg.user === 'Admin' ? '#c9956a' : '#8b5e3c' }}>{msg.user}:</span>
                            <span className="break-words font-medium" style={{ color: '#5a3e28' }}>{msg.text}</span>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSend} className="p-4 border-t" style={{ borderColor: '#c9956a25', backgroundColor: '#f0e6d3' }}>
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full rounded-full pl-4 pr-10 py-2.5 text-sm outline-none transition-all"
                            style={{ backgroundColor: '#fdf6ee', border: '1px solid #c9956a40', color: '#3b2a1a' }}
                            placeholder="Type message..."
                        />
                        <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors" style={{ color: '#a0785a' }}>
                            <Send size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Streaming;
