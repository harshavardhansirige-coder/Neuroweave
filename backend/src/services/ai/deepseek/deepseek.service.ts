import axios from 'axios';
import { AIProvider, AIChatMessage, AIProviderOptions } from '../../../types';
import dotenv from 'dotenv';

dotenv.config();

export class DeepSeekService implements AIProvider {
  private apiKey: string;
  private defaultModel = 'deepseek-chat'; // Can also be deepseek-reasoner

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    if (!this.apiKey) {
      console.warn('>>> [DeepSeek Service] Warning: DEEPSEEK_API_KEY is not defined.');
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
    const url = 'https://api.deepseek.com/v1/chat/completions';

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
          temperature: options?.temperature ?? 0.2,
          max_tokens: options?.maxTokens ?? 2048
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const text = response.data?.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error('DeepSeek API returned an empty completion.');
      }
      return text;
    } catch (error: any) {
      console.error('>>> [DeepSeek Service] API call failed:', error.response?.data || error.message);
      // Fallback: If DeepSeek is down or rate-limited, log it and bubble up to allow orchestration fallback
      throw new Error(`DeepSeek Service failed: ${error.message}`);
    }
  }

  async summarize(content: string, options?: AIProviderOptions): Promise<string> {
    const system = 'Summarize this content as a Senior Systems Architect.';
    return this.generate(content, system, options);
  }
}

export const deepseekService = new DeepSeekService();
