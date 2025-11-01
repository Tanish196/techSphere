import Explorebtn from '@/components/Explorebtn'
import EventCard from '@/components/EventCard'
import { events } from '@/lib/constants'

const Home = () => {
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
          {events.map((event) => (
            <li key={event.title}><EventCard {...event} /></li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Home