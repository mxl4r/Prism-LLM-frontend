'use client';

import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useRouter } from 'next/navigation';

/** Google "G" logo as an inline SVG */
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://system.prism-llm.tech:8080';

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 md:p-6 relative z-20">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-prism-accent text-white shadow-xl shadow-prism-accent/20 mb-5">
            <svg viewBox="0 0 512 512" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32">
              <path d="M229.73,45.88,37.53,327.79a31.79,31.79,0,0,0,11.31,46L241,476.26a31.77,31.77,0,0,0,29.92,0l192.2-102.51a31.79,31.79,0,0,0,11.31-46L282.27,45.88A31.8,31.8,0,0,0,229.73,45.88Z" />
              <line x1="256" y1="32" x2="256" y2="480" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome to Prism</h1>
          <p className="text-slate-500 mt-2 leading-relaxed">Sign in to start your AI-powered conversation</p>
        </div>

        <Card className="bg-white/60 backdrop-blur-2xl border-white/60 shadow-xl w-full">
          <div className="flex flex-col gap-4">
            {/* Primary CTA: Continue with Google */}
            <button
              onClick={handleGoogleLogin}
              className="
                w-full h-12 text-base flex items-center justify-center gap-3
                bg-white hover:bg-slate-50
                border border-slate-200 hover:border-slate-300
                rounded-2xl font-medium text-slate-700
                shadow-sm hover:shadow-md
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-prism-accent/20
              "
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/60"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-slate-400 font-medium tracking-wider">or</span>
              </div>
            </div>

            <Button variant="ghost" onClick={() => router.push('/')} className="text-sm w-full">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
            By continuing, you agree to Prism&apos;s Terms of Service and Privacy Policy.
          </p>
        </div>

        <div className="mt-4 text-center flex items-center justify-center gap-2 text-slate-400 text-sm">
          <Sparkles size={14} />
          <span>Powered by Prism AI Gateway</span>
        </div>
      </div>
    </div>
  );
}