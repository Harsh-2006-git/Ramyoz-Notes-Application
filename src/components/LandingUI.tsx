"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, Lock, Globe, MessageSquare } from "lucide-react";
import GoogleSignIn from "./GoogleSignIn";

export default function LandingUI({ googleClientId }: { googleClientId: string }) {
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', justifyContent: 'center' }}>
                        <GoogleSignIn clientId={googleClientId} />
                        
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
