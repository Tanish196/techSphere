import { Suspense } from 'react';
import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import { getAllEvents } from '@/lib/actions/event.actions';
import { EventCardData } from '@/types/Event';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// This is a separate component that will be wrapped in Suspense
async function FeaturedEventsList() {
  try {
    const events = await getAllEvents();
    
    // Show only first 6 events as featured
    const featuredEvents = events.slice(0, 6);
    
    if (featuredEvents.length === 0) {
      return <p className="text-light-200 text-center">No events available at the moment.</p>;
    }
    
    return (
      <>
        <ul className='events list-none'>
          {featuredEvents.map((event: EventCardData) => (
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
        
        {events.length > 6 && (
          <div className="flex justify-center mt-12">
            <Link 
              href="/events"
              className="bg-dark-100 border border-dark-200 text-white font-semibold px-8 py-3.5 rounded-full hover:border-primary/50 transition-all duration-300"
            >
              View All Events
            </Link>
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error('Error fetching events:', error);
    return <p className="text-light-200 text-center">Failed to load events. Please try again later.</p>;
  }
}

// Loading component for Suspense fallback
function EventsLoading() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

const Home = () => {
  return (
    <>
      <Hero />
      
      <section className="mt-20">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold">Featured Events</h3>
        </div>
        
        <Suspense fallback={<EventsLoading />}>
          <FeaturedEventsList />
        </Suspense>
      </section>
    </>
  )
}

export default Home