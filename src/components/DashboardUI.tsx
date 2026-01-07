"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Trash2, Edit3, X, Search, Clock,
    CheckCircle2, AlertCircle, Save, Sparkles,
    Layout, Calendar, Hash, Zap
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
                addNotification("Signal synced to vault", "success");
            } else {
                setNotes(prev => prev.filter(n => n._id !== tempId));
                addNotification("Sync failed", "error");
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
                addNotification("Vault updated", "update");
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
                addNotification("Signal purged", "delete");
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
                                {notification.type === 'update' && <Zap size={20} />}
                                {notification.type === 'delete' && <Trash2 size={20} />}
                                {notification.type === 'error' && <AlertCircle size={20} />}
                                {notification.message}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Hero Section */}
            <section style={{
                padding: '60px 40px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.05))',
                borderRadius: '32px',
                marginBottom: '48px',
                border: '1px solid rgba(255,255,255,0.05)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '40px'
            }}>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>
                        <Sparkles size={16} /> Welcome back, Commander
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 950, marginBottom: '16px', letterSpacing: '-2px', lineHeight: 1 }}>
                        Ramyoz <span style={{ color: 'var(--accent)' }}>Dashboard</span>
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '1.2rem', maxWidth: '500px', lineHeight: 1.6 }}>
                        Your personal signal vault for high-impact thoughts.
                    </p>

                    <div style={{ display: 'flex', gap: '32px', marginTop: '40px' }}>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{notes.length}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Total Signals</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 900 }}>{session?.user?.name?.split(' ')[0]}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 600 }}>Operator</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '450px' }}>
                    <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Search size={22} color="var(--accent)" />
                        <input
                            placeholder="Search Vault..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.1rem', width: '100%', fontWeight: 500 }}
                        />
                    </div>
                    <button onClick={() => setIsAdding(true)} className="btn-primary" style={{ padding: '18px', borderRadius: '20px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                        <Plus size={24} /> Create New Signal
                    </button>
                </div>
            </section>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '28px' }}>
                {filteredNotes.map((note) => (
                    <motion.div
                        layout
                        key={note._id}
                        className="glass-card"
                        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', wordBreak: 'break-word', color: 'white' }}>{note.title}</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => setEditingNote(note)} style={{ color: 'var(--muted)', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px' }}><Edit3 size={20} /></button>
                                <button onClick={() => setDeleteConfirmId(note._id)} style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.05)', padding: '10px', borderRadius: '12px' }}><Trash2 size={20} /></button>
                            </div>
                        </div>
                        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.7', whiteSpace: 'pre-wrap', flex: 1 }}>{note.content}</p>
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(note.updatedAt).toLocaleDateString()}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isAdding && (
                    <div className="modal-backdrop" style={{ zIndex: 3000 }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="solid-card" style={{ padding: '40px', maxWidth: '700px', width: '95%', border: '2px solid var(--accent)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Initialize Signal</h2>
                                <button onClick={() => setIsAdding(false)}><X size={28} /></button>
                            </div>
                            <input placeholder="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '20px', padding: '20px', borderRadius: '16px' }} />
                            <textarea placeholder="Input metadata..." value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', fontSize: '1.2rem', color: 'var(--muted)', minHeight: '250px', resize: 'none', padding: '20px', borderRadius: '16px' }} />
                            <button onClick={handleAddNote} className="btn-primary" style={{ width: '100%', padding: '18px', marginTop: '20px' }}>Sync to Vault</button>
                        </motion.div>
                    </div>
                )}

                {editingNote && (
                    <div className="modal-backdrop" style={{ zIndex: 3000 }}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="solid-card" style={{ padding: '40px', maxWidth: '700px', width: '95%', border: '2px solid #fbbf24' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Recalibrate Signal</h2>
                                <button onClick={() => setEditingNote(null)}><X size={28} /></button>
                            </div>
                            <input value={editingNote.title} onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', color: 'white', fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }} />
                            <textarea value={editingNote.content} onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })} style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '20px', color: 'var(--muted)', minHeight: '250px', resize: 'none', fontSize: '1.2rem' }} />
                            <button onClick={handleUpdateNote} className="btn-primary" style={{ width: '100%', padding: '18px', marginTop: '20px', background: '#fbbf24', color: '#000' }}>Save Recalibration</button>
                        </motion.div>
                    </div>
                )}

                {deleteConfirmId && (
                    <div className="modal-backdrop" style={{ zIndex: 4000 }}>
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="solid-card" style={{ padding: '50px', maxWidth: '450px', width: '95%', textAlign: 'center', border: '1px solid #ef4444' }}>
                            <Trash2 size={64} color="#ef4444" style={{ marginBottom: '24px' }} />
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '12px' }}>PURGE SIGNAL?</h2>
                            <button onClick={handleConfirmDelete} className="btn-primary" style={{ width: '100%', padding: '18px', background: '#ef4444', marginTop: '20px' }}>Purge Data</button>
                            <button onClick={() => setDeleteConfirmId(null)} className="btn-secondary" style={{ width: '100%', padding: '18px', marginTop: '12px' }}>Abort</button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
