import { useState, useMemo } from 'react';
import BlogsFilterBar from './BlogsFilterBar';
import BlogCard from '@/components/BlogCard';

interface Blog {
    id: string;
    slug: string;
    data: {
        title: string;
        date: string | Date;
        category: string;
        cover: any;
        author: string;
        description?: string;
    };
}

interface BlogsPageProps {
    blogs: Blog[];
}

export default function BlogsPage({ blogs }: BlogsPageProps) {
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Get unique categories
    const categories = useMemo(() => {
        return [...new Set(blogs.map(blog => blog.data.category).filter(Boolean))].sort();
    }, [blogs]);

    // Filter blogs based on selection
    const filteredBlogs = useMemo(() => {
        if (selectedCategory === 'all') return blogs;
        return blogs.filter(blog => blog.data.category === selectedCategory);
    }, [blogs, selectedCategory]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <BlogsFilterBar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
            />

            <section className="w-full py-8 md:py-12">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9 md:gap-y-11 lg:gap-y-16 lg:gap-x-8">
                        {filteredBlogs.map((blog) => (
                            <BlogCard key={blog.id} id={blog.id} data={blog.data} />
                        ))}
                    </div>

                    {filteredBlogs.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-gray-600 dark:text-gray-400">
                                No blogs found in this category.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
