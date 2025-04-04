import EventCard from './EventCard';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image?: string;
  status: string;
  ticketsAvailable?: boolean;
  ticketPrice?: number;
  ticketCurrency?: string;
  maxAttendees?: number;
}

export default function EventsList({ events }: { events: Event[] }) {
  if (events.length === 0) {
    return <p>No events to display.</p>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}