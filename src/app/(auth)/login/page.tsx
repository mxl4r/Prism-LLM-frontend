'use client';

import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4 md:p-6 relative z-20">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-prism-accent text-white shadow-lg mb-4">
            <svg viewBox="0 0 512 512" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32">
              <path d="M229.73,45.88,37.53,327.79a31.79,31.79,0,0,0,11.31,46L241,476.26a31.77,31.77,0,0,0,29.92,0l192.2-102.51a31.79,31.79,0,0,0,11.31-46L282.27,45.88A31.8,31.8,0,0,0,229.73,45.88Z" />
              <line x1="256" y1="32" x2="256" y2="480" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome to Prism</h1>
          <p className="text-slate-500 mt-2">Your AI-powered conversation assistant</p>
        </div>

        <Card className="bg-white/60 backdrop-blur-2xl border-white/60 shadow-xl w-full">
          <div className="flex flex-col gap-4">
            {/* Primary CTA: Start chatting */}
            <Button
              variant="primary"
              className="w-full h-12 text-base flex items-center justify-center gap-2"
              onClick={() => router.push('/chat')}
            >
              <Sparkles size={18} />
              Start Chatting
              <ArrowRight size={18} className="ml-1" />
            </Button>

            <div className="relative my-2">
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

        <div className="mt-8 text-center flex items-center justify-center gap-2 text-slate-400 text-sm">
          <Sparkles size={14} />
          <span>Powered by Prism AI Gateway</span>
        </div>
      </div>
    </div>
  );
}