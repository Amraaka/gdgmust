import { getEvents } from '@/lib/data';
import EventList from '@/components/eventspage/EventList';
import PaginationControls from '@/components/eventspage/PaginationControls';
import EventSearch from '@/components/eventspage/EventSearch';
import { getTranslations } from 'next-intl/server';

const ITEMS_PER_PAGE = 9;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ upcomingPage?: string; pastPage?: string; search?: string }>;
}) {
  // Rest of your code stays the same
  const searchParamsObj = await searchParams;
  const events = await getEvents();
  const searchQuery = searchParamsObj.search?.toLowerCase() || '';

  const t = await getTranslations('EventsPage');
  
  // Filter events by search query if provided
  const filteredEvents = searchQuery
    ? events.filter(event => 
        event.title.toLowerCase().includes(searchQuery) || 
        event.description.toLowerCase().includes(searchQuery) ||
        event.location.toLowerCase().includes(searchQuery)
      )
    : events;
  
  // Get current page from URL params or default to 1
  const upcomingPage = Number(searchParamsObj.upcomingPage) || 1;
  const pastPage = Number(searchParamsObj.pastPage) || 1;
  
  // Filter and sort upcoming events (earliest first)
  const allUpcomingEvents = filteredEvents
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Filter and sort past events (most recent first)
  const allPastEvents = filteredEvents
    .filter(event => new Date(event.date) <= new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Calculate total pages first
  const totalUpcomingPages = Math.max(1, Math.ceil(allUpcomingEvents.length / ITEMS_PER_PAGE));
  const totalPastPages = Math.max(1, Math.ceil(allPastEvents.length / ITEMS_PER_PAGE));
  
  // Paginate events
  const upcomingEvents = allUpcomingEvents.slice(
    (upcomingPage - 1) * ITEMS_PER_PAGE, 
    upcomingPage * ITEMS_PER_PAGE
  );
  
  const pastEvents = allPastEvents.slice(
    (pastPage - 1) * ITEMS_PER_PAGE, 
    pastPage * ITEMS_PER_PAGE
  );
  
  return (
    <div className=''>
      <div className='relative bg-gradient-to-b from-white to-white'>
        <div className="container mx-auto mt-20 px-4 py-8">
          {/* Search component */}
          <nav className='flex justify-center items-center'>
            <EventSearch />
          </nav>

          {/* Display search results summary if search is active */}
          {searchQuery && (
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredEvents.length === 0
                  ? t('SearchBar.notfound')
                  : `Found ${filteredEvents.length} event${filteredEvents.length === 1 ? '' : 's'} matching "${searchParamsObj.search}"`}
              </p>
            </div>
          )}
          
          {/* Upcoming events section */}
          <h2 className="text-2xl font-bold mt-5 mb-4">
            {t('headerofevents.upcoming')}
          </h2>
          <a>
          {allUpcomingEvents.length > 0 ? (
            <>
              <EventList events={upcomingEvents} />
              {totalUpcomingPages > 1 && (
                <PaginationControls 
                  currentPage={upcomingPage}
                  totalPages={totalUpcomingPages}
                  paramName="upcomingPage"
                  preserveParams={["pastPage", "search"]}
                />
              )}
            </>
          ) : (
            <p className="text-gray-600 py-4">{t('SearchBar.upcoming-notfound')}</p>
          )}
          </a>
          
          {/* Past events section */}
          <h2 className="text-2xl font-bold mb-4 mt-16">
            {t('headerofevents.past')}
          </h2>
          <a>
          {allPastEvents.length > 0 ? (
            <>
              <EventList events={pastEvents} />
              {totalPastPages > 1 && (
                <PaginationControls 
                  currentPage={pastPage}
                  totalPages={totalPastPages}
                  paramName="pastPage"
                  preserveParams={["upcomingPage", "search"]}
                />
              )}
            </>
          ) : (
            <p className="text-gray-600 py-4 mb-[500px]">{t('SearchBar.past-notfound')}</p>
          )}
          </a>
        </div>
      </div>
    </div>
  );
}