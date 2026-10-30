
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
            onClick={onClick}
            style={{ width, height }}
            className="
    flex items-center justify-center gap-3
    rounded-full
    border-2 border-[#F5E3C8]
    bg-gradient-to-r from-[#FFF3D9] via-white to-[#FFF8EB]
    font-semibold
    shadow-md
    transition-all duration-300 ease-in-out
    hover:scale-105 hover:shadow-lg
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
