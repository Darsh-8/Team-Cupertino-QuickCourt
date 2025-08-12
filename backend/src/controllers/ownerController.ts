import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import Venue from '../models/Venue';
import Court from '../models/Court';
import TimeSlot from '../models/TimeSlot';
import VenueAnalytics from '../models/VenueAnalytics';
import Booking from '../models/Booking';
import Review from '../models/Review';
import User from '../models/User';

/**
 * @desc    Get owner dashboard KPIs
 * @route   GET /api/owner/dashboard/kpis
 * @access  Private (Owner only)
 */
export const getDashboardKPIs = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  
  // Get owner's venues
  const venues = await Venue.findAll({
    where: { ownerId },
    attributes: ['id', 'name']
  });
  
  const venueIds = venues.map(v => v.id);
  
  if (venueIds.length === 0) {
    return res.json({
      success: true,
      data: {
        totalBookings: 0,
        activeCourts: 0,
        totalEarnings: 0,
        monthlyGrowth: 0,
        bookingCalendar: { today: 0, thisWeek: 0, thisMonth: 0 },
        topPerformingCourt: null
      }
    });
  }

  // Calculate date ranges
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  // Get total bookings
  const totalBookings = await Booking.count({
    where: { venueId: { [Op.in]: venueIds } }
  });

  // Get active courts
  const activeCourts = await Court.count({
    where: { 
      venueId: { [Op.in]: venueIds },
      isActive: true,
      maintenanceMode: false
    }
  });

  // Get total earnings
  const totalEarnings = await Booking.sum('totalAmount', {
    where: { 
      venueId: { [Op.in]: venueIds },
      paymentStatus: 'paid'
    }
  }) || 0;

  // Get this month's earnings
  const thisMonthEarnings = await Booking.sum('totalAmount', {
    where: { 
      venueId: { [Op.in]: venueIds },
      paymentStatus: 'paid',
      createdAt: { [Op.gte]: startOfMonth }
    }
  }) || 0;

  // Get last month's earnings for growth calculation
  const lastMonthEarnings = await Booking.sum('totalAmount', {
    where: { 
      venueId: { [Op.in]: venueIds },
      paymentStatus: 'paid',
      createdAt: { 
        [Op.gte]: lastMonth,
        [Op.lte]: endOfLastMonth
      }
    }
  }) || 0;

  // Calculate monthly growth
  const monthlyGrowth = lastMonthEarnings > 0 
    ? ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 
    : 0;

  // Get booking calendar data
  const todayBookings = await Booking.count({
    where: { 
      venueId: { [Op.in]: venueIds },
      bookingDate: today.toISOString().split('T')[0]
    }
  });

  const weekBookings = await Booking.count({
    where: { 
      venueId: { [Op.in]: venueIds },
      bookingDate: { [Op.gte]: startOfWeek }
    }
  });

  const monthBookings = await Booking.count({
    where: { 
      venueId: { [Op.in]: venueIds },
      bookingDate: { [Op.gte]: startOfMonth }
    }
  });

  // Get top performing court
  const courtPerformance = await Booking.findAll({
    where: { venueId: { [Op.in]: venueIds } },
    attributes: [
      'courtId',
      [Booking.sequelize!.fn('COUNT', Booking.sequelize!.col('id')), 'bookingCount'],
      [Booking.sequelize!.fn('SUM', Booking.sequelize!.col('totalAmount')), 'revenue']
    ],
    include: [{
      model: Court,
      as: 'court',
      attributes: ['name']
    }],
    group: ['courtId'],
    order: [[Booking.sequelize!.fn('COUNT', Booking.sequelize!.col('id')), 'DESC']],
    limit: 1,
    raw: false
  });

  const topPerformingCourt = courtPerformance.length > 0 ? {
    courtName: (courtPerformance[0] as any).court?.name || 'Unknown',
    bookings: (courtPerformance[0] as any).dataValues.bookingCount,
    revenue: (courtPerformance[0] as any).dataValues.revenue
  } : null;

  return res.json({
    success: true,
    data: {
      totalBookings,
      activeCourts,
      totalEarnings: Number(totalEarnings),
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      bookingCalendar: {
        today: todayBookings,
        thisWeek: weekBookings,
        thisMonth: monthBookings
      },
      topPerformingCourt
    }
  });
});

/**
 * @desc    Get dashboard charts data
 * @route   GET /api/owner/dashboard/charts
 * @access  Private (Owner only)
 */
export const getDashboardCharts = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { period = 'week', venueId } = req.query;
  
  // Get owner's venues
  let venueIds: number[];
  if (venueId) {
    // Verify venue belongs to owner
    const venue = await Venue.findOne({
      where: { id: parseInt(venueId as string), ownerId }
    });
    if (!venue) {
      throw new AppError('Venue not found or access denied', 404);
    }
    venueIds = [Number(venueId)];
  } else {
    const venues = await Venue.findAll({
      where: { ownerId },
      attributes: ['id']
    });
    venueIds = venues.map(v => v.id);
  }

  // Calculate date range based on period
  const endDate = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'week':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(endDate.getDate() - 7);
  }

  // Get booking trends
  const bookingTrends = await Booking.findAll({
    where: {
      venueId: { [Op.in]: venueIds },
      bookingDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      }
    },
    attributes: [
      [Booking.sequelize!.fn('DATE', Booking.sequelize!.col('bookingDate')), 'date'],
      [Booking.sequelize!.fn('COUNT', Booking.sequelize!.col('id')), 'count']
    ],
    group: [Booking.sequelize!.fn('DATE', Booking.sequelize!.col('bookingDate'))],
    order: [[Booking.sequelize!.fn('DATE', Booking.sequelize!.col('bookingDate')), 'ASC']],
    raw: true
  });

  // Get earnings summary
  const earningsSummary = await Booking.findAll({
    where: {
      venueId: { [Op.in]: venueIds },
      paymentStatus: 'paid',
      bookingDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      }
    },
    attributes: [
      [Booking.sequelize!.fn('DATE', Booking.sequelize!.col('bookingDate')), 'date'],
      [Booking.sequelize!.fn('SUM', Booking.sequelize!.col('totalAmount')), 'revenue']
    ],
    group: [Booking.sequelize!.fn('DATE', Booking.sequelize!.col('bookingDate'))],
    order: [[Booking.sequelize!.fn('DATE', Booking.sequelize!.col('bookingDate')), 'ASC']],
    raw: true
  });

  // Get peak booking hours
  const peakHours = await Booking.findAll({
    where: {
      venueId: { [Op.in]: venueIds },
      bookingDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      }
    },
    attributes: [
      [Booking.sequelize!.fn('HOUR', Booking.sequelize!.col('startTime')), 'hour'],
      [Booking.sequelize!.fn('COUNT', Booking.sequelize!.col('id')), 'count']
    ],
    group: [Booking.sequelize!.fn('HOUR', Booking.sequelize!.col('startTime'))],
    order: [[Booking.sequelize!.fn('HOUR', Booking.sequelize!.col('startTime')), 'ASC']],
    raw: true
  });

  // Get sport-wise bookings
  const sportWiseBookings = await Booking.findAll({
    where: {
      venueId: { [Op.in]: venueIds },
      bookingDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      }
    },
    include: [{
      model: Court,
      as: 'court',
      attributes: ['sportType']
    }],
    attributes: [
      [Booking.sequelize!.col('court.sportType'), 'sport'],
      [Booking.sequelize!.fn('COUNT', Booking.sequelize!.col('Booking.id')), 'count']
    ],
    group: ['court.sportType'],
    order: [[Booking.sequelize!.fn('COUNT', Booking.sequelize!.col('Booking.id')), 'DESC']],
    raw: true
  });

  res.json({
    success: true,
    data: {
      bookingTrends: {
        labels: bookingTrends.map((item: any) => item.date),
        data: bookingTrends.map((item: any) => parseInt(item.count))
      },
      earningsSummary: {
        labels: earningsSummary.map((item: any) => item.date),
        data: earningsSummary.map((item: any) => parseFloat(item.revenue) || 0)
      },
      peakBookingHours: {
        labels: peakHours.map((item: any) => `${item.hour}:00`),
        data: peakHours.map((item: any) => parseInt(item.count))
      },
      sportWiseBookings: {
        labels: sportWiseBookings.map((item: any) => item.sport),
        data: sportWiseBookings.map((item: any) => parseInt(item.count))
      }
    }
  });
});

/**
 * @desc    Get owner's facilities
 * @route   GET /api/owner/facilities
 * @access  Private (Owner only)
 */
export const getOwnerFacilities = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { page = 1, limit = 10 } = req.query;
  
  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows: venues } = await Venue.findAndCountAll({
    where: { ownerId },
    include: [
      {
        model: Court,
        as: 'courts',
        attributes: ['id', 'name', 'isActive']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  // Get additional stats for each venue
  const venuesWithStats = await Promise.all(
    venues.map(async (venue) => {
      const totalCourts = await Court.count({
        where: { venueId: venue.id }
      });

      const totalBookings = await Booking.count({
        where: { venueId: venue.id }
      });

      const monthlyRevenue = await Booking.sum('totalAmount', {
        where: {
          venueId: venue.id,
          paymentStatus: 'paid',
          createdAt: {
            [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }) || 0;

      return {
        ...venue.toJSON(),
        totalCourts,
        totalBookings,
        monthlyRevenue: Number(monthlyRevenue)
      };
    })
  );

  const pendingApproval = venues.filter(v => v.approvalStatus === 'pending').length;

  res.json({
    success: true,
    data: {
      venues: venuesWithStats,
      totalVenues: count,
      pendingApproval,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        hasNextPage: Number(page) < Math.ceil(count / Number(limit)),
        hasPrevPage: Number(page) > 1
      }
    }
  });
});

/**
 * @desc    Add new venue
 * @route   POST /api/owner/facilities
 * @access  Private (Owner only)
 */
export const addVenue = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const {
    name,
    description,
    address,
    city,
    state,
    pincode,
    latitude,
    longitude,
    sportsAvailable,
    amenities,
    contactPhone,
    contactEmail,
    website,
    openingTime,
    closingTime,
    daysOfOperation
  } = req.body;

  // Create venue
  const venue = await Venue.create({
    ownerId,
    name,
    description,
    address,
    city,
    state,
    pincode,
    latitude,
    longitude,
    sportsAvailable,
    amenities: amenities || [],
    photos: [],
    priceMin: 0,
    priceMax: 0,
    contactPhone,
    contactEmail,
    website,
    openingTime: openingTime || '06:00:00',
    closingTime: closingTime || '22:00:00',
    daysOfOperation: daysOfOperation || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    approvalStatus: 'pending',
    isApproved: false,
    isActive: true
  });

  res.status(201).json({
    success: true,
    message: 'Venue added successfully. Pending admin approval.',
    data: {
      venueId: venue.id,
      name: venue.name,
      approvalStatus: venue.approvalStatus
    }
  });
});

/**
 * @desc    Update venue details
 * @route   PUT /api/owner/facilities/:venueId
 * @access  Private (Owner only)
 */
export const updateVenue = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { venueId } = req.params;
  
  const venue = await Venue.findOne({
    where: { id: parseInt(venueId), ownerId }
  });

  if (!venue) {
    throw new AppError('Venue not found or access denied', 404);
  }

  const updatedFields: string[] = [];
  const allowedFields = [
    'name', 'description', 'address', 'city', 'state', 'pincode',
    'latitude', 'longitude', 'sportsAvailable', 'amenities',
    'contactPhone', 'contactEmail', 'website', 'openingTime',
    'closingTime', 'daysOfOperation'
  ];

  // Update only provided fields
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      (venue as any)[field] = req.body[field];
      updatedFields.push(field);
    }
  }

  await venue.save();

  res.json({
    success: true,
    message: 'Venue updated successfully',
    data: {
      venueId: venue.id,
      updatedFields
    }
  });
});

/**
 * @desc    Upload venue photos
 * @route   POST /api/owner/facilities/:venueId/photos
 * @access  Private (Owner only)
 */
export const uploadVenuePhotos = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { venueId } = req.params;
  
  const venue = await Venue.findOne({
    where: { id: parseInt(venueId), ownerId }
  });

  if (!venue) {
    throw new AppError('Venue not found or access denied', 404);
  }

  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new AppError('Please upload at least one photo', 400);
  }

  // Process uploaded files
  const uploadedPhotos = (req.files as Express.Multer.File[]).map(file => 
    `/uploads/venues/${file.filename}`
  );

  // Update venue photos
  const currentPhotos = venue.photos || [];
  venue.photos = [...currentPhotos, ...uploadedPhotos];
  await venue.save();

  res.json({
    success: true,
    message: 'Photos uploaded successfully',
    data: {
      uploadedPhotos,
      totalPhotos: venue.photos.length
    }
  });
});

/**
 * @desc    Get venue courts
 * @route   GET /api/owner/courts
 * @access  Private (Owner only)
 */
export const getVenueCourts = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { venueId } = req.query;

  if (!venueId) {
    throw new AppError('Venue ID is required', 400);
  }

  // Verify venue belongs to owner
  const venue = await Venue.findOne({
    where: { id: parseInt(venueId as string), ownerId }
  });

  if (!venue) {
    throw new AppError('Venue not found or access denied', 404);
  }

  const courts = await Court.findAll({
    where: { venueId: parseInt(venueId as string) },
    order: [['name', 'ASC']]
  });

  // Get additional stats for each court
  const courtsWithStats = await Promise.all(
    courts.map(async (court) => {
      const today = new Date().toISOString().split('T')[0];
      
      const todayBookings = await Booking.count({
        where: {
          courtId: court.id,
          bookingDate: today
        }
      });

      const weeklyRevenue = await Booking.sum('totalAmount', {
        where: {
          courtId: court.id,
          paymentStatus: 'paid',
          bookingDate: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }) || 0;

      // Calculate utilization rate for today
      const totalHours = 16; // Assuming 6 AM to 10 PM
      const bookedHours = await Booking.sum('duration', {
        where: {
          courtId: court.id,
          bookingDate: today,
          status: { [Op.in]: ['confirmed', 'completed'] }
        }
      }) || 0;

      const utilizationRate = totalHours > 0 ? (Number(bookedHours) / totalHours) * 100 : 0;

      return {
        ...court.toJSON(),
        todayBookings,
        weeklyRevenue: Number(weeklyRevenue),
        utilizationRate: Math.round(utilizationRate * 100) / 100
      };
    })
  );

  const totalCourts = courts.length;
  const activeCourts = courts.filter(c => c.isActive && !c.maintenanceMode).length;

  res.json({
    success: true,
    data: {
      courts: courtsWithStats,
      totalCourts,
      activeCourts
    }
  });
});

/**
 * @desc    Add new court
 * @route   POST /api/owner/courts
 * @access  Private (Owner only)
 */
export const addCourt = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const {
    venueId,
    name,
    sportType,
    description,
    pricePerHour,
    priceWeekday,
    priceWeekend,
    pricePeakHours,
    operatingStart,
    operatingEnd,
    courtSize,
    surfaceType,
    maxPlayers,
    equipmentProvided,
    courtAmenities
  } = req.body;

  // Verify venue belongs to owner
  const venue = await Venue.findOne({
    where: { id: parseInt(venueId), ownerId }
  });

  if (!venue) {
    throw new AppError('Venue not found or access denied', 404);
  }

  // Create court
  const court = await Court.create({
    venueId,
    name,
    sportType,
    description,
    pricePerHour,
    priceWeekday,
    priceWeekend,
    pricePeakHours,
    operatingStart: operatingStart || '06:00:00',
    operatingEnd: operatingEnd || '22:00:00',
    courtSize,
    surfaceType,
    maxPlayers: maxPlayers || 4,
    equipmentProvided: equipmentProvided || [],
    courtAmenities: courtAmenities || [],
    isActive: true,
    maintenanceMode: false
  });

  // Update venue price range
  const allCourts = await Court.findAll({
    where: { venueId, isActive: true }
  });

  const prices = allCourts.map(c => c.pricePerHour);
  venue.priceMin = Math.min(...prices);
  venue.priceMax = Math.max(...prices);
  await venue.save();

  res.status(201).json({
    success: true,
    message: 'Court added successfully',
    data: {
      courtId: court.id,
      name: court.name,
      sportType: court.sportType,
      venueId: court.venueId
    }
  });
});

/**
 * @desc    Update court details
 * @route   PUT /api/owner/courts/:courtId
 * @access  Private (Owner only)
 */
export const updateCourt = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { courtId } = req.params;

  // Find court and verify ownership
  const court = await Court.findOne({
    where: { id: courtId },
    include: [{
      model: Venue,
      as: 'venue',
      where: { ownerId }
    }]
  });

  if (!court) {
    throw new AppError('Court not found or access denied', 404);
  }

  const updatedFields: string[] = [];
  const allowedFields = [
    'name', 'description', 'pricePerHour', 'priceWeekday', 'priceWeekend',
    'pricePeakHours', 'operatingStart', 'operatingEnd', 'courtSize',
    'surfaceType', 'maxPlayers', 'equipmentProvided', 'courtAmenities'
  ];

  // Update only provided fields
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      (court as any)[field] = req.body[field];
      updatedFields.push(field);
    }
  }

  await court.save();

  res.json({
    success: true,
    message: 'Court updated successfully',
    data: {
      courtId: court.id,
      updatedFields
    }
  });
});

/**
 * @desc    Toggle court status
 * @route   PUT /api/owner/courts/:courtId/status
 * @access  Private (Owner only)
 */
export const toggleCourtStatus = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { courtId } = req.params;
  const { isActive, maintenanceMode, reason } = req.body;

  // Find court and verify ownership
  const court = await Court.findOne({
    where: { id: courtId },
    include: [{
      model: Venue,
      as: 'venue',
      where: { ownerId }
    }]
  });

  if (!court) {
    throw new AppError('Court not found or access denied', 404);
  }

  // Update status
  if (isActive !== undefined) court.isActive = isActive;
  if (maintenanceMode !== undefined) court.maintenanceMode = maintenanceMode;

  await court.save();

  // If court is being deactivated or put in maintenance, block future time slots
  if (!court.isActive || court.maintenanceMode) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30); // Block for next 30 days

    await TimeSlot.update(
      { 
        status: court.maintenanceMode ? 'maintenance' : 'blocked',
        blockReason: reason || 'Court unavailable'
      },
      {
        where: {
          courtId: court.id,
          date: { [Op.gte]: new Date() },
          status: 'available'
        }
      }
    );
  }

  res.json({
    success: true,
    message: 'Court status updated successfully',
    data: {
      courtId: court.id,
      isActive: court.isActive,
      maintenanceMode: court.maintenanceMode
    }
  });
});

/**
 * @desc    Get court availability calendar
 * @route   GET /api/owner/time-slots/calendar
 * @access  Private (Owner only)
 */
export const getCourtCalendar = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { courtId, startDate, endDate } = req.query;

  if (!courtId || !startDate || !endDate) {
    throw new AppError('Court ID, start date, and end date are required', 400);
  }

  // Verify court belongs to owner
  const court = await Court.findOne({
    where: { id: parseInt(courtId as string) },
    include: [{
      model: Venue,
      as: 'venue',
      where: { ownerId }
    }]
  });

  if (!court) {
    throw new AppError('Court not found or access denied', 404);
  }

  // Get time slots for the date range
  const timeSlots = await TimeSlot.findAll({
    where: {
      courtId: parseInt(courtId as string),
      date: {
        [Op.gte]: new Date(startDate as string),
        [Op.lte]: new Date(endDate as string)
      }
    },
    include: [{
      model: Booking,
      as: 'booking',
      include: [{
        model: User,
        as: 'user',
        attributes: ['fullName']
      }],
      required: false
    }],
    order: [['date', 'ASC'], ['startTime', 'ASC']]
  });

  // Group slots by date
  const calendar: any = {};
  timeSlots.forEach(slot => {
    const dateKey = slot.date.toISOString().split('T')[0];
    if (!calendar[dateKey]) {
      calendar[dateKey] = [];
    }

    calendar[dateKey].push({
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: slot.status,
      price: slot.customPrice || court.pricePerHour,
      bookingId: slot.bookingId,
      customerName: (slot as any).booking?.user?.fullName,
      blockReason: slot.blockReason
    });
  });

  res.json({
    success: true,
    data: {
      calendar: Object.keys(calendar).map(date => ({
        date,
        slots: calendar[date]
      }))
    }
  });
});

/**
 * @desc    Block time slots
 * @route   POST /api/owner/time-slots/block
 * @access  Private (Owner only)
 */
export const blockTimeSlots = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { courtId, date, startTime, endTime, blockReason } = req.body;

  // Verify court belongs to owner
  const court = await Court.findOne({
    where: { id: parseInt(courtId) },
    include: [{
      model: Venue,
      as: 'venue',
      where: { ownerId }
    }]
  });

  if (!court) {
    throw new AppError('Court not found or access denied', 404);
  }

  // Generate hourly slots between start and end time
  const slots = [];
  let currentTime = startTime;
  
  while (currentTime < endTime) {
    const nextHour = new Date(`2000-01-01T${currentTime}`);
    nextHour.setHours(nextHour.getHours() + 1);
    const nextTimeStr = nextHour.toTimeString().substring(0, 5);

    // Check if slot already exists
    const existingSlot = await TimeSlot.findOne({
      where: { courtId: parseInt(courtId), date, startTime: currentTime }
    });

    if (existingSlot) {
      if (existingSlot.status === 'booked') {
        throw new AppError(`Cannot block slot ${currentTime} - already booked`, 400);
      }
      // Update existing slot
      existingSlot.status = 'blocked';
      existingSlot.blockReason = blockReason;
      await existingSlot.save();
    } else {
      // Create new blocked slot
      await TimeSlot.create({
        courtId: parseInt(courtId),
        date,
        startTime: currentTime,
        endTime: nextTimeStr,
        status: 'blocked',
        blockReason
      });
    }

    slots.push({
      date,
      startTime: currentTime,
      endTime: nextTimeStr
    });

    currentTime = nextTimeStr;
  }

  res.json({
    success: true,
    message: 'Time slots blocked successfully',
    data: {
      blockedSlots: slots
    }
  });
});

/**
 * @desc    Set custom pricing for time slots
 * @route   PUT /api/owner/time-slots/pricing
 * @access  Private (Owner only)
 */
export const setCustomPricing = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { courtId, date, timeSlots } = req.body;

  // Verify court belongs to owner
  const court = await Court.findOne({
    where: { id: courtId },
    include: [{
      model: Venue,
      as: 'venue',
      where: { ownerId }
    }]
  });

  if (!court) {
    throw new AppError('Court not found or access denied', 404);
  }

  let updatedSlots = 0;
  let totalRevenue = 0;

  for (const slot of timeSlots) {
    const { startTime, endTime, customPrice } = slot;

    // Find or create time slot
    const [timeSlot] = await TimeSlot.findOrCreate({
      where: { courtId, date, startTime },
      defaults: {
        courtId,
        date,
        startTime,
        endTime,
        status: 'available',
        customPrice
      }
    });

    // Update custom price
    timeSlot.customPrice = customPrice;
    await timeSlot.save();

    updatedSlots++;
    totalRevenue += customPrice;
  }

  res.json({
    success: true,
    message: 'Custom pricing applied successfully',
    data: {
      updatedSlots,
      totalRevenue
    }
  });
});

/**
 * @desc    Get all venue bookings for owner
 * @route   GET /api/owner/bookings
 * @access  Private (Owner only)
 */
export const getVenueBookings = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { 
    venueId, 
    status, 
    page = 1, 
    limit = 20, 
    sortBy = 'bookingDate', 
    order = 'desc',
    startDate,
    endDate
  } = req.query;

  // Get owner's venues
  let venueIds: number[];
  if (venueId) {
    const venue = await Venue.findOne({
      where: { id: parseInt(venueId as string), ownerId }
    });
    if (!venue) {
      throw new AppError('Venue not found or access denied', 404);
    }
    venueIds = [Number(venueId)];
  } else {
    const venues = await Venue.findAll({
      where: { ownerId },
      attributes: ['id']
    });
    venueIds = venues.map(v => v.id);
  }

  const offset = (Number(page) - 1) * Number(limit);

  // Build where clause
  const whereClause: any = {
    venueId: { [Op.in]: venueIds }
  };

  if (status) {
    whereClause.status = status;
  }

  if (startDate && endDate) {
    whereClause.bookingDate = {
      [Op.gte]: startDate,
      [Op.lte]: endDate
    };
  }

  const { count, rows: bookings } = await Booking.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'email', 'avatar']
      },
      {
        model: Venue,
        as: 'venue',
        attributes: ['id', 'name']
      },
      {
        model: Court,
        as: 'court',
        attributes: ['id', 'name', 'sportType']
      }
    ],
    order: [[sortBy as string, order as string]],
    limit: Number(limit),
    offset
  });

  // Calculate summary
  const summary = {
    totalRevenue: await Booking.sum('totalAmount', {
      where: {
        venueId: { [Op.in]: venueIds },
        paymentStatus: 'paid'
      }
    }) || 0,
    confirmedBookings: await Booking.count({
      where: {
        venueId: { [Op.in]: venueIds },
        status: 'confirmed'
      }
    }),
    cancelledBookings: await Booking.count({
      where: {
        venueId: { [Op.in]: venueIds },
        status: 'cancelled'
      }
    })
  };

  res.json({
    success: true,
    data: {
      bookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalBookings: count,
        limit: Number(limit)
      },
      summary: {
        totalRevenue: Number(summary.totalRevenue),
        confirmedBookings: summary.confirmedBookings,
        cancelledBookings: summary.cancelledBookings
      }
    }
  });
});

/**
 * @desc    Bulk update time slots availability
 * @route   POST /api/owner/time-slots/bulk-update
 * @access  Private (Owner only)
 */
export const bulkUpdateTimeSlots = asyncHandler(async (req: Request, res: Response) => {
  const ownerId = req.user.id;
  const { 
    courtId, 
    dateRange, 
    timeRange, 
    action, 
    excludeDays = [], 
    reason 
  } = req.body;

  // Verify court belongs to owner
  const court = await Court.findOne({
    where: { id: courtId },
    include: [{
      model: Venue,
      as: 'venue',
      where: { ownerId }
    }]
  });

  if (!court) {
    throw new AppError('Court not found or access denied', 404);
  }

  const { startDate, endDate } = dateRange;
  const { startTime, endTime } = timeRange;

  let affectedSlots = 0;
  const currentDate = new Date(startDate);
  const finalDate = new Date(endDate);

  while (currentDate <= finalDate) {
    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Skip excluded days
    if (!excludeDays.includes(dayName)) {
      // Generate hourly slots for this date
      let currentTime = startTime;
      
      while (currentTime < endTime) {
        const nextHour = new Date(`2000-01-01T${currentTime}`);
        nextHour.setHours(nextHour.getHours() + 1);
        const nextTimeStr = nextHour.toTimeString().substring(0, 5);

        // Find or create time slot
        const [timeSlot] = await TimeSlot.findOrCreate({
          where: {
            courtId,
            date: currentDate,
            startTime: currentTime
          },
          defaults: {
            courtId,
            date: currentDate,
            startTime: currentTime,
            endTime: nextTimeStr,
            status: 'available'
          }
        });

        // Apply action
        switch (action) {
          case 'make_available':
            if (timeSlot.status !== 'booked') {
              timeSlot.status = 'available';
              timeSlot.blockReason = undefined;
              await timeSlot.save();
              affectedSlots++;
            }
            break;
          case 'block':
            if (timeSlot.status !== 'booked') {
              timeSlot.status = 'blocked';
              timeSlot.blockReason = reason;
              await timeSlot.save();
              affectedSlots++;
            }
            break;
          case 'set_maintenance':
            if (timeSlot.status !== 'booked') {
              timeSlot.status = 'maintenance';
              timeSlot.blockReason = reason;
              await timeSlot.save();
              affectedSlots++;
            }
            break;
        }

        currentTime = nextTimeStr;
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  res.json({
    success: true,
    message: 'Bulk availability update completed',
    data: {
      affectedSlots,
      dateRange: `${startDate} to ${endDate}`,
      action
    }
  });
});