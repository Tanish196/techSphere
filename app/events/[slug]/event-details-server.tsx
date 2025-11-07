import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import EventDetails from "@/components/EventDetails";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";

const getEventDetails = async (slug: string) => {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (host ? `${protocol}://${host}` : 'http://localhost:3000');

    const res = await fetch(`${baseUrl}/api/events/${slug}`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
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

export default async function EventDetailsServer({ slug }: { slug: string }) {
  const event = await getEventDetails(slug);
  
  if (!event) {
    notFound();
  }

  // Fetch similar events on the server
  const similarEvents = await getSimilarEventsBySlug(slug);

  return <EventDetails event={event} slug={slug} similarEvents={similarEvents || []} />;
}
