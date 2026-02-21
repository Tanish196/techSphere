'use client';

import { useState, useEffect } from 'react';
import EventCard from '@/components/EventCard';
import { EventCardData } from '@/types/Event';

export default function EventsClient({ initialEvents }: { initialEvents: EventCardData[] }) {
  const [events, setEvents] = useState<EventCardData[]>(initialEvents);
  const [displayCount, setDisplayCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const displayedEvents = events.slice(0, displayCount);
  const hasMore = displayCount < events.length;

  const loadMore = () => {
    setIsLoading(true);
    // Simulate loading for better UX
    setTimeout(() => {
      setDisplayCount((prev) => prev + 6);
      setIsLoading(false);
    }, 300);
  };

  return (
    <>
      <ul className='events list-none'>
        {displayedEvents.map((event: EventCardData) => (
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

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button 
            onClick={loadMore}
            disabled={isLoading}
            className="bg-dark-100 border border-dark-200 text-white font-semibold px-8 py-3.5 rounded-full hover:border-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                Loading...
              </>
            ) : (
              'Load More Events'
            )}
          </button>
        </div>
      )}

      {!hasMore && events.length > 6 && (
        <p className="text-center text-light-200 mt-12">You've viewed all events</p>
      )}
    </>
  );
}
