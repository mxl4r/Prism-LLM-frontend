'use client';

import React, { useState, useCallback, useRef } from 'react';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { Message, Attachment, ModelType } from '@/types';
import { AIService } from '@/lib/ai-service';
import { generateId } from '@/lib/utils';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const aiServiceRef = useRef(new AIService());

  const getSelectedModel = (): ModelType => {
    if (typeof window !== 'undefined') {
       // Cast to unknown first if strict checks fail, but ModelType includes this string now.
       // We use 'as ModelType' to tell TS we trust the storage/default.
       const stored = localStorage.getItem('prism_model');
       if (stored) return stored as ModelType;
    }
    return 'gemini-2.5-flash-latest';
  };

  const handleSendMessage = useCallback(async (content: string, attachments: Attachment[]) => {
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

  return (
    <>
      <ChatWindow messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </>
  );
}