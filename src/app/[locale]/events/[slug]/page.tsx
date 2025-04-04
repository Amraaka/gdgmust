import { getEvents } from '@/lib/data';
import { notFound } from 'next/navigation';
import { default as ImageComponent } from '@/components/eventspage/ImageWrapper';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

import { getTranslations } from 'next-intl/server';

import { FaRegCalendar, FaClock, FaTwitter, FaFacebook, FaLink } from 'react-icons/fa';
import { FaCalendarDays } from "react-icons/fa6";
import { BsCircleFill } from 'react-icons/bs';
import { IoTicketOutline, IoPricetagOutline, IoPeople } from 'react-icons/io5';
import { IoIosInformationCircle } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { HiLocationMarker, HiOutlineLocationMarker } from "react-icons/hi";
import { BsPeopleFill } from "react-icons/bs";
import { FaQuestion } from "react-icons/fa";
import { IoDocuments } from "react-icons/io5";
import { FaHandshake } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";



// Helper function to create slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
};

// Helper function to safely resolve params whether they're Promises or not
const resolveParams = async (params: any) => {
  if (params && typeof params.then === 'function') {
    return await params;
  }
  return params;
};

export async function generateMetadata(props: any) {
  const params = await resolveParams(props.params);
  const events = await getEvents();
  const slug = params.slug;
  const event = events.find(e => createSlug(e.title) === slug);
  
  if (!event) return { title: 'Event Not Found' };
  
  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.image ? [event.image] : [],
    },
  };
}

export default async function EventPage(props: any) {
  const params = await resolveParams(props.params);
  const events = await getEvents();
  const slug = params.slug;
  const event = events.find(e => createSlug(e.title) === slug);
  const t = await getTranslations('EventsPage');

  if (!event) {
    notFound();
  }

  // Define sponsors variable
  const sponsors = event.sponsors || [];
  const hasSponsors = Array.isArray(sponsors) && sponsors.length > 0;
  
  // Parse people array into speakers and panelists
  const people = event.people || [];
  
  // More robust filtering that handles typos like "panenlist"
  const speakers = people.filter(person => 
    person.type && person.type.toLowerCase() === 'speaker');
  
  const panelists = people.filter(person => 
    person.type && 
    (person.type.toLowerCase().includes('panel') || 
     person.type.toLowerCase() === 'panenlist')
  );
  
  const hasPeople = Array.isArray(people) && people.length > 0;
  const hasSpeakers = speakers.length > 0;
  const hasPanelists = panelists.length > 0;
  
  // Check if event has detailed location info
  const hasExactLocation = !!event.exactLocation;
  
  // Generate Google Maps URL based on location
  const generateMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  // Additional information sections - can be expanded as more fields are added to events.json
  const hasAdditionalInfo = event.additionalInfo || event.agenda || event.requirements;

  return (
    <div className=" bg-zinc-100 mx-auto px-4 py-12">
      <div className="mt-2 max-w-6xl mx-auto space-y-8">
        {/* Hero section */}
        <div className="relative h-[500px] w-full mb-12 rounded-2xl overflow-hidden shadow-xl select-none" draggable="false">
          {event.image ? (
            <ImageComponent
              src={event.image}
              alt={event.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <p className="text-white text-xl font-medium">No image available</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-10">
            <div className="max-w-3xl">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 [text-shadow:_0_2px_4px_rgba(0,0,0,0.3)]">{event.title}</h1>
              <div className="flex flex-wrap gap-3 md:gap-4 lg:gap-5 text-white">
                {event.date && (
                  <div className="flex items-center bg-black/30 backdrop-blur-sm py-2 px-4 rounded-full">
                    <FaCalendarDays  className="h-[18px] w-[18px] mr-2 text-blue-400"/>
                    <span>{new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center bg-black/30 backdrop-blur-sm py-2 px-4 rounded-full">
                    <HiLocationMarker className="h-5 w-5 mr-2 text-blue-400"/>
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event details */}
        {/* Event details - two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content - description and other details */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl">
              {/* Description section */}
              <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <IoIosInformationCircle className="h-[28px] w-[28px] mr-3 text-blue-600" />
                About the event
              </h2>
              {event.description ? (
                  <p className="text-gray-700 whitespace-pre-line text-lg leading-relaxed">{event.description}</p>
                ) : (
                  <p className="text-gray-500 italic">No description available</p>
                )}
              </div>
            </div>

          {/* Sidebar - Registration and event summary */}
          <div className="md:col-span-1">
            <div className="sticky top-8 space-y-6">
                  {/* Registration card */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                    <h3 className="text-xl font-bold mb-4 text-blue-900">Event Summary</h3>

                <div className="space-y-4 mb-6">
                  {/* Status badge */}
                  <div className="flex justify-between items-center select-none" draggable="false">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === 'upcoming' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="flex items-center">
                        <BsCircleFill className="h-2 w-2 mr-1" />
                        {event.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
                      </div>
                    </span>
                  </div>
                  
                  {/* Date with icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium flex items-center">
                      <FaRegCalendar className="h-4 w-4 mr-2 text-blue-500" />
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Time with icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  
                  {/* Tickets */}
                  {typeof event.ticketsAvailable !== 'undefined' && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tickets:</span>
                      {event.ticketsAvailable ? (
                        <span className="text-green-600 font-medium">Available</span>
                      ) : (
                        <span className="text-red-600 font-medium">Not available</span>
                      )}
                    </div>
                  )}
                  
                  {/* Price */}
                  {event.ticketPrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="text-blue-600 font-bold">
                        {event.ticketPrice.toLocaleString()} {event.ticketCurrency}
                      </span>
                    </div>
                  )}
                  
                  {/* Capacity */}
                  {event.maxAttendees && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-medium">{event.maxAttendees} attendees</span>
                    </div>
                  )}
                </div>
                
                {/* Registration button for upcoming events with available tickets */}
                {event.status === 'upcoming' && event.ticketsAvailable && (
                  <span className='flex justify-center select-none' draggable="false">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-medium h-[48px] py-3 px-6 rounded-full transition-all hover:shadow-lg transform hover:-translate-y-0.5">
                      <a href={event.ticketLink} target="_blank" rel="noopener noreferrer">
                        {t('in-event-info.Register')}
                      </a>
                    </button>
                  </span>
                )}
                
                {/* Share event buttons */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-sm text-gray-600 mb-3 select-none">Share this event</p>
                  <div className="flex space-x-3">
                    {/* Social share buttons */}
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 select-none" draggable="false">
                      <a href="https://www.facebook.com/sharer/sharer.php?u" target="_blank" rel="noreferrer">
                        <FaFacebook  className="w-5 h-5"/>
                      </a>
                    </button>
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 select-none" draggable="false">
                      <a href="https://x.com/intent/post" target="_blank" rel="noreferrer">
                        <FaXTwitter className="w-5 h-5"/>
                      </a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


            {/* Location information with See Location button */}
            {event.location && (
              <div className="bg-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <HiOutlineLocationMarker className="h-6 w-6 mr-3 text-blue-600" />
                  Location
                </h2>
                <p className="text-xl font-medium text-gray-800 mb-2">{event.location}</p>
                {hasExactLocation && (
                  <div className="mb-4">
                    <p className="text-gray-600">{event.exactLocation}</p>
                  </div>
                )}
                <div className="bg-gray-100 rounded-xl p-4 mb-6 h-48 flex items-center justify-center">
                  <p className="text-gray-500">Map preview placeholder</p>
                </div>
                <nav className="flex justify-center md:justify-start lg:justify-start">
                  <a 
                    href={generateMapsUrl(hasExactLocation ? event.exactLocation : event.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-medium h-[48px] py-3 px-6 rounded-full transition-all hover:shadow-lg transform hover:-translate-y-0.5 select-none" draggable="false"
                  >
                    <HiLocationMarker className="h-5 w-5 mr-2" />
                    Open in Google Maps
                  </a>
                </nav>
              </div>
            )}
            
            {/* Additional info sections */}
            {hasAdditionalInfo && (
              <div className="bg-white rounded-2xl shadow-lg p-8 transition-all hover:shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <IoDocuments className="h-6 w-6 mr-3 text-blue-600"/>
                  Event Details
                </h2>
                <div className="space-y-6">
                  {event.agenda && (
                    <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Agenda</h3>
                      <div className="whitespace-pre-line text-gray-700">{event.agenda}</div>
                    </div>
                  )}
                  
                  {event.requirements && (
                    <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-500">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Requirements</h3>
                      <div className="whitespace-pre-line text-gray-700">{event.requirements}</div>
                    </div>
                  )}
                  
                  {event.additionalInfo && (
                    <div className="bg-green-50 rounded-xl p-6 border-l-4 border-green-500">
                      <h3 className="text-xl font-bold text-gray-800 mb-3">Additional Information</h3>
                      <div className="whitespace-pre-line text-gray-700">{event.additionalInfo}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sponsers */}
            {/* Sponsors card */}
            {hasSponsors && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <FaHandshake className="h-6 w-6 ml-[2px] mr-[10px] text-blue-600"/>
                    Sponsers
                </p>
                <div className="gap-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 select-none" draggable="false">
                  {sponsors.map((sponsor, index) => (
                    <a 
                      key={index}
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
                      draggable="false"
                    >
                      <div className="relative h-16 w-full">
                        <ImageComponent
                          src={sponsor.logo}
                          alt={sponsor.name}
                          fill
                          style={{objectFit: 'contain'}}
                          sizes="200px"
                          draggable="false"
                        />
                      </div>
                      <p className="text-center text-sm text-gray-600 mt-2">{sponsor.name}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {/* People sections with improved cards */}
            {hasSpeakers && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <BsPeopleFill className="h-6 w-6 mr-3 text-blue-600"/>
                  Speakers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6"> 
                  {speakers.map((person, index) => (
                    <div key={`speaker-${index}`} className="flex p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all transform hover:-translate-y-1">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-md select-none" draggable="false">
                        {person.image ? (
                          <ImageComponent
                            src={person.image}
                            alt={person.name}
                            fill
                            style={{objectFit: 'cover'}}
                            draggable="false"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <FaQuestion className="h-10 w-10 text-blue-400"/>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-lg text-gray-800">{person.name}</h3>
                        {person.role && <p className="text-blue-600 font-medium">{person.role}</p>}
                        {person.bio && <p className="text-sm text-gray-600 mt-1 line-clamp-3">{person.bio}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Panelists Section */}
          {hasPanelists && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <BsPeopleFill className="h-6 w-6 mr-3 text-blue-600"/>
                    Panelists
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6"> 
                  {panelists.map((person, index) => (
                    <div key={`panelist-${index}`} className="flex p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all transform hover:-translate-y-1">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-md select-none" draggable="false">
                        {person.image ? (
                          <ImageComponent
                            src={person.image}
                            alt={person.name}
                            fill
                            style={{objectFit: 'cover'}}
                            draggable="false"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                            <FaQuestion className="h-10 w-10 text-blue-400"/>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-bold text-lg text-gray-800">{person.name}</h3>
                        {person.role && <p className="text-blue-600 font-medium">{person.role}</p>}
                        {person.bio && <p className="text-sm text-gray-600 mt-1 line-clamp-3">{person.bio}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        <div className='mt-12'>
          <Link href="/events" className="flex justify-center">
            <button className="bg-blue-600 flex flex-row items-center hover:bg-blue-500 text-white font-medium h-[48px] py-3 px-6 rounded-full transition-all hover:shadow-lg transform hover:-translate-y-0.5">
              {/* Back button with icon */}
              <IoMdArrowRoundBack className="h-5 w-5 mr-2" />
              {t('in-event-info.BackButton')}
            </button>
          </Link>
        </div>
      </div>
  );
}