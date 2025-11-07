// Still in works

import { Suspense } from 'react';
import Explorebtn from '@/components/ExploreBtn';
import EventCard from '@/components/EventCard';
import { getAllEvents } from '@/lib/actions/event.actions';

export const dynamic = 'force-dynamic';

// Simple event type for client components
type EventCardData = {
  _id: string;
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

// This is a separate component that will be wrapped in Suspense
async function EventsList() {
  try {
    const events = await getAllEvents();
    
    if (events.length === 0) {
      return <p>No events found.</p>;
    }
    
    return (
      <ul className='events list-none'>
        {events.map((event: EventCardData) => (
          <li key={event._id}>
            <EventCard 
              title={event.title}
              image={event.image}
              slug={event.slug}
              location={event.location}
              date={event.date}
              time={event.time}
            />
          </li>
        ))}
      </ul>
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    return <p>Failed to load events. Please try again later.</p>;
  }
}

// Loading component for Suspense fallback
function EventsLoading() {
  return <div>Loading events...</div>;
}

const Home = () => {
  return (
    <section>
      <h1 className='text-center'>
        Dive into the world of Tech
      </h1>
      <p className='text-center mt-5'>Welcome to the world full of Developer events</p>
      <Explorebtn />

      <div>
        <h3>Featured Events</h3>
        <Suspense fallback={<EventsLoading />}>
          <EventsList />
        </Suspense>
      </div>
    </section>
  )
}

export default Home