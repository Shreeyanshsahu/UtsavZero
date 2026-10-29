import CommunityBar from "@/components/HomeContent/CommunityBar";
import CelebrateSection from "@/components/HomeContent/CelebrateSection";
import ComplimentsCards from "@/components/HomeContent/ComplimentCards";
import FeaturedCelebrations from "@/components/HomeContent/FeatureCelebrations";

export default function HomeContent() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <CommunityBar />
      <CelebrateSection />
      <ComplimentsCards />
      <FeaturedCelebrations />
    </div>
  );
}