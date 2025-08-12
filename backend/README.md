# QuickCourt Backend API

A comprehensive Express.js backend for the QuickCourt sports booking platform, built for hackathon demonstration with realistic data and seamless functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8.0
- npm or yarn

### Installation

1. **Clone and setup**
```bash
cd backend
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

3. **Setup database**
```bash
npm run setup-db
```

4. **Start development server**
```bash
npm run dev
```

The API will be running at `http://localhost:5000`

## 📚 API Documentation

Visit `http://localhost:5000/api-docs` for interactive Swagger documentation.

## 🔐 Demo Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Customer | `customer@demo.com` | `demo123` | Regular user account |
| Sports User | `sports@demo.com` | `demo123` | Active sports enthusiast |
| Venue Owner | `owner@demo.com` | `demo123` | Venue management access |
| Admin | `admin@demo.com` | `demo123` | Full platform access |

## 🏗️ Architecture

### Tech Stack
- **Backend**: Express.js + TypeScript
- **Database**: MySQL 8.0 with Sequelize ORM
- **Authentication**: JWT tokens
- **Validation**: express-validator
- **Documentation**: Swagger UI
- **File Upload**: Multer
- **Email**: Nodemailer (demo mode)

### Project Structure
```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── models/          # Sequelize models
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic services
│   └── utils/           # Utilities and helpers
├── uploads/             # File upload directory
└── README.md
```

## 🛠️ API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /verify-otp` - Email verification
- `POST /login` - User login
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `POST /logout` - User logout

### Venues (`/api/venues`)
- `GET /` - List venues with filters
- `GET /popular` - Popular venues
- `GET /search` - Search venues
- `GET /:id` - Venue details
- `GET /:id/courts` - Venue courts
- `GET /:id/reviews` - Venue reviews
- `POST /:id/reviews` - Create review

### Bookings (`/api/bookings`)
- `POST /` - Create booking
- `GET /my-bookings` - User bookings
- `GET /availability` - Check availability
- `GET /:id` - Booking details
- `PUT /:id/cancel` - Cancel booking

### Users (`/api/users`)
- `GET /profile` - User profile with stats
- `PUT /profile` - Update profile
- `POST /avatar` - Upload avatar
- `GET /bookings` - User bookings
- `GET /reviews` - User reviews

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and authentication
- **venues** - Sports venue information
- **courts** - Individual courts within venues
- **bookings** - Booking records and status
- **reviews** - User reviews and ratings

### Key Features
- Foreign key relationships
- Unique constraints for booking conflicts
- JSON fields for flexible data (amenities, photos)
- Proper indexing for performance
- Soft deletes where appropriate

## 🎯 Demo Features

### Realistic Data
- 6+ venues across different sports
- Multiple courts per venue
- Sample bookings and reviews
- Proper pricing and availability

### Working Functionality
- Complete authentication flow
- Venue search and filtering
- Real-time availability checking
- Booking creation and management
- Payment simulation
- Email notifications (demo mode)

### Performance Optimized
- Database indexing
- Efficient queries with joins
- Pagination for large datasets
- Proper error handling
- Request validation

## 🔧 Configuration

### Environment Variables
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=quickcourt_db
JWT_SECRET=your_jwt_secret
DEMO_MODE=true
```

### Database Setup
The setup script automatically:
1. Creates database tables
2. Sets up relationships
3. Seeds demo data
4. Configures indexes

## 🚦 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### API Testing
Use the Swagger UI at `/api-docs` or tools like Postman with the provided endpoints.

### Demo Scenarios

1. **User Registration Flow**
   - Register → Verify OTP → Login

2. **Venue Discovery**
   - Browse venues → Filter by sport → View details

3. **Booking Process**
   - Check availability → Create booking → Payment simulation

4. **Profile Management**
   - Update profile → Upload avatar → View bookings

## 📊 Monitoring

### Logs
- Request/response logging with Morgan
- Error tracking and reporting
- Performance monitoring

### Statistics
- API endpoint usage
- Database query performance
- File upload statistics

## 🔒 Security

### Implemented Features
- JWT authentication
- Password hashing (bcrypt)
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- SQL injection prevention

### Demo Mode Safety
- Email sending disabled
- Payment simulation only
- Safe demo credentials
- No real external API calls

## 🚀 Deployment Ready

### Production Considerations
- Environment-based configuration
- Database connection pooling
- Error handling and logging
- Security middleware
- Performance optimization
- Health check endpoints

### Docker Support (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## 📝 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues or questions:
- Check the API documentation at `/api-docs`
- Review the demo data setup
- Verify environment configuration
- Check database connectivity

---

**Built for QuickCourt Hackathon Demo** 🏆

This backend provides a complete, production-ready API for sports venue booking with realistic data and comprehensive functionality for demonstration to judges.