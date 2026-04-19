"use client";

import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Key, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
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
        <div className="auth-container" style={{
            maxWidth: '100%',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            padding: '40px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '24px', color: 'white', textAlign: 'center' }}>
                {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>

            {error && (
                <div style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <AnimatePresence>
                    {!isLogin && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}
                        >
                            <label style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Full Name</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 20px' }}>
                                <User size={18} style={{ color: 'var(--muted)', marginRight: '12px' }} />
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
                                    required={!isLogin}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Email Address</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 20px' }}>
                        <Mail size={18} style={{ color: 'var(--muted)', marginRight: '12px' }} />
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
                            required
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                    <label style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>Password</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px 20px' }}>
                        <Key size={18} style={{ color: 'var(--muted)', marginRight: '12px' }} />
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '1rem' }}
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
                        fontWeight: '600',
                        padding: '18px',
                        borderRadius: '12px',
                        marginTop: '12px',
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        width: '100%'
                    }}
                >
                    {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                </button>
            </form>

            <div style={{ marginTop: '30px', fontSize: '0.95rem', color: 'var(--muted)', textAlign: 'center' }}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    onClick={() => { setIsLogin(!isLogin); setError(""); }}
                    style={{ color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {isLogin ? "Sign Up" : "Log In"}
                </button>
            </div>
        </div>
    );
}
