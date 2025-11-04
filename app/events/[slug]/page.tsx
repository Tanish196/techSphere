'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import EventDetails from "@/components/EventDetails";

export default function EventDetailsPage() {
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
        const res = await fetch(`${BASE_URL}/api/events/${params.slug}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          } else {
            throw new Error('Failed to fetch event');
          }
        }

        const data = await res.json();
        setEvent(data.event);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    if (params?.slug) {
      fetchEvent();
    }
  }, [params?.slug]);

  if (loading) {
    return <div>Loading event...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!event) {
    return notFound();
  }

  return (
    <main>
      <EventDetails event={event} slug={params.slug as string} />
    </main>
  );
}