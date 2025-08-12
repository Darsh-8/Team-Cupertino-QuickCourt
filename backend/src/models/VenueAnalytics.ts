import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Venue Analytics attributes interface
export interface VenueAnalyticsAttributes {
  id: number;
  venueId: number;
  date: Date;
  
  // Booking metrics
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  
  // Revenue metrics
  totalRevenue: number;
  confirmedRevenue: number;
  
  // Utilization metrics
  totalAvailableHours: number;
  totalBookedHours: number;
  utilizationRate: number;
  
  // Peak hours data
  peakHourBookings: { [key: string]: number };
  
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface VenueAnalyticsCreationAttributes extends Optional<VenueAnalyticsAttributes, 
  'id' | 'totalBookings' | 'confirmedBookings' | 'cancelledBookings' | 'completedBookings' | 
  'totalRevenue' | 'confirmedRevenue' | 'totalAvailableHours' | 'totalBookedHours' | 
  'utilizationRate' | 'peakHourBookings' | 'createdAt' | 'updatedAt'> {}

// Venue Analytics model class
class VenueAnalytics extends Model<VenueAnalyticsAttributes, VenueAnalyticsCreationAttributes> implements VenueAnalyticsAttributes {
  public id!: number;
  public venueId!: number;
  public date!: Date;
  public totalBookings!: number;
  public confirmedBookings!: number;
  public cancelledBookings!: number;
  public completedBookings!: number;
  public totalRevenue!: number;
  public confirmedRevenue!: number;
  public totalAvailableHours!: number;
  public totalBookedHours!: number;
  public utilizationRate!: number;
  public peakHourBookings!: { [key: string]: number };

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public calculateUtilizationRate(): number {
    if (this.totalAvailableHours === 0) return 0;
    return Math.round((this.totalBookedHours / this.totalAvailableHours) * 100 * 100) / 100;
  }

  public updateMetrics(bookingData: any): void {
    this.totalBookings += 1;
    
    switch (bookingData.status) {
      case 'confirmed':
        this.confirmedBookings += 1;
        this.confirmedRevenue += bookingData.amount;
        break;
      case 'cancelled':
        this.cancelledBookings += 1;
        break;
      case 'completed':
        this.completedBookings += 1;
        break;
    }
    
    this.totalRevenue += bookingData.amount;
    this.totalBookedHours += bookingData.duration;
    this.utilizationRate = this.calculateUtilizationRate();
  }

  public getPeakHour(): string {
    let maxBookings = 0;
    let peakHour = '';
    
    for (const [hour, bookings] of Object.entries(this.peakHourBookings)) {
      if (bookings > maxBookings) {
        maxBookings = bookings;
        peakHour = hour;
      }
    }
    
    return peakHour;
  }
}

// Initialize Venue Analytics model
VenueAnalytics.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'venues',
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
    totalBookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Total bookings cannot be negative'
        }
      }
    },
    confirmedBookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Confirmed bookings cannot be negative'
        }
      }
    },
    cancelledBookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Cancelled bookings cannot be negative'
        }
      }
    },
    completedBookings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Completed bookings cannot be negative'
        }
      }
    },
    totalRevenue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Total revenue cannot be negative'
        }
      }
    },
    confirmedRevenue: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Confirmed revenue cannot be negative'
        }
      }
    },
    totalAvailableHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Total available hours cannot be negative'
        }
      }
    },
    totalBookedHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Total booked hours cannot be negative'
        }
      }
    },
    utilizationRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: 'Utilization rate cannot be negative'
        },
        max: {
          args: [100],
          msg: 'Utilization rate cannot exceed 100%'
        }
      }
    },
    peakHourBookings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      validate: {
        isObject(value: any) {
          if (typeof value !== 'object' || Array.isArray(value)) {
            throw new Error('Peak hour bookings must be an object');
          }
          return true;
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'VenueAnalytics',
    tableName: 'venue_analytics',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['venueId', 'date'],
        name: 'unique_venue_date'
      },
      {
        fields: ['venueId', 'date']
      },
      {
        fields: ['date']
      }
    ]
  }
);

export default VenueAnalytics;