import type { CollectionEntry } from 'astro:content';
import { useState, useMemo } from 'react';
import EventsFilterBar from './EventsFilterBar';
import EventCard from './EventCard';
import PageHero from '../PageHero';

type Event = CollectionEntry<'events'>;

interface EventsPageProps {
  events: Event[];
}

export default function EventsPage({ events }: EventsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Calculate event statistics
  const today = new Date();

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(events.map(event => event.data.category).filter(Boolean))] as string[];
  }, [events]);

  // Filter events based on filters
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || event.data.category === selectedCategory;

      // Status filter
      let matchesStatus = true;
      if (selectedStatus !== 'all') {
        const eventDate = event.data.date;
        eventDate.setHours(23, 59, 59, 999);
        const isPast = eventDate.getTime() < today.getTime();
        const isToday = eventDate.toDateString() === today.toDateString();

        if (selectedStatus === 'upcoming') {
          matchesStatus = !isPast;
        } else if (selectedStatus === 'today') {
          matchesStatus = isToday;
        } else if (selectedStatus === 'past') {
          matchesStatus = isPast;
        }
      }

      return matchesCategory && matchesStatus;
    });
  }, [events, selectedCategory, selectedStatus]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  return (
    <div className="min-h-screen">
      <PageHero
        title="Our Events"
        description="Join us in making a difference through community service, leadership development, and meaningful connections."
      />

      <EventsFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        selectedStatus={selectedStatus}
        onCategoryChange={handleCategoryChange}
        onStatusChange={handleStatusChange}
        onClearFilters={handleClearFilters}
      />

      <section className="w-full py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          {/* Results count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredEvents.length} of {events.length} events
            </p>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {filteredEvents.map((event) => {
                const eventDate = new Date(event.data.date);
                eventDate.setHours(23, 59, 59, 999);
                const isPast = eventDate.getTime() < today.getTime();
                const isToday = eventDate.toDateString() === today.toDateString();

                return (
                  <EventCard
                    key={event.slug}
                    event={event}
                    isPast={isPast}
                    isToday={isToday}
                    isFeatured={false}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No events available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for upcoming events and activities.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
