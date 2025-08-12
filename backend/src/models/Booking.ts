import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Booking attributes interface
export interface BookingAttributes {
  id: number;
  userId: number;
  venueId: number;
  courtId: number;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'status' | 'paymentStatus' | 'paymentId' | 'createdAt' | 'updatedAt'> {}

// Booking model class
class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: number;
  public userId!: number;
  public venueId!: number;
  public courtId!: number;
  public bookingDate!: Date;
  public startTime!: string;
  public endTime!: string;
  public duration!: number;
  public totalAmount!: number;
  public status!: 'confirmed' | 'cancelled' | 'completed';
  public paymentStatus!: 'pending' | 'paid' | 'refunded';
  public paymentId?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public canBeCancelled(): boolean {
    const now = new Date();
    const bookingDateTime = new Date(`${this.bookingDate.toISOString().split('T')[0]}T${this.startTime}`);
    const timeDiff = bookingDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return this.status === 'confirmed' && hoursDiff > 2; // Can cancel if more than 2 hours before
  }

  public isUpcoming(): boolean {
    const now = new Date();
    const bookingDateTime = new Date(`${this.bookingDate.toISOString().split('T')[0]}T${this.startTime}`);
    return bookingDateTime > now && this.status === 'confirmed';
  }

  public isPast(): boolean {
    const now = new Date();
    const bookingDateTime = new Date(`${this.bookingDate.toISOString().split('T')[0]}T${this.endTime}`);
    return bookingDateTime < now;
  }

  public async cancel(): Promise<void> {
    if (!this.canBeCancelled()) {
      throw new Error('Booking cannot be cancelled');
    }
    this.status = 'cancelled';
    await this.save();
  }

  public async complete(): Promise<void> {
    if (this.status !== 'confirmed') {
      throw new Error('Only confirmed bookings can be completed');
    }
    this.status = 'completed';
    await this.save();
  }
}

// Initialize Booking model
Booking.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'venues',
        key: 'id'
      }
    },
    courtId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courts',
        key: 'id'
      }
    },
    bookingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: 'Please provide a valid date'
        },
        isAfter: {
          args: new Date().toISOString().split('T')[0],
          msg: 'Booking date must be in the future'
        }
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Start time is required'
        }
      }
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'End time is required'
        }
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'Duration must be at least 1 hour'
        },
        max: {
          args: [8],
          msg: 'Duration cannot exceed 8 hours'
        }
      }
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Total amount cannot be negative'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('confirmed', 'cancelled', 'completed'),
      allowNull: false,
      defaultValue: 'confirmed'
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded'),
      allowNull: false,
      defaultValue: 'paid'
    },
    paymentId: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['courtId', 'bookingDate', 'startTime'],
        name: 'unique_booking'
      },
      {
        fields: ['userId']
      },
      {
        fields: ['venueId']
      },
      {
        fields: ['bookingDate']
      },
      {
        fields: ['status']
      },
      {
        fields: ['paymentStatus']
      }
    ]
  }
);

export default Booking;