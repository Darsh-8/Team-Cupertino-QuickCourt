import express from 'express';
import {
  getVenues,
  getPopularVenues,
  searchVenues,
  getVenueById,
  getVenueCourts,
  getVenueReviews,
  createVenueReview,
  getFeaturedVenues
} from '../controllers/venueController';
import { authenticate, optionalAuth } from '../middleware/auth';
import {
  validateVenueSearch,
  validateVenueId,
  validateReviewCreation
} from '../middleware/validation';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Venue:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         address:
 *           type: string
 *         latitude:
 *           type: number
 *         longitude:
 *           type: number
 *         sportsAvailable:
 *           type: array
 *           items:
 *             type: string
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *         priceMin:
 *           type: number
 *         priceMax:
 *           type: number
 *         rating:
 *           type: number
 *         reviewCount:
 *           type: integer
 *         isApproved:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/venues:
 *   get:
 *     summary: Get all venues with filtering and pagination
 *     tags: [Venues]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of venues per page
 *       - in: query
 *         name: sport
 *         schema:
 *           type: string
 *           enum: [badminton, tennis, football, basketball, cricket, swimming, table_tennis, volleyball, squash, gym]
 *         description: Filter by sport type
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price filter
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price filter
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         description: Minimum rating filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in venue name, description, or address
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rating, price-low, price-high, newest, popular]
 *           default: rating
 *         description: Sort venues by criteria
 *     responses:
 *       200:
 *         description: Venues retrieved successfully
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
 *                     venues:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Venue'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalVenues:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPrevPage:
 *                           type: boolean
 *                         limit:
 *                           type: integer
 */
router.get('/', validateVenueSearch, getVenues);

/**
 * @swagger
 * /api/venues/popular:
 *   get:
 *     summary: Get popular venues
 *     tags: [Venues]
 *     responses:
 *       200:
 *         description: Popular venues retrieved successfully
 */
router.get('/popular', getPopularVenues);

/**
 * @swagger
 * /api/venues/featured:
 *   get:
 *     summary: Get featured venues
 *     tags: [Venues]
 *     responses:
 *       200:
 *         description: Featured venues retrieved successfully
 */
router.get('/featured', getFeaturedVenues);

/**
 * @swagger
 * /api/venues/search:
 *   get:
 *     summary: Search venues
 *     tags: [Venues]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *       400:
 *         description: Search query or location is required
 */
router.get('/search', searchVenues);

/**
 * @swagger
 * /api/venues/{id}:
 *   get:
 *     summary: Get venue by ID
 *     tags: [Venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Venue ID
 *     responses:
 *       200:
 *         description: Venue retrieved successfully
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
 *                     venue:
 *                       $ref: '#/components/schemas/Venue'
 *       404:
 *         description: Venue not found
 */
router.get('/:id', validateVenueId, optionalAuth, getVenueById);

/**
 * @swagger
 * /api/venues/{id}/courts:
 *   get:
 *     summary: Get venue courts
 *     tags: [Venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Venue ID
 *       - in: query
 *         name: sport
 *         schema:
 *           type: string
 *         description: Filter courts by sport type
 *     responses:
 *       200:
 *         description: Courts retrieved successfully
 *       404:
 *         description: Venue not found
 */
router.get('/:id/courts', validateVenueId, getVenueCourts);

/**
 * @swagger
 * /api/venues/{id}/reviews:
 *   get:
 *     summary: Get venue reviews
 *     tags: [Venues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Venue ID
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
 *         description: Reviews retrieved successfully
 *       404:
 *         description: Venue not found
 */
router.get('/:id/reviews', validateVenueId, getVenueReviews);

/**
 * @swagger
 * /api/venues/{id}/reviews:
 *   post:
 *     summary: Create venue review
 *     tags: [Venues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Venue ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 1000
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error or user already reviewed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Venue not found
 */
router.post('/:id/reviews', authenticate, validateReviewCreation, createVenueReview);

export default router;