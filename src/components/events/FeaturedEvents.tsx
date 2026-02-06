import { Button } from "@/components/ui/button";
import EventCard from "./EventCard";

interface Event {
  slug?: string;
  data: {
    title: string;
    date: string;
    time?: string;
    location?: string;
    category?: string;
    description?: string;
    poster?: string;
    maxParticipants?: number;
  };
}

interface FeaturedEventsProps {
  events: Event[];
}

export default function FeaturedEvents({ events }: FeaturedEventsProps) {
  // Calculate event status for each event
  const today = new Date();
  
  return (
    <section className="w-full py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming & Recent Events
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Stay updated with our latest activities and upcoming events
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((eventItem) => {
            const eventDate = new Date(eventItem.data.date);
            eventDate.setHours(23, 59, 59, 999);
            const isPast = eventDate.getTime() < today.getTime();
            const isToday = eventDate.toDateString() === today.toDateString();
            
            return (
              <EventCard
                key={eventItem.slug}
                event={eventItem}
                isPast={isPast}
                isToday={isToday}
                isFeatured={true}
              />
            );
          })}
        </div>
        
        <div className="text-center mt-8">
          <a href="/events">
            <Button size="lg" className="bg-primary hover:bg-primary/90 hover:scale-105 transition-transform duration-200">
              View All Events
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
