import Explorebtn from '@/components/Explorebtn'
import EventCard from '@/components/EventCard'
import { IEvent } from '@/database/event.model';
// import { events } from '@/lib/constants'
import { cacheLife } from 'next/cache';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async () => {
  "use cache"
  cacheLife('hours')
  const res = await fetch(`${BASE_URL}/api/events`)
  const { events } = await res.json()

  return (
    <section>
      <h1 className='text-center'>
        Dive into the world of Tech
      </h1>
      <p className='text-center mt-5'>Welcome to the world full of Developer events</p>
      <Explorebtn />

      <div>
        <h3>Featured Events</h3>
        <ul className='events list-none'>
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title}><EventCard {...event} /></li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Home