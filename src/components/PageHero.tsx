interface PageHeroProps {
    title: string;
    description: string;
}

export default function PageHero({ title, description }: PageHeroProps) {
    return (
        <section className="relative w-full py-12 md:py-16 bg-gradient-to-br from-primary/10 via-primary/20 to-secondary/10 overflow-hidden">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-4">
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                            {title}
                        </h1>
                        <p className="text-lg md:text-lg text-gray-800 dark:text-gray-300 max-w-3xl mx-auto">
                            {description}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
