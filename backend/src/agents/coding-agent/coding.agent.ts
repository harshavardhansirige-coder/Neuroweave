import { aiService } from '../../services/ai/ai.service';

export interface CodingChallengePayload {
  title: string;
  problem_statement: string;
  initial_code: string;
  solution_code: string;
  test_cases: Array<{ input: any; expected: any }>;
}

export class CodingAgent {
  async execute(topic: string): Promise<CodingChallengePayload> {
    console.log(`>>> [Coding Agent] Formulating programming exercise for "${topic}"...`);

    const systemInstruction = `You are the Coding Agent. Formulate a hands-on programming challenge for the topic: "${topic}". Output ONLY a valid JSON object: { "title": string, "problem_statement": string, "initial_code": string, "solution_code": string }. Never include markdown wrappers. Ensure it contains clear instructions.`;

    const response = await aiService.generate(`Topic: ${topic}`, systemInstruction, {
      temperature: 0.3
    });

    try {
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const exercise = JSON.parse(cleaned);
      return {
        title: exercise.title || `Coding Challenge: ${topic}`,
        problem_statement: exercise.problem_statement || `Write a function to solve a basic problem under ${topic}.`,
        initial_code: exercise.initial_code || 'function solve() {\n  // Code here\n}',
        solution_code: exercise.solution_code || 'function solve() {\n  return true;\n}',
        test_cases: [{ input: {}, expected: {} }]
      };
    } catch (e: any) {
      console.warn('>>> [Coding Agent] Coding challenge parsing failed, using fallback exercise:', e.message);
      return {
        title: `Exercise: Implementing ${topic}`,
        problem_statement: `Write a Javascript function named 'run' that processes tasks for ${topic} and returns a success status.`,
        initial_code: `function run() {\n  // TODO: Implement solution\n}`,
        solution_code: `function run() {\n  return "success";\n}`,
        test_cases: [{ input: '', expected: 'success' }]
      };
    }
  }
}

export const codingAgent = new CodingAgent();
export default codingAgent;
