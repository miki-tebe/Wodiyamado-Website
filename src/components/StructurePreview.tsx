import { Button } from "@/components/ui/button";
import type { CmsBoardMember } from "@/lib/emdash-content";

const previewRoles = [
    "Vice President",
    "Secretary and Community Service Director",
    "Project Officer",
    "Strategy and Operations Director",
];

export default function StructurePreview({ members }: { members: CmsBoardMember[] }) {
    const president = members.find((member) => member.role === "President");
    const leadership = previewRoles
        .map((role) => members.find((member) => member.role === role))
        .filter((member): member is CmsBoardMember => Boolean(member));

    return (
        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-800/50">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px] items-center">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                                Meet Our 2026–2027 Leadership
                            </h2>
                            <p className="max-w-[600px] text-gray-500 md:text-lg dark:text-gray-400">
                                Get to know the board members and directors guiding our club's service, growth, and community impact this year.
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
                    <div className="relative mx-auto aspect-video w-full max-w-[550px] overflow-hidden rounded-2xl bg-primary p-4 shadow-xl shadow-primary/15 sm:p-5 lg:order-last">
                        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10" />
                        <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full border-[28px] border-white/10" />

                        <div className="relative flex h-full flex-col">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-xs">
                                        Club structure
                                    </p>
                                    <p className="font-bold sm:text-lg">Board of Directors</p>
                                </div>
                                <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide sm:text-xs">
                                    2026–2027
                                </span>
                            </div>

                            {president && (
                                <div className="relative mx-auto mt-2 flex items-center gap-2 rounded-full border border-white/25 bg-white/95 py-1.5 pl-1.5 pr-3 shadow-lg sm:mt-3">
                                    <img
                                        alt=""
                                        className="h-9 w-9 rounded-full object-cover sm:h-11 sm:w-11"
                                        src={president.image ?? "/placeholder.svg"}
                                    />
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-primary sm:text-[10px]">
                                            President
                                        </p>
                                        <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
                                            {president.name}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="mx-auto h-3 w-px bg-white/45 sm:h-4" />
                            <div className="mx-[12%] h-px bg-white/45" />

                            <div className="mt-1.5 grid flex-1 grid-cols-4 gap-1.5 sm:mt-2 sm:gap-2.5">
                                {leadership.map((member) => (
                                    <div
                                        className="flex min-w-0 flex-col items-center justify-center rounded-lg border border-white/20 bg-white/10 px-1 py-1.5 text-center backdrop-blur-sm sm:rounded-xl sm:px-2 sm:py-2"
                                        key={member.name}
                                    >
                                        <img
                                            alt=""
                                            className="h-8 w-8 rounded-full border-2 border-white/80 object-cover sm:h-11 sm:w-11"
                                            loading="lazy"
                                            src={member.image ?? "/placeholder.svg"}
                                        />
                                        <p className="mt-1 line-clamp-2 text-[8px] font-semibold leading-tight text-white sm:text-[10px]">
                                            {member.role}
                                        </p>
                                        <p className="mt-0.5 hidden truncate text-[9px] text-white/70 sm:block sm:w-full">
                                            {member.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
