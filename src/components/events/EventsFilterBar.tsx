import { Button } from '@/components/ui/button';
import { Calendar, Tag } from 'lucide-react';

interface EventsFilterBarProps {
  categories: string[];
  selectedCategory: string;
  selectedStatus: string;
  onCategoryChange: (category: string) => void;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
}

export default function EventsFilterBar({
  categories,
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
  onClearFilters
}: EventsFilterBarProps) {
  const statusOptions = [
    { value: 'all', label: 'All Events', count: 0 },
    { value: 'upcoming', label: 'Upcoming', count: 0 },
    { value: 'today', label: 'Today', count: 0 },
    { value: 'past', label: 'Past Events', count: 0 }
  ];

  const hasActiveFilters = selectedCategory !== 'all' || selectedStatus !== 'all';

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="container px-4 md:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Left side - Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div className="flex gap-1">
                {statusOptions.map((status) => (
                  <Button
                    key={status.value}
                    variant={selectedStatus === status.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onStatusChange(status.value)}
                    className="text-xs"
                  >
                    {status.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <div className="flex gap-1">
                  <Button
                    variant={selectedCategory === 'all' ? "default" : "outline"}
                    size="sm"
                    onClick={() => onCategoryChange('all')}
                    className="text-xs"
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => onCategoryChange(category)}
                      className="text-xs"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right side - Clear filters */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Clear filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-xs"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Active filters display */}
        {/* {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-600 mt-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Category: {selectedCategory}
              </Badge>
            )}
            {selectedStatus !== 'all' && (
              <Badge variant="secondary" className="text-xs">
                Status: {statusOptions.find(s => s.value === selectedStatus)?.label}
              </Badge>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
}
