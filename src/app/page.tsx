"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, Lock, Globe, MessageSquare } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") return null;

  return (
    <div style={{ minHeight: '90vh', overflow: 'hidden' }}>
      {/* Hero Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 16px',
        position: 'relative'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1), rgba(217, 70, 239, 0.1))',
            borderRadius: '100px',
            color: 'var(--accent)',
            fontSize: '0.75rem',
            fontWeight: '800',
            marginBottom: '24px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            <Sparkles size={12} />
            <span>Premium Intelligence</span>
          </div>

          <h1 className="hero-title" style={{
            fontWeight: '950',
            lineHeight: '0.95',
            marginBottom: '20px',
            letterSpacing: '-3px',
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
            maxWidth: '600px',
            margin: '0 auto 40px auto',
            lineHeight: '1.5',
            fontWeight: '400'
          }}>
            A high-performance workspace designed for your most valuable thoughts.
            Secure, instant, and refined.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => signIn("google")}
              className="btn-primary"
              style={{
                fontSize: '0.95rem',
                padding: '14px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '14px',
                boxShadow: '0 8px 30px rgba(139, 92, 246, 0.3)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
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
                fontSize: '0.95rem',
                padding: '14px 28px',
                borderRadius: '14px'
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
          left: '10%',
          width: '250px',
          height: '250px',
          background: 'rgba(139, 92, 246, 0.15)',
          filter: 'blur(80px)',
          zIndex: -1
        }}></div>
      </section>

      {/* Features Grid */}
      <section style={{
        padding: '40px 16px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {[
            { icon: <Lock />, title: "Secure Storage", desc: "Enterprise-grade encryption for your digital thoughts." },
            { icon: <Zap />, title: "Instant Sync", desc: "Metadata mirroring across all your authorized devices." },
            { icon: <Shield />, title: "Privacy First", desc: "No tracking. No ads. Just your thoughts in the vault." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="solid-card"
              style={{ padding: '32px', border: '1px solid rgba(255,255,255,0.03)' }}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(139, 92, 246, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                marginBottom: '20px'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '10px', color: 'white' }}>{feature.title}</h3>
              <p style={{ color: 'var(--muted)', lineHeight: '1.5', fontSize: '0.9rem' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer style={{
        padding: '60px 16px',
        textAlign: 'center',
        opacity: 0.5,
        fontSize: '0.8rem',
        letterSpacing: '2px'
      }}>
        © 2026 RAMYOZ NOTES APPLICATION. ALL SIGNALS SECURED.
      </footer>

      <style jsx>{`
        .hero-title {
          font-size: 3.5rem;
        }
        .hero-desc {
          font-size: 1.25rem;
        }
        @media (max-width: 767px) {
          .hero-title { font-size: 2.5rem; letter-spacing: -2px; }
          .hero-desc { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}
