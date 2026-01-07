"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, Lock, Globe, MessageSquare } from "lucide-react";

export default function LandingUI() {
    return (
        <div style={{ minHeight: '90vh', overflow: 'hidden' }}>
            {/* Hero Section */}
            <section className="hero-section" style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.3s ease'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 18px',
                        background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1))',
                        borderRadius: '100px',
                        color: 'var(--accent)',
                        fontSize: 'var(--tag-font, 0.9rem)',
                        fontWeight: '900',
                        marginBottom: '32px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        <Sparkles size={16} />
                        <span>Premium Intelligence</span>
                    </div>

                    <h1 className="hero-title" style={{
                        fontWeight: '1000',
                        lineHeight: '0.9',
                        marginBottom: '28px',
                        letterSpacing: '-4px',
                        color: 'white'
                    }}>
                        Ramyoz <br />
                        <span style={{
                            background: 'linear-gradient(to right, #8b5cf6, #d946ef, #3b82f6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>Notes Application.</span>
                    </h1>

                    <p className="hero-desc" style={{
                        color: 'var(--muted)',
                        maxWidth: 'var(--desc-width, 800px)',
                        margin: '0 auto 50px auto',
                        lineHeight: '1.4',
                        fontWeight: '400'
                    }}>
                        A high-performance workspace designed for your most valuable thoughts.
                        Secure, instant, and refined for the modern age.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => signIn("google")}
                            className="btn-primary"
                            style={{
                                fontSize: 'var(--btn-font, 1.1rem)',
                                padding: 'var(--btn-padding, 18px 40px)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                borderRadius: '16px',
                                boxShadow: '0 12px 35px rgba(139, 92, 246, 0.4)'
                            }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335" />
                            </svg>
                            Sign In with Google
                        </button>
                        <button
                            className="btn-secondary"
                            style={{
                                fontSize: 'var(--btn-font, 1.1rem)',
                                padding: 'var(--btn-padding, 18px 40px)',
                                borderRadius: '16px'
                            }}
                        >
                            Explore Tech
                        </button>
                    </div>
                </motion.div>

                {/* Floating background blur elements */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '5%',
                    width: '400px',
                    height: '400px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    filter: 'blur(100px)',
                    zIndex: -1
                }}></div>
            </section>

            {/* Features Grid */}
            <section className="features-section" style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '32px'
                }}>
                    {[
                        { icon: <Lock size={28} />, title: "Secure Storage", desc: "Enterprise-grade encryption for your digital thoughts. Your privacy is our priority." },
                        { icon: <Zap size={28} />, title: "Instant Sync", desc: "Metadata mirroring across all your authorized devices. Work from anywhere." },
                        { icon: <Shield size={28} />, title: "Privacy First", desc: "No tracking. No ads. Just your thoughts in a secure digital space." }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="solid-card"
                            style={{ padding: 'var(--feature-padding, 48px)', border: '1px solid rgba(255,255,255,0.03)' }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: 'rgba(139, 92, 246, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent)',
                                marginBottom: '24px'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '16px', color: 'white' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--muted)', lineHeight: '1.6', fontSize: '1rem' }}>{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            <footer style={{
                padding: '80px 20px',
                textAlign: 'center',
                opacity: 0.5,
                fontSize: '0.9rem',
                letterSpacing: '3px',
                fontWeight: 'bold'
            }}>
                © 2026 RAMYOZ NOTES APPLICATION. ALL DATA SECURED.
            </footer>

            <style jsx>{`
        .hero-section {
          padding: 100px 20px;
        }
        .hero-title {
          font-size: 5rem;
        }
        .hero-desc {
          font-size: 1.5rem;
        }
        .features-section {
          padding: 60px 20px;
        }
        @media (max-width: 1200px) {
          .hero-title { font-size: 4rem; }
          .hero-desc { font-size: 1.25rem; }
        }
        @media (max-width: 767px) {
          .hero-section { padding: 60px 16px; }
          .hero-title { font-size: 2.75rem; letter-spacing: -2px; }
          .hero-desc { font-size: 1.05rem; }
          .features-section { padding: 40px 16px; }
          :global(:root) {
            --btn-font: 0.95rem;
            --btn-padding: 14px 28px;
            --tag-font: 0.8rem;
            --desc-width: 100%;
            --feature-padding: 32px;
          }
        }
      `}</style>
        </div>
    );
}
