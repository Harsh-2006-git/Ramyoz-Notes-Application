"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Trash2, Edit3, X, Search, Clock,
    CheckCircle2, AlertCircle, Save, Sparkles,
    Layout, Calendar, Hash, Zap, StickyNote
} from "lucide-react";

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

export default function DashboardUI({ initialNotes }: { initialNotes: any[] }) {
    const { data: session } = useSession();
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [newNote, setNewNote] = useState({ title: "", content: "" });
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const addNotification = (message: string, type: "success" | "error" | "update" | "delete" = "success") => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
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
                addNotification("Note saved successfully", "success");
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
                addNotification("Update failed", "error");
            } else {
                addNotification("Note updated", "update");
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
                addNotification("Deletion failed", "error");
            } else {
                addNotification("Note deleted", "delete");
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

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
            {/* Notifications */}
            <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 5000, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence mode="popLayout">
                    {notifications.map(notification => {
                        const colors = { success: "#22c55e", update: "#fbbf24", delete: "#ef4444", error: "#ef4444" };
                        const color = colors[notification.type];
                        return (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.8, x: 50 }}
                                style={{
                                    padding: '16px 24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    background: color,
                                    borderRadius: '16px',
                                    boxShadow: `0 10px 40px ${color}44`,
                                    color: notification.type === 'update' ? '#000' : '#fff',
                                    fontWeight: 800,
                                    fontSize: '0.95rem'
                                }}
                            >
                                {notification.type === 'success' && <CheckCircle2 size={20} />}
                                {notification.type === 'update' && <Edit3 size={20} />}
                                {notification.type === 'delete' && <Trash2 size={20} />}
                                {notification.type === 'error' && <AlertCircle size={20} />}
                                {notification.message}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Compact Hero Section */}
            <section className="dashboard-hero" style={{
                padding: 'var(--dashboard-hero-padding, 40px)',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(217, 70, 239, 0.04))',
                borderRadius: '24px',
                marginBottom: '32px',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '24px'
            }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                        <Sparkles size={14} /> Welcome back, {session?.user?.name?.split(' ')[0]}
                    </div>
                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 950, marginBottom: '12px', letterSpacing: '-1.5px', lineHeight: 1 }}>
                        Ramyoz <span style={{ color: 'var(--accent)' }}>Notes</span>
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: '450px', lineHeight: 1.5, marginBottom: '24px' }}>
                        Your secure digital workspace for capturing ideas and organizing thoughts.
                    </p>

                    <div style={{ display: 'flex', gap: '32px' }}>
                        <div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{notes.length}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Notes</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Captured Today</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '400px' }}>
                    <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={20} color="var(--accent)" />
                        <input
                            placeholder="Search your notes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ background: 'none', border: 'none', color: 'white', fontSize: '1rem', width: '100%', fontWeight: 500 }}
                        />
                    </div>
                    <button onClick={() => setIsAdding(true)} className="btn-primary" style={{ padding: '16px', borderRadius: '16px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)' }}>
                        <Plus size={22} /> Create New Note
                    </button>
                </div>
            </section>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: '24px', marginBottom: '60px' }}>
                {filteredNotes.map((note) => (
                    <motion.div
                        layout
                        key={note._id}
                        className="glass-card"
                        whileHover={{ y: -5, borderColor: 'rgba(139, 92, 246, 0.3)' }}
                        style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '18px', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s ease' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px' }}>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', wordBreak: 'break-word', color: 'white', lineHeight: 1.3 }}>{note.title}</h3>
                            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                <button
                                    onClick={() => setEditingNote(note)}
                                    style={{ color: 'var(--muted)', background: 'rgba(255,255,255,0.04)', padding: '8px', borderRadius: '10px' }}
                                    className="icon-btn"
                                >
                                    <Edit3 size={18} />
                                </button>
                                <button
                                    onClick={() => setDeleteConfirmId(note._id)}
                                    style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.04)', padding: '8px', borderRadius: '10px' }}
                                    className="icon-btn"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', flex: 1, opacity: 0.8 }}>{note.content}</p>
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.8rem', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', opacity: 0.6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={12} /> {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={12} /> {new Date(note.updatedAt).toLocaleDateString()}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredNotes.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.15 }}>
                    <StickyNote size={64} style={{ marginBottom: '20px' }} />
                    <p style={{ fontSize: '1.25rem', fontWeight: 900 }}>NO NOTES FOUND</p>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {isAdding && (
                    <div className="modal-backdrop" style={{ zIndex: 3000 }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="solid-card" style={{ padding: '32px', maxWidth: '650px', width: '95%', border: '2px solid var(--accent)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Plus size={22} color="var(--accent)" /> Create New Note
                                </h2>
                                <button onClick={() => setIsAdding(false)} style={{ color: 'var(--muted)' }}><X size={24} /></button>
                            </div>
                            <input placeholder="Note Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', fontSize: '1.25rem', fontWeight: '800', color: 'white', marginBottom: '16px', padding: '16px', borderRadius: '12px' }} autoFocus />
                            <textarea placeholder="Start typing your note..." value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', fontSize: '1.1rem', color: 'var(--muted)', minHeight: '200px', resize: 'none', padding: '16px', borderRadius: '12px', lineHeight: '1.5' }} />
                            <button onClick={handleAddNote} className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '16px', fontSize: '1rem' }}>Save Note</button>
                        </motion.div>
                    </div>
                )}

                {editingNote && (
                    <div className="modal-backdrop" style={{ zIndex: 3000 }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="solid-card" style={{ padding: '32px', maxWidth: '650px', width: '95%', border: '2px solid #fbbf24' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Edit3 size={22} color="#fbbf24" /> Edit Note
                                </h2>
                                <button onClick={() => setEditingNote(null)} style={{ color: 'var(--muted)' }}><X size={24} /></button>
                            </div>
                            <input value={editingNote.title} onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', color: 'white', fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px' }} />
                            <textarea value={editingNote.content} onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', color: 'var(--muted)', minHeight: '200px', resize: 'none', fontSize: '1.1rem', lineHeight: '1.5' }} />
                            <button onClick={handleUpdateNote} className="btn-primary" style={{ width: '100%', padding: '16px', marginTop: '16px', background: '#fbbf24', color: '#000', fontSize: '1rem', boxShadow: '0 8px 25px rgba(251, 191, 36, 0.2)' }}>Save Changes</button>
                        </motion.div>
                    </div>
                )}

                {deleteConfirmId && (
                    <div className="modal-backdrop" style={{ zIndex: 4000 }}>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="solid-card" style={{ padding: '40px', maxWidth: '400px', width: '95%', textAlign: 'center', border: '1px solid #ef4444' }}>
                            <Trash2 size={48} color="#ef4444" style={{ marginBottom: '20px' }} />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', color: 'white' }}>DELETE NOTE?</h2>
                            <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>This action cannot be undone. Your note will be permanently removed.</p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={handleConfirmDelete} className="btn-primary" style={{ flex: 1, padding: '14px', background: '#ef4444', border: 'none', fontSize: '0.95rem' }}>Delete</button>
                                <button onClick={() => setDeleteConfirmId(null)} className="btn-secondary" style={{ flex: 1, padding: '14px', fontSize: '0.95rem' }}>Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
        @media (max-width: 767px) {
          :global(:root) {
            --dashboard-hero-padding: 30px 20px;
          }
        }
      `}</style>
        </div>
    );
}
