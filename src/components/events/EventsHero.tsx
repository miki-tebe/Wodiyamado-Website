import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Users, MapPin } from 'lucide-react';

interface EventsHeroProps {
    totalEvents: number;
    upcomingEvents: number;
    pastEvents: number;
    onSearch: (query: string) => void;
}

export default function EventsHero() {
    return (
        <section className="relative w-full py-16 md:py-24 bg-gradient-to-br from-primary/10 via-primary/20 to-secondary/10 overflow-hidden">

            <div className="container px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    {/* Main heading */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
                            Our Events
                        </h1>
                        <p className="text-lg md:text-xl text-gray-800 dark:text-gray-300 max-w-3xl mx-auto">
                            Join us in making a difference through community service, leadership development, and meaningful connections.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
