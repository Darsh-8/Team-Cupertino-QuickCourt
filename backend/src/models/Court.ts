import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Enhanced Court attributes interface
export interface CourtAttributes {
  id: number;
  venueId: number;
  name: string;
  sportType: string;
  description?: string;
  
  // Pricing tiers
  pricePerHour: number;
  priceWeekday?: number;
  priceWeekend?: number;
  pricePeakHours?: number;
  
  // Operating hours
  operatingStart: string;
  operatingEnd: string;
  
  // Court specifications
  courtSize?: string;
  surfaceType?: string;
  maxPlayers: number;
  
  // Equipment and amenities
  equipmentProvided: string[];
  courtAmenities: string[];
  
  // Status
  isActive: boolean;
  maintenanceMode: boolean;
  
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface CourtCreationAttributes extends Optional<CourtAttributes, 
  'id' | 'description' | 'priceWeekday' | 'priceWeekend' | 'pricePeakHours' | 'courtSize' | 
  'surfaceType' | 'maxPlayers' | 'equipmentProvided' | 'courtAmenities' | 'isActive' | 
  'maintenanceMode' | 'operatingStart' | 'operatingEnd' | 'createdAt' | 'updatedAt'> {}

// Enhanced Court model class
class Court extends Model<CourtAttributes, CourtCreationAttributes> implements CourtAttributes {
  public id!: number;
  public venueId!: number;
  public name!: string;
  public sportType!: string;
  public description?: string;
  public pricePerHour!: number;
  public priceWeekday?: number;
  public priceWeekend?: number;
  public pricePeakHours?: number;
  public operatingStart!: string;
  public operatingEnd!: string;
  public courtSize?: string;
  public surfaceType?: string;
  public maxPlayers!: number;
  public equipmentProvided!: string[];
  public courtAmenities!: string[];
  public isActive!: boolean;
  public maintenanceMode!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public isOperatingAt(time: string): boolean {
    return time >= this.operatingStart && time <= this.operatingEnd;
  }

  public getPriceForTime(time: string, date: Date): number {
    const dayOfWeek = date.getDay();
    const hour = parseInt(time.split(':')[0]);
    
    // Weekend pricing (Saturday = 6, Sunday = 0)
    if ((dayOfWeek === 0 || dayOfWeek === 6) && this.priceWeekend) {
      return this.priceWeekend;
    }
    
    // Peak hours pricing (6-9 PM)
    if (hour >= 18 && hour <= 21 && this.pricePeakHours) {
      return this.pricePeakHours;
    }
    
    // Weekday pricing
    if (this.priceWeekday && dayOfWeek >= 1 && dayOfWeek <= 5) {
      return this.priceWeekday;
    }
    
    // Default pricing
    return this.pricePerHour;
  }

  public canBeBooked(): boolean {
    return this.isActive && !this.maintenanceMode;
  }

  public hasEquipment(equipment: string): boolean {
    return this.equipmentProvided.includes(equipment);
  }

  public hasAmenity(amenity: string): boolean {
    return this.courtAmenities.includes(amenity);
  }

  public getOperatingHours(): { start: string; end: string } {
    return {
      start: this.operatingStart,
      end: this.operatingEnd
    };
  }
}

// Initialize Enhanced Court model
Court.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Court name is required'
        },
        len: {
          args: [2, 100],
          msg: 'Court name must be between 2 and 100 characters'
        }
      }
    },
    sportType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Sport type is required'
        },
        isIn: {
          args: [['badminton', 'tennis', 'football', 'basketball', 'cricket', 'swimming', 'table_tennis', 'volleyball', 'squash', 'gym']],
          msg: 'Invalid sport type'
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    pricePerHour: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price per hour cannot be negative'
        }
      }
    },
    priceWeekday: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Weekday price cannot be negative'
        }
      }
    },
    priceWeekend: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Weekend price cannot be negative'
        }
      }
    },
    pricePeakHours: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: {
          args: [0],
          msg: 'Peak hours price cannot be negative'
        }
      }
    },
    operatingStart: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '06:00:00'
    },
    operatingEnd: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: '22:00:00'
    },
    courtSize: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    surfaceType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: {
          args: [['synthetic', 'wooden', 'concrete', 'clay', 'grass', 'rubber']],
          msg: 'Invalid surface type'
        }
      }
    },
    maxPlayers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 4,
      validate: {
        min: {
          args: [1],
          msg: 'Maximum players must be at least 1'
        },
        max: {
          args: [50],
          msg: 'Maximum players cannot exceed 50'
        }
      }
    },
    equipmentProvided: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray: {
          args: true,
          msg: 'Equipment provided must be an array'
        }
      }
    },
    courtAmenities: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
      validate: {
        isArray: {
          args: true,
          msg: 'Court amenities must be an array'
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'Court',
    tableName: 'courts',
    timestamps: true,
    indexes: [
      {
        fields: ['venueId']
      },
      {
        fields: ['sportType']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['maintenanceMode']
      },
      {
        fields: ['pricePerHour']
      }
    ]
  }
);

export default Court;