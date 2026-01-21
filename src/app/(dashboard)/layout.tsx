'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { ChatSession, ModelType } from '@/types';
import { generateId } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // Default updated to new supported model
  const [currentModel, setCurrentModel] = useState<ModelType>('gemini-2.5-flash-latest');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(generateId());
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Optional: Redirect
      }
    };
    checkAuth();
  }, [router]);

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNewChat = () => {
    setCurrentSessionId(generateId());
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    window.location.href = '/chat';
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-[#F8FAFC]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={(id) => setCurrentSessionId(id)}
      />

      <div className="flex-1 flex flex-col h-full relative z-10 transition-all duration-300">
        <Navbar 
          onToggleSidebar={handleToggleSidebar} 
          currentModel={currentModel}
          onModelChange={setCurrentModel}
          onNewChat={handleNewChat}
        />
        
        <main className="flex-1 flex flex-col relative overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}