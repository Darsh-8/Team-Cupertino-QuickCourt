import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// Review attributes interface
export interface ReviewAttributes {
  id: number;
  userId: number;
  venueId: number;
  rating: number;
  comment?: string;
  photos: string[];
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id' | 'comment' | 'photos' | 'isVerified' | 'createdAt' | 'updatedAt'> {}

// Review model class
class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public userId!: number;
  public venueId!: number;
  public rating!: number;
  public comment?: string;
  public photos!: string[];
  public isVerified!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public hasPhotos(): boolean {
    return this.photos && this.photos.length > 0;
  }

  public isPositive(): boolean {
    return this.rating >= 4;
  }

  public isNegative(): boolean {
    return this.rating <= 2;
  }
}

// Initialize Review model
Review.init(
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [1],
          msg: 'Rating must be at least 1'
        },
        max: {
          args: [5],
          msg: 'Rating cannot exceed 5'
        }
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Comment cannot exceed 1000 characters'
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
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['venueId']
      },
      {
        fields: ['rating']
      },
      {
        fields: ['isVerified']
      },
      {
        fields: ['createdAt']
      }
    ]
  }
);

export default Review;