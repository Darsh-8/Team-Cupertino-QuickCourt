import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  checkAvailability,
  getBookingStats
} from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';
import {
  validateBookingCreation,
  validateBookingId
} from '../middleware/validation';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         userId:
 *           type: integer
 *         venueId:
 *           type: integer
 *         courtId:
 *           type: integer
 *         bookingDate:
 *           type: string
 *           format: date
 *         startTime:
 *           type: string
 *           format: time
 *         endTime:
 *           type: string
 *           format: time
 *         duration:
 *           type: integer
 *         totalAmount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [confirmed, cancelled, completed]
 *         paymentStatus:
 *           type: string
 *           enum: [pending, paid, refunded]
 *         paymentId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - venueId
 *               - courtId
 *               - bookingDate
 *               - startTime
 *               - endTime
 *               - duration
 *             properties:
 *               venueId:
 *                 type: integer
 *                 example: 1
 *               courtId:
 *                 type: integer
 *                 example: 1
 *               bookingDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-08-15"
 *               startTime:
 *                 type: string
 *                 format: time
 *                 example: "10:00"
 *               endTime:
 *                 type: string
 *                 format: time
 *                 example: "12:00"
 *               duration:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 8
 *                 example: 2
 *     responses:
 *       201:
 *         description: Booking created successfully
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
 *                     booking:
 *                       $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error or booking conflict
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Court or venue not found
 */
router.post('/', authenticate, validateBookingCreation, createBooking);

/**
 * @swagger
 * /api/bookings/my-bookings:
 *   get:
 *     summary: Get user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *         description: Bookings per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [confirmed, cancelled, completed]
 *         description: Filter by booking status
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter bookings from date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter bookings to date
 *       - in: query
 *         name: sport
 *         schema:
 *           type: string
 *         description: Filter by sport type
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
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
 *                     bookings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Booking'
 *                     pagination:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/my-bookings', authenticate, getMyBookings);

/**
 * @swagger
 * /api/bookings/stats:
 *   get:
 *     summary: Get booking statistics
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authenticate, getBookingStats);

/**
 * @swagger
 * /api/bookings/availability:
 *   get:
 *     summary: Check court availability
 *     tags: [Bookings]
 *     parameters:
 *       - in: query
 *         name: courtId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Court ID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to check availability
 *     responses:
 *       200:
 *         description: Availability information retrieved successfully
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
 *                     courtId:
 *                       type: integer
 *                     date:
 *                       type: string
 *                       format: date
 *                     availableSlots:
 *                       type: array
 *                       items:
 *                         type: string
 *                     bookedSlots:
 *                       type: array
 *                       items:
 *                         type: object
 *                     operatingHours:
 *                       type: object
 *       400:
 *         description: Court ID and date are required
 *       404:
 *         description: Court not found
 */
router.get('/availability', checkAvailability);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
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
 *                     booking:
 *                       $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.get('/:id', authenticate, validateBookingId, getBookingById);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       400:
 *         description: Booking cannot be cancelled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Booking not found
 */
router.put('/:id/cancel', authenticate, validateBookingId, cancelBooking);

export default router;