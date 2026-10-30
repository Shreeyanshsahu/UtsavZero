
"use client";

import type { ReactNode } from "react";

type Props = {
  onClick: () => void;
  text: ReactNode;
  width?: string;
  height?: string;
};

export default function SecondaryButton({
  onClick,
  text,
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
        flex shrink-0 items-center justify-center
        rounded-full border-2 border-[#F5E3C8]
        bg-gradient-to-r from-[#FFF3D9] via-white to-[#FFF8EB]
        px-3
        font-semibold
        shadow-md
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-lg
        active:scale-95
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-orange-500
      "
    >
      <span className="
        bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A]
        bg-clip-text text-transparent
      ">
        {text}
      </span>
    </button>
  );
}
