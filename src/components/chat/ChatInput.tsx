'use client';
import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Paperclip, Mic, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { fileToBase64 } from '../../lib/utils';
import { Attachment } from '../../types';

interface ChatInputProps {
  onSend: (message: string, attachments: Attachment[]) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && attachments.length === 0) || isLoading) return;
    
    onSend(input, attachments);
    setInput('');
    setAttachments([]);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Simple validation
      if (!file.type.startsWith('image/')) {
        alert("Only images are supported for now.");
        return;
      }

      try {
        const base64 = await fileToBase64(file);
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substring(7),
          type: 'image',
          url: URL.createObjectURL(file),
          base64: base64,
          mimeType: file.type
        };
        setAttachments(prev => [...prev, newAttachment]);
      } catch (err) {
        console.error("File upload error", err);
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6">
      
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex gap-3 mb-3 overflow-x-auto pb-1 px-1">
          {attachments.map(att => (
             <div key={att.id} className="relative group flex-shrink-0">
               <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/50 shadow-sm relative">
                 <img src={att.url} alt="preview" className="w-full h-full object-cover" />
               </div>
               <button 
                 onClick={() => removeAttachment(att.id)}
                 className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
               >
                 <X size={12} />
               </button>
             </div>
          ))}
        </div>
      )}

      <form 
        onSubmit={handleSubmit}
        className="
          relative flex items-end gap-2 p-2
          bg-white/70 backdrop-blur-xl 
          border border-white/50 
          rounded-3xl 
          shadow-[0_0_40px_-10px_rgba(4,36,68,0.1)]
          transition-all duration-300
          focus-within:ring-2 focus-within:ring-prism-accent/10 focus-within:bg-white/90
        "
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileSelect}
        />

        <Button 
          type="button" 
          variant="icon" 
          size="md" 
          onClick={() => fileInputRef.current?.click()}
          className="mb-1 ml-1 text-slate-400 hover:text-prism-accent transition-colors"
        >
          <ImageIcon size={20} />
        </Button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={attachments.length > 0 ? "Add a caption..." : "Ask Prism..."}
          rows={1}
          className="
            flex-1 
            bg-transparent 
            border-none 
            resize-none 
            py-3 
            px-2
            text-slate-700 
            placeholder-slate-400 
            focus:outline-none 
            max-h-[120px] 
            scrollbar-hide
          "
        />

        <div className="flex gap-1 mb-1 mr-1">
          {!input.trim() && attachments.length === 0 && (
             <Button 
             type="button" 
             variant="icon" 
             size="md" 
             className="text-slate-400 hover:text-prism-accent transition-colors"
           >
             <Mic size={20} />
           </Button>
          )}
          <Button 
            type="submit" 
            variant={(input.trim() || attachments.length > 0) ? "primary" : "icon"}
            size="md"
            disabled={(!input.trim() && attachments.length === 0) || isLoading}
            className={`
              transition-all duration-300 rounded-xl
              ${(input.trim() || attachments.length > 0)
                ? 'w-10 h-10 p-0 flex items-center justify-center bg-prism-accent hover:bg-prism-accent/90' 
                : 'text-slate-300 hover:text-slate-400'
              }
            `}
          >
            <SendHorizontal size={20} className={(input.trim() || attachments.length > 0) ? "ml-0.5" : ""} />
          </Button>
        </div>
      </form>
      <div className="text-center mt-3 text-[10px] text-slate-400 font-light">
        Prism supports Gemini, ChatGPT & Claude. Verify important info.
      </div>
    </div>
  );
};