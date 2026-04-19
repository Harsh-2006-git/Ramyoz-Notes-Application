"use client";

import { useEffect, useRef } from "react";
import { signIn } from "next-auth/react";

interface GoogleSignInProps {
    clientId: string;
}

export default function GoogleSignIn({ clientId }: GoogleSignInProps) {
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!clientId) return;

        const handleCredentialResponse = async (response: any) => {
            await signIn("google-id-token", {
                idToken: response.credential,
                callbackUrl: "/dashboard",
            });
        };

        const initializeGSI = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                    cancel_on_tap_outside: true,
                });

                if (buttonRef.current) {
                    window.google.accounts.id.renderButton(buttonRef.current, {
                        type: "standard",
                        theme: "filled_blue",
                        size: "large",
                        text: "signin_with",
                        shape: "rectangular",
                        logo_alignment: "left",
                        width: "280",
                    });
                }

                // Also show One Tap prompt
                window.google.accounts.id.prompt();
            } else {
                setTimeout(initializeGSI, 100);
            }
        };

        initializeGSI();
    }, [clientId]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div ref={buttonRef}></div>
        </div>
    );
}

declare global {
    interface Window {
        google: any;
    }
}
