import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import Booking from '../models/Booking';
import Court from '../models/Court';
import Venue from '../models/Venue';
import User from '../models/User';
import { processPayment } from '../services/paymentService';

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const {
    venueId,
    courtId,
    bookingDate,
    startTime,
    endTime,
    duration
  } = req.body;
  
  const userId = req.user.id;

  // Validate court exists and belongs to venue
  const court = await Court.findOne({
    where: { id: courtId, venueId, isActive: true },
    include: [
      {
        model: Venue,
        as: 'venue',
        attributes: ['id', 'name', 'isApproved']
      }
    ]
  });

  if (!court) {
    throw new AppError('Court not found or not available', 404);
  }

  if (!(court as any).venue.isApproved) {
    throw new AppError('Venue is not available for booking', 400);
  }

  // Check if court is operating at the requested time
  if (!court.isOperatingAt(startTime) || !court.isOperatingAt(endTime)) {
    throw new AppError('Court is not operating at the requested time', 400);
  }

  // Check for booking conflicts
  const conflictingBooking = await Booking.findOne({
    where: {
      courtId,
      bookingDate,
      status: { [Op.in]: ['confirmed', 'completed'] },
      [Op.or]: [
        {
          startTime: { [Op.lt]: endTime },
          endTime: { [Op.gt]: startTime }
        }
      ]
    }
  });

  if (conflictingBooking) {
    throw new AppError('Court is already booked for the selected time slot', 400);
  }

  // Calculate total amount
  const totalAmount = court.pricePerHour * duration;

  // Process payment (simulated)
  const paymentResult = await processPayment({
    amount: totalAmount,
    currency: 'INR',
    description: `Booking for ${(court as any).venue.name} - ${court.name}`,
    userId
  });

  if (!paymentResult.success) {
    throw new AppError('Payment processing failed', 400);
  }

  // Create booking
  const booking = await Booking.create({
    userId,
    venueId,
    courtId,
    bookingDate,
    startTime,
    endTime,
    duration,
    totalAmount,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentId: paymentResult.paymentId
  });

  // Fetch booking with related data
  const createdBooking = await Booking.findByPk(booking.id, {
    include: [
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
    ]
  });

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: {
      booking: createdBooking
    }
  });
});

/**
 * @desc    Get user's bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    status,
    dateFrom,
    dateTo,
    sport
  } = req.query;
  
  const userId = req.user.id;
  const offset = (Number(page) - 1) * Number(limit);

  // Build where clause
  const whereClause: any = { userId };

  if (status) {
    whereClause.status = status;
  }

  if (dateFrom || dateTo) {
    whereClause.bookingDate = {};
    if (dateFrom) {
      whereClause.bookingDate[Op.gte] = dateFrom;
    }
    if (dateTo) {
      whereClause.bookingDate[Op.lte] = dateTo;
    }
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
 * @desc    Get booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const booking = await Booking.findOne({
    where: { id, userId },
    include: [
      {
        model: Venue,
        as: 'venue',
        attributes: ['id', 'name', 'address', 'photos', 'amenities']
      },
      {
        model: Court,
        as: 'court',
        attributes: ['id', 'name', 'sportType', 'pricePerHour']
      },
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'avatar']
      }
    ]
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  res.json({
    success: true,
    data: {
      booking
    }
  });
});

/**
 * @desc    Cancel booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const booking = await Booking.findOne({
    where: { id, userId }
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  if (!booking.canBeCancelled()) {
    throw new AppError('Booking cannot be cancelled. Cancellation is only allowed up to 2 hours before the booking time.', 400);
  }

  // Cancel booking
  await booking.cancel();

  // Process refund (simulated)
  if (booking.paymentStatus === 'paid') {
    // In a real application, you would process the refund here
    booking.paymentStatus = 'refunded';
    await booking.save();
  }

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      booking
    }
  });
});

/**
 * @desc    Check court availability
 * @route   GET /api/bookings/availability
 * @access  Public
 */
export const checkAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { courtId, date } = req.query;

  if (!courtId || !date) {
    throw new AppError('Court ID and date are required', 400);
  }

  // Get court details
  const court = await Court.findOne({
    where: { id: Number(courtId), isActive: true }
  });

  if (!court) {
    throw new AppError('Court not found', 404);
  }

  // Get existing bookings for the date
  const existingBookings = await Booking.findAll({
    where: {
      courtId: Number(courtId),
      bookingDate: date as string,
      status: { [Op.in]: ['confirmed', 'completed'] }
    },
    attributes: ['startTime', 'endTime'],
    order: [['startTime', 'ASC']]
  });

  // Generate available time slots
  const operatingStart = court.operatingStart;
  const operatingEnd = court.operatingEnd;
  
  const availableSlots: string[] = [];
  const bookedSlots = existingBookings.map(booking => ({
    start: booking.startTime,
    end: booking.endTime
  }));

  // Generate hourly slots from operating start to end
  let currentHour = parseInt(operatingStart.split(':')[0]);
  const endHour = parseInt(operatingEnd.split(':')[0]);

  while (currentHour < endHour) {
    const slotStart = `${currentHour.toString().padStart(2, '0')}:00`;
    const slotEnd = `${(currentHour + 1).toString().padStart(2, '0')}:00`;
    
    // Check if this slot conflicts with any booking
    const isBooked = bookedSlots.some(booking => 
      (slotStart >= booking.start && slotStart < booking.end) ||
      (slotEnd > booking.start && slotEnd <= booking.end) ||
      (slotStart <= booking.start && slotEnd >= booking.end)
    );

    if (!isBooked) {
      availableSlots.push(slotStart);
    }

    currentHour++;
  }

  res.json({
    success: true,
    data: {
      courtId: Number(courtId),
      date,
      availableSlots,
      bookedSlots,
      operatingHours: {
        start: operatingStart,
        end: operatingEnd
      }
    }
  });
});

/**
 * @desc    Get booking statistics
 * @route   GET /api/bookings/stats
 * @access  Private
 */
export const getBookingStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.id;

  // Get total bookings count
  const totalBookings = await Booking.count({
    where: { userId }
  });

  // Get bookings by status
  const bookingsByStatus = await Booking.findAll({
    where: { userId },
    attributes: [
      'status',
      [Booking.sequelize!.fn('COUNT', Booking.sequelize!.col('status')), 'count']
    ],
    group: ['status'],
    raw: true
  });

  // Get total amount spent
  const totalSpent = await Booking.sum('totalAmount', {
    where: { 
      userId,
      paymentStatus: 'paid'
    }
  }) || 0;

  // Get upcoming bookings count
  const upcomingBookings = await Booking.count({
    where: {
      userId,
      status: 'confirmed',
      bookingDate: { [Op.gte]: new Date() }
    }
  });

  // Get favorite sports
  const favoriteSports = await Booking.findAll({
    where: { userId },
    include: [
      {
        model: Court,
        as: 'court',
        attributes: ['sportType']
      }
    ],
    attributes: [
      [Booking.sequelize!.col('court.sportType'), 'sport'],
      [Booking.sequelize!.fn('COUNT', Booking.sequelize!.col('court.sportType')), 'count']
    ],
    group: ['court.sportType'],
    order: [[Booking.sequelize!.fn('COUNT', Booking.sequelize!.col('court.sportType')), 'DESC']],
    limit: 5,
    raw: true
  });

  res.json({
    success: true,
    data: {
      totalBookings,
      bookingsByStatus,
      totalSpent,
      upcomingBookings,
      favoriteSports
    }
  });
});