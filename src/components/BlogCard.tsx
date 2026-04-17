import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
    id: string;
    data: {
        title: string;
        cover: string;
        category: string;
        date: string | Date;
        author: string;
    };
}

export default function BlogCard({ id, data }: BlogCardProps) {
    // Ensure we have a string URL for the image
    // If data.cover is an object (from Astro image), use .src
    const coverSrc = typeof data.cover === 'object' && data.cover !== null && 'src' in data.cover
        ? (data.cover as any).src
        : data.cover;

    return (
        <article className="group space-y-4">
            <a
                href={`/blogs/${id}/`}
                className="flex h-52 group-hover:-translate-y-2 group-hover:shadow-xl transition duration-300"
            >
                <img
                    loading="eager"
                    className="w-full h-full object-cover rounded-xl overflow-hidden"
                    width={720}
                    height={360}
                    src={coverSrc}
                    alt={data.title}
                />
            </a>

            <div className="flex items-center justify-between">
                <a href={`/blogs/category/${data.category}`}>
                    <Badge className="capitalize">
                        {data.category}
                    </Badge>
                </a>
                <span className="font-medium text-muted-foreground">
                    {formatDate(new Date(data.date))}
                </span>
            </div>

            <div>
                <a href={`/blogs/${id}/`} className="group-hover:underline">
                    <h2 className="font-heading text-xl md:text-2xl leading-snug line-clamp-3">
                        {data.title}
                    </h2>
                </a>
                <p className="text-sm text-muted-foreground">
                    Written by {data.author}
                </p>
            </div>
        </article>
    );
}
