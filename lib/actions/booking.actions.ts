'use server';

import Booking from '@/database/booking.model';
import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import { sendEmail } from '@/lib/email';
import { BookingConfirmationEmail } from '@/lib/email-templates/booking-confirmation';

export const createBooking = async ({ eventId, email }: { eventId: string; email: string; }) => {
    try {
        await connectDB();

        // Check if user has already booked this event
        const existingBooking = await Booking.findOne({ eventId, email });

        if (existingBooking) {
            return {
                success: false,
                error: 'already_booked',
                message: 'You have already booked this event!'
            };
        }

        // Create the booking
        await Booking.create({ eventId, email });

        // Fetch event details for the email
        const event = await Event.findById(eventId).lean() as any;

        if (!event) {
            console.error('Event not found for email:', eventId);
            // Still return success since booking was created
            return { success: true, emailSent: false };
        }

        // Convert MongoDB document to plain object and handle _id
        const eventDetails = {
            ...event,
            _id: event._id.toString(),
            date: event.date instanceof Date ? event.date.toISOString() : String(event.date),
        };

        // Send confirmation email
        const emailHtml = BookingConfirmationEmail({
            eventDetails: eventDetails as any,
            userEmail: email
        });

        const emailResult = await sendEmail({
            to: email,
            subject: `Booking Confirmed: ${event.title}`,
            html: emailHtml,
        });

        // Log email result but don't fail the booking
        if (!emailResult.success) {
            console.error('Failed to send confirmation email:', emailResult.error);
        }

        return {
            success: true,
            emailSent: emailResult.success
        };
    } catch (e: any) {
        console.error('create booking failed', e);

        // Handle duplicate key error from MongoDB
        if (e.code === 11000 || e.name === 'MongoServerError') {
            return {
                success: false,
                error: 'already_booked',
                message: 'You have already booked this event!'
            };
        }

        return {
            success: false,
            error: 'booking_failed',
            message: 'Failed to create booking. Please try again.'
        };
    }
}
