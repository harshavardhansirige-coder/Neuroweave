import { AIProvider, AIChatMessage, AIProviderOptions } from '../../types';
import { geminiService } from './gemini/gemini.service';
import { groqService } from './groq/groq.service';
import { deepseekService } from './deepseek/deepseek.service';
import { openrouterService } from './openrouter/openrouter.service';

export type ProviderName = 'gemini' | 'groq' | 'deepseek' | 'openrouter';

export class AIService implements AIProvider {
  private providers: Record<ProviderName, AIProvider> = {
    gemini: geminiService,
    groq: groqService,
    deepseek: deepseekService,
    openrouter: openrouterService
  };

  private providerOrder: ProviderName[] = ['gemini', 'groq', 'openrouter', 'deepseek'];

  // Retrieve service by name
  getProvider(name: ProviderName): AIProvider {
    return this.providers[name];
  }

  // Resilient generate with fallback routing
  async generate(
    prompt: string,
    systemInstruction?: string,
    options?: AIProviderOptions & { preferredProvider?: ProviderName }
  ): Promise<string> {
    const preferred = options?.preferredProvider || 'gemini';
    const chain = [preferred, ...this.providerOrder.filter(p => p !== preferred)];

    let lastError: any = null;
    for (const providerName of chain) {
      try {
        console.log(`>>> [AIService] Attempting content generation with provider: ${providerName}...`);
        const provider = this.getProvider(providerName);
        const result = await provider.generate(prompt, systemInstruction, options);
        console.log(`>>> [AIService] Generation succeeded with provider: ${providerName}.`);
        return result;
      } catch (err: any) {
        console.warn(`>>> [AIService] Provider ${providerName} failed: ${err.message}. Retrying fallback chain...`);
        lastError = err;
      }
    }

    throw new Error(`AIService.generate failed across all providers. Last error: ${lastError?.message}`);
  }

  // Resilient chat with fallback routing
  async chat(
    messages: AIChatMessage[],
    systemInstruction?: string,
    options?: AIProviderOptions & { preferredProvider?: ProviderName }
  ): Promise<string> {
    const preferred = options?.preferredProvider || 'gemini';
    const chain = [preferred, ...this.providerOrder.filter(p => p !== preferred)];

    let lastError: any = null;
    for (const providerName of chain) {
      try {
        console.log(`>>> [AIService] Attempting chat completion with provider: ${providerName}...`);
        const provider = this.getProvider(providerName);
        const result = await provider.chat(messages, systemInstruction, options);
        console.log(`>>> [AIService] Chat succeeded with provider: ${providerName}.`);
        return result;
      } catch (err: any) {
        console.warn(`>>> [AIService] Provider ${providerName} failed: ${err.message}. Retrying fallback chain...`);
        lastError = err;
      }
    }

    throw new Error(`AIService.chat failed across all providers. Last error: ${lastError?.message}`);
  }

  // Resilient summarization
  async summarize(
    content: string,
    options?: AIProviderOptions & { preferredProvider?: ProviderName }
  ): Promise<string> {
    const system = 'You are a summarization agent. Summarize the text concisely.';
    return this.generate(content, system, options);
  }
}

export const aiService = new AIService();
export default aiService;
