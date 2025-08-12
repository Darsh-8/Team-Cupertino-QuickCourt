import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Enhanced Venue attributes interface
export interface VenueEnhancedAttributes {
  id: number;
  ownerId: number;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  
  // Sports and amenities
  sportsAvailable: string[];
  amenities: string[];
  photos: string[];
  
  // Pricing and ratings
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewCount: number;
  
  // Business details
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  
  // Status and approval
  isApproved: boolean;
  isActive: boolean;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  
  // Operational details
  openingTime: string;
  closingTime: string;
  daysOfOperation: string[];
  
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface VenueEnhancedCreationAttributes extends Optional<VenueEnhancedAttributes, 
  'id' | 'description' | 'pincode' | 'latitude' | 'longitude' | 'contactPhone' | 'contactEmail' | 
  'website' | 'rating' | 'reviewCount' | 'isApproved' | 'isActive' | 'approvalStatus' | 
  'rejectionReason' | 'openingTime' | 'closingTime' | 'createdAt' | 'updatedAt'> {}

// Enhanced Venue model class
class VenueEnhanced extends Model<VenueEnhancedAttributes, VenueEnhancedCreationAttributes> implements VenueEnhancedAttributes {
  public id!: number;
  public ownerId!: number;
  public name!: string;
  public description?: string;
  public address!: string;
  public city!: string;
  public state!: string;
  public pincode?: string;
  public latitude?: number;
  public longitude?: number;
  public sportsAvailable!: string[];
  public amenities!: string[];
  public photos!: string[];
  public priceMin!: number;
  public priceMax!: number;
  public rating!: number;
  public reviewCount!: number;
  public contactPhone?: string;
  public contactEmail?: string;
  public website?: string;
  public isApproved!: boolean;
  public isActive!: boolean;
  public approvalStatus!: 'pending' | 'approved' | 'rejected';
  public rejectionReason?: string;
  public openingTime!: string;
  public closingTime!: string;
  public daysOfOperation!: string[];

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public updateRating(newRating: number, isNewReview: boolean = true): void {
    if (isNewReview) {
      const totalRating = this.rating * this.reviewCount + newRating;
      this.reviewCount += 1;
      this.rating = Math.round((totalRating / this.reviewCount) * 10) / 10;
    }
  }

  public isOperatingOn(day: string): boolean {
    return this.daysOfOperation.includes(day.toLowerCase());
  }

  public isOperatingAt(time: string): boolean {
    return time >= this.openingTime && time <= this.closingTime;
  }

  public getOperatingHours(): { opening: string; closing: string } {
    return {
      opening: this.openingTime,
      closing: this.closingTime
    };
  }

  public canBeBooked(): boolean {
    return this.isActive && this.isApproved && this.approvalStatus === 'approved';
  }
}

// Initialize Enhanced Venue model
VenueEnhanced.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Venue name is required'
        },
        len: {
          args: [3, 150],
          msg: 'Venue name must be between 3 and 150 characters'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Address is required'
        }
      }
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'City is required'
        }
      }
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'State is required'
        }
      }
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        len: {
          args: [6, 10],
          msg: 'Pincode must be between 6 and 10 characters'
        }
      }
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      validate: {
        min: -90,
        max: 90
      }
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      validate: {
        min: -180,
        max: 180
      }
    },
    sportsAvailable: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray: {
          args: true,
          msg: 'Sports available must be an array'
        }
      }
    },
    amenities: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray: {
          args: true,
          msg: 'Amenities must be an array'
        }
      }
    },
    photos: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray: {
          args: true,
          msg: 'Photos must be an array'
        }
      }
    },
    priceMin: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Minimum price cannot be negative'
        }
      }
    },
    priceMax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Maximum price cannot be negative'
        }
      }
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    contactPhone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      validate: {
        is: {
          args: /^[\+]?[1-9][\d]{0,15}$/,
          msg: 'Please provide a valid phone number'
        }
      }
    },
    contactEmail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        }
      }
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Please provide a valid website URL'
        }
      }
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    approvalStatus: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    openingTime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '06:00:00'
    },
    closingTime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '22:00:00'
    },
    daysOfOperation: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      validate: {
        isArray: {
          args: true,
          msg: 'Days of operation must be an array'
        }
      }
    }
  },
  {
    sequelize,
    modelName: 'VenueEnhanced',
    tableName: 'venues_enhanced',
    timestamps: true,
    indexes: [
      {
        fields: ['ownerId']
      },
      {
        fields: ['city']
      },
      {
        fields: ['state']
      },
      {
        fields: ['approvalStatus']
      },
      {
        fields: ['isActive', 'isApproved']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['priceMin', 'priceMax']
      }
    ]
  }
);

export default VenueEnhanced;