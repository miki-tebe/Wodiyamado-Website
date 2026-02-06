import { Button } from "@/components/ui/button";

export default function StructurePreview() {
    return (
        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] items-center">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                                Our Organization Structure
                            </h2>
                            <p className="max-w-[600px] text-gray-500 md:text-lg dark:text-gray-400">
                                Discover the dedicated team behind our impactful projects. Get to know the board members and directors who lead our club's initiatives.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <a href="/structure">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 hover:scale-105 transition-transform duration-200">
                                    Meet the Team
                                </Button>
                            </a>
                        </div>
                    </div>
                    <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last">
                        <img
                            alt="Club Structure"
                            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                            src="/structure.png"
                            width="550"
                            height="310"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
