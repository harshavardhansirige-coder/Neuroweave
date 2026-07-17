import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  error: any;
}

export const sendSuccess = <T = any>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200
) => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    error: null
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: any,
  message: string = 'Operation failed',
  statusCode: number = 500
) => {
  const response: ApiResponse<null> = {
    success: false,
    data: null,
    message,
    error: typeof error === 'string' ? { message: error } : error
  };
  return res.status(statusCode).json(response);
};
