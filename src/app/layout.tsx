import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prism AI - Clarity in Conversation",
  description: "Experience the next generation of AI with a minimalist, liquid glass interface.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} selection:bg-prism-accent/20`}>
        {/* Dynamic Background Blobs for Liquid Feel - Global */}
        <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob -z-10" />
        <div className="fixed top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 -z-10" />
        <div className="fixed bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-sky-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 -z-10" />
        
        {children}
      </body>
    </html>
  );
}