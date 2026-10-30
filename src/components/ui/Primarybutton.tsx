
"use client";

import type { ReactNode } from "react";

type Props = {
  onClick: () => void;
  text: ReactNode;
  width?: string;
  height?: string;
};

export default function PrimaryButton({
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
        rounded-full
        bg-gradient-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A]
        p-0 text-white
        shadow-md
        transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-lg
        active:scale-95
        focus-visible:outline-2
        focus-visible:outline-offset-4
        focus-visible:outline-orange-500
      "
    >
      {text}
    </button>
  );
}
