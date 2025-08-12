import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Time Slot attributes interface
export interface TimeSlotAttributes {
  id: number;
  courtId: number;
  date: Date;
  startTime: string;
  endTime: string;
  
  // Slot status
  status: 'available' | 'booked' | 'blocked' | 'maintenance';
  blockReason?: string;
  
  // Pricing override
  customPrice?: number;
  
  // Booking reference
  bookingId?: number;
  
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface TimeSlotCreationAttributes extends Optional<TimeSlotAttributes, 
  'id' | 'status' | 'blockReason' | 'customPrice' | 'bookingId' | 'createdAt' | 'updatedAt'> {}

// Time Slot model class
class TimeSlot extends Model<TimeSlotAttributes, TimeSlotCreationAttributes> implements TimeSlotAttributes {
  public id!: number;
  public courtId!: number;
  public date!: Date;
  public startTime!: string;
  public endTime!: string;
  public status!: 'available' | 'booked' | 'blocked' | 'maintenance';
  public blockReason?: string;
  public customPrice?: number;
  public bookingId?: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public isAvailable(): boolean {
    return this.status === 'available';
  }

  public isBooked(): boolean {
    return this.status === 'booked';
  }

  public isBlocked(): boolean {
    return this.status === 'blocked' || this.status === 'maintenance';
  }

  public block(reason: string): void {
    this.status = 'blocked';
    this.blockReason = reason;
  }

  public unblock(): void {
    this.status = 'available';
    this.blockReason = undefined;
  }

  public setCustomPrice(price: number): void {
    this.customPrice = price;
  }

  public clearCustomPrice(): void {
    this.customPrice = undefined;
  }
}

// Initialize Time Slot model
TimeSlot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    courtId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'courts',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          args: true,
          msg: 'Please provide a valid date'
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
    status: {
      type: DataTypes.ENUM('available', 'booked', 'blocked', 'maintenance'),
      allowNull: false,
      defaultValue: 'available'
    },
    blockReason: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    customPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Custom price cannot be negative'
        }
      }
    },
    bookingId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'bookings',
        key: 'id'
      },
      onDelete: 'SET NULL'
    }
  },
  {
    sequelize,
    modelName: 'TimeSlot',
    tableName: 'time_slots',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['courtId', 'date', 'startTime'],
        name: 'unique_time_slot'
      },
      {
        fields: ['courtId', 'date']
      },
      {
        fields: ['status']
      },
      {
        fields: ['bookingId']
      }
    ]
  }
);

export default TimeSlot;