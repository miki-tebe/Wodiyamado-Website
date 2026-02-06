import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';

interface BlogsFilterBarProps {
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function BlogsFilterBar({
    categories,
    selectedCategory,
    onCategoryChange,
}: BlogsFilterBarProps) {
    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="container px-4 md:px-6 py-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {categories.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Tag className="w-4 h-4 text-gray-500" />
                                <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                    <Button
                                        variant={selectedCategory === 'all' ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => onCategoryChange('all')}
                                        className="text-xs whitespace-nowrap"
                                    >
                                        All Categories
                                    </Button>
                                    {categories.map((category) => (
                                        <Button
                                            key={category}
                                            variant={selectedCategory === category ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => onCategoryChange(category)}
                                            className="text-xs whitespace-nowrap"
                                        >
                                            {category}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
