import mongoose, { Document, Schema, Model } from 'mongoose';

// TypeScript interface for Event
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema for Event
const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    organizer: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true, validate: (v: unknown) => Array.isArray(v) && v.length > 0 },
    tags: { type: [String], required: true, validate: (v: unknown) => Array.isArray(v) && v.length > 0 },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Pre-validate hook to ensure slug is always set before validation
EventSchema.pre<IEvent>('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

// Pre-save hook for date normalization and validation
EventSchema.pre<IEvent>('save', function(this: IEvent & { isNew?: boolean; isModified(field: string): boolean }, next: (err?: Error) => void) {

  // Date normalization: ensure ISO format
  if (this.isModified('date')) {
    const dateObj = new Date(this.date);
    if (isNaN(dateObj.getTime())) {
      return next(new Error('Invalid date format.'));
    }
    this.date = dateObj.toISOString().split('T')[0];
  }

  // Time normalization: HH:MM 24hr format
  if (this.isModified('time')) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(this.time)) {
      return next(new Error('Time must be in HH:MM 24-hour format.'));
    }
  }

  // Validate required fields are non-empty
  const requiredFields: Array<keyof IEvent> = [
    'title', 'description', 'overview', 'image', 'venue', 'location', 'date', 'time', 'mode', 'audience', 'agenda', 'organizer', 'tags'
  ];
  for (const field of requiredFields) {
    if (!this[field] || (Array.isArray(this[field]) && (this[field] as string[]).length === 0)) {
      return next(new Error(`${field} is required and cannot be empty.`));
    }
  }

  next();
});

// Export Event model
export const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);