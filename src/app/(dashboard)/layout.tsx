'use client';

import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Navbar } from '../../components/layout/Navbar';
import { ChatSession, ModelType } from '../../types';
import { generateId } from '../../lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentModel, setCurrentModel] = useState<ModelType>('gemini-2.5-pro');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(generateId());

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleNewChat = () => {
    setCurrentSessionId(generateId());
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    window.location.href = '/chat';
  };

  return (
    // h-[100dvh] overflow-hidden locks the viewport for the app shell.
    // The body itself is NOT overflow:hidden so other pages (landing, login) can scroll.
    <div className="flex h-[100dvh] w-full relative overflow-hidden bg-[#F8FAFC]">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectSession={(id) => setCurrentSessionId(id)}
      />

      <div className="flex-1 flex flex-col h-full relative z-10 transition-all duration-300 min-w-0">
        <Navbar
          onToggleSidebar={handleToggleSidebar}
          currentModel={currentModel}
          onModelChange={setCurrentModel}
          onNewChat={handleNewChat}
        />

        {/* min-h-0 ensures children can scroll properly */}
        <main className="flex-1 flex flex-col relative overflow-hidden min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}