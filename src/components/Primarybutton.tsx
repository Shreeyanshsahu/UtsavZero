
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
      onClick={onClick}
      style={{ width, height }}
      className="p-0 bg-linear-to-r from-[#FFBE45] via-[#FF6A16] to-[#F0440A]
        text-white rounded-full shadow-md
        transition duration-300 ease-in-out
        hover:scale-105 flex items-center justify-center"
    >
      {text}
    </button>
  );
}
