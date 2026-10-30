
import Image from "next/image";
import PrimaryBtnsvg from "@/components/ui/PrimaryBtnsvg";
import SecondryBtnsvg from "@/components/ui/SecondryBtnsvg";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Play } from "lucide-react";
export default function HomeHero() {
    const router = useRouter();
    return (
        <section
            className="
                relative z-10 flex flex-col items-center
                w-full max-w-7xl
                bg-cover bg-bottom bg-no-repeat min-h-[calc(100vh-60px)]
                px-8 py-10 mt-15 
                " 
            style={{
                backgroundImage: "url('/UtsavZerobgm.png')",
            }}
        >
            <Image
                src="/UtsavZeroLogo.png"
                alt="UtsavZero Logo"
                width={450}
                height={65}
            />
            <div className="mx-auto max-w-7xl py-6">
                <h1 className="text-3xl font-lora font-bold text-black">
                    Same Celebration. Cleaner Tomorrow.
                </h1>
            </div>
            <div className="mx-auto max-w-7xl py-4 w-3/7">
                <p className="text-xl font-lora font-semibold text-center text-gray-500">
                    Discover community celebrations, cultural events and  firecracker-free festivities across Delhi.
                </p>
            </div>
            <div className="flex justify-center gap-4">
                <PrimaryBtnsvg text1="Explore Events" text2=<ArrowRight size={22} /> onClick={() => router.push("/events")} width="175px" height="43px" />
                <SecondryBtnsvg text1="Learn More" text2=<Play size={24} /> onClick={() => router.push("/about")} width="175px" height="43px" />
            </div>
        </section>
    )
};