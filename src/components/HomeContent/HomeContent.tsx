
"use client";

import CommunityBar from "@/components/HomeContent/CommunityBar";
import CelebrateSection from "@/components/HomeContent/CelebrateSection";
import ComplimentsCards from "@/components/HomeContent/ComplimentCards";
import FeaturedCelebrations from "@/components/HomeContent/FeatureCelebrations";

export default function HomeContent() {
  return (
    <main className="flex w-full min-w-0 flex-col gap-3 overflow-x-clip sm:gap-4 lg:gap-6">
      <CommunityBar />

      <CelebrateSection />

      <ComplimentsCards />

      <FeaturedCelebrations />
    </main>
  );
}
