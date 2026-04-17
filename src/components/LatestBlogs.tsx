import { Button } from "@/components/ui/button";

interface Blog {
  slug?: string;
  data: {
    title: string;
    date: string;
    category?: string;
    description?: string;
    cover?: string;
    author: string;
  };
}

interface LatestBlogsProps {
  blogs: Blog[];
}

export default function LatestBlogs({ blogs }: LatestBlogsProps) {
  return (
    <section className="w-full py-16 md:py-24 ">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Insights & Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Read our latest blog posts about community service, leadership, and
            youth development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.slug} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {blog.data.cover && (
                <div className="aspect-[16/11] overflow-hidden">
                  <img
                    src={blog.data.cover}
                    alt={blog.data.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-primary/90 text-white text-sm font-medium rounded-full">
                    {blog.data.category || "Blog"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(blog.data.date).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 line-clamp-2">
                  {blog.data.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    By {blog.data.author}
                  </span>
                  <a
                    href={`/blogs/${blog.slug}`}
                    className="text-primary hover:text-primary/80 font-medium text-sm inline-flex items-center gap-1 group"
                  >
                    Read More
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="/blogs">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white hover:scale-105 transition-transform duration-200"
            >
              View All Posts
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}
