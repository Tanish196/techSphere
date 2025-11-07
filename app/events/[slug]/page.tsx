import { notFound } from 'next/navigation';
import EventDetailsServer from './event-details-server';

export const dynamic = 'force-dynamic';

export default async function EventDetailsPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  return (
    <main>
      <EventDetailsServer slug={slug} />
    </main>
  );
}