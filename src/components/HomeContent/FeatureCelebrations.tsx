
"use client";

import { useRouter } from "next/navigation";
import FeatureCard from "@/components/HomeContent/FeatureCard";
import { ArrowUpRight } from "lucide-react";

const celebrations = [
    {
        id: 1,
        title: "Community Diwali Mela",
        location: "Central Delhi",
        image: "/images/Event1.jpg",
        category: "Community",
        seatsAvailable: 120,
        totalSeats: 200,
    },
    {
        id: 2,
        title: "Ramlila & Cultural Night",
        location: "India Habitat Centre, Delhi",
        image: "/images/Event2.jpg",
        category: "Art & Culture",
        seatsAvailable: 80,
        totalSeats: 150,
    },
    {
        id: 3,
        title: "Diya-Making Workshop",
        location: "South Delhi",
        image: "/images/Event3.jpg",
        category: "Workshop",
        seatsAvailable: 45,
        totalSeats: 60,
    },
    {
        id: 4,
        title: "Community Music Evening",
        location: "Jawaharlal Nehru Stadium, Delhi",
        image: "/images/Event4.jpg",
        category: "Music",
        seatsAvailable: 450,
        totalSeats: 500,
    },
];

export default function FeaturedCelebrations() {
    const router = useRouter();

    return (
        <section className="w-full bg-transparent px-5 py-6 sm:px-7">
            <div
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2
             [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {celebrations.map((event) => (
                    <div
                        key={event.id}
                        className="w-[280px] shrink-0 snap-start sm:w-[calc((100%-2rem)/3)]"
                    >
                        <FeatureCard
                            title={event.title}
                            location={event.location}
                            image={event.image}
                            category={event.category}
                            seatsAvailable={event.seatsAvailable}
                            totalSeats={event.totalSeats}
                            onClick={() => router.push("/events")}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
