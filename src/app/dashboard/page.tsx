"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Sparkles, X, Search, Clock, CheckCircle2, AlertCircle, Save } from "lucide-react";

interface Note {
    _id: string;
    title: string;
    content: string;
    updatedAt: string;
}

interface Notification {
    id: number;
    message: string;
    type: "success" | "error" | "update" | "delete";
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    // Edit state for the Popup
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    const [newNote, setNewNote] = useState({ title: "", content: "" });
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        } else if (status === "authenticated") {
            fetchNotes();
        }
    }, [status, router]);

    const addNotification = (message: string, type: "success" | "error" | "update" | "delete" = "success") => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    };

    const fetchNotes = async () => {
        try {
            const res = await fetch("/api/notes");
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setNotes(data);
            }
        } catch (err) {
            console.error("Failed to fetch notes");
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async () => {
        if (!newNote.title.trim()) {
            addNotification("Please enter a title", "error");
            return;
        }

        const tempId = Date.now().toString();
        const optimisticNote: Note = {
            _id: tempId,
            title: newNote.title,
            content: newNote.content,
            updatedAt: new Date().toISOString(),
        };

        setNotes(prev => [optimisticNote, ...prev]);
        setIsAdding(false);
        setNewNote({ title: "", content: "" });

        try {
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: optimisticNote.title, content: optimisticNote.content }),
            });
            const data = await res.json();
            if (res.ok) {
                setNotes(prev => prev.map(n => n._id === tempId ? data : n));
                addNotification("Note saved instantly!", "success");
            } else {
                setNotes(prev => prev.filter(n => n._id !== tempId));
                addNotification("Failed to save note", "error");
            }
        } catch (err) {
            setNotes(prev => prev.filter(n => n._id !== tempId));
            addNotification("Network error", "error");
        }
    };

    const handleUpdateNote = async () => {
        if (!editingNote) return;
        const { _id: id, title, content } = editingNote;
        const oldNote = notes.find(n => n._id === id);
        if (!oldNote) return;

        // Optimistic Update in main list
        setNotes(prev => prev.map(n => n._id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n));
        setEditingNote(null);

        try {
            const res = await fetch(`/api/notes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });
            if (!res.ok) {
                setNotes(prev => prev.map(n => n._id === id ? oldNote : n));
                addNotification("Failed to update", "error");
            } else {
                addNotification("Note updated!", "update");
            }
        } catch (err) {
            setNotes(prev => prev.map(n => n._id === id ? oldNote : n));
            addNotification("Network error", "error");
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmId) return;
        const idToDelete = deleteConfirmId;
        const oldNote = notes.find(n => n._id === idToDelete);

        setNotes(prev => prev.filter(n => n._id !== idToDelete));
        setDeleteConfirmId(null);

        try {
            const res = await fetch(`/api/notes/${idToDelete}`, { method: "DELETE" });
            if (!res.ok) {
                if (oldNote) setNotes(prev => [oldNote, ...prev]);
                addNotification("Failed to delete", "error");
            } else {
                addNotification("Note deleted!", "delete");
            }
        } catch (err) {
            if (oldNote) setNotes(prev => [oldNote, ...prev]);
            addNotification("Network error", "error");
        }
    };

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.content.toLowerCase().includes(search.toLowerCase())
    );

    if (status === "loading" || loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div className="animate-pulse" style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>Loading Workspace...</div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 10px' }}>
            {/* Notifications */}
            <div style={{
                position: 'fixed',
                top: '100px',
                right: '20px',
                zIndex: 2500,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxWidth: 'calc(100vw - 40px)'
            }}>
                <AnimatePresence mode="popLayout">
                    {notifications.map(notification => {
                        const colors = {
                            success: "#22c55e",
                            update: "#fbbf24",
                            delete: "#ef4444",
                            error: "#ef4444"
                        };
                        const color = colors[notification.type];
                        const textColor = notification.type === 'update' ? '#000000' : '#ffffff';

                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                                style={{
                                    padding: '12px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    minWidth: '220px',
                                    background: color,
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                                    color: textColor,
                                }}
                            >
                                {notification.type === 'success' && <CheckCircle2 size={18} />}
                                {notification.type === 'update' && <Edit3 size={18} />}
                                {notification.type === 'delete' && <Trash2 size={18} />}
                                {notification.type === 'error' && <AlertCircle size={18} />}
                                <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{notification.message}</span>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div className="modal-backdrop" onClick={() => setDeleteConfirmId(null)} style={{ padding: '20px', zIndex: 2000 }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="solid-card"
                            style={{ padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ color: '#ef4444', marginBottom: '20px' }}>
                                <Trash2 size={48} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '12px', color: 'white' }}>Delete Persistent?</h2>
                            <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>This note will be permanently removed from Ramyoz cloud storage.</p>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button onClick={handleConfirmDelete} className="btn-primary" style={{ flex: 1, minWidth: '120px', background: '#ef4444' }}>Confirm Delete</button>
                                <button onClick={() => setDeleteConfirmId(null)} className="btn-secondary" style={{ flex: 1, minWidth: '120px' }}>Keep Note</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Note Popup Modal */}
            <AnimatePresence>
                {editingNote && (
                    <div className="modal-backdrop" onClick={() => setEditingNote(null)} style={{ padding: '20px', zIndex: 2000 }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="solid-card"
                            style={{ padding: '32px', maxWidth: '600px', width: '100%', position: 'relative' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => setEditingNote(null)} style={{ position: 'absolute', top: '24px', right: '24px', color: 'var(--muted)' }}>
                                <X size={24} />
                            </button>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'white', fontWeight: '800' }}>Edit Note</h2>
                            <input
                                value={editingNote.title}
                                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                                placeholder="Title"
                                style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', color: 'white', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}
                            />
                            <textarea
                                value={editingNote.content}
                                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                                placeholder="Content"
                                style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', color: 'var(--muted)', minHeight: '200px', resize: 'none', fontSize: '1.1rem', lineHeight: '1.6' }}
                            />
                            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                                <button onClick={handleUpdateNote} className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <Save size={20} /> Save Changes
                                </button>
                                <button onClick={() => setEditingNote(null)} className="btn-secondary" style={{ padding: '12px 24px' }}>Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <header className="dashboard-header" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
                flexWrap: 'wrap',
                gap: '20px',
                padding: '16px 0'
            }}>
                <div style={{ flex: 1, minWidth: '240px' }}>
                    <h1 className="vault-title" style={{ fontWeight: '900', letterSpacing: '-1.5px', lineHeight: 1 }}>Personal Vault</h1>
                    <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginTop: '4px' }}>Welcome back, {session?.user?.name?.split(' ')[0]}</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', width: '100%', maxWidth: '440px', flexWrap: 'wrap' }}>
                    <div className="glass-card" style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '180px' }}>
                        <Search size={18} color="var(--muted)" />
                        <input
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ background: 'none', border: 'none', color: 'white', fontSize: '0.9rem', width: '100%' }}
                        />
                    </div>
                    <button onClick={() => setIsAdding(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem' }}>
                        <Plus size={18} /> <span style={{ fontWeight: 600 }}>Create</span>
                    </button>
                </div>
            </header>

            <style jsx>{`
        .vault-title {
          font-size: 2.5rem;
        }
        @media (max-width: 767px) {
          .vault-title { font-size: 1.75rem; }
          .dashboard-header { margin-bottom: 24px !important; }
        }
      `}</style>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="solid-card"
                        style={{ padding: '32px', marginBottom: '48px', position: 'relative', border: '1px solid var(--accent)' }}
                    >
                        <button onClick={() => setIsAdding(false)} style={{ position: 'absolute', top: '24px', right: '24px', color: 'var(--muted)' }}>
                            <X size={24} />
                        </button>
                        <input
                            placeholder="Note Title"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                            style={{ display: 'block', width: '100%', background: 'none', border: 'none', fontSize: '1.8rem', fontWeight: '900', color: 'white', marginBottom: '16px', letterSpacing: '-0.5px' }}
                            autoFocus
                        />
                        <textarea
                            placeholder="Start typing..."
                            value={newNote.content}
                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                            style={{ display: 'block', width: '100%', background: 'none', border: 'none', fontSize: '1.2rem', color: 'var(--muted)', minHeight: '160px', resize: 'none', lineHeight: '1.6' }}
                        />
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button onClick={handleAddNote} className="btn-primary" style={{ padding: '12px 32px' }}>Save to Vault</button>
                            <button onClick={() => setIsAdding(false)} className="btn-secondary" style={{ padding: '12px 32px' }}>Discard</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: '24px' }}>
                {filteredNotes.map((note: Note) => (
                    <motion.div
                        layout
                        key={note._id}
                        className="glass-card"
                        style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(255,255,255,0.03)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', wordBreak: 'break-word', letterSpacing: '-0.3px' }}>{note.title}</h3>
                            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                <button
                                    onClick={() => setEditingNote(note)}
                                    style={{ color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}
                                    title="Modify"
                                >
                                    <Edit3 size={20} />
                                </button>
                                <button
                                    onClick={() => setDeleteConfirmId(note._id)}
                                    style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.05)', padding: '10px', borderRadius: '12px' }}
                                    title="Purge"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', flex: 1 }}>{note.content}</p>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--muted)', opacity: 0.7, paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <Clock size={14} />
                            <span>
                                {new Date(note.updatedAt).toLocaleDateString()} — {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredNotes.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '140px 0', opacity: 0.2 }}>
                    <Sparkles size={60} style={{ marginBottom: '24px' }} />
                    <p style={{ fontSize: '1.4rem', fontWeight: 600 }}>No signals found in your vault.</p>
                </div>
            )}
        </div>
    );
}
