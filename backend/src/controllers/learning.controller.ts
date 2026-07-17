import { Response } from 'express';
import { supabase } from '../config/supabase';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { masterAgent } from '../agents/master-agent/master.agent';
import { teacherAgent } from '../agents/teacher-agent/teacher.agent';
import { quizAgent } from '../agents/quiz-agent/quiz.agent';
import { codingAgent } from '../agents/coding-agent/coding.agent';
import { revisionAgent } from '../agents/revision-agent/revision.agent';
import { researchAgent } from '../agents/research-agent/research.agent';

export const generateLearning = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { prompt, level, durationDays, language, learningStyle } = req.body;

    if (!user || !user.profileId) {
      return sendError(res, 'Unauthorized', 'Session generation failed', 401);
    }

    if (!prompt) {
      return sendError(res, 'Missing prompt parameter.', 'Bad request', 400);
    }

    // 1. Create a pending learning session in the database
    const { data: session, error: sessionErr } = await supabase
      .from('learning_sessions')
      .insert({
        user_id: user.profileId,
        prompt: prompt,
        topic: prompt.replace(/learn/i, '').trim(),
        difficulty_level: level || 'Intermediate',
        duration_days: durationDays || 5,
        language: language || 'English',
        learning_style: learningStyle || 'Visual',
        status: 'pending'
      })
      .select()
      .single();

    if (sessionErr) {
      return sendError(res, sessionErr.message, 'Database session initialization failed', 500);
    }

    // 2. Trigger Orchestration in background or run synchronously based on API expectations
    // Let's run synchronously but handle response or run in background. Since this is an HTTP API,
    // let's execute in the background so the request doesn't timeout, or wait up to 10 seconds.
    // We will trigger it in the background:
    masterAgent.orchestrate({
      sessionId: session.id,
      userId: user.profileId,
      prompt: session.prompt,
      topic: session.topic,
      difficulty: session.difficulty_level,
      durationDays: session.duration_days,
      learningStyle: session.learning_style,
      language: session.language
    }).catch(err => {
      console.error(`>>> [Learning Controller] Background orchestration failed for session ${session.id}:`, err);
    });

    return sendSuccess(res, { session, status: 'processing' }, 'Orchestration pipeline initialized in background.', 202);
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to trigger learning orchestration');
  }
};

export const getCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, 'Unauthorized', 'Fetch failed', 401);

    const { data: courses, error } = await supabase
      .from('courses')
      .select(`
        *,
        course_modules (
          *,
          notes (*),
          quizzes (*),
          coding_exercises (*),
          visual_contents (*)
        )
      `)
      .eq('user_id', user.profileId)
      .order('created_at', { ascending: false });

    if (error) return sendError(res, error.message, 'Database fetch failed', 500);

    return sendSuccess(res, courses, 'Courses fetched successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to retrieve courses');
  }
};

export const getSessions = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, 'Unauthorized', 'Fetch failed', 401);

    const { data: sessions, error } = await supabase
      .from('learning_sessions')
      .select('*, agent_executions(*)')
      .eq('user_id', user.profileId)
      .order('created_at', { ascending: false });

    if (error) return sendError(res, error.message, 'Database fetch failed', 500);

    return sendSuccess(res, sessions, 'Learning sessions fetched successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to retrieve sessions');
  }
};

export const getSessionById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { id } = req.params;
    if (!user) return sendError(res, 'Unauthorized', 'Fetch failed', 401);

    const { data: session, error } = await supabase
      .from('learning_sessions')
      .select('*, agent_executions(*)')
      .eq('id', id)
      .eq('user_id', user.profileId)
      .single();

    if (error) return sendError(res, error.message, 'Session not found', 404);

    return sendSuccess(res, session, 'Session retrieved successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to retrieve session');
  }
};

// Specialized modular endpoint generators
export const generateCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic, difficulty, durationDays } = req.body;
    const concepts = await researchAgent.execute(topic, difficulty || 'Intermediate');
    const syllabus = await teacherAgent.generateSyllabus(concepts, durationDays || 5, difficulty || 'Intermediate');
    return sendSuccess(res, { syllabus }, 'Course syllabus generated successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to generate course');
  }
};

export const generateNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic, difficulty } = req.body;
    const notes = await teacherAgent.generateStudyNotes(topic, difficulty || 'Intermediate');
    return sendSuccess(res, notes, 'Study notes generated successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to generate study notes');
  }
};

export const generateQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic, count } = req.body;
    const questions = await quizAgent.execute(topic, count || 2);
    return sendSuccess(res, { questions }, 'Quiz generated successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to generate quiz');
  }
};

export const generateFlashcards = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic, count } = req.body;
    const flashcards = await revisionAgent.execute(topic, count || 2);
    return sendSuccess(res, { flashcards }, 'Flashcards generated successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to generate flashcards');
  }
};

export const generateRoadmap = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { topic, difficulty } = req.body;
    const concepts = await researchAgent.execute(topic, difficulty || 'Intermediate');
    return sendSuccess(res, { concepts }, 'Roadmap concepts compiled successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to generate roadmap concepts');
  }
};
