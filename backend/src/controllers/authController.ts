import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import { generateToken } from '../middleware/auth';
import User from '../models/User';
import { sendEmail } from '../services/emailService';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password, role = 'customer' } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('User with this email already exists', 400);
  }

  // Create user
  const user = await User.create({
    fullName,
    email,
    password,
    role,
    isVerified: process.env.SKIP_EMAIL_VERIFICATION === 'true' // Skip verification in demo mode
  });

  // Generate OTP for email verification
  let otpCode = '';
  if (process.env.SKIP_EMAIL_VERIFICATION !== 'true') {
    otpCode = await user.generateOTP();
    
    // Send verification email
    try {
      await sendEmail({
        to: email,
        subject: 'QuickCourt - Verify Your Email',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e11d48;">Welcome to QuickCourt!</h2>
            <p>Hi ${fullName},</p>
            <p>Thank you for registering with QuickCourt. Please verify your email address using the OTP below:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #e11d48; font-size: 32px; margin: 0;">${otpCode}</h1>
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't create this account, please ignore this email.</p>
            <hr style="margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px;">
              Best regards,<br>
              The QuickCourt Team
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail registration if email fails in demo mode
    }
  }

  // Generate token
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    message: process.env.SKIP_EMAIL_VERIFICATION === 'true' 
      ? 'User registered successfully' 
      : 'User registered successfully. Please check your email for verification code.',
    data: {
      user: user.toJSON(),
      token,
      ...(process.env.DEMO_MODE === 'true' && otpCode && { otpCode }) // Include OTP in demo mode
    }
  });
});

/**
 * @desc    Verify email with OTP
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email, otpCode } = req.body;

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isVerified) {
    throw new AppError('User is already verified', 400);
  }

  // Skip OTP verification in demo mode
  if (process.env.SKIP_EMAIL_VERIFICATION === 'true') {
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = generateToken(user);

    return res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  }

  // Verify OTP
  if (!user.isOTPValid(otpCode)) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  // Update user verification status
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpiry = undefined;
  await user.save();

  // Generate token
  const token = generateToken(user);

  return res.json({
    success: true,
    message: 'Email verified successfully',
    data: {
      user: user.toJSON(),
      token
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user with password
  const user = await User.findOne({ 
    where: { email },
    attributes: { include: ['password'] }
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is verified (skip in demo mode)
  if (!user.isVerified && process.env.SKIP_EMAIL_VERIFICATION !== 'true') {
    throw new AppError('Please verify your email before logging in', 401);
  }

  // Generate token
  const token = generateToken(user);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.toJSON(),
      token
    }
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByPk(req.user.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: {
      user: user.toJSON()
    }
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
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
    user.isVerified = false; // Require re-verification for new email
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
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  
  const user = await User.findByPk(req.user.id, {
    attributes: { include: ['password'] }
  });
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('User not found with this email', 404);
  }

  // Generate OTP for password reset
  const otpCode = await user.generateOTP();

  // Send password reset email
  try {
    await sendEmail({
      to: email,
      subject: 'QuickCourt - Password Reset',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e11d48;">Password Reset Request</h2>
          <p>Hi ${user.fullName},</p>
          <p>You requested to reset your password. Use the OTP below to reset your password:</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #e11d48; font-size: 32px; margin: 0;">${otpCode}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The QuickCourt Team
          </p>
        </div>
      `
    });
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    throw new AppError('Failed to send password reset email', 500);
  }

  res.json({
    success: true,
    message: 'Password reset OTP sent to your email',
    ...(process.env.DEMO_MODE === 'true' && { otpCode }) // Include OTP in demo mode
  });
});

/**
 * @desc    Reset password with OTP
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, otpCode, newPassword } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify OTP
  if (!user.isOTPValid(otpCode)) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  // Update password
  user.password = newPassword;
  user.otpCode = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  // In a real application, you might want to blacklist the token
  // For now, we'll just send a success response
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});