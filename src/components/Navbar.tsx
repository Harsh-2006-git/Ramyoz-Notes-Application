"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LogOut, User, StickyNote, Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { data: session } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="glass-card" style={{
            margin: '10px 15px',
            padding: '10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '10px',
            zIndex: 1000
        }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)' }}>
                <StickyNote size={20} className="nav-logo-icon" />
                <span className="nav-title" style={{ fontWeight: '800', letterSpacing: '-0.5px' }}>Ramyoz <span className="hide-mobile">Notes</span></span>
            </Link>

            {/* Desktop Menu */}
            <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="desktop-flex">
                {session ? (
                    <>
                        <Link href="/dashboard" style={{ color: 'var(--foreground)', fontWeight: '500', fontSize: '0.9rem' }}>Dashboard</Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '30px', border: '1px solid var(--card-border)' }}>
                            {session.user?.image ? (
                                <Image src={session.user.image} alt="User" width={20} height={20} style={{ borderRadius: '50%' }} />
                            ) : (
                                <User size={16} />
                            )}
                            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{session.user?.name?.split(' ')[0]}</span>
                        </div>
                        <button onClick={() => signOut()} className="btn-secondary" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                            <LogOut size={14} />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <button onClick={() => signIn("google")} className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
                        Get Started
                    </button>
                )}
            </div>

            {/* Mobile Hamburger Icon */}
            <button
                className="mobile-block"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{ color: 'white', display: 'none', padding: '4px' }}
            >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="solid-card"
                        style={{
                            position: 'absolute',
                            top: '60px',
                            left: 0,
                            right: 0,
                            padding: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            margin: '0',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                            border: '1px solid var(--card-border)',
                            zIndex: 1001
                        }}
                    >
                        {session ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {session.user?.image && <Image src={session.user.image} alt="User" width={32} height={32} style={{ borderRadius: '50%' }} />}
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{session.user?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{session.user?.email}</div>
                                    </div>
                                </div>
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1rem', padding: '8px 0' }}>Dashboard</Link>
                                <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="btn-secondary" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', width: '100%' }}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={() => { signIn("google"); setIsMenuOpen(false); }} className="btn-primary" style={{ width: '100%', fontSize: '0.9rem' }}>
                                Get Started
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        .nav-title {
          font-size: 1.25rem;
        }
        @media (min-width: 768px) {
          .desktop-flex { display: flex !important; }
          .mobile-block { display: none !important; }
        }
        @media (max-width: 767px) {
          .mobile-block { display: block !important; }
          .nav-title { font-size: 1rem; }
          .hide-mobile { display: none; }
        }
      `}</style>
        </nav>
    );
}
