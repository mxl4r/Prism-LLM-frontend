'use client';

import React, { useState, useCallback } from 'react';
import { ChatWindow } from '../../../components/chat/ChatWindow';
import { ChatInput } from '../../../components/chat/ChatInput';
import { Message, Attachment, ModelType, ChatApiMessage } from '../../../types';
import { streamChat } from '../../../lib/api';
import { generateId } from '../../../lib/utils';

// Force dynamic rendering to avoid static export issues during Vercel build
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/** Convert local Message history to the API message format */
function toApiMessages(messages: Message[]): ChatApiMessage[] {
  return messages
    .filter((m) => !m.isError)
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));
}

/** Read the selected model from localStorage (set by Navbar/ModelSelector) */
function getSelectedModel(): ModelType {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('prism_model');
    if (stored) return stored as ModelType;
  }
  return 'gemini-2.5-flash-latest';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleSendMessage = useCallback(async (content: string, attachments: Attachment[]) => {
    if (isLoading) return;

    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const model = getSelectedModel();

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content,
      attachments,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    // Placeholder AI message that will be filled incrementally
    const aiMsgId = generateId();
    setMessages((prev) => [
      ...prev,
      {
        id: aiMsgId,
        role: 'model',
        content: '',
        timestamp: new Date(),
      },
    ]);

    try {
      // Build history including the new user message
      const historyForApi = toApiMessages([...messages, userMsg]);

      await streamChat(
        { model, messages: historyForApi },
        (chunk) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, content: msg.content + chunk } : msg,
            ),
          );
        },
        abortControllerRef.current.signal,
      );
    } catch (error: any) {
      const isAborted = error?.name === 'AbortError' || error?.message?.includes('aborted');

      if (!isAborted) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? {
                  ...msg,
                  content: error?.message || 'An unexpected error occurred. Please try again.',
                  isError: true,
                }
              : msg,
          ),
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  // ROBUST LAYOUT STRATEGY:
  // 1. Outer container is flex-col, full height, no overflow.
  // 2. Middle container is flex-1 and RELATIVE.
  // 3. Inner container is ABSOLUTE INSET-0.
  // This forces the chat window to stay strictly within the available bounds and scroll internally.
  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#F8FAFC]">

      {/* Messages Area - Absolute Positioning Trick */}
      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 w-full z-10 bg-[#F8FAFC]/80 backdrop-blur-sm">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}