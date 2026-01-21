import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { Card } from '../ui/Card';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface LoginPageProps {
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // Redirect back to this app
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 relative z-20">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-prism-accent text-white shadow-lg mb-4">
               <svg viewBox="0 0 512 512" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32">
                  <path d="M229.73,45.88,37.53,327.79a31.79,31.79,0,0,0,11.31,46L241,476.26a31.77,31.77,0,0,0,29.92,0l192.2-102.51a31.79,31.79,0,0,0,11.31-46L282.27,45.88A31.8,31.8,0,0,0,229.73,45.88Z" />
                  <line x1="256" y1="32" x2="256" y2="480" />
               </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome to Prism</h1>
            <p className="text-slate-500 mt-2">Sign in to continue your conversation</p>
        </div>

        <Card className="bg-white/60 backdrop-blur-2xl border-white/60 shadow-xl">
          <div className="flex flex-col gap-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                {error}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="group relative flex items-center justify-center gap-3 w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/60"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-slate-400 font-medium tracking-wider">or</span>
              </div>
            </div>

            <Button variant="ghost" onClick={onBack} className="text-sm">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </div>
        </Card>
        
        <div className="mt-8 text-center flex items-center justify-center gap-2 text-slate-400 text-sm">
            <Sparkles size={14} />
            <span>Secured by Supabase</span>
        </div>
      </div>
    </div>
  );
};