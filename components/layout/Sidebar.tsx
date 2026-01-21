import React from 'react';
import { Plus, MessageSquare, Settings, LogOut, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { ChatSession } from '../../types';
import { supabase } from '../../services/supabaseClient';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId?: string;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  sessions, 
  currentSessionId,
  onNewChat,
  onSelectSession
}) => {
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed md:relative z-50 h-full w-[280px] 
          bg-white/80 backdrop-blur-2xl border-r border-white/50
          transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 px-2">
            <div className="w-6 h-6 rounded-md bg-prism-accent flex items-center justify-center">
               <svg viewBox="0 0 512 512" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32">
                  <path d="M229.73,45.88,37.53,327.79a31.79,31.79,0,0,0,11.31,46L241,476.26a31.77,31.77,0,0,0,29.92,0l192.2-102.51a31.79,31.79,0,0,0,11.31-46L282.27,45.88A31.8,31.8,0,0,0,229.73,45.88Z" />
                  <line x1="256" y1="32" x2="256" y2="480" />
               </svg>
            </div>
            <span className="font-bold text-lg tracking-tight text-prism-accent">Prism</span>
          </div>
          <Button variant="icon" onClick={onClose} className="md:hidden">
            <X size={20} />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 mb-6">
          <Button 
            variant="secondary" 
            className="w-full justify-start gap-3 shadow-none border-dashed border-slate-300 bg-transparent hover:bg-white/60 hover:border-solid hover:border-slate-200"
            onClick={onNewChat}
          >
            <div className="bg-slate-200 p-1 rounded-md text-slate-600">
               <Plus size={14} />
            </div>
            <span>New Chat</span>
          </Button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            History
          </div>
          {sessions.length === 0 && (
             <div className="px-4 py-8 text-center text-sm text-slate-400 font-light">
                No previous conversations
             </div>
          )}
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all
                ${currentSessionId === session.id 
                  ? 'bg-white shadow-sm border border-slate-100 text-prism-accent font-medium' 
                  : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                }
              `}
            >
              <MessageSquare size={16} className="opacity-50" />
              <span className="truncate text-left">{session.title}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/50 space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 text-sm font-normal">
            <Settings size={16} />
            Settings
          </Button>
           <Button 
             variant="ghost" 
             className="w-full justify-start gap-3 text-sm font-normal text-red-400 hover:text-red-500 hover:bg-red-50"
             onClick={handleLogout}
           >
            <LogOut size={16} />
            Log out
          </Button>
        </div>
      </aside>
    </>
  );
};