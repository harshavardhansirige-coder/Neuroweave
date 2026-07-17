import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { prompt, level, duration, language, sessionId } = await req.json();

    // 1. Initialize Supabase client using Edge Function environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Fetch Gemini API credentials
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Missing backend GEMINI_API_KEY environment variable on Supabase.');
    }

    // Update session status to processing
    await supabase
      .from('learning_sessions')
      .update({ status: 'processing' })
      .eq('id', sessionId);

    // --- HELPER: GEMINI API CALLER ---
    const callGemini = async (systemInstruction: string, promptText: string) => {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
      
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: `${systemInstruction}\n\nInput Context:\n${promptText}` }
            ]
          }
        ]
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Gemini service error: ${res.statusText}`);
      }

      const json = await res.json();
      return json.candidates[0].content.parts[0].text;
    };

    // --- STAGE 1: RESEARCH AGENT ---
    // Log start of research agent
    const { data: researchLog } = await supabase
      .from('agent_executions')
      .insert({
        session_id: sessionId,
        agent_name: 'Research',
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    const researchInstruction = `You are the Research Agent. Research the topic and extract 10 key nodes required to master it at a ${level} level. Output ONLY a valid JSON list of strings representing the topic titles.`;
    const researchResult = await callGemini(researchInstruction, prompt);
    const cleanedResearch = researchResult.replace(/```json/g, '').replace(/```/g, '').trim();
    const topics = JSON.parse(cleanedResearch);

    await supabase
      .from('agent_executions')
      .update({
        status: 'completed',
        output_summary: `Identified ${topics.length} key curriculum nodes.`,
        completed_at: new Date().toISOString()
      })
      .eq('id', researchLog.id);

    // --- STAGE 2: CURRICULUM AGENT ---
    const { data: curriculumLog } = await supabase
      .from('agent_executions')
      .insert({
        session_id: sessionId,
        agent_name: 'Curriculum',
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    const curriculumInstruction = `You are the Curriculum Agent. Map the researched topics: ${JSON.stringify(topics)} into a day-by-day lesson syllabus matching exactly ${duration} days. Output ONLY a valid JSON array of objects, where each object has: { "day_number": number, "title": string, "description": string, "estimated_minutes": number }`;
    const curriculumResult = await callGemini(curriculumInstruction, JSON.stringify(topics));
    const cleanedCurriculum = curriculumResult.replace(/```json/g, '').replace(/```/g, '').trim();
    const daysData = JSON.parse(cleanedCurriculum);

    // Save Roadmap
    const { data: roadmap } = await supabase
      .from('roadmaps')
      .insert({
        session_id: sessionId,
        title: `Masterclass: ${prompt.replace(/learn/i, '').trim()}`,
        description: `Structured curriculum focused on "${prompt}" customized for ${level} level.`,
        duration_days: duration
      })
      .select()
      .single();

    // Save Roadmap Days
    const insertedDays = [];
    for (const d of daysData) {
      const { data: dayObj } = await supabase
        .from('roadmap_days')
        .insert({
          roadmap_id: roadmap.id,
          day_number: d.day_number,
          title: d.title,
          description: d.description,
          estimated_minutes: d.estimated_minutes
        })
        .select()
        .single();
      insertedDays.push(dayObj);
    }

    await supabase
      .from('agent_executions')
      .update({
        status: 'completed',
        output_summary: `Scaffolded ${insertedDays.length} chapters.`,
        completed_at: new Date().toISOString()
      })
      .eq('id', curriculumLog.id);

    // --- STAGE 3: TEACHER & SPECIALIST AGENTS ---
    // For each day, we generate study notes, tests, and revision cards in parallel to make this fast!
    for (const day of insertedDays) {
      // 3.1 Teacher notes
      const notesInstruction = `You are the Teacher Agent. Write detailed educational summary notes (in Markdown format) covering the topic: "${day.title}". Outline architectural details, examples, and code snippets. Also output 3 short key takeaways in a JSON formatted like: { "content": "Markdown text here", "key_takeaways": ["takeaway1", "takeaway2", "takeaway3"] }`;
      const notesResult = await callGemini(notesInstruction, day.title);
      const cleanedNotes = JSON.parse(notesResult.replace(/```json/g, '').replace(/```/g, '').trim());
      
      await supabase
        .from('study_notes')
        .insert({
          day_id: day.id,
          content: cleanedNotes.content,
          key_takeaways: cleanedNotes.key_takeaways
        });

      // 3.2 Coding Exercises (Only if code-related topic)
      const codeInstruction = `You are the Coding Agent. Formulate a hands-on programming challenge for the topic: "${day.title}". Output ONLY a valid JSON object: { "title": string, "problem_statement": string, "initial_code": string, "solution_code": string }`;
      const codeResult = await callGemini(codeInstruction, day.title);
      const parsedCode = JSON.parse(codeResult.replace(/```json/g, '').replace(/```/g, '').trim());
      
      await supabase
        .from('coding_exercises')
        .insert({
          day_id: day.id,
          title: parsedCode.title,
          problem_statement: parsedCode.problem_statement,
          initial_code: parsedCode.initial_code,
          solution_code: parsedCode.solution_code,
          test_cases: [{ input: 'test', expected: 'success' }] // Default mock test case
        });

      // 3.3 Quizzes (MCQs)
      const quizInstruction = `You are the Quiz Agent. Create 2 conceptual multiple-choice questions for "${day.title}". Output ONLY a JSON array of objects: [ { "question": string, "options": [string, string, string, string], "correct_option_index": number, "explanation": string } ]`;
      const quizResult = await callGemini(quizInstruction, day.title);
      const parsedQuizzes = JSON.parse(quizResult.replace(/```json/g, '').replace(/```/g, '').trim());
      
      for (const q of parsedQuizzes) {
        await supabase
          .from('quizzes')
          .insert({
            day_id: day.id,
            question: q.question,
            options: q.options,
            correct_option_index: q.correct_option_index,
            explanation: q.explanation
          });
      }

      // 3.4 Flashcards (Revision Agent)
      const fcInstruction = `You are the Revision Agent. Formulate 2 revision flashcards (front/back) covering "${day.title}". Output ONLY a JSON array of objects: [ { "front": string, "back": string } ]`;
      const fcResult = await callGemini(fcInstruction, day.title);
      const parsedCards = JSON.parse(fcResult.replace(/```json/g, '').replace(/```/g, '').trim());
      
      for (const card of parsedCards) {
        await supabase
          .from('flashcards')
          .insert({
            session_id: sessionId,
            day_id: day.id,
            front: card.front,
            back: card.back
          });
      }
    }

    // 4. Mark session status as completed
    await supabase
      .from('learning_sessions')
      .update({ status: 'completed' })
      .eq('id', sessionId);

    // Fetch the final merged payloads to return
    const { data: notesList } = await supabase.from('study_notes').select('*');
    const { data: codingList } = await supabase.from('coding_exercises').select('*');
    const { data: quizList } = await supabase.from('quizzes').select('*');
    const { data: cardsList } = await supabase.from('flashcards').select('*').eq('session_id', sessionId);

    const notesObj: Record<string, any> = {};
    const codingObj: Record<string, any[]> = {};
    const quizObj: Record<string, any[]> = {};

    insertedDays.forEach(day => {
      notesObj[day.id] = notesList?.find((n: any) => n.day_id === day.id);
      codingObj[day.id] = codingList?.filter((c: any) => c.day_id === day.id) || [];
      quizObj[day.id] = quizList?.filter((q: any) => q.day_id === day.id) || [];
    });

    const responsePayload = {
      session: { id: sessionId, status: 'completed', prompt, topic: prompt, difficulty_level: level, duration_days: duration, language },
      roadmap: roadmap,
      days: insertedDays,
      notes: notesObj,
      codingExercises: codingObj,
      quizzes: quizObj,
      flashcards: cardsList || [],
      progress: []
    };

    return new Response(
      JSON.stringify(responsePayload),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
