import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CollectionEntry } from "astro:content";

export default function GalleryCarousel({
  images,
}: {
  images: CollectionEntry<"gallery">[];
}) {
  return (
    <Carousel className="mx-2">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <img
              alt={image?.data.alt}
              className="aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="310"
              src={image?.data.image ?? "/placeholder.svg"}
              width="550"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
