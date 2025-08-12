import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { asyncHandler } from '../middleware/errorHandler';
import { AppError } from '../middleware/errorHandler';
import Venue from '../models/Venue';
import Court from '../models/Court';
import Review from '../models/Review';
import User from '../models/User';

/**
 * @desc    Get all venues with filtering and pagination
 * @route   GET /api/venues
 * @access  Public
 */
export const getVenues = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 10,
    sport,
    priceMin,
    priceMax,
    rating,
    search,
    location,
    sortBy = 'rating'
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  
  // Build where clause
  const whereClause: any = {
    isApproved: true
  };

  // Sport filter
  if (sport) {
    whereClause.sportsAvailable = {
      [Op.contains]: [sport]
    };
  }

  // Price filter
  if (priceMin || priceMax) {
    whereClause[Op.and] = [];
    if (priceMin) {
      whereClause[Op.and].push({
        priceMin: { [Op.gte]: Number(priceMin) }
      });
    }
    if (priceMax) {
      whereClause[Op.and].push({
        priceMax: { [Op.lte]: Number(priceMax) }
      });
    }
  }

  // Rating filter
  if (rating) {
    whereClause.rating = { [Op.gte]: Number(rating) };
  }

  // Search filter
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
      { address: { [Op.like]: `%${search}%` } }
    ];
  }

  // Location filter
  if (location) {
    whereClause.address = { [Op.like]: `%${location}%` };
  }

  // Build order clause
  let orderClause: any = [];
  switch (sortBy) {
    case 'price-low':
      orderClause = [['priceMin', 'ASC']];
      break;
    case 'price-high':
      orderClause = [['priceMax', 'DESC']];
      break;
    case 'rating':
      orderClause = [['rating', 'DESC'], ['reviewCount', 'DESC']];
      break;
    case 'newest':
      orderClause = [['createdAt', 'DESC']];
      break;
    case 'popular':
      orderClause = [['reviewCount', 'DESC'], ['rating', 'DESC']];
      break;
    default:
      orderClause = [['rating', 'DESC'], ['reviewCount', 'DESC']];
  }

  // Get venues with pagination
  const { count, rows: venues } = await Venue.findAndCountAll({
    where: whereClause,
    limit: Number(limit),
    offset,
    order: orderClause,
    include: [
      {
        model: Court,
        as: 'courts',
        attributes: ['id', 'name', 'sportType', 'pricePerHour']
      }
    ]
  });

  // Calculate pagination info
  const totalPages = Math.ceil(count / Number(limit));
  const hasNextPage = Number(page) < totalPages;
  const hasPrevPage = Number(page) > 1;

  res.json({
    success: true,
    data: {
      venues,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalVenues: count,
        hasNextPage,
        hasPrevPage,
        limit: Number(limit)
      }
    }
  });
});

/**
 * @desc    Get popular venues
 * @route   GET /api/venues/popular
 * @access  Public
 */
export const getPopularVenues = asyncHandler(async (req: Request, res: Response) => {
  const venues = await Venue.findAll({
    where: {
      isApproved: true,
      rating: { [Op.gte]: 4.0 }
    },
    order: [
      ['reviewCount', 'DESC'],
      ['rating', 'DESC']
    ],
    limit: 10,
    include: [
      {
        model: Court,
        as: 'courts',
        attributes: ['id', 'name', 'sportType', 'pricePerHour']
      }
    ]
  });

  res.json({
    success: true,
    data: {
      venues
    }
  });
});

/**
 * @desc    Search venues
 * @route   GET /api/venues/search
 * @access  Public
 */
export const searchVenues = asyncHandler(async (req: Request, res: Response) => {
  const { q, location, limit = 10 } = req.query;

  if (!q && !location) {
    throw new AppError('Search query or location is required', 400);
  }

  const whereClause: any = {
    isApproved: true
  };

  const orConditions: any[] = [];

  if (q) {
    orConditions.push(
      { name: { [Op.like]: `%${q}%` } },
      { description: { [Op.like]: `%${q}%` } },
      { sportsAvailable: { [Op.contains]: [q] } }
    );
  }

  if (location) {
    orConditions.push(
      { address: { [Op.like]: `%${location}%` } }
    );
  }

  if (orConditions.length > 0) {
    whereClause[Op.or] = orConditions;
  }

  const venues = await Venue.findAll({
    where: whereClause,
    limit: Number(limit),
    order: [['rating', 'DESC'], ['reviewCount', 'DESC']],
    include: [
      {
        model: Court,
        as: 'courts',
        attributes: ['id', 'name', 'sportType', 'pricePerHour']
      }
    ]
  });

  res.json({
    success: true,
    data: {
      venues,
      searchQuery: q,
      location
    }
  });
});

/**
 * @desc    Get single venue by ID
 * @route   GET /api/venues/:id
 * @access  Public
 */
export const getVenueById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const venue = await Venue.findByPk(id, {
    include: [
      {
        model: Court,
        as: 'courts',
        where: { isActive: true },
        required: false
      },
      {
        model: Review,
        as: 'reviews',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'avatar']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: 10
      }
    ]
  });

  if (!venue) {
    throw new AppError('Venue not found', 404);
  }

  if (!venue.isApproved) {
    throw new AppError('Venue is not available', 404);
  }

  res.json({
    success: true,
    data: {
      venue
    }
  });
});

/**
 * @desc    Get venue courts
 * @route   GET /api/venues/:id/courts
 * @access  Public
 */
export const getVenueCourts = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { sport } = req.query;

  // Check if venue exists
  const venue = await Venue.findByPk(id);
  if (!venue) {
    throw new AppError('Venue not found', 404);
  }

  // Build where clause for courts
  const whereClause: any = {
    venueId: id,
    isActive: true
  };

  if (sport) {
    whereClause.sportType = sport;
  }

  const courts = await Court.findAll({
    where: whereClause,
    order: [['name', 'ASC']]
  });

  res.json({
    success: true,
    data: {
      courts
    }
  });
});

/**
 * @desc    Get venue reviews
 * @route   GET /api/venues/:id/reviews
 * @access  Public
 */
export const getVenueReviews = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check if venue exists
  const venue = await Venue.findByPk(id);
  if (!venue) {
    throw new AppError('Venue not found', 404);
  }

  const offset = (Number(page) - 1) * Number(limit);

  const { count, rows: reviews } = await Review.findAndCountAll({
    where: { venueId: id, isVerified: true },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'avatar']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: Number(limit),
    offset
  });

  // Calculate rating distribution
  const ratingDistribution = await Review.findAll({
    where: { venueId: id, isVerified: true },
    attributes: [
      'rating',
      [Review.sequelize!.fn('COUNT', Review.sequelize!.col('rating')), 'count']
    ],
    group: ['rating'],
    raw: true
  });

  const totalPages = Math.ceil(count / Number(limit));

  res.json({
    success: true,
    data: {
      reviews,
      ratingDistribution,
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
 * @desc    Create venue review
 * @route   POST /api/venues/:id/reviews
 * @access  Private
 */
export const createVenueReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  // Check if venue exists
  const venue = await Venue.findByPk(id);
  if (!venue) {
    throw new AppError('Venue not found', 404);
  }

  // Check if user has already reviewed this venue
  const existingReview = await Review.findOne({
    where: { userId, venueId: parseInt(id) }
  });

  if (existingReview) {
    throw new AppError('You have already reviewed this venue', 400);
  }

  // Create review
  const review = await Review.create({
    userId,
    venueId: parseInt(id),
    rating,
    comment,
    photos: [] // File upload will be handled separately
  });

  // Update venue rating
  const allReviews = await Review.findAll({
    where: { venueId: parseInt(id), isVerified: true }
  });

  const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
  const avgRating = Math.round((totalRating / allReviews.length) * 10) / 10;

  await venue.update({
    rating: avgRating,
    reviewCount: allReviews.length
  });

  // Fetch the created review with user details
  const createdReview = await Review.findByPk(review.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'fullName', 'avatar']
      }
    ]
  });

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: {
      review: createdReview
    }
  });
});

/**
 * @desc    Get featured venues
 * @route   GET /api/venues/featured
 * @access  Public
 */
export const getFeaturedVenues = asyncHandler(async (req: Request, res: Response) => {
  const venues = await Venue.findAll({
    where: {
      isApproved: true,
      rating: { [Op.gte]: 4.5 }
    },
    order: [
      ['rating', 'DESC'],
      ['reviewCount', 'DESC']
    ],
    limit: 8,
    include: [
      {
        model: Court,
        as: 'courts',
        attributes: ['id', 'name', 'sportType', 'pricePerHour']
      }
    ]
  });

  res.json({
    success: true,
    data: {
      venues
    }
  });
});