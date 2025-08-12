import { sequelize } from '../config/database';
import User from './User';
import Venue from './Venue';
import Court from './Court';
import Booking from './Booking';
import Review from './Review';
import TimeSlot from './TimeSlot';
import VenueAnalytics from './VenueAnalytics';

// Define associations
const setupAssociations = () => {
  // User associations
  User.hasMany(Venue, { foreignKey: 'ownerId', as: 'ownedVenues' });
  User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
  User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });

  // Venue associations
  Venue.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
  Venue.hasMany(Court, { foreignKey: 'venueId', as: 'courts' });
  Venue.hasMany(Booking, { foreignKey: 'venueId', as: 'bookings' });
  Venue.hasMany(Review, { foreignKey: 'venueId', as: 'reviews' });
  Venue.hasMany(VenueAnalytics, { foreignKey: 'venueId', as: 'analytics' });

  // Court associations
  Court.belongsTo(Venue, { foreignKey: 'venueId', as: 'venue' });
  Court.hasMany(Booking, { foreignKey: 'courtId', as: 'bookings' });
  Court.hasMany(TimeSlot, { foreignKey: 'courtId', as: 'timeSlots' });

  // Booking associations
  Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Booking.belongsTo(Venue, { foreignKey: 'venueId', as: 'venue' });
  Booking.belongsTo(Court, { foreignKey: 'courtId', as: 'court' });

  // Review associations
  Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Review.belongsTo(Venue, { foreignKey: 'venueId', as: 'venue' });

  // TimeSlot associations
  TimeSlot.belongsTo(Court, { foreignKey: 'courtId', as: 'court' });
  TimeSlot.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

  // VenueAnalytics associations
  VenueAnalytics.belongsTo(Venue, { foreignKey: 'venueId', as: 'venue' });
};

// Setup associations
setupAssociations();

// Export models and database instance
export {
  sequelize,
  User,
  Venue,
  Court,
  Booking,
  Review,
  TimeSlot,
  VenueAnalytics
};

// Sync database (for development)
export const syncDatabase = async (force: boolean = false) => {
  try {
    await sequelize.sync({ force, alter: !force });
    console.log('✅ Database synchronized successfully');
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
    throw error;
  }
};

// Close database connection
export const closeDatabase = async () => {
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database:', error);
    throw error;
  }
};