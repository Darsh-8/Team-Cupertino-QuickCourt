import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getDashboardKPIs,
  getDashboardCharts,
  getOwnerFacilities,
  addVenue,
  updateVenue,
  uploadVenuePhotos,
  getVenueCourts,
  addCourt,
  updateCourt,
  toggleCourtStatus,
  getCourtCalendar,
  blockTimeSlots,
  setCustomPricing,
  bulkUpdateTimeSlots,
  getVenueBookings
} from '../controllers/ownerController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// Multer configuration for venue photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/venues/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'venue-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Apply authentication and authorization to all routes
router.use(authenticate);
router.use(authorize('owner', 'admin'));

/**
 * @swagger
 * /api/owner/dashboard/kpis:
 *   get:
 *     summary: Get owner dashboard KPIs
 *     tags: [Owner Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard KPIs retrieved successfully
 */
router.get('/dashboard/kpis', getDashboardKPIs);

/**
 * @swagger
 * /api/owner/dashboard/charts:
 *   get:
 *     summary: Get dashboard charts data
 *     tags: [Owner Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *           default: week
 *       - in: query
 *         name: venueId
 *         schema:
 *           type: integer
 *         description: Filter by specific venue
 *     responses:
 *       200:
 *         description: Charts data retrieved successfully
 */
router.get('/dashboard/charts', getDashboardCharts);

/**
 * @swagger
 * /api/owner/facilities:
 *   get:
 *     summary: Get owner's facilities
 *     tags: [Facility Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Facilities retrieved successfully
 */
router.get('/facilities', getOwnerFacilities);

/**
 * @swagger
 * /api/owner/facilities:
 *   post:
 *     summary: Add new venue
 *     tags: [Facility Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Venue added successfully
 */
router.post('/facilities', addVenue);

/**
 * @swagger
 * /api/owner/facilities/{venueId}:
 *   put:
 *     summary: Update venue details
 *     tags: [Facility Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Venue updated successfully
 */
router.put('/facilities/:venueId', updateVenue);

/**
 * @swagger
 * /api/owner/facilities/{venueId}/photos:
 *   post:
 *     summary: Upload venue photos
 *     tags: [Facility Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Photos uploaded successfully
 */
router.post('/facilities/:venueId/photos', upload.array('photos', 10), uploadVenuePhotos);

/**
 * @swagger
 * /api/owner/courts:
 *   get:
 *     summary: Get venue courts
 *     tags: [Court Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courts retrieved successfully
 */
router.get('/courts', getVenueCourts);

/**
 * @swagger
 * /api/owner/courts:
 *   post:
 *     summary: Add new court
 *     tags: [Court Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Court added successfully
 */
router.post('/courts', addCourt);

/**
 * @swagger
 * /api/owner/courts/{courtId}:
 *   put:
 *     summary: Update court details
 *     tags: [Court Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Court updated successfully
 */
router.put('/courts/:courtId', updateCourt);

/**
 * @swagger
 * /api/owner/courts/{courtId}/status:
 *   put:
 *     summary: Toggle court status
 *     tags: [Court Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Court status updated successfully
 */
router.put('/courts/:courtId/status', toggleCourtStatus);

/**
 * @swagger
 * /api/owner/time-slots/calendar:
 *   get:
 *     summary: Get court availability calendar
 *     tags: [Time Slot Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Calendar data retrieved successfully
 */
router.get('/time-slots/calendar', getCourtCalendar);

/**
 * @swagger
 * /api/owner/time-slots/block:
 *   post:
 *     summary: Block time slots
 *     tags: [Time Slot Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Time slots blocked successfully
 */
router.post('/time-slots/block', blockTimeSlots);

/**
 * @swagger
 * /api/owner/time-slots/pricing:
 *   put:
 *     summary: Set custom pricing for time slots
 *     tags: [Time Slot Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Custom pricing applied successfully
 */
router.put('/time-slots/pricing', setCustomPricing);

/**
 * @swagger
 * /api/owner/time-slots/bulk-update:
 *   post:
 *     summary: Bulk update time slots availability
 *     tags: [Time Slot Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bulk update completed successfully
 */
router.post('/time-slots/bulk-update', bulkUpdateTimeSlots);

/**
 * @swagger
 * /api/owner/bookings:
 *   get:
 *     summary: Get all venue bookings
 *     tags: [Booking Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 */
router.get('/bookings', getVenueBookings);

export default router;