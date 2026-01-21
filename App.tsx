import React, { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { ChatInput } from './components/chat/ChatInput';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { Message, ChatSession, ModelType } from './types';
import { GeminiService } from './services/geminiService';
import { supabase } from './services/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Simple UUID generator fallback
const generateId = () => Math.random().toString(36).substring(2, 9);

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<'landing' | 'login' | 'chat'>('landing');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentModel, setCurrentModel] = useState<ModelType>('gemini-3-flash-preview');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(generateId());
  const [initialLoading, setInitialLoading] = useState(true);

  // Service Ref to persist between renders
  const geminiServiceRef = useRef(new GeminiService(currentModel));

  useEffect(() => {
    // Check active session
    const initSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setSession(session);
        if (session) {
          setView('chat');
        }
      } catch (err) {
        console.warn("Supabase session check failed (likely due to missing env vars):", err);
      } finally {
        setInitialLoading(false);
      }
    };

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setView('chat');
      } else {
        // If we are in chat view and lose session, go to landing
        // If we are in login view, stay there (unless explicit sign out)
        setView((prev) => (prev === 'chat' ? 'landing' : prev));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleModelChange = (model: ModelType) => {
    setCurrentModel(model);
    geminiServiceRef.current.setModel(model);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(generateId());
    // On mobile, close sidebar after clicking new chat
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSendMessage = useCallback(async (content: string) => {
    // Add User Message
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Create session if first message
    if (messages.length === 0) {
      setSessions(prev => [
        { id: currentSessionId, title: content.slice(0, 30) + (content.length > 30 ? '...' : ''), updatedAt: new Date() },
        ...prev
      ]);
    }

    try {
      // Create Placeholder AI Message
      const aiMsgId = generateId();
      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: 'model',
        content: '',
        timestamp: new Date(),
      }]);

      const stream = geminiServiceRef.current.sendMessageStream(content);
      
      let fullContent = '';
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, content: fullContent } 
            : msg
        ));
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'model',
        content: "I'm having trouble connecting to the network right now. Please try again.",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages.length, currentSessionId]);

  const handleStartInteraction = (initialPrompt?: string) => {
    if (session) {
      // Already logged in, go to chat
      setView('chat');
      if (initialPrompt) {
        setTimeout(() => handleSendMessage(initialPrompt), 300);
      }
    } else {
      // Not logged in, go to login
      setView('login');
      // Ideally we'd store the initialPrompt to use after login, 
      // but for simplicity we'll just redirect to login for now.
    }
  };

  if (initialLoading) {
     return (
        <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
           <div className="w-8 h-8 rounded-lg bg-prism-accent flex items-center justify-center shadow-lg animate-pulse">
             <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
           </div>
        </div>
     )
  }

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-[#F8FAFC] text-slate-800 font-sans selection:bg-prism-accent/20">
      
      {/* Dynamic Background Blobs for Liquid Feel - Persists across Landing and Chat */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] bg-sky-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      
      {view === 'landing' && (
        <LandingPage onStartChat={handleStartInteraction} />
      )}

      {view === 'login' && (
        <LoginPage onBack={() => setView('landing')} />
      )}

      {view === 'chat' && (
        <>
          {/* Sidebar */}
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            sessions={sessions}
            currentSessionId={currentSessionId}
            onNewChat={handleNewChat}
            onSelectSession={(id) => setCurrentSessionId(id)}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full relative z-10 transition-all duration-300">
            <Navbar 
              onToggleSidebar={handleToggleSidebar} 
              currentModel={currentModel}
              onModelChange={handleModelChange}
              onNewChat={handleNewChat}
            />
            
            <main className="flex-1 flex flex-col relative overflow-hidden">
              <ChatWindow messages={messages} isLoading={isLoading} />
              <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;