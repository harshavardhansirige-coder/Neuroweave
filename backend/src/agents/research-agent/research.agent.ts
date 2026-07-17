import { aiService } from '../../services/ai/ai.service';

export class ResearchAgent {
  async execute(topic: string, level: string): Promise<string[]> {
    console.log(`>>> [Research Agent] Analyzing topic: "${topic}" at level: ${level}`);

    const systemInstruction = `You are the Research Agent. Research the topic and extract 10 key nodes required to master it at a ${level} level. Output ONLY a valid JSON list of strings representing the topic titles. Never include markdown wrappers like \`\`\`json.`;
    
    const prompt = `Topic: "${topic}"`;
    const response = await aiService.generate(prompt, systemInstruction, {
      temperature: 0.1
    });

    try {
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const nodes = JSON.parse(cleaned);
      if (Array.isArray(nodes)) {
        return nodes;
      }
      throw new Error('Response is not a JSON array.');
    } catch (e: any) {
      console.warn('>>> [Research Agent] Parsing JSON failed, attempting regex fallback:', e.message);
      // Fallback: simple split or generic nodes
      return [
        `Introduction to ${topic}`,
        `Core Principles of ${topic}`,
        `Advanced architecture in ${topic}`,
        `Best Practices for ${topic}`
      ];
    }
  }
}

export const researchAgent = new ResearchAgent();
export default researchAgent;
