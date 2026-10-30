
"use client";

import type { ReactNode } from "react";

type Props = {
  onClick: () => void;
  text1: ReactNode;
  text2: ReactNode;
  width?: string;
  height?: string;
};

export default function PrimaryBtnsvg({
  onClick,
  text1,
  text2,
  width = "175px",
  height = "45px",
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
        rounded-full
        bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A]
        px-4
        text-sm font-semibold text-white
        shadow-md
        transition-all duration-300 ease-in-out
        hover:scale-[1.03] hover:shadow-lg
        active:scale-[0.98]
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-orange-500
        sm:gap-3 sm:text-base
      "
    >
      <span className="whitespace-nowrap">{text1}</span>
      <span className="shrink-0">{text2}</span>
    </button>
  );
}
