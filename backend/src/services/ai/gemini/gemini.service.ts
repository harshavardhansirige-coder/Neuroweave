import axios from 'axios';
import { AIProvider, AIChatMessage, AIProviderOptions } from '../../../types';
import dotenv from 'dotenv';

dotenv.config();

export class GeminiService implements AIProvider {
  private apiKey: string;
  private defaultModel = 'gemini-1.5-flash';

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('>>> [Gemini Service] Warning: GEMINI_API_KEY is not defined.');
    }
  }

  async generate(prompt: string, systemInstruction?: string, options?: AIProviderOptions): Promise<string> {
    const model = options?.model || this.defaultModel;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    const contents = [];
    if (systemInstruction) {
      // For Gemini, system instructions are passed as a top-level property or prepended in contents
      // Let's prepend it as system instruction if API supports it, or as a user message.
      // Standard v1beta systemInstruction parameter:
    }

    const payload: any = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: options?.temperature ?? 0.2,
        maxOutputTokens: options?.maxTokens ?? 2048,
        responseMimeType: prompt.toLowerCase().includes('json') ? 'application/json' : 'text/plain'
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    try {
      const response = await axios.post(url, payload);
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Gemini API returned an empty response.');
      }
      return text;
    } catch (error: any) {
      console.error('>>> [Gemini Service] API call failed:', error.response?.data || error.message);
      throw new Error(`Gemini Service failed: ${error.message}`);
    }
  }

  async chat(messages: AIChatMessage[], systemInstruction?: string, options?: AIProviderOptions): Promise<string> {
    const model = options?.model || this.defaultModel;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    // Convert messages to Gemini format
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const payload: any = {
      contents,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        maxOutputTokens: options?.maxTokens ?? 1024
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    try {
      const response = await axios.post(url, payload);
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Gemini API returned an empty chat response.');
      }
      return text;
    } catch (error: any) {
      console.error('>>> [Gemini Service Chat] API call failed:', error.response?.data || error.message);
      throw new Error(`Gemini Service Chat failed: ${error.message}`);
    }
  }

  async summarize(content: string, options?: AIProviderOptions): Promise<string> {
    const system = 'You are a Summarization Agent. Synthesize the following context into 3 key bullet points. Be extremely concise.';
    return this.generate(content, system, options);
  }
}

export const geminiService = new GeminiService();
