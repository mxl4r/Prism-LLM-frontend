export type Role = 'user' | 'model';

export interface Attachment {
  id: string;
  type: 'image';
  url: string; // Preview URL (blob)
  base64?: string; // For sending to backend
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
export type ModelProvider = 'google' | 'openai' | 'anthropic' | 'alibaba';

export type ModelType =
  // Google
  | 'gemini-2.5-flash-latest'
  | 'gemini-3-pro-preview'
  // Alibaba / Qwen
  | 'qwen2.5:3b'
  // Anthropic
  | 'claude-3-5-sonnet-latest'
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