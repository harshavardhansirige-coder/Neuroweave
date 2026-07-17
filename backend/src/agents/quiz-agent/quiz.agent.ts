import { aiService } from '../../services/ai/ai.service';

export interface QuizQuestionPayload {
  question: string;
  options: string[];
  correct_option_index: number;
  explanation: string;
}

export class QuizAgent {
  async execute(topic: string, count: number = 2): Promise<QuizQuestionPayload[]> {
    console.log(`>>> [Quiz Agent] Generating ${count} questions for "${topic}"...`);

    const systemInstruction = `You are the Quiz Agent. Create ${count} conceptual multiple-choice questions for "${topic}". Output ONLY a valid JSON array of objects: [ { "question": string, "options": [string, string, string, string], "correct_option_index": number, "explanation": string } ]. Never include markdown wrappers. Ensure correct_option_index is 0-indexed.`;

    const response = await aiService.generate(`Topic: ${topic}`, systemInstruction, {
      temperature: 0.4
    });

    try {
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const questions = JSON.parse(cleaned);
      if (Array.isArray(questions)) {
        return questions;
      }
      throw new Error('Response is not an array');
    } catch (e: any) {
      console.warn('>>> [Quiz Agent] Quiz parsing failed, using fallback quiz:', e.message);
      // Fallback
      return [
        {
          question: `Which of the following describes the core mechanism of ${topic}?`,
          options: [
            'It is sequential and blocking.',
            'It leverages automated scheduling loops.',
            'It requires external third-party middleware.',
            'It disables garbage collection.'
          ],
          correct_option_index: 1,
          explanation: `The core mechanism of ${topic} relies on automated event-driven loops.`
        }
      ];
    }
  }
}

export const quizAgent = new QuizAgent();
export default quizAgent;
