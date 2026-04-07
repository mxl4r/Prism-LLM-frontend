export type Role = 'user' | 'model';

export interface Attachment {
  id: string;
  type: 'image' | 'file';
  name?: string; // Original filename
  size?: number; // File size in bytes
  url: string; // Preview URL (blob for images, empty for files)
  base64?: string; // Base64-encoded content for sending to backend
  mimeType?: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: Date;
}

// Supported Models — labels sent to the backend gateway
export type ModelProvider = 'google' | 'anthropic' | 'alibaba';

export type ModelType =
  // Google
  | 'gemini-2.5-pro'
  | 'gemini-2.5-flash'
  // Alibaba / Qwen
  | 'qwen2.5:3b'
  // Anthropic
  | 'claude-sonnet-4-6'
  | 'claude-3-opus-latest';

export interface AIModelConfig {
  id: ModelType;
  name: string;
  provider: ModelProvider;
  description: string;
  multimodal: boolean;
}

/** Message format expected by the backend API */
export interface ChatApiMessage {
  role: 'user' | 'assistant';
  content: string;
}