
"use client";

import { useRouter } from "next/navigation";
import FeatureCard from "@/components/HomeContent/FeatureCard";
import { useTheme } from "@/context/ThemeContext";

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
  const { isDarkMode } = useTheme();

  return (
    <section
      aria-label="Featured celebrations"
      className={`w-full px-4 py-6 transition-colors duration-300 sm:px-6 sm:py-8 lg:px-8 ${
        isDarkMode ? "bg-[#171A19]" : "bg-transparent"
      }`}
    >
      {/* Mobile: Horizontal scroll */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 lg:hidden">
        {celebrations.map((event) => (
          <div
            key={event.id}
            className="w-[min(82vw,300px)] shrink-0 snap-start"
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

      {/* Desktop: Four-column grid */}
      <div className="mx-auto hidden max-w-7xl grid-cols-2 gap-5 lg:grid lg:grid-cols-4 lg:gap-6">
        {celebrations.map((event) => (
          <FeatureCard
            key={event.id}
            title={event.title}
            location={event.location}
            image={event.image}
            category={event.category}
            seatsAvailable={event.seatsAvailable}
            totalSeats={event.totalSeats}
            onClick={() => router.push("/events")}
          />
        ))}
      </div>
    </section>
  );
}
