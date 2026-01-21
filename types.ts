export type Role = 'user' | 'model';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: Date;
}

export type ModelType = 'gemini-3-flash-preview' | 'gemini-3-pro-preview';