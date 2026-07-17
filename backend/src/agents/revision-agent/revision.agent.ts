import { aiService } from '../../services/ai/ai.service';

export interface FlashcardPayload {
  front: string;
  back: string;
}

export class RevisionAgent {
  async execute(topic: string, count: number = 2): Promise<FlashcardPayload[]> {
    console.log(`>>> [Revision Agent] Generating ${count} flashcards for "${topic}"...`);

    const systemInstruction = `You are the Revision Agent. Formulate ${count} revision flashcards (front/back) covering "${topic}". Output ONLY a valid JSON array of objects: [ { "front": string, "back": string } ]. Front should be a question or concept, Back should be the answer/definition. Never include markdown wrappers.`;

    const response = await aiService.generate(`Topic: ${topic}`, systemInstruction, {
      temperature: 0.5
    });

    try {
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const flashcards = JSON.parse(cleaned);
      if (Array.isArray(flashcards)) {
        return flashcards;
      }
      throw new Error('Response is not an array.');
    } catch (e: any) {
      console.warn('>>> [Revision Agent] Flashcard parsing failed, using fallback flashcards:', e.message);
      return [
        {
          front: `What is the primary objective of ${topic}?`,
          back: `To optimize the architecture and maintain scalability during workload execution.`
        },
        {
          front: `Name one critical aspect to consider when deploying ${topic}.`,
          back: `Ensuring proper resource limits and error-handling wakers.`
        }
      ];
    }
  }
}

export const revisionAgent = new RevisionAgent();
export default revisionAgent;
