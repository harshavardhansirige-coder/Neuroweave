import axios from 'axios';
import { AIProvider, AIChatMessage, AIProviderOptions } from '../../../types';
import dotenv from 'dotenv';

dotenv.config();

export class OpenRouterService implements AIProvider {
  private apiKey: string;
  private defaultModel = 'google/gemini-2.5-flash';

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('>>> [OpenRouter Service] Warning: OPENROUTER_API_KEY is not defined.');
    }
  }

  async generate(prompt: string, systemInstruction?: string, options?: AIProviderOptions): Promise<string> {
    const messages: AIChatMessage[] = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });
    return this.chat(messages, undefined, options);
  }

  async chat(messages: AIChatMessage[], systemInstruction?: string, options?: AIProviderOptions): Promise<string> {
    const model = options?.model || this.defaultModel;
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const formattedMessages = [...messages];
    if (systemInstruction) {
      formattedMessages.unshift({ role: 'system', content: systemInstruction });
    }

    try {
      const response = await axios.post(
        url,
        {
          model,
          messages: formattedMessages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 1024
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://learnforge.ai', // Required by OpenRouter
            'X-Title': 'LearnForge AI'
          }
        }
      );

      const text = response.data?.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error('OpenRouter API returned an empty completion.');
      }
      return text;
    } catch (error: any) {
      console.error('>>> [OpenRouter Service] API call failed:', error.response?.data || error.message);
      throw new Error(`OpenRouter Service failed: ${error.message}`);
    }
  }

  async summarize(content: string, options?: AIProviderOptions): Promise<string> {
    const system = 'Summarize the given text.';
    return this.generate(content, system, options);
  }
}

export const openrouterService = new OpenRouterService();
