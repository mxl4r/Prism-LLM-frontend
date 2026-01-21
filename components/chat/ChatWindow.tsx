import React, { useEffect, useRef } from 'react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';
import { Sparkles } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-prism-accent to-blue-600 flex items-center justify-center mb-6 shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
          <Sparkles size={40} className="relative z-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">
          Hello, I'm <span className="text-prism-accent">Prism</span>
        </h1>
        <p className="text-slate-500 max-w-md mx-auto text-lg font-light leading-relaxed">
          How can I help you explore your ideas today?
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2 scrollbar-hide">
      <div className="max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start w-full animate-fade-in">
             <div className="flex max-w-[75%] gap-3 flex-row">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-white/50 bg-prism-accent text-white">
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                <div className="px-5 py-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 rounded-tl-sm flex items-center gap-1.5 h-12">
                  <div className="w-1.5 h-1.5 bg-prism-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-1.5 h-1.5 bg-prism-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 bg-prism-accent/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
             </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
};