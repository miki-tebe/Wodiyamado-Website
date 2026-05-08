import type { CmsEntry, CmsGalleryItem } from "@/lib/emdash-content";

interface GalleryGridProps {
    images: CmsEntry<CmsGalleryItem>[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
    return (
        <div className="w-full">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                {images.map((image, index) => {
                    return (
                        <div key={index} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                            <img
                                alt={image.data.alt || "Gallery image"}
                                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                src={image.data.image || "/placeholder.svg"}
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
