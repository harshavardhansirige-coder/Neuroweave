import axios from 'axios';
import { AIProvider, AIChatMessage, AIProviderOptions } from '../../../types';
import dotenv from 'dotenv';

dotenv.config();

export class GroqService implements AIProvider {
  private apiKey: string;
  private defaultModel = 'llama3-8b-8192';

  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
    if (!this.apiKey) {
      console.warn('>>> [Groq Service] Warning: GROQ_API_KEY is not defined.');
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
    const url = 'https://api.groq.com/openai/v1/chat/completions';

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
          temperature: options?.temperature ?? 0.5,
          max_tokens: options?.maxTokens ?? 1024,
          response_format: formattedMessages[formattedMessages.length - 1].content.toLowerCase().includes('json')
            ? { type: 'json_object' }
            : undefined
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
        throw new Error('Groq API returned an empty completion.');
      }
      return text;
    } catch (error: any) {
      console.error('>>> [Groq Service] API call failed:', error.response?.data || error.message);
      throw new Error(`Groq Service failed: ${error.message}`);
    }
  }

  async summarize(content: string, options?: AIProviderOptions): Promise<string> {
    const system = 'Summarize the given text in a concise style.';
    return this.generate(content, system, options);
  }
}

export const groqService = new GroqService();
