import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Ramyoz Notes Application",
  description: "A premium, instant note-taking experience with secure Google Authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main style={{ padding: '0 16px 40px 16px' }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
