import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import { Event } from './event.model';

// TypeScript interface for Booking
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email validation regex
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i;

// Mongoose schema for Booking
const BookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => emailRegex.test(v),
        message: 'Invalid email address.'
      }
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Pre-save hook: validate event reference and email
BookingSchema.pre<IBooking>('save', async function (next) {
  // Validate eventId references an existing Event
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    return next(new Error('Referenced event does not exist.'));
  }

  // Email format is validated by schema, no need to duplicate here
  next();
});

// Export Booking model
export const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
