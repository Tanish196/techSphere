import { Suspense } from 'react';
import { getAllEvents } from '@/lib/actions/event.actions';
import EventsClient from './EventsClient';

export const dynamic = 'force-dynamic';

async function EventsList() {
  try {
    const events = await getAllEvents();
    
    if (events.length === 0) {
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">No Events Available</h2>
          <p className="text-light-200">Check back soon for upcoming events!</p>
        </div>
      );
    }
    
    return <EventsClient initialEvents={events} />;
  } catch (error) {
    console.error('Error fetching events:', error);
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4 text-red-500">Failed to Load Events</h2>
        <p className="text-light-200">Please try again later.</p>
      </div>
    );
  }
}

function EventsLoading() {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <section className="py-10">
      <div className="mb-12">
        <h1 className="text-gradient text-6xl font-bold max-sm:text-4xl mb-4">
          All Events
        </h1>
        <p className="text-light-100 text-lg max-sm:text-base">
          Discover and join exciting tech events from around the world
        </p>
      </div>

      <Suspense fallback={<EventsLoading />}>
        <EventsList />
      </Suspense>
    </section>
  );
}
