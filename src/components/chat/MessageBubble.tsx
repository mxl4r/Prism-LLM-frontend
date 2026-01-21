'use client';
import React from 'react';
import { Message } from '../../types';
import { Bot, User, AlertCircle } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const hasAttachments = message.attachments && message.attachments.length > 0;

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in group`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
          shadow-sm border border-white/50
          ${isUser 
            ? 'bg-slate-200 text-slate-600' 
            : isError 
              ? 'bg-red-100 text-red-600'
              : 'bg-prism-accent text-white'
          }
        `}>
          {isUser ? <User size={16} /> : isError ? <AlertCircle size={16}/> : <Bot size={16} />}
        </div>

        {/* Content Container */}
        <div className="flex flex-col gap-2 w-full">
          
          {/* Attachments (Images) */}
          {hasAttachments && (
             <div className={`flex flex-wrap gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {message.attachments!.map(att => (
                   <div key={att.id} className="relative rounded-2xl overflow-hidden border border-white/50 shadow-sm max-w-[200px]">
                      <img src={att.url} alt="attachment" className="w-full h-auto" />
                   </div>
                ))}
             </div>
          )}

          {/* Text Bubble */}
          {(message.content || !hasAttachments) && (
            <div className={`
              relative px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
              ${isUser 
                ? 'bg-prism-accent text-white rounded-tr-sm ml-auto' 
                : isError
                  ? 'bg-red-50 text-red-800 border border-red-100 rounded-tl-sm'
                  : 'bg-white/80 backdrop-blur-md border border-white/60 text-slate-700 rounded-tl-sm'
              }
            `}>
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
              
              {/* Timestamp (Visible on hover) */}
              <div className={`
                absolute -bottom-5 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity
                ${isUser ? 'right-0' : 'left-0'}
              `}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};