import { Response, NextFunction } from 'express';
import { verifyFirebaseToken } from '../config/firebase';
import { supabase } from '../config/supabase';
import { sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Unauthorized: Missing or invalid Authorization header.', 'Authentication failed', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify token
    const decodedToken = await verifyFirebaseToken(token);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return sendError(res, 'Unauthorized: Firebase token must contain an email.', 'Authentication failed', 401);
    }

    // 2. Check if profile exists in Supabase, create if not
    let { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('firebase_uid', uid)
      .maybeSingle();

    if (fetchError) {
      console.error('>>> [Auth Middleware] Error fetching profile:', fetchError);
      return sendError(res, fetchError, 'Database lookup failed', 500);
    }

    if (!profile) {
      // Create user profile
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          firebase_uid: uid,
          email: email,
          display_name: name || email.split('@')[0],
          photo_url: picture || ''
        })
        .select('id')
        .single();

      if (createError) {
        console.error('>>> [Auth Middleware] Error creating profile:', createError);
        return sendError(res, createError, 'Failed to create user profile in database', 500);
      }

      profile = newProfile;
      console.log(`>>> [Auth Middleware] Profile created for user: ${email} (${uid})`);

      // Initialize default settings for user
      await supabase.from('settings').insert({
        user_id: profile.id,
        preferred_theme: 'dark',
        preferred_ai_provider: 'gemini',
        email_notifications: true
      });
    }

    // 3. Attach user info to request
    req.user = {
      uid: uid,
      email: email,
      profileId: profile.id
    };

    next();
  } catch (error: any) {
    return sendError(res, error.message || error, 'Unauthorized: Token validation failed.', 401);
  }
};
