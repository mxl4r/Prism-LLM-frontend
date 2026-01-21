import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Paperclip, Mic } from 'lucide-react';
import { Button } from '../ui/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6">
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
        <Button 
          type="button" 
          variant="icon" 
          size="md" 
          className="mb-1 ml-1 text-slate-400 hover:text-prism-accent transition-colors"
        >
          <Paperclip size={20} />
        </Button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Prism..."
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
          {!input.trim() && (
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
            variant={input.trim() ? "primary" : "icon"}
            size="md"
            disabled={!input.trim() || isLoading}
            className={`
              transition-all duration-300 rounded-xl
              ${input.trim() 
                ? 'w-10 h-10 p-0 flex items-center justify-center bg-prism-accent hover:bg-prism-accent/90' 
                : 'text-slate-300 hover:text-slate-400'
              }
            `}
          >
            <SendHorizontal size={20} className={input.trim() ? "ml-0.5" : ""} />
          </Button>
        </div>
      </form>
      <div className="text-center mt-3 text-[10px] text-slate-400 font-light">
        Prism can make mistakes. Please verify important information.
      </div>
    </div>
  );
};