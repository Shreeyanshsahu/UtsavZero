
import Image from "next/image";

export default function HomeHero() {
    return (
        <section
            className="min-h-screen bg-cover bg-bottom bg-no-repeat
             w-full flex flex-col items-center justify-center"
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
        </section>
    )
};