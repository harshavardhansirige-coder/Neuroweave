import { Request } from 'express';

export interface UserProfile {
  id: string;
  firebase_uid: string;
  email: string;
  display_name?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    profileId?: string;
  };
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProviderOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface AIProvider {
  generate(prompt: string, systemInstruction?: string, options?: AIProviderOptions): Promise<string>;
  chat(messages: AIChatMessage[], systemInstruction?: string, options?: AIProviderOptions): Promise<string>;
  summarize(content: string, options?: AIProviderOptions): Promise<string>;
}
