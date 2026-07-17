import { Response } from 'express';
import { supabase } from '../config/supabase';
import { aiService } from '../services/ai/ai.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const handleChat = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { sessionId, message } = req.body;

    if (!user) return sendError(res, 'Unauthorized', 'Chat failed', 401);
    if (!sessionId || !message) {
      return sendError(res, 'Missing sessionId or message parameter.', 'Bad request', 400);
    }

    // 1. Log the user's message to the chat history
    const { error: userInsertErr } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.profileId,
        session_id: sessionId,
        sender: 'user',
        message: message
      });

    if (userInsertErr) {
      return sendError(res, userInsertErr.message, 'Database insert user message failed', 500);
    }

    // 2. Fetch the recent chat transcript to give context to the AI model
    const { data: history, error: fetchErr } = await supabase
      .from('chat_history')
      .select('sender, message')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10);

    if (fetchErr) {
      return sendError(res, fetchErr.message, 'Database transcript retrieval failed', 500);
    }

    // 3. Format history for AI service chat completions
    const aiMessages = (history || []).map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
      content: h.message
    }));

    const systemInstruction = `You are the Teacher Agent assistant in LearnForge AI. Guide the user with encouraging explanation, code snippets, and structured bullet points. Keep response educational and focused on the current topic.`;

    // 4. Generate AI response
    const botResponse = await aiService.chat(aiMessages, systemInstruction, {
      temperature: 0.7
    });

    // 5. Log the assistant response to database
    const { error: assistantInsertErr } = await supabase
      .from('chat_history')
      .insert({
        user_id: user.profileId,
        session_id: sessionId,
        sender: 'assistant',
        message: botResponse
      });

    if (assistantInsertErr) {
      return sendError(res, assistantInsertErr.message, 'Database insert assistant response failed', 500);
    }

    return sendSuccess(res, { reply: botResponse }, 'Chat processed successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to complete chat interaction');
  }
};

export const getChatHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { sessionId } = req.params;

    if (!user) return sendError(res, 'Unauthorized', 'Fetch failed', 401);

    const { data: history, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', user.profileId)
      .order('created_at', { ascending: true });

    if (error) return sendError(res, error.message, 'Database query failed', 500);

    return sendSuccess(res, history, 'Chat history retrieved successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to retrieve chat history');
  }
};
