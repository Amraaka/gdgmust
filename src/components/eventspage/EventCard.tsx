'use client';

import ImageWrapper, { default as ImageComponent } from './ImageWrapper';
import { useRouter } from 'next/navigation';

import OptimizedImage from '../utils/optimization/OptimizedImage';

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

export default function EventCard({ event }: { event: Event }) {
  const router = useRouter();

  // Create a URL-friendly slug from the event title
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim();
  };

  const handleClick = () => {
    router.push(`/events/${createSlug(event.title)}`);
  };

  return (
    <div 
      className="backdrop-blur-md bg-white/70 border border-white/20 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer select-none"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
      }}
      onClick={handleClick}
      draggable={false}
    >
      {event.image && (
        <div className="relative h-48 w-full">
          <ImageWrapper 
            src={event.image} 
            alt={event.title}
            draggable={false}
            priority={true}
            fill={true}
            style={{objectFit: 'cover'}}
            sizes="100%"
          />
        </div>
      )}
      <div className="p-5 select-none" draggable={false}>
        <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
        <p className="text-gray-600 mt-1">
          {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
        <p className="text-gray-600 mb-3">{event.location}</p>
        <p className="mb-4 text-gray-700 line-clamp-2">{event.description}</p>
        <div className="flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            event.status === 'upcoming' 
              ? 'bg-green-100/70 text-green-800 backdrop-blur-sm' 
              : 'bg-gray-100/70 text-gray-800 backdrop-blur-sm'
          }`}>
            {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
          </span>
          {event.ticketsAvailable && (
            <span className="text-blue-600 font-medium">
              {event.ticketPrice?.toLocaleString()} {event.ticketCurrency}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}