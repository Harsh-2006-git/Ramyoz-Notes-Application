"use client";

import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Lock, Zap, Shield, Mail, Key, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingUI() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (isLogin) {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("Invalid email or password");
                setLoading(false);
            } else {
                router.push("/dashboard");
            }
        } else {
            try {
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Registration failed");
                }

                // Auto login after registration
                const loginRes = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                });

                if (loginRes?.error) {
                    setError("Registered successfully, but login failed.");
                    setLoading(false);
                } else {
                    router.push("/dashboard");
                }
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        }
    };

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
                        margin: '0 auto 40px auto',
                        lineHeight: '1.4',
                        fontWeight: '400'
                    }}>
                        A high-performance workspace designed for your most valuable thoughts.
                        Secure, instant, and refined for the modern age.
                    </p>

                    {/* Auth Form Container */}
                    <div className="auth-container" style={{
                        maxWidth: '400px',
                        margin: '0 auto',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        padding: '32px',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
                    }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px', color: 'white' }}>
                            {isLogin ? 'Welcome Back' : 'Create an Account'}
                        </h2>

                        {error && (
                            <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <AnimatePresence>
                                {!isLogin && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}
                                    >
                                        <label style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Full Name</label>
                                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px' }}>
                                            <User size={18} style={{ color: 'var(--muted)', marginRight: '12px' }} />
                                            <input 
                                                type="text" 
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                                required={!isLogin}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Email Address</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px' }}>
                                    <Mail size={18} style={{ color: 'var(--muted)', marginRight: '12px' }} />
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                                <label style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Password</label>
                                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px' }}>
                                    <Key size={18} style={{ color: 'var(--muted)', marginRight: '12px' }} />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none' }}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary"
                                style={{
                                    fontSize: '1rem',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    marginTop: '8px',
                                    opacity: loading ? 0.7 : 1,
                                    cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                            </button>
                        </form>

                        <div style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--muted)' }}>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button 
                                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                                style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                {isLogin ? "Sign Up" : "Log In"}
                            </button>
                        </div>
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
          padding: 80px 20px;
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
          .hero-section { padding: 40px 16px; }
          .hero-title { font-size: 2.75rem; letter-spacing: -2px; border-bottom: 24px; }
          .hero-desc { font-size: 1.05rem; }
          .features-section { padding: 40px 16px; }
          .auth-container { padding: 24px !important; width: 100%; border-radius: 20px !important; }
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
