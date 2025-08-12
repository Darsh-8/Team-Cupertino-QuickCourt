import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';

// Handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(error => error.msg)
    });
    return;
  }
  
  next();
};

// User registration validation
export const validateUserRegistration = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['customer', 'owner', 'admin'])
    .withMessage('Role must be customer, owner, or admin'),
  
  handleValidationErrors
];

// User login validation
export const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// OTP verification validation
export const validateOTPVerification = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('otpCode')
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage('OTP must be a 6-digit number'),
  
  handleValidationErrors
];

// Booking creation validation
export const validateBookingCreation = [
  body('venueId')
    .isInt({ min: 1 })
    .withMessage('Valid venue ID is required'),
  
  body('courtId')
    .isInt({ min: 1 })
    .withMessage('Valid court ID is required'),
  
  body('bookingDate')
    .isISO8601()
    .toDate()
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (value < today) {
        throw new Error('Booking date must be today or in the future');
      }
      return true;
    }),
  
  body('startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  
  body('endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format')
    .custom((endTime, { req }) => {
      const startTime = req.body.startTime;
      if (startTime && endTime <= startTime) {
        throw new Error('End time must be after start time');
      }
      return true;
    }),
  
  body('duration')
    .isInt({ min: 1, max: 8 })
    .withMessage('Duration must be between 1 and 8 hours'),
  
  handleValidationErrors
];

// Review creation validation
export const validateReviewCreation = [
  param('venueId')
    .isInt({ min: 1 })
    .withMessage('Valid venue ID is required'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  
  handleValidationErrors
];

// Venue search validation
export const validateVenueSearch = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('sport')
    .optional()
    .isIn(['badminton', 'tennis', 'football', 'basketball', 'cricket', 'swimming', 'table_tennis', 'volleyball', 'squash', 'gym'])
    .withMessage('Invalid sport type'),
  
  query('priceMin')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  query('priceMax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  
  query('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  
  handleValidationErrors
];

// Venue ID validation
export const validateVenueId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid venue ID is required'),
  
  handleValidationErrors
];

// Booking ID validation
export const validateBookingId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid booking ID is required'),
  
  handleValidationErrors
];

// Profile update validation
export const validateProfileUpdate = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  handleValidationErrors
];

// Password change validation
export const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  
  handleValidationErrors
];