import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AuthPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
                <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', textDecoration: 'none', marginBottom: '24px', fontSize: '0.9rem' }}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
                
                <AuthForm />
            </div>

            {/* Floating background blur elements */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '400px',
                height: '400px',
                background: 'rgba(139, 92, 246, 0.1)',
                filter: 'blur(100px)',
                zIndex: -1,
                pointerEvents: 'none'
            }}></div>
        </div>
    );
}
