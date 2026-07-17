import { aiService } from '../../services/ai/ai.service';

export interface SyllabusDay {
  day_number: number;
  title: string;
  description: string;
  estimated_minutes: number;
}

export interface StudyNotesPayload {
  content: string;
  key_takeaways: string[];
}

export class TeacherAgent {
  /**
   * Structure researched nodes into a day-by-day syllabus
   */
  async generateSyllabus(nodes: string[], durationDays: number, level: string): Promise<SyllabusDay[]> {
    console.log(`>>> [Teacher Agent] Formatting syllabus for ${durationDays} days...`);

    const systemInstruction = `You are the Curriculum Agent. Map these researched concepts: ${JSON.stringify(nodes)} into a day-by-day lesson syllabus matching exactly ${durationDays} days. Output ONLY a valid JSON array of objects, where each object has: { "day_number": number, "title": string, "description": string, "estimated_minutes": number }. Never include markdown wrappers.`;

    const prompt = `Format a ${durationDays}-day course syllabus for ${level} level.`;
    const response = await aiService.generate(prompt, systemInstruction, {
      temperature: 0.2
    });

    try {
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const syllabus = JSON.parse(cleaned);
      if (Array.isArray(syllabus)) {
        return syllabus;
      }
      throw new Error('Response is not a JSON array.');
    } catch (e: any) {
      console.warn('>>> [Teacher Agent] Syllabus parsing failed, using fallback mapper:', e.message);
      // Fallback
      return Array.from({ length: durationDays }, (_, i) => ({
        day_number: i + 1,
        title: nodes[i % nodes.length] || `Chapter ${i + 1}`,
        description: `Deep dive study of ${nodes[i % nodes.length] || 'concept'}.`,
        estimated_minutes: 60
      }));
    }
  }

  /**
   * Write detailed study notes for a specific topic
   */
  async generateStudyNotes(topic: string, level: string): Promise<StudyNotesPayload> {
    console.log(`>>> [Teacher Agent] Writing detailed notes for "${topic}"...`);

    const systemInstruction = `You are the Teacher Agent. Write detailed educational summary notes (in Markdown format) covering the topic: "${topic}" suitable for a ${level} level. Outline architectural details, examples, and code snippets. Output a JSON object formatted exactly like: { "content": "Markdown text here", "key_takeaways": ["takeaway1", "takeaway2", "takeaway3"] }. Escaped quotes correctly. Never include markdown wrappers.`;

    const response = await aiService.generate(`Topic: ${topic}`, systemInstruction, {
      temperature: 0.3
    });

    try {
      const cleaned = response.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return {
        content: parsed.content || `### Study Notes: ${topic}\nContent is processing.`,
        key_takeaways: parsed.key_takeaways || ['Takeaway 1', 'Takeaway 2']
      };
    } catch (e: any) {
      console.warn('>>> [Teacher Agent] Notes JSON parsing failed, using markdown fallback:', e.message);
      return {
        content: `### ${topic}\n\nThis module covers fundamental and advanced structures.`,
        key_takeaways: [`Understand the principles of ${topic}`, `Implement ${topic} in real systems`]
      };
    }
  }
}

export const teacherAgent = new TeacherAgent();
export default teacherAgent;
