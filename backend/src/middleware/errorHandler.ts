import { Request, Response, NextFunction } from 'express';
import { ValidationError, DatabaseError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let err = { ...error };
  err.message = error.message;

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
  }

  // Sequelize Validation Error
  if (error instanceof ValidationError) {
    const message = error.errors.map(err => err.message).join(', ');
    err = new AppError(message, 400);
  }

  // Sequelize Unique Constraint Error
  if (error instanceof UniqueConstraintError) {
    const field = error.errors[0]?.path || 'field';
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    err = new AppError(message, 400);
  }

  // Sequelize Foreign Key Constraint Error
  if (error instanceof ForeignKeyConstraintError) {
    const message = 'Referenced resource not found';
    err = new AppError(message, 400);
  }

  // Sequelize Database Error
  if (error instanceof DatabaseError) {
    const message = 'Database operation failed';
    err = new AppError(message, 500);
  }

  // JWT Error
  if (error.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    err = new AppError(message, 401);
  }

  // JWT Expired Error
  if (error.name === 'TokenExpiredError') {
    const message = 'Token expired';
    err = new AppError(message, 401);
  }

  // Multer Error (File upload)
  if (error.code === 'LIMIT_FILE_SIZE') {
    const message = 'File size too large';
    err = new AppError(message, 400);
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field';
    err = new AppError(message, 400);
  }

  // Cast Error (Invalid ObjectId)
  if (error.name === 'CastError') {
    const message = 'Invalid resource ID';
    err = new AppError(message, 400);
  }

  // Default error response
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: error.message,
      stack: error.stack
    })
  });
};

// Async error handler wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};