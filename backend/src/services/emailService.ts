import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Email interface
interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

// Send email function
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Skip email sending in demo mode or if credentials are not configured
    if (process.env.DEMO_MODE === 'true' || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 Email sending skipped (Demo mode or credentials not configured)');
      console.log('Email details:', {
        to: options.to,
        subject: options.subject,
        preview: options.html ? options.html.substring(0, 100) + '...' : options.text?.substring(0, 100) + '...'
      });
      return true;
    }

    const mailOptions = {
      from: options.from || `"QuickCourt" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (to: string, name: string): Promise<boolean> => {
  const subject = 'Welcome to QuickCourt!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #e11d48; font-size: 28px; margin: 0;">Welcome to QuickCourt!</h1>
      </div>
      
      <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
        <h2 style="color: #1f2937; margin-top: 0;">Hi ${name}! 👋</h2>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
          Welcome to QuickCourt - your ultimate destination for booking sports venues and connecting with fellow sports enthusiasts!
        </p>
        <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">
          You can now:
        </p>
        <ul style="color: #4b5563; line-height: 1.8;">
          <li>🏟️ Browse and book premium sports venues</li>
          <li>🏸 Find courts for badminton, tennis, football, and more</li>
          <li>⭐ Read reviews and ratings from other players</li>
          <li>📅 Manage your bookings easily</li>
          <li>🤝 Connect with other sports enthusiasts</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:3000" style="background: #e11d48; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Start Exploring Venues
        </a>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Need help? Contact us at <a href="mailto:support@quickcourt.com" style="color: #e11d48;">support@quickcourt.com</a>
        </p>
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Best regards,<br>
          The QuickCourt Team
        </p>
      </div>
    </div>
  `;

  return await sendEmail({ to, subject, html });
};

// Send booking confirmation email
export const sendBookingConfirmationEmail = async (
  to: string, 
  name: string, 
  bookingDetails: any
): Promise<boolean> => {
  const subject = 'Booking Confirmed - QuickCourt';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #e11d48; font-size: 28px; margin: 0;">Booking Confirmed! ✅</h1>
      </div>
      
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
        <h2 style="color: #166534; margin-top: 0;">Hi ${name}!</h2>
        <p style="color: #166534; font-size: 16px;">
          Your booking has been confirmed successfully. Here are the details:
        </p>
      </div>
      
      <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
        <h3 style="color: #1f2937; margin-top: 0; border-bottom: 2px solid #e11d48; padding-bottom: 10px;">
          Booking Details
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Venue:</td>
            <td style="padding: 10px 0; color: #1f2937;">${bookingDetails.venueName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Court:</td>
            <td style="padding: 10px 0; color: #1f2937;">${bookingDetails.courtName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Sport:</td>
            <td style="padding: 10px 0; color: #1f2937;">${bookingDetails.sport}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Date:</td>
            <td style="padding: 10px 0; color: #1f2937;">${bookingDetails.date}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Time:</td>
            <td style="padding: 10px 0; color: #1f2937;">${bookingDetails.startTime} - ${bookingDetails.endTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Duration:</td>
            <td style="padding: 10px 0; color: #1f2937;">${bookingDetails.duration} hour(s)</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Total Amount:</td>
            <td style="padding: 10px 0; color: #1f2937; font-weight: bold; font-size: 18px;">₹${bookingDetails.totalAmount}</td>
          </tr>
        </table>
      </div>
      
      <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
        <h4 style="color: #92400e; margin-top: 0;">📍 Venue Address:</h4>
        <p style="color: #92400e; margin: 0;">${bookingDetails.venueAddress}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:3000/profile/bookings" style="background: #e11d48; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-right: 15px;">
          View My Bookings
        </a>
        <a href="http://localhost:3000/venue/${bookingDetails.venueId}" style="background: #6b7280; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          View Venue Details
        </a>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Important:</strong> Please arrive 15 minutes before your booking time. 
          Cancellations are allowed up to 2 hours before the booking time.
        </p>
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
          Questions? Contact us at <a href="mailto:support@quickcourt.com" style="color: #e11d48;">support@quickcourt.com</a>
        </p>
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Best regards,<br>
          The QuickCourt Team
        </p>
      </div>
    </div>
  `;

  return await sendEmail({ to, subject, html });
};

// Send booking cancellation email
export const sendBookingCancellationEmail = async (
  to: string, 
  name: string, 
  bookingDetails: any
): Promise<boolean> => {
  const subject = 'Booking Cancelled - QuickCourt';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #dc2626; font-size: 28px; margin: 0;">Booking Cancelled</h1>
      </div>
      
      <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
        <h2 style="color: #dc2626; margin-top: 0;">Hi ${name},</h2>
        <p style="color: #dc2626; font-size: 16px;">
          Your booking has been cancelled successfully. If you paid for this booking, your refund will be processed within 3-5 business days.
        </p>
      </div>
      
      <div style="background: #f8fafc; padding: 25px; border-radius: 10px; margin-bottom: 30px;">
        <h3 style="color: #1f2937; margin-top: 0;">Cancelled Booking Details</h3>
        <p><strong>Venue:</strong> ${bookingDetails.venueName}</p>
        <p><strong>Date:</strong> ${bookingDetails.date}</p>
        <p><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
        <p><strong>Amount:</strong> ₹${bookingDetails.totalAmount}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:3000/search" style="background: #e11d48; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Book Another Venue
        </a>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          Need help? Contact us at <a href="mailto:support@quickcourt.com" style="color: #e11d48;">support@quickcourt.com</a>
        </p>
      </div>
    </div>
  `;

  return await sendEmail({ to, subject, html });
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    if (process.env.DEMO_MODE === 'true') {
      console.log('📧 Email verification skipped (Demo mode)');
      return true;
    }

    await transporter.verify();
    console.log('✅ Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('❌ Email configuration verification failed:', error);
    return false;
  }
};