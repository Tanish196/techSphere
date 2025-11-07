/**
 * Shared Event type representing the full event object structure
 * returned by server actions and used across components
 */
export type Event = {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
};

/**
 * Subset of Event fields needed for EventCard component
 */
export type EventCardData = Pick<Event, '_id' | 'title' | 'image' | 'slug' | 'location' | 'date' | 'time'>;
