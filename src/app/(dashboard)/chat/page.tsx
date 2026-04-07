'use client';

import React, { useState, useCallback, useRef } from 'react';
import { ChatWindow } from '../../../components/chat/ChatWindow';
import { ChatInput } from '../../../components/chat/ChatInput';
import { Message, Attachment, ModelType, ChatApiMessage } from '../../../types';
import { streamChat } from '../../../lib/api';
import { generateId } from '../../../lib/utils';
import { Paperclip } from 'lucide-react';

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
  return 'gemini-2.5-pro';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFiles, setDroppedFiles] = useState<File[] | undefined>(undefined);
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const dragCounterRef = useRef(0);

  // --- Page-level drag & drop ---
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setDroppedFiles(Array.from(files));
    }
  }, []);

  const handleDroppedFilesHandled = useCallback(() => {
    setDroppedFiles(undefined);
  }, []);

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

  return (
    <div
      className="flex flex-col h-full w-full overflow-hidden bg-[#F8FAFC] relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      {/* Full-page drag overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
          <div className="p-8 rounded-3xl border-2 border-dashed border-prism-accent/40 bg-prism-accent/5 text-center">
            <Paperclip size={32} className="mx-auto text-prism-accent/60 mb-3" />
            <p className="text-base text-prism-accent/80 font-semibold">Drop files here</p>
            <p className="text-xs text-slate-400 mt-1">Images, PDF, text, JSON, CSV</p>
          </div>
        </div>
      )}

      {/* Messages Area - Absolute Positioning Trick */}
      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0">
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 w-full z-10 bg-[#F8FAFC]/80 backdrop-blur-sm">
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          droppedFiles={droppedFiles}
          onDroppedFilesHandled={handleDroppedFilesHandled}
        />
      </div>
    </div>
  );
}