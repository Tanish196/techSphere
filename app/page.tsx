// Still in works

import { Suspense } from 'react';
import Explorebtn from '@/components/ExploreBtn';
import EventCard from '@/components/EventCard';
import { IEvent } from '@/database/event.model';

// Use a default value if the environment variable is not set
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

// This function is automatically cached by Next.js and can be used in multiple places
// without re-fetching the data
async function getEvents(): Promise<IEvent[]> {
  const apiUrl = `${BASE_URL}/api/events`;
  
  const res = await fetch(apiUrl, {
    next: { 
      revalidate: 60, // Revalidate every 60 seconds
      tags: ['events'] // Can be used to revalidate on demand
    }
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  return data.events || [];
}

// This is a separate component that will be wrapped in Suspense
async function EventsList() {
  const events = await getEvents();
  
  if (events.length === 0) {
    return <p>No events found.</p>;
  }
  
  return (
    <ul className='events list-none'>
      {events.map((event: IEvent) => (
        <li key={event.slug}><EventCard {...event} /></li>
      ))}
    </ul>
  );
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

      <div id="events">
        <h3>Featured Events</h3>
        <Suspense fallback={<EventsLoading />}>
          <EventsList />
        </Suspense>
      </div>
    </section>
  )
}

export default Home