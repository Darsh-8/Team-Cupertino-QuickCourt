import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  deleteAvatar,
  getUserBookings,
  getUserReviews,
  deleteUserAccount
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validateProfileUpdate } from '../middleware/validation';

const router = express.Router();

// Multer configuration for avatar upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile with statistics
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalBookings:
 *                           type: integer
 *                         totalSpent:
 *                           type: number
 *                         totalReviews:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile', authenticate, getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error or email already taken
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/profile', authenticate, validateProfileUpdate, updateUserProfile);

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file (JPEG, PNG, GIF, max 5MB)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatar:
 *                       type: string
 *       400:
 *         description: No file uploaded or invalid file type
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post('/avatar', authenticate, upload.single('avatar'), uploadAvatar);

/**
 * @swagger
 * /api/users/avatar:
 *   delete:
 *     summary: Delete user avatar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar deleted successfully
 *       400:
 *         description: No avatar to delete
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/avatar', authenticate, deleteAvatar);

/**
 * @swagger
 * /api/users/bookings:
 *   get:
 *     summary: Get user bookings
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Bookings per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [confirmed, cancelled, completed]
 *         description: Filter by status
 *       - in: query
 *         name: sport
 *         schema:
 *           type: string
 *         description: Filter by sport type
 *     responses:
 *       200:
 *         description: User bookings retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/bookings', authenticate, getUserBookings);

/**
 * @swagger
 * /api/users/reviews:
 *   get:
 *     summary: Get user reviews
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Reviews per page
 *     responses:
 *       200:
 *         description: User reviews retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/reviews', authenticate, getUserReviews);

/**
 * @swagger
 * /api/users/account:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: Current password for verification
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Password required or invalid password
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/account', authenticate, deleteUserAccount);

export default router;