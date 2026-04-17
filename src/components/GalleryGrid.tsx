import type { CollectionEntry } from "astro:content";

interface GalleryGridProps {
    images: CollectionEntry<"gallery">[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
    return (
        <div className="w-full">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {images.map((image, index) => {
                    // Handle both string paths and ImageMetadata objects (from Astro)
                    const imageSrc =
                        typeof image.data.image === "object" && image.data.image !== null
                            ? (image.data.image as any).src
                            : image.data.image;

                    return (
                        <div key={index} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                            <img
                                alt={image.data.alt || "Gallery image"}
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                src={imageSrc ?? "/placeholder.svg"}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
