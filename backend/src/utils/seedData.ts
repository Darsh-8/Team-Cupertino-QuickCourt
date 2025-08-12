import { User, Venue, Court, Booking, Review, TimeSlot, VenueAnalytics } from '../models';
import bcrypt from 'bcryptjs';

export const seedDemoData = async () => {
  try {
    console.log('🌱 Seeding demo data...');

    // Check if data already exists
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('📊 Demo data already exists, skipping seed...');
      return;
    }

    // Create demo users
    const demoUsers = await User.bulkCreate([
      {
        fullName: 'Demo Customer',
        email: 'customer@demo.com',
        password: await bcrypt.hash('demo123', 12),
        role: 'customer',
        isVerified: true,
        avatar: '/uploads/avatars/customer-avatar.jpg'
      },
      {
        fullName: 'Sports Enthusiast',
        email: 'sports@demo.com',
        password: await bcrypt.hash('demo123', 12),
        role: 'customer',
        isVerified: true,
        avatar: '/uploads/avatars/sports-avatar.jpg'
      },
      {
        fullName: 'Venue Owner',
        email: 'owner@demo.com',
        password: await bcrypt.hash('demo123', 12),
        role: 'owner',
        isVerified: true,
        avatar: '/uploads/avatars/owner-avatar.jpg'
      },
      {
        fullName: 'System Admin',
        email: 'admin@demo.com',
        password: await bcrypt.hash('demo123', 12),
        role: 'admin',
        isVerified: true,
        avatar: '/uploads/avatars/admin-avatar.jpg'
      },
      {
        fullName: 'Rajesh Kumar',
        email: 'rajesh@demo.com',
        password: await bcrypt.hash('demo123', 12),
        role: 'customer',
        isVerified: true
      },
      {
        fullName: 'Priya Sharma',
        email: 'priya@demo.com',
        password: await bcrypt.hash('demo123', 12),
        role: 'customer',
        isVerified: true
      },
      {
        fullName: 'Amit Patel',
        email: 'amit@demo.com',
        password: await bcrypt.hash('demo123', 12),
        role: 'customer',
        isVerified: true
      }
    ]);

    console.log('✅ Demo users created');

    // Create enhanced venues with complete data
    const demoVenues = await Venue.bulkCreate([
      {
        ownerId: demoUsers[2].id,
        name: 'Elite Sports Arena',
        description: 'Premium multi-sport facility with world-class amenities. Perfect for badminton, tennis, and basketball enthusiasts. Our state-of-the-art courts feature professional-grade flooring and lighting systems.',
        address: '123 Sports Complex, Satellite Road, Ahmedabad, Gujarat 380015',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        latitude: 23.0225,
        longitude: 72.5714,
        sportsAvailable: ['badminton', 'tennis', 'basketball'],
        amenities: ['parking', 'wifi', 'cafe', 'shower', 'ac', 'equipment_rental'],
        photos: [
          'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        priceMin: 400,
        priceMax: 1200,
        rating: 4.8,
        reviewCount: 124,
        contactPhone: '+91-9876543210',
        contactEmail: 'info@elitesports.com',
        website: 'https://elitesports.com',
        isApproved: true,
        isActive: true,
        approvalStatus: 'approved',
        openingTime: '06:00:00',
        closingTime: '22:00:00',
        daysOfOperation: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      {
        ownerId: demoUsers[2].id,
        name: 'Champions Club',
        description: 'Exclusive sports club offering premium tennis and swimming facilities. Our Olympic-size swimming pool and clay tennis courts provide the perfect environment for serious athletes.',
        address: '456 Game Avenue, Bopal, Ahmedabad, Gujarat 380058',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380058',
        latitude: 23.0395,
        longitude: 72.4681,
        sportsAvailable: ['tennis', 'swimming', 'gym'],
        amenities: ['parking', 'cafe', 'shower', 'locker', 'spa'],
        photos: [
          'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        priceMin: 600,
        priceMax: 2000,
        rating: 4.7,
        reviewCount: 95,
        contactPhone: '+91-9876543211',
        contactEmail: 'info@championsclub.com',
        isApproved: true,
        isActive: true,
        approvalStatus: 'approved',
        openingTime: '05:00:00',
        closingTime: '23:00:00',
        daysOfOperation: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      {
        ownerId: demoUsers[2].id,
        name: 'Metro Sports Complex',
        description: 'Large sports complex featuring multiple football fields and basketball courts. Ideal for team sports and group activities with ample parking and modern facilities.',
        address: '789 Sports City, Makarba, Ahmedabad, Gujarat 380051',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380051',
        latitude: 23.0138,
        longitude: 72.5080,
        sportsAvailable: ['football', 'basketball', 'badminton'],
        amenities: ['parking', 'shower', 'changing_room', 'equipment_rental'],
        photos: [
          'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        priceMin: 800,
        priceMax: 2400,
        rating: 4.6,
        reviewCount: 156,
        contactPhone: '+91-9876543212',
        contactEmail: 'info@metrosports.com',
        isApproved: true,
        isActive: true,
        approvalStatus: 'approved',
        openingTime: '06:00:00',
        closingTime: '22:00:00',
        daysOfOperation: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      {
        ownerId: demoUsers[2].id,
        name: 'AquaZone Pool Club',
        description: 'Premium aquatic center with heated pools, diving facilities, and water sports equipment. Perfect for swimming enthusiasts and water aerobics classes.',
        address: '321 Water World, Prahlad Nagar, Ahmedabad, Gujarat 380015',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        latitude: 23.0076,
        longitude: 72.5067,
        sportsAvailable: ['swimming', 'water_sports'],
        amenities: ['parking', 'cafe', 'shower', 'locker', 'spa'],
        photos: [
          'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        priceMin: 500,
        priceMax: 1500,
        rating: 4.4,
        reviewCount: 89,
        contactPhone: '+91-9876543213',
        contactEmail: 'info@aquazone.com',
        isApproved: true,
        isActive: true,
        approvalStatus: 'approved',
        openingTime: '05:00:00',
        closingTime: '22:00:00',
        daysOfOperation: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      }
    ]);

    console.log('✅ Demo venues created');

    // Create enhanced courts with advanced features
    const demoCourts = await Court.bulkCreate([
      // Elite Sports Arena Courts
      {
        venueId: demoVenues[0].id,
        name: 'Badminton Court Premium A1',
        sportType: 'badminton',
        description: 'Professional badminton court with synthetic flooring and LED lighting',
        pricePerHour: 400,
        priceWeekday: 350,
        priceWeekend: 500,
        pricePeakHours: 600,
        operatingStart: '06:00:00',
        operatingEnd: '22:00:00',
        courtSize: '20x44 feet',
        surfaceType: 'synthetic',
        maxPlayers: 4,
        equipmentProvided: ['rackets', 'shuttlecocks', 'nets'],
        courtAmenities: ['led_lights', 'scoreboard', 'seating', 'air_conditioning'],
        isActive: true,
        maintenanceMode: false
      },
      {
        venueId: demoVenues[0].id,
        name: 'Tennis Court Championship',
        sportType: 'tennis',
        description: 'Championship-grade tennis court with clay surface',
        pricePerHour: 800,
        priceWeekday: 700,
        priceWeekend: 1000,
        pricePeakHours: 1200,
        operatingStart: '06:00:00',
        operatingEnd: '20:00:00',
        courtSize: '78x36 feet',
        surfaceType: 'clay',
        maxPlayers: 4,
        equipmentProvided: ['nets', 'line_brushes'],
        courtAmenities: ['floodlights', 'umpire_chair', 'player_benches'],
        isActive: true,
        maintenanceMode: false
      },
      {
        venueId: demoVenues[0].id,
        name: 'Basketball Court Pro',
        sportType: 'basketball',
        description: 'Professional basketball court with wooden flooring',
        pricePerHour: 1200,
        priceWeekday: 1000,
        priceWeekend: 1500,
        pricePeakHours: 1800,
        operatingStart: '06:00:00',
        operatingEnd: '22:00:00',
        courtSize: '94x50 feet',
        surfaceType: 'wooden',
        maxPlayers: 10,
        equipmentProvided: ['basketballs', 'scoreboard'],
        courtAmenities: ['led_lights', 'sound_system', 'spectator_seating'],
        isActive: true,
        maintenanceMode: false
      },
      // Champions Club Courts
      {
        venueId: demoVenues[1].id,
        name: 'Olympic Swimming Pool',
        sportType: 'swimming',
        description: 'Olympic-size swimming pool with lane dividers',
        pricePerHour: 600,
        priceWeekday: 500,
        priceWeekend: 800,
        pricePeakHours: 900,
        operatingStart: '05:00:00',
        operatingEnd: '22:00:00',
        courtSize: '50x25 meters',
        surfaceType: 'tiled',
        maxPlayers: 20,
        equipmentProvided: ['lane_ropes', 'kickboards', 'pool_noodles'],
        courtAmenities: ['underwater_lights', 'timing_system', 'spectator_seating'],
        isActive: true,
        maintenanceMode: false
      },
      {
        venueId: demoVenues[1].id,
        name: 'Premium Tennis Court',
        sportType: 'tennis',
        description: 'Premium tennis court with grass surface',
        pricePerHour: 1200,
        priceWeekday: 1000,
        priceWeekend: 1500,
        pricePeakHours: 2000,
        operatingStart: '06:00:00',
        operatingEnd: '21:00:00',
        courtSize: '78x36 feet',
        surfaceType: 'grass',
        maxPlayers: 4,
        equipmentProvided: ['nets', 'court_maintenance'],
        courtAmenities: ['floodlights', 'umpire_chair', 'ball_boys'],
        isActive: true,
        maintenanceMode: false
      },
      // Metro Sports Complex Courts
      {
        venueId: demoVenues[2].id,
        name: 'Football Field A',
        sportType: 'football',
        description: 'Full-size football field with natural grass',
        pricePerHour: 2000,
        priceWeekday: 1800,
        priceWeekend: 2500,
        pricePeakHours: 3000,
        operatingStart: '06:00:00',
        operatingEnd: '22:00:00',
        courtSize: '100x64 meters',
        surfaceType: 'grass',
        maxPlayers: 22,
        equipmentProvided: ['goals', 'corner_flags', 'footballs'],
        courtAmenities: ['floodlights', 'dugouts', 'spectator_stands'],
        isActive: true,
        maintenanceMode: false
      },
      {
        venueId: demoVenues[2].id,
        name: 'Basketball Court Metro',
        sportType: 'basketball',
        description: 'Outdoor basketball court with concrete surface',
        pricePerHour: 1000,
        priceWeekday: 800,
        priceWeekend: 1200,
        pricePeakHours: 1500,
        operatingStart: '06:00:00',
        operatingEnd: '22:00:00',
        courtSize: '94x50 feet',
        surfaceType: 'concrete',
        maxPlayers: 10,
        equipmentProvided: ['basketballs', 'scoreboard'],
        courtAmenities: ['floodlights', 'player_benches'],
        isActive: true,
        maintenanceMode: false
      },
      // AquaZone Pool Club Courts
      {
        venueId: demoVenues[3].id,
        name: 'Main Swimming Pool',
        sportType: 'swimming',
        description: 'Large swimming pool with multiple lanes',
        pricePerHour: 500,
        priceWeekday: 400,
        priceWeekend: 600,
        pricePeakHours: 800,
        operatingStart: '05:00:00',
        operatingEnd: '22:00:00',
        courtSize: '25x15 meters',
        surfaceType: 'tiled',
        maxPlayers: 15,
        equipmentProvided: ['lane_ropes', 'kickboards'],
        courtAmenities: ['underwater_lights', 'pool_deck'],
        isActive: true,
        maintenanceMode: false
      },
      {
        venueId: demoVenues[3].id,
        name: 'Kids Pool',
        sportType: 'swimming',
        description: 'Shallow pool perfect for children and beginners',
        pricePerHour: 300,
        priceWeekday: 250,
        priceWeekend: 400,
        pricePeakHours: 500,
        operatingStart: '08:00:00',
        operatingEnd: '20:00:00',
        courtSize: '15x10 meters',
        surfaceType: 'tiled',
        maxPlayers: 10,
        equipmentProvided: ['pool_toys', 'floaties'],
        courtAmenities: ['shallow_end', 'safety_equipment'],
        isActive: true,
        maintenanceMode: false
      }
    ]);

    console.log('✅ Demo courts created');

    // Create time slots for courts
    const today = new Date();
    const timeSlots = [];
    
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      
      for (const court of demoCourts) {
        // Generate hourly slots from 6 AM to 10 PM
        for (let hour = 6; hour < 22; hour++) {
          const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
          const endTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;
          
          // Randomly make some slots booked or blocked for demo
          let status: 'available' | 'booked' | 'blocked' | 'maintenance' = 'available';
          let blockReason: string | undefined = undefined;
          
          if (Math.random() < 0.2) { // 20% chance of being booked
            status = 'booked';
          } else if (Math.random() < 0.05) { // 5% chance of being blocked
            status = 'blocked';
            blockReason = 'Maintenance';
          }
          
          timeSlots.push({
            courtId: court.id,
            date: currentDate,
            startTime,
            endTime,
            status,
            blockReason
          });
        }
      }
    }
    
    await TimeSlot.bulkCreate(timeSlots);
    console.log('✅ Time slots created');

    // Create venue analytics data
    const analyticsData = [];
    for (let dayOffset = -30; dayOffset < 0; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      
      for (const venue of demoVenues) {
        const dailyBookings = Math.floor(Math.random() * 20) + 5; // 5-25 bookings per day
        const dailyRevenue = dailyBookings * (Math.random() * 800 + 400); // Random revenue
        
        analyticsData.push({
          venueId: venue.id,
          date: currentDate,
          totalBookings: dailyBookings,
          confirmedBookings: Math.floor(dailyBookings * 0.9),
          cancelledBookings: Math.floor(dailyBookings * 0.1),
          completedBookings: Math.floor(dailyBookings * 0.8),
          totalRevenue: dailyRevenue,
          confirmedRevenue: dailyRevenue * 0.9,
          totalAvailableHours: 64, // 4 courts * 16 hours
          totalBookedHours: dailyBookings * 1.5,
          utilizationRate: (dailyBookings * 1.5 / 64) * 100,
          peakHourBookings: {
            '06': Math.floor(Math.random() * 3),
            '07': Math.floor(Math.random() * 5),
            '08': Math.floor(Math.random() * 5),
            '18': Math.floor(Math.random() * 8) + 5,
            '19': Math.floor(Math.random() * 10) + 8,
            '20': Math.floor(Math.random() * 6) + 4
          }
        });
      }
    }
    
    await VenueAnalytics.bulkCreate(analyticsData);
    console.log('✅ Venue analytics data created');

    // Create demo bookings
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const demoBookings = await Booking.bulkCreate([
      {
        userId: demoUsers[0].id,
        venueId: demoVenues[0].id,
        courtId: demoCourts[0].id,
        bookingDate: tomorrow,
        startTime: '18:00:00',
        endTime: '19:00:00',
        duration: 1,
        totalAmount: 400,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentId: 'pay_demo_001'
      },
      {
        userId: demoUsers[1].id,
        venueId: demoVenues[1].id,
        courtId: demoCourts[3].id,
        bookingDate: dayAfter,
        startTime: '07:00:00',
        endTime: '08:30:00',
        duration: 1.5,
        totalAmount: 900,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentId: 'pay_demo_002'
      },
      {
        userId: demoUsers[4].id,
        venueId: demoVenues[2].id,
        courtId: demoCourts[5].id,
        bookingDate: dayAfter,
        startTime: '19:30:00',
        endTime: '21:30:00',
        duration: 2,
        totalAmount: 4000,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentId: 'pay_demo_003'
      }
    ]);

    console.log('✅ Demo bookings created');

    // Create demo reviews
    const demoReviews = await Review.bulkCreate([
      {
        userId: demoUsers[0].id,
        venueId: demoVenues[0].id,
        rating: 5,
        comment: 'Excellent facilities and well-maintained courts. The badminton courts are professional grade and the staff is very helpful. Highly recommended!',
        photos: [],
        isVerified: true
      },
      {
        userId: demoUsers[1].id,
        venueId: demoVenues[0].id,
        rating: 4,
        comment: 'Great place for tennis. The courts are clean and the equipment rental service is convenient. Only downside is parking can be crowded during peak hours.',
        photos: [],
        isVerified: true
      },
      {
        userId: demoUsers[4].id,
        venueId: demoVenues[1].id,
        rating: 5,
        comment: 'Amazing swimming pool with crystal clear water. The changing rooms are clean and spacious. Perfect for morning workouts!',
        photos: [],
        isVerified: true
      },
      {
        userId: demoUsers[5].id,
        venueId: demoVenues[1].id,
        rating: 4,
        comment: 'Good facilities overall. The basketball court is well-maintained and the lighting is excellent for evening games.',
        photos: [],
        isVerified: true
      },
      {
        userId: demoUsers[6].id,
        venueId: demoVenues[2].id,
        rating: 5,
        comment: 'Premium tennis club with excellent service. The clay courts are perfectly maintained and the coaching staff is professional.',
        photos: [],
        isVerified: true
      }
    ]);

    console.log('✅ Demo reviews created');

    // Update venue ratings based on reviews
    for (const venue of demoVenues) {
      const reviews = await Review.findAll({
        where: { venueId: venue.id, isVerified: true }
      });
      
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = Math.round((totalRating / reviews.length) * 10) / 10;
        
        await venue.update({
          rating: avgRating,
          reviewCount: reviews.length
        });
      }
    }

    console.log('✅ Venue ratings updated');

    console.log('🎉 Demo data seeded successfully!');
    console.log('');
    console.log('📋 Demo Accounts Created:');
    console.log('👤 Customer: customer@demo.com / demo123');
    console.log('👤 Sports User: sports@demo.com / demo123');
    console.log('🏢 Venue Owner: owner@demo.com / demo123');
    console.log('⚡ Admin: admin@demo.com / demo123');
    console.log('');
    console.log('🏟️ Created 4 venues with enhanced features');
    console.log('🏸 Created 10 courts with advanced pricing');
    console.log('📅 Created time slots and analytics data');
    console.log('📝 Created sample bookings and reviews');
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  }
};