'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Paperclip, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { fileToBase64 } from '../../lib/utils';
import { Attachment } from '../../types';

interface ChatInputProps {
  onSend: (message: string, attachments: Attachment[]) => void;
  isLoading: boolean;
  /** Files dropped from outside (e.g. page-level drag-and-drop) */
  droppedFiles?: File[];
  /** Signal to clear the droppedFiles after processing */
  onDroppedFilesHandled?: () => void;
}

/** Human-readable file size */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Maximum file size: 10 MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;



export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading, droppedFiles, onDroppedFilesHandled }) => {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Process files dropped from page-level drag-and-drop
  useEffect(() => {
    if (droppedFiles && droppedFiles.length > 0) {
      processFiles(droppedFiles).then(() => {
        onDroppedFilesHandled?.();
      });
    }
  }, [droppedFiles]);

  const hasContent = input.trim().length > 0 || attachments.length > 0;

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!hasContent || isLoading) return;

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

  const processFiles = async (files: FileList | File[]) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];



      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        alert(`File "${file.name}" is too large (${formatFileSize(file.size)}).\nMaximum: ${formatFileSize(MAX_FILE_SIZE)}.`);
        continue;
      }

      try {
        const base64 = await fileToBase64(file);
        const isImage = file.type.startsWith('image/');
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substring(2, 9),
          type: isImage ? 'image' : 'file',
          name: file.name,
          size: file.size,
          url: isImage ? URL.createObjectURL(file) : '',
          base64,
          mimeType: file.type,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      } catch (err) {
        console.error('File read error:', err);
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFiles(files);
    // Reset the file input so re-selecting the same file triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = '';
  };



  // Paste handler for images
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        await processFiles(imageFiles);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 md:pb-6 flex-shrink-0">

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex gap-3 mb-3 overflow-x-auto pt-2 pb-2 px-2">
          {attachments.map((att) => (
            <div key={att.id} className="relative group flex-shrink-0" style={{ overflow: 'visible' }}>
              {att.type === 'image' ? (
                /* Image preview */
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/50 shadow-sm">
                  <img src={att.url} alt="preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                /* File preview (non-image) */
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 border border-slate-200/50 shadow-sm max-w-[200px]">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <FileText size={16} className="text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium text-slate-700 truncate">{att.name}</div>
                    <div className="text-[10px] text-slate-400">{formatFileSize(att.size ?? 0)}</div>
                  </div>
                </div>
              )}
              <button
                onClick={() => removeAttachment(att.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`
          relative flex items-end gap-2 p-2
          bg-white/70 backdrop-blur-xl
          border border-white/50
          rounded-3xl
          shadow-[0_0_40px_-10px_rgba(4,36,68,0.1)]
          transition-all duration-300
          focus-within:ring-2 focus-within:ring-prism-accent/10 focus-within:bg-white/90
        `}
      >
        {/* Hidden file input — accepts images, text, PDF, JSON, CSV */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"

          multiple
          onChange={handleFileSelect}
        />

        {/* Attach File Button */}
        <Button
          type="button"
          variant="icon"
          size="md"
          onClick={() => fileInputRef.current?.click()}
          className="mb-1 ml-1 text-slate-400 hover:text-prism-accent transition-colors"
          title="Attach files"
        >
          <Paperclip size={20} />
        </Button>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={attachments.length > 0 ? 'Add a message...' : 'Ask Prism...'}
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
            max-h-[160px]
            scrollbar-hide
          "
        />

        {/* Send Button — icon always visible, color changes on active state */}
        <div className="flex gap-1 mb-1 mr-1">
          <button
            type="submit"
            disabled={!hasContent || isLoading}
            className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              transition-all duration-300
              focus:outline-none focus:ring-2 focus:ring-prism-accent/20
              disabled:cursor-not-allowed
              ${hasContent
                ? 'bg-prism-accent text-white shadow-lg hover:bg-prism-accent/90 hover:shadow-prism-accent/20'
                : 'bg-transparent text-slate-300'
              }
            `}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
      <div className="text-center mt-3 text-[10px] text-slate-400 font-light">
        Prism supports Gemini, Qwen &amp; Claude. Verify important info.
      </div>
    </div>
  );
};