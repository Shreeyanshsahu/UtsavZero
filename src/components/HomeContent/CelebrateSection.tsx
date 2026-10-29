  import { useTheme } from "../../context/ThemeContext";

export default function CelebrateSection() {
  const { isDarkMode } = useTheme();

  return (
    <section
      className={`flex flex-col items-center justify-center px-4 py-4 ${
        isDarkMode ? "bg-[#171A19]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl py-2.5">
        <h1
          className={`text-center text-2xl font-lora font-bold sm:text-3xl ${
            isDarkMode ? "text-[#FFF0D7]" : "text-[#3D2923]"
          }`}
        >
          Celebrate Together, Breathe Better
        </h1>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <p
          className={`text-center font-lora text-base font-normal sm:text-lg ${
            isDarkMode ? "text-[#B9AD99]" : "text-[#927D70]"
          }`}
        >
          UtsavZero makes it easy to find and join organised, firecracker-free
          celebrations happening across Delhi from cultural festivals to
          community events.
        </p>
      </div>
    </section>
  );
}