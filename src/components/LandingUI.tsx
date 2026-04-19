"use client";

import { motion } from "framer-motion";
import { Sparkles, Lock, Zap, Shield, ArrowRight } from "lucide-react";
import AuthForm from "./AuthForm";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingUI() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        
        // Initial check
        checkMobile();
        
        // Listen for resize
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{ minHeight: '90vh', overflow: 'hidden' }}>
            {/* Hero Section */}
            <section className="hero-section" style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: isMobile ? '40px' : '80px',
                alignItems: 'center',
                position: 'relative',
                paddingTop: isMobile ? '60px' : '120px',
                paddingBottom: '80px'
            }}>
                {/* Left Column: Hero Text */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: isMobile ? 'center' : 'left' }}
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
                        lineHeight: '1',
                        marginBottom: '28px',
                        letterSpacing: '-2px',
                        color: 'white',
                        fontSize: isMobile ? '3.5rem' : '5.5rem'
                    }}>
                        Ramyoz <br />
                        <span style={{
                            background: 'linear-gradient(to right, #8b5cf6, #d946ef, #3b82f6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>Notes.</span>
                    </h1>

                    <p className="hero-desc" style={{
                        color: 'var(--muted)',
                        maxWidth: 'var(--desc-width, 600px)',
                        margin: isMobile ? '0 auto 40px auto' : '0 0 40px 0',
                        lineHeight: '1.6',
                        fontSize: '1.25rem',
                        fontWeight: '400'
                    }}>
                        A high-performance workspace designed for your most valuable thoughts.
                        Secure, instant, and refined for the modern age.
                    </p>

                    {isMobile && (
                        <Link href="/auth" style={{ textDecoration: 'none' }}>
                            <button
                                className="btn-primary"
                                style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    padding: '18px 40px',
                                    borderRadius: '16px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    boxShadow: '0 12px 35px rgba(139, 92, 246, 0.4)'
                                }}
                            >
                                Get Started <ArrowRight size={20} />
                            </button>
                        </Link>
                    )}
                </motion.div>

                {/* Right Column: Auth Form (Desktop Only) */}
                {!isMobile && (
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                    >
                        <div style={{ width: '100%', maxWidth: '450px' }}>
                            <AuthForm />
                        </div>
                    </motion.div>
                )}

                {/* Floating background blur elements */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '5%',
                    width: '500px',
                    height: '500px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    filter: 'blur(120px)',
                    zIndex: -1
                }}></div>
            </section>

            {/* Features Grid */}
            <section className="features-section" style={{
                maxWidth: '1400px',
                margin: '0 auto',
                paddingTop: '60px'
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
          padding: 0 20px;
        }
        .features-section {
          padding: 60px 20px;
        }
        @media (max-width: 1200px) {
          .hero-title { font-size: 4.5rem !important; }
        }
        @media (max-width: 1024px) {
          .hero-title { font-size: 3.5rem !important; }
        }
        @media (max-width: 767px) {
          .hero-title { font-size: 3rem !important; letter-spacing: -2px; }
          .hero-desc { font-size: 1.05rem; }
          .features-section { padding: 40px 16px; }
          :global(:root) {
            --tag-font: 0.8rem;
            --desc-width: 100%;
            --feature-padding: 32px;
          }
        }
      `}</style>
        </div>
    );
}
