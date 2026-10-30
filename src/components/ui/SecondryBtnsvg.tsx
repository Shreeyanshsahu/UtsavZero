
"use client";

import type { ReactNode } from "react";

type Props = {
  onClick: () => void;
  text1: ReactNode;
  text2: ReactNode;
  width?: string;
  height?: string;
};

export default function SecondaryBtnsvg({
  onClick,
  text1,
  text2,
  width = "48px",
  height = "48px",
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width,
        height,
        maxWidth: "100%",
      }}
      className="
        flex shrink-0 items-center justify-center gap-2
        rounded-full border-2 border-[#F5E3C8]
        bg-gradient-to-r from-[#FFF3D9] via-white to-[#FFF8EB]
        px-4
        font-semibold
        shadow-md
        transition-all duration-300 ease-in-out
        hover:scale-[1.03] hover:shadow-lg
        active:scale-[0.98]
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-orange-500
        sm:gap-3
      "
    >
      <span className="
        bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A]
        bg-clip-text text-sm font-semibold text-transparent
        sm:text-base
      ">
        {text1}
      </span>

      <span className="flex shrink-0 items-center justify-center text-[#F0440A]">
        {text2}
      </span>
    </button>
  );
}
