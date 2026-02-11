'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatWindow } from '../../../components/chat/ChatWindow';
import { ChatInput } from '../../../components/chat/ChatInput';
import { Message, Attachment, ModelType } from '../../../types';
import { AIService } from '../../../lib/ai-service';
import { generateId } from '../../../lib/utils';

// Force dynamic rendering to avoid static export issues during Vercel build
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Initialize as null to prevent instantiation during server-side pre-rendering
  const aiServiceRef = useRef<AIService | null>(null);

  // Instantiate service only on the client side after mount
  useEffect(() => {
    aiServiceRef.current = new AIService();
  }, []);

  const getSelectedModel = (): ModelType => {
    if (typeof window !== 'undefined') {
       const stored = localStorage.getItem('prism_model');
       if (stored) return stored as ModelType;
    }
    return 'gemini-2.5-flash-latest';
  };

  const handleSendMessage = useCallback(async (content: string, attachments: Attachment[]) => {
    // Safety check / lazy init
    if (!aiServiceRef.current) {
        aiServiceRef.current = new AIService();
    }

    const model = getSelectedModel();
    
    // Add User Message
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content,
      attachments, // Store attachments
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const aiMsgId = generateId();
      setMessages(prev => [...prev, {
        id: aiMsgId,
        role: 'model',
        content: '',
        timestamp: new Date(),
      }]);

      const stream = aiServiceRef.current.streamMessage(model, content, attachments);
      
      let fullContent = '';
      
      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, content: fullContent } 
            : msg
        ));
      }

    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: generateId(),
        role: 'model',
        content: `Error (${model}): ${error.message || "Connection failed."}`,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Explicitly wrap in a flex column container that takes full height
  return (
    <div className="flex flex-col h-full min-h-0 w-full">
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}