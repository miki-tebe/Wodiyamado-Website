import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';

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

interface EventCardProps {
  event: Event;
  isPast: boolean;
  isToday: boolean;
  isFeatured?: boolean;
}

export default function EventCard({ event, isPast, isToday, isFeatured }: EventCardProps) {
  const getStatusBadge = () => {
    if (isPast) {
      return <Badge variant="secondary" className="bg-gray-500 text-white">Past Event</Badge>;
    }
    if (isToday) {
      return <Badge variant="destructive" className="bg-red-500 text-white">Today!</Badge>;
    }
    if (isFeatured) {
      return <Badge variant="default" className="bg-primary text-white">Featured</Badge>;
    }
    return <Badge variant="outline" className="border-green-500 text-green-600">Upcoming</Badge>;
  };

  const getDaysUntilEvent = () => {
    if (isPast) return null;
    
    const eventDate = new Date(event.data.date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `In ${diffDays} days`;
    return null;
  };

  return (
    <a 
      href={`/events/${event.slug}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
    >
      {/* Image container */}
      <div className="relative aspect-[16/11] overflow-hidden">
        {event.data.poster ? (
          <img
            src={event.data.poster}
            alt={event.data.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Calendar className="w-16 h-16 text-primary/40" />
          </div>
        )}
        
        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {getStatusBadge()}
          {getDaysUntilEvent() && (
            <Badge variant="outline" className="bg-white/90 text-gray-700 border-gray-300">
              {getDaysUntilEvent()}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-2">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {event.data.title}
        </h3>

        {/* Description */}
        {event.data.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {event.data.description}
          </p>
        )}

        {/* Event details */}
        <div className="space-y-2">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(new Date(event.data.date))}</span>
            {event.data.time && (
              <>
                <Clock className="w-4 h-4 ml-2" />
                <span>{event.data.time}</span>
              </>
            )}
          </div>

          {/* Location */}
          {event.data.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.data.location}</span>
            </div>
          )}

          {/* Participants */}
          {event.data.maxParticipants && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>Max {event.data.maxParticipants} participants</span>
            </div>
          )}
        </div>

        {/* Action indicator */}
        <div className="pt-2">
          <div className="text-sm text-primary font-medium group-hover:text-primary/80 transition-colors">
            {isPast ? 'View Event Details' : 'Learn More'}
          </div>
        </div>
      </div>
    </a>
  );
}
