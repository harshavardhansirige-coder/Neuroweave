import { Response } from 'express';
import { supabase } from '../config/supabase';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return sendError(res, 'Unauthorized: Request context does not contain user claims.', 'Auth failed', 401);
    }

    // Retrieve full profile from Supabase
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*, settings(*)')
      .eq('id', user.profileId)
      .single();

    if (error) {
      return sendError(res, error.message, 'Failed to retrieve profile', 500);
    }

    // Create a learning session log if needed (placeholder or track activity)
    console.log(`>>> [Auth Controller] User logged in: ${user.email}`);

    return sendSuccess(res, { profile }, 'Authentication successful');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Login failed');
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    console.log(`>>> [Auth Controller] User logged out: ${user?.email}`);
    return sendSuccess(res, null, 'Logged out successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Logout failed');
  }
};

export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return sendError(res, 'Unauthorized', 'Profile fetch failed', 401);
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*, settings(*)')
      .eq('id', user.profileId)
      .single();

    if (error) {
      return sendError(res, error.message, 'Database lookup failed', 500);
    }

    return sendSuccess(res, profile, 'Profile retrieved successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Failed to retrieve profile');
  }
};

export const updateSettings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const { preferredTheme, preferredAiProvider, emailNotifications } = req.body;

    if (!user) {
      return sendError(res, 'Unauthorized', 'Settings update failed', 401);
    }

    const { data, error } = await supabase
      .from('settings')
      .update({
        preferred_theme: preferredTheme,
        preferred_ai_provider: preferredAiProvider,
        email_notifications: emailNotifications,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.profileId)
      .select()
      .single();

    if (error) {
      return sendError(res, error.message, 'Failed to update settings', 500);
    }

    return sendSuccess(res, data, 'Settings updated successfully');
  } catch (err: any) {
    return sendError(res, err.message || err, 'Settings update failed');
  }
};
