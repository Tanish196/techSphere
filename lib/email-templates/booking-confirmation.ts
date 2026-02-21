import { Event as EventType } from '@/types/Event';

interface BookingConfirmationEmailProps {
  eventDetails: EventType;
  userEmail: string;
}

export const BookingConfirmationEmail = ({ eventDetails, userEmail }: BookingConfirmationEmailProps) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Booking Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
  <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #59deca; padding-bottom: 20px;">
      <h1 style="color: #030708; margin: 0; font-size: 28px;">🎉 Booking Confirmed!</h1>
      <p style="color: #666; margin-top: 10px; font-size: 16px;">You're all set for the event</p>
    </div>

    <!-- Greeting -->
    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
      Hi there! 
    </p>
    
    <p style="font-size: 16px; color: #333; margin-bottom: 25px;">
      Thank you for registering for <strong>${eventDetails.title}</strong>. We're excited to have you join us!
    </p>

    <!-- Event Details Card -->
    <div style="background-color: #f8f9fa; border-left: 4px solid #59deca; padding: 20px; border-radius: 4px; margin-bottom: 25px;">
      <h2 style="color: #030708; margin-top: 0; font-size: 22px; margin-bottom: 15px;">Event Details</h2>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #555;"> Date:</strong> 
        <span style="color: #333;">${new Date(eventDetails.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #555;"> Time:</strong> 
        <span style="color: #333;">${eventDetails.time}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #555;"> Venue:</strong> 
        <span style="color: #333;">${eventDetails.venue}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #555;"> Location:</strong> 
        <span style="color: #333;">${eventDetails.location}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #555;"> Mode:</strong> 
        <span style="color: #333; text-transform: capitalize;">${eventDetails.mode}</span>
      </div>
      
      <div style="margin-bottom: 12px;">
        <strong style="color: #555;">👥 Organizer:</strong> 
        <span style="color: #333;">${eventDetails.organizer}</span>
      </div>
    </div>

    <!-- Event Overview -->
    <div style="margin-bottom: 25px;">
      <h3 style="color: #030708; font-size: 18px; margin-bottom: 10px;">About the Event</h3>
      <p style="color: #555; font-size: 15px; line-height: 1.6;">${eventDetails.overview}</p>
    </div>

    <!-- Agenda -->
    ${eventDetails.agenda && eventDetails.agenda.length > 0 ? `
    <div style="margin-bottom: 25px;">
      <h3 style="color: #030708; font-size: 18px; margin-bottom: 10px;">Event Agenda</h3>
      <ul style="color: #555; font-size: 15px; padding-left: 20px;">
        ${eventDetails.agenda.map(item => `<li style="margin-bottom: 8px;">${item}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- Important Information -->
    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 4px; margin-bottom: 25px;">
      <h3 style="color: #856404; margin-top: 0; font-size: 16px; margin-bottom: 10px;">⚠️ Important Information</h3>
      <ul style="color: #856404; font-size: 14px; margin: 0; padding-left: 20px;">
        <li>Please arrive 15 minutes early for registration</li>
        <li>Bring a valid ID for check-in</li>
        <li>Save this email for your records</li>
        ${eventDetails.mode === 'online' ? '<li>Meeting link will be shared 1 hour before the event</li>' : ''}
        ${eventDetails.mode === 'offline' ? '<li>Please check parking information at the venue</li>' : ''}
      </ul>
    </div>

    <!-- Contact Info -->
    <div style="margin-bottom: 25px;">
      <h3 style="color: #030708; font-size: 18px; margin-bottom: 10px;">Need Help?</h3>
      <p style="color: #555; font-size: 15px; margin-bottom: 10px;">
        If you have any questions or need to make changes to your registration, please contact the event organizer at:
      </p>
      <p style="color: #59deca; font-size: 15px; margin: 0;">
        <strong>${eventDetails.organizer}</strong>
      </p>
    </div>

    <!-- Footer CTA -->
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/events/${eventDetails.slug}" 
         style="display: inline-block; background-color: #59deca; color: #030708; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 16px;">
        View Event Details
      </a>
    </div>

    <!-- Footer -->
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 13px;">
      <p style="margin: 5px 0;">
        This email was sent to <strong>${userEmail}</strong>
      </p>
      <p style="margin: 5px 0;">
        © ${new Date().getFullYear()} TechSphere. All rights reserved.
      </p>
      <p style="margin: 15px 0 0 0;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #59deca; text-decoration: none;">Visit TechSphere</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
};
