import { notFound } from 'next/navigation';
import EventDetails from "@/components/EventDetails";
import { getEventBySlug, getSimilarEventsBySlug } from "@/lib/actions/event.actions";

export default async function EventDetailsServer({ slug }: { slug: string }) {
  const event = await getEventBySlug(slug);
  
  if (!event) {
    notFound();
  }

  // Fetch similar events on the server
  const similarEvents = await getSimilarEventsBySlug(slug);

  return <EventDetails event={event} slug={slug} similarEvents={similarEvents} />;
}
