import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const rawNotificationEmail = process.env.NOTIFICATION_EMAIL || 'regmikiraneyyy@gmail.com';
const toEmails = rawNotificationEmail.split(',').map(e => e.trim()).filter(Boolean);
// Common CSS for email styling (Quiet Luxury theme)
const emailStyles = `
  background-color: #fcfbf9;
  color: #2e302f;
  margin: 0;
  padding: 40px 20px;
`;

const containerStyles = `
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid #e5e2db;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
`;

const headerStyles = `
  background-color: #1c221e;
  padding: 30px;
  text-align: center;
  border-bottom: 2px solid #e0cda9;
`;

const bodyStyles = `
  padding: 40px 30px;
  font-family: 'Lato', Helvetica, Arial, sans-serif;
  line-height: 1.6;
`;

const footerStyles = `
  background-color: #f7f5f0;
  padding: 20px 30px;
  text-align: center;
  font-size: 11px;
  color: #7d807e;
  border-top: 1px solid #e5e2db;
`;

const btnStyles = `
  display: inline-block;
  background-color: #e0cda9;
  color: #1c221e;
  text-decoration: none;
  font-weight: bold;
  padding: 12px 28px;
  border-radius: 24px;
  margin: 20px 0;
  font-size: 14px;
`;

const tableStyles = `
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 13px;
`;

const thStyles = `
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid #e5e2db;
  color: #7d807e;
  font-weight: 600;
  width: 35%;
`;

const tdStyles = `
  padding: 8px 12px;
  border-bottom: 1px solid #e5e2db;
  color: #2e302f;
  font-weight: bold;
`;

// Helper to wrap content in main template layout
function wrapLayout(title: string, bodyContent: string) {
  return `
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
      </head>
      <body style="${emailStyles}">
        <div style="${containerStyles}">
          <div style="${headerStyles}">
            <h1 style="color: #fdfbf7; margin: 0; font-size: 24px; font-weight: normal; letter-spacing: 0.15em; font-family: Georgia, serif;">NANOHANA LODGE</h1>
            <p style="color: #e0cda9; margin: 5px 0 0 0; font-size: 11px; font-family: sans-serif; letter-spacing: 0.2em; text-transform: uppercase;">Lakeside, Pokhara</p>
          </div>
          <div style="${bodyStyles}">
            ${bodyContent}
          </div>
          <div style="${footerStyles}">
            <p style="margin: 0 0 5px 0;"><strong>Nanohana Lodge</strong> | Street No. 4, Lakeside, Pokhara, Nepal</p>
            <p style="margin: 0;">Phone: +977-61-464070 | Email: nanohana_lodge@hotmail.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// 1. Send Contact Submission Email
export async function sendContactEmail(data: {
  name: string;
  email: string;
  checkin?: string;
  checkout?: string;
  rooms: string;
  message: string;
  discovery: string;
}) {
  const subject = `New Contact Form Message from ${data.name}`;
  const htmlContent = wrapLayout(
    'New Contact Message',
    `
    <h2 style="font-family: Georgia, serif; font-weight: normal; margin-top: 0; color: #1c221e; border-bottom: 1px solid #e0cda9; padding-bottom: 10px;">Contact Dispatch</h2>
    <p>You have received a new message via the contact form on your website. Here are the details:</p>
    
    <table style="${tableStyles}">
      <tr>
        <th style="${thStyles}">Guest Name:</th>
        <td style="${tdStyles}">${data.name}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Email Address:</th>
        <td style="${tdStyles}">${data.email}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Check-in:</th>
        <td style="${tdStyles}">${data.checkin || 'Not specified'}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Check-out:</th>
        <td style="${tdStyles}">${data.checkout || 'Not specified'}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Preferred Room:</th>
        <td style="${tdStyles}">${data.rooms}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Found Us Via:</th>
        <td style="${tdStyles}">${data.discovery}</td>
      </tr>
    </table>
    
    <div style="margin-top: 25px; padding: 20px; background-color: #f7f5f0; border-left: 3px solid #1c221e; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0; font-family: sans-serif; font-size: 11px; text-transform: uppercase; color: #7d807e; letter-spacing: 0.1em;">Guest Message</h4>
      <p style="margin: 0; font-size: 14px; font-style: italic; color: #1c221e;">"${data.message}"</p>
    </div>
    `
  );

  return resend.emails.send({
    from: 'Nanohana Contact <info@nanohanalodge.com.np>',
    to: toEmails,
    subject,
    html: htmlContent,
  });
}

// 2. Send Booking Request Email
export async function sendBookingRequestEmail(data: {
  id: string;
  guestName: string;
  email: string;
  phone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  roomsCount?: number;
  totalPrice: number;
  message?: string;
}) {
  const subject = `New Booking Request: ${data.id} - ${data.guestName}`;
  const htmlContent = wrapLayout(
    'Booking Request Received',
    `
    <h2 style="font-family: Georgia, serif; font-weight: normal; margin-top: 0; color: #1c221e; border-bottom: 1px solid #e0cda9; padding-bottom: 10px;">New Booking Request Received</h2>
    <p>A guest has requested a room reservation. Please review the details below in your dashboard to approve or decline the booking:</p>
    
    <table style="${tableStyles}">
      <tr>
        <th style="${thStyles}">Request ID:</th>
        <td style="${tdStyles} font-family: monospace; font-size: 14px; color: #1c221e;">${data.id}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Guest Name:</th>
        <td style="${tdStyles}">${data.guestName}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Email:</th>
        <td style="${tdStyles}">${data.email}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Phone:</th>
        <td style="${tdStyles}">${data.phone}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Room Type:</th>
        <td style="${tdStyles}">${data.roomType}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Check-in Date:</th>
        <td style="${tdStyles}">${data.checkIn}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Check-out Date:</th>
        <td style="${tdStyles}">${data.checkOut}</td>
      </tr>
      <tr>
        <th style="${thStyles}">Travelers:</th>
        <td style="${tdStyles}">${data.guestsCount} Adult(s)</td>
      </tr>
      <tr>
        <th style="${thStyles}">Rooms Requested:</th>
        <td style="${tdStyles}">${data.roomsCount || 1} Room(s)</td>
      </tr>
      <tr>
        <th style="${thStyles}">Estimated Price:</th>
        <td style="${tdStyles} color: #1c221e; font-size: 16px;">$${data.totalPrice}</td>
      </tr>
    </table>
    
    ${data.message ? `
    <div style="margin-top: 25px; padding: 20px; background-color: #f7f5f0; border-left: 3px solid #1c221e; border-radius: 4px;">
      <h4 style="margin: 0 0 8px 0; font-family: sans-serif; font-size: 11px; text-transform: uppercase; color: #7d807e; letter-spacing: 0.1em;">Special Requests</h4>
      <p style="margin: 0; font-size: 14px; font-style: italic; color: #1c221e;">"${data.message}"</p>
    </div>
    ` : ''}

    <div style="text-align: center; margin-top: 30px;">
      <a href="${(process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://nanohanalodge.com.np').replace(/\/$/, '')}/admin/booking-requests" style="${btnStyles} display: inline-block; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 24px;">Manage Requests Dashboard</a>
    </div>
    `
  );

  return resend.emails.send({
    from: 'Nanohana Bookings <info@nanohanalodge.com.np>',
    to: toEmails,
    subject,
    html: htmlContent,
  });
}

// 3. Send Booking Status Update Email (Confirm/Reject)
export async function sendBookingStatusEmail(req: {
  id: string;
  guestName: string;
  email: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  roomsCount?: number;
  totalPrice: number;
}, newStatus: 'Confirmed' | 'Rejected') {
  const isConfirmed = newStatus === 'Confirmed';
  const subject = isConfirmed 
    ? `Booking Confirmed! Request ${req.id} - Nanohana Lodge`
    : `Update regarding your Booking Request ${req.id} - Nanohana Lodge`;
  
  const bodyContent = isConfirmed
    ? `
      <h2 style="font-family: Georgia, serif; font-weight: normal; margin-top: 0; color: #2e6930; border-bottom: 1px solid #2e6930; padding-bottom: 10px;">Reservation Confirmed</h2>
      <p>Namaste <strong>${req.guestName}</strong>,</p>
      <p>We are delighted to inform you that your booking request at <strong>Nanohana Lodge</strong> has been officially confirmed! Our team is preparing your room for your upcoming stay.</p>
      
      <div style="background-color: #f4fbf4; border: 1px solid #c2e0c3; border-radius: 8px; padding: 20px; margin: 25px 0;">
        <h3 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 16px; color: #2e6930;">Your Booking Summary</h3>
        <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #2e302f;">
          <li style="margin-bottom: 6px;"><strong>Reservation ID:</strong> ${req.id}</li>
          <li style="margin-bottom: 6px;"><strong>Room Category:</strong> ${req.roomType}</li>
          <li style="margin-bottom: 6px;"><strong>Check-in:</strong> ${req.checkIn}</li>
          <li style="margin-bottom: 6px;"><strong>Check-out:</strong> ${req.checkOut}</li>
          <li style="margin-bottom: 6px;"><strong>Details:</strong> ${req.roomsCount || 1} Room(s) for ${req.guestsCount} Guest(s)</li>
          <li style="margin-bottom: 6px;"><strong>Total Price due at Checkout:</strong> $${req.totalPrice}</li>
        </ul>
      </div>

      <h3 style="font-family: Georgia, serif; font-weight: normal; color: #1c221e; margin-top: 30px;">Important Arrival Info</h3>
      <p style="font-size: 13px; color: #4e504f;">We are located at <strong>Street No. 4, Lakeside, Pokhara</strong> (opposite the owner's family house). If you require private taxi pick-up service from the Pokhara Airport or bus station, please send us your arrival details by replying to this email.</p>
      
      <p style="margin-top: 25px;">We look forward to welcoming you to Pokhara!</p>
      <p>Warm regards,<br/><strong>Nanohana Team</strong></p>
    `
    : `
      <h2 style="font-family: Georgia, serif; font-weight: normal; margin-top: 0; color: #aa3333; border-bottom: 1px solid #aa3333; padding-bottom: 10px;">Booking Request Status</h2>
      <p>Dear <strong>${req.guestName}</strong>,</p>
      <p>Thank you for requesting a reservation at <strong>Nanohana Lodge</strong>.</p>
      <p>We have carefully reviewed request <strong>${req.id}</strong>, but unfortunately, we are unable to accommodate your stay for the requested dates (<strong>${req.checkIn}</strong> to <strong>${req.checkOut}</strong>) in the <strong>${req.roomType}</strong> category.</p>
      
      <div style="background-color: #fffaf9; border: 1px solid #ffd4d0; border-radius: 8px; padding: 20px; margin: 25px 0; font-size: 13px; color: #aa3333;">
        Please note: Your card was not charged, as payment is only processed at checkout.
      </div>
      
      <p>If your travel dates are flexible or if you are interested in a different room category, please reply to this email or send us a message via our contact form, and we will do our absolute best to find an alternative setup for you.</p>
      
      <p>Thank you for your understanding.</p>
      <p>Warm regards,<br/><strong>Nanohana Team</strong></p>
    `;

  const finalHtml = wrapLayout(
    isConfirmed ? 'Booking Confirmed' : 'Booking Request Update',
    bodyContent
  );

  return resend.emails.send({
    from: 'Nanohana Lodge <info@nanohanalodge.com.np>',
    to: [req.email],
    bcc: toEmails,
    subject,
    html: finalHtml,
  });
}
