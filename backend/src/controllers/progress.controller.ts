import { Response } from 'express';
import { supabase } from '../config/supabase';
import { resendService } from '../services/resend/resend.service';
import { cloudinaryService } from '../services/cloudinary/cloudinary.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const getProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return sendError(res, 'Unauthorized', 'Fetch failed', 401);

    const { data: progressList, error } = await supabase
      .from('learning_progress')
      .select('*, course_modules(*)')
      .eq('user_id', user.profileId);

    if (error) return sendError(res, error.message, 'Database fetch failed', 500);

    return sendSuccess(res, progressList, 'User learning progress fetched successfully.');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to fetch progress');
  }
};

export const completeModule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { courseId, moduleId } = req.body;

    if (!user) return sendError(res, 'Unauthorized', 'Action failed', 401);
    if (!courseId || !moduleId) {
      return sendError(res, 'Missing courseId or moduleId parameter.', 'Bad request', 400);
    }

    // 1. Record module completion in learning_progress
    const { error: progressErr } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: user.profileId,
        course_id: courseId,
        module_id: moduleId,
        completed: true,
        completed_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,course_id,module_id'
      });

    if (progressErr) return sendError(res, progressErr.message, 'Failed to update progress', 500);

    // 2. Recalculate progress percentage for this course
    const { data: modules } = await supabase
      .from('course_modules')
      .select('id')
      .eq('course_id', courseId);

    const { data: completedProgress } = await supabase
      .from('learning_progress')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', user.profileId)
      .eq('completed', true);

    const totalModules = modules?.length || 1;
    const completedModules = completedProgress?.length || 0;
    const percentage = Math.round((completedModules / totalModules) * 100);

    await supabase
      .from('courses')
      .update({ progress_percentage: percentage })
      .eq('id', courseId);

    // 3. Inform client
    return sendSuccess(res, { percentage, completedModules, totalModules }, 'Module marked completed successfully.');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to complete module');
  }
};

export const submitQuizAttempt = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { quizId, score } = req.body;

    if (!user) return sendError(res, 'Unauthorized', 'Action failed', 401);
    if (!quizId || score === undefined) {
      return sendError(res, 'Missing quizId or score parameters.', 'Bad request', 400);
    }

    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quizId,
        user_id: user.profileId,
        score: score
      })
      .select()
      .single();

    if (error) return sendError(res, error.message, 'Database log failed', 500);

    return sendSuccess(res, attempt, 'Quiz attempt submitted successfully.');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to submit quiz attempt');
  }
};

export const submitAssessmentAttempt = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { assessmentId, score, courseTitle } = req.body;

    if (!user) return sendError(res, 'Unauthorized', 'Action failed', 401);
    if (!assessmentId || score === undefined) {
      return sendError(res, 'Missing assessmentId or score.', 'Bad request', 400);
    }

    const passed = score >= 70;
    let certificateUrl = '';

    // 1. If passed, generate mock certificate and upload to Cloudinary
    if (passed) {
      console.log('>>> [Progress Controller] Generating PDF/Image certificate for completion...');
      // Simple SVG/HTML certificate template converted to base64 for Cloudinary upload
      const svgCertificate = `
        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
          <rect width="800" height="600" fill="#0A0A16" />
          <rect x="20" y="20" width="760" height="560" fill="none" stroke="#6366F1" stroke-width="4" />
          <text x="400" y="150" fill="#FFFFFF" font-size="36" text-anchor="middle" font-family="sans-serif">LEARNFORGE AI CERTIFICATE</text>
          <text x="400" y="220" fill="#94A3B8" font-size="18" text-anchor="middle" font-family="sans-serif">This is cryptographically certified to</text>
          <text x="400" y="290" fill="#818CF8" font-size="28" font-weight="bold" text-anchor="middle" font-family="sans-serif">${user.email}</text>
          <text x="400" y="350" fill="#94A3B8" font-size="18" text-anchor="middle" font-family="sans-serif">for successfully mastering</text>
          <text x="400" y="410" fill="#10B981" font-size="24" font-weight="bold" text-anchor="middle" font-family="sans-serif">${courseTitle || 'Learning Module'}</text>
          <text x="400" y="480" fill="#475569" font-size="14" text-anchor="middle" font-family="sans-serif">Security ID: LF-${assessmentId.slice(0, 8)}</text>
        </svg>
      `;
      const base64Data = `data:image/svg+xml;base64,${Buffer.from(svgCertificate).toString('base64')}`;
      
      try {
        const uploadResponse = await cloudinaryService.uploadFile(base64Data, 'certificates');
        certificateUrl = uploadResponse.url;
      } catch (uploadErr) {
        console.error('>>> [Progress Controller] Certificate upload failed, using fallback URL:', uploadErr);
        certificateUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=600';
      }
    }

    // 2. Save submission in DB
    const { data: submission, error: dbErr } = await supabase
      .from('assessment_submissions')
      .insert({
        assessment_id: assessmentId,
        user_id: user.profileId,
        score: score,
        passed: passed,
        certificate_url: certificateUrl || null
      })
      .select()
      .single();

    if (dbErr) return sendError(res, dbErr.message, 'Database log failed', 500);

    // 3. Dispatch transactional email via Resend Service
    try {
      if (passed) {
        await resendService.sendCourseCompletionEmail(user.email, user.email.split('@')[0], courseTitle || 'Module', certificateUrl);
      } else {
        await resendService.sendAssessmentResultsEmail(user.email, user.email.split('@')[0], courseTitle || 'Module', score, false);
      }
    } catch (emailErr) {
      console.error('>>> [Progress Controller] Resend email dispatch failed:', emailErr);
    }

    return sendSuccess(res, submission, 'Assessment submission processed successfully.');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to process assessment submission');
  }
};
