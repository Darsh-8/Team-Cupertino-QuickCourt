import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import bcrypt from 'bcryptjs';

// User attributes interface
export interface UserAttributes {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: 'customer' | 'owner' | 'admin';
  isVerified: boolean;
  avatar?: string;
  otpCode?: string;
  otpExpiry?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Optional attributes for creation
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'isVerified' | 'avatar' | 'otpCode' | 'otpExpiry' | 'createdAt' | 'updatedAt'> {}

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public role!: 'customer' | 'owner' | 'admin';
  public isVerified!: boolean;
  public avatar?: string;
  public otpCode?: string;
  public otpExpiry?: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  public async generateOTP(): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpCode = otp;
    this.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await this.save();
    return otp;
  }

  public isOTPValid(otp: string): boolean {
    return this.otpCode === otp && this.otpExpiry! > new Date();
  }

  // Convert to JSON (exclude sensitive data)
  public toJSON(): Partial<UserAttributes> {
    const { password, otpCode, otpExpiry, ...rest } = this.get();
    return rest;
  }
}

// Initialize User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Full name is required'
        },
        len: {
          args: [2, 100],
          msg: 'Full name must be between 2 and 100 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: 'Password must be at least 6 characters long'
        }
      }
    },
    role: {
      type: DataTypes.ENUM('customer', 'owner', 'admin'),
      allowNull: false,
      defaultValue: 'customer'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    otpCode: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ['password', 'otpCode', 'otpExpiry'] }
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['role']
      },
      {
        fields: ['isVerified']
      }
    ]
  }
);

// Hash password before saving
User.beforeSave(async (user: User) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

export default User;