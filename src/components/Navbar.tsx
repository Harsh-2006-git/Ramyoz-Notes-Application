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
        <nav className="glass-card main-nav" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            zIndex: 1000,
            transition: 'all 0.3s ease'
        }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
                <StickyNote size={28} className="nav-logo-icon" />
                <span className="nav-title" style={{ fontWeight: '900', letterSpacing: '-0.5px' }}>Ramyoz <span className="hide-mobile">Notes Application</span></span>
            </Link>

            {/* Desktop Menu */}
            <div style={{ display: 'none', alignItems: 'center', gap: '24px' }} className="desktop-flex">
                {session ? (
                    <>
                        <Link href="/dashboard" style={{ color: 'var(--foreground)', fontWeight: '600', fontSize: '1.05rem' }}>Dashboard</Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '40px', border: '1px solid var(--card-border)' }}>
                            {session.user?.image ? (
                                <Image src={session.user.image} alt="User" width={24} height={24} style={{ borderRadius: '50%' }} />
                            ) : (
                                <User size={18} />
                            )}
                            <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>{session.user?.name}</span>
                        </div>
                        <button onClick={() => signOut()} className="btn-secondary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </>
                ) : (
                    <button onClick={() => signIn("google")} className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
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
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
                            top: '70px',
                            left: 0,
                            right: 0,
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            margin: '0',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.7)',
                            border: '1px solid var(--card-border)',
                            zIndex: 1001
                        }}
                    >
                        {session ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {session.user?.image && <Image src={session.user.image} alt="User" width={40} height={40} style={{ borderRadius: '50%' }} />}
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{session.user?.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{session.user?.email}</div>
                                    </div>
                                </div>
                                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.1rem', padding: '10px 0', fontWeight: '600' }}>Dashboard</Link>
                                <button onClick={() => { signOut(); setIsMenuOpen(false); }} className="btn-secondary" style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', width: '100%', padding: '14px' }}>
                                    <LogOut size={18} /> Logout
                                </button>
                            </>
                        ) : (
                            <button onClick={() => { signIn("google"); setIsMenuOpen(false); }} className="btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '14px' }}>
                                Get Started
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        .main-nav {
          margin: 20px 40px;
          padding: 16px 32px;
          top: 20px;
        }
        .nav-title {
          font-size: 1.5rem;
        }
        @media (min-width: 768px) {
          .desktop-flex { display: flex !important; }
          .mobile-block { display: none !important; }
        }
        @media (max-width: 767px) {
          .main-nav {
            margin: 10px 15px;
            padding: 12px 16px;
            top: 10px;
          }
          .mobile-block { display: block !important; }
          .nav-title { font-size: 1.1rem; }
          .hide-mobile { display: none; }
          .nav-logo-icon { width: 22px; height: 22px; }
        }
      `}</style>
        </nav>
    );
}
