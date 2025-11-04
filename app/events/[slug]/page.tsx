import { notFound } from 'next/navigation';
import EventDetails from "@/components/EventDetails"

const getEventDetails = async (slug: string) => {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
    const res = await fetch(`${BASE_URL}/api/events/${slug}`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch event');
    }

    const data = await res.json();
    return data.event;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
};

const EventDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const event = await getEventDetails(params.slug);
  
  if (!event) {
    notFound();
  }

  return (
    <main>
      <EventDetails event={event} slug={params.slug} />
    </main>
  );
};

export default EventDetailsPage;