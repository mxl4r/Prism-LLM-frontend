export type Role = 'user' | 'model';

export interface Attachment {
  id: string;
  type: 'image';
  url: string; // Preview URL (blob)
  base64?: string; // For API sending
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

// Supported Models
export type ModelProvider = 'google' | 'openai' | 'anthropic';

export type ModelType = 
  // Google
  | 'gemini-2.5-flash-latest'
  | 'gemini-3-pro-preview'
  // OpenAI
  | 'gpt-4o'
  | 'gpt-4o-mini'
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