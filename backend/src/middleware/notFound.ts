import { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: {
      auth: '/api/auth',
      venues: '/api/venues',
      bookings: '/api/bookings',
      users: '/api/users',
      documentation: '/api-docs',
      health: '/health'
    }
  });
};