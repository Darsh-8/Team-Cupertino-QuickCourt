import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import User from '../models/User';
import Booking from '../models/Booking';
import Review from '../models/Review';
import Venue from '../models/Venue';
import Court from '../models/Court';
import { uploadService } from '../services/uploadService';

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password', 'otpCode', 'otpExpiry'] }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Get user statistics
  const totalBookings = await Booking.count({
    where: { userId: user.id }
  });

  const totalSpent = await Booking.sum('totalAmount', {
    where: { 
      userId: user.id,
      paymentStatus: 'paid'
    }
  }) || 0;

  const totalReviews = await Review.count({
    where: { userId: user.id }
  });

  res.json({
    success: true,
    data: {
      user,
      stats: {
        totalBookings,
        totalSpent,
        totalReviews
      }
    }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email } = req.body;
  
  const user = await User.findByPk(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email is already taken', 400);
    }
    user.email = email;
    // In a real application, you might want to require email re-verification
  }

  if (fullName) user.fullName = fullName;

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.toJSON()
    }
  });
});

/**
 * @desc    Upload user avatar
 * @route   POST /api/users/avatar
 * @access  Private
 */
export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError('Please upload an image file', 400);
  }

  const user = await User.findByPk(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Delete old avatar if exists
  if (user.avatar) {
    await uploadService.deleteFile(user.avatar);
  }

  // Update user avatar
  user.avatar = `/uploads/avatars/${req.file.filename}`;
  await user.save();

  res.json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: {
      avatar: user.avatar
    }
  });
});

/**
 * @desc    Delete user avatar
 * @route   DELETE /api/users/avatar
 * @access  Private
 */
export const deleteAvatar = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByPk(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.avatar) {
    throw new AppError('No avatar to delete', 400);
  }

  // Delete avatar file
  await uploadService.deleteFile(user.avatar);

  // Update user
  user.avatar = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Avatar deleted successfully'
  });
});

/**
 * @desc    Get user bookings
 * @route   GET /api/users/bookings
 * @access  Private
 */
export const getUserBookings = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    status,
    sport
  } = req.query;
  
  const userId = req.user.id;
  const offset = (Number(page) - 1) * Number(limit);

  // Build where clause
  const whereClause: any = { userId };
  if (status) {
    whereClause.status = status;
  }

  // Build include clause
  const includeClause: any[] = [
    {
      model: Venue,
      as: 'venue',
      attributes: ['id', 'name', 'address', 'photos']
    },
    {
      model: Court,
      as: 'court',
      attributes: ['id', 'name', 'sportType']
    }
  ];

  // Add sport filter if specified
  if (sport) {
    includeClause[1].where = { sportType: sport };
  }

  const { count, rows: bookings } = await Booking.findAndCountAll({
    where: whereClause,
    include: includeClause,
    order: [['bookingDate', 'DESC'], ['startTime', 'DESC']],
    limit: Number(limit),
    offset
  });

  const totalPages = Math.ceil(count / Number(limit));

  res.json({
    success: true,
    data: {
      bookings,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalBookings: count,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1
      }
    }
  });
});

/**
 * @desc    Get user reviews
 * @route   GET /api/users/reviews
 * @access  Private
 */
export const getUserReviews = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10
  } = req.query;
  
  const userId = req.user.id;
  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows: reviews } = await Review.findAndCountAll({
    where: { userId },
    include: [
      {
        model: Venue,
        as: 'venue',
        attributes: ['id', 'name', 'photos']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  const totalPages = Math.ceil(count / Number(limit));

  res.json({
    success: true,
    data: {
      reviews,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalReviews: count,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1
      }
    }
  });
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/users/account
 * @access  Private
 */
export const deleteUserAccount = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body;
  
  if (!password) {
    throw new AppError('Password is required to delete account', 400);
  }

  const user = await User.findByPk(req.user.id, {
    attributes: { include: ['password'] }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid password', 400);
  }

  // Delete user avatar if exists
  if (user.avatar) {
    await uploadService.deleteFile(user.avatar);
  }

  // Delete user account
  await user.destroy();

  res.json({
    success: true,
    message: 'Account deleted successfully'
  });
});