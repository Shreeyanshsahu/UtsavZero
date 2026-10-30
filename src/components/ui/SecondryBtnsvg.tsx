
"use client";

import type { ReactNode } from "react";
import { text } from "stream/consumers";

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
    bg-clip-text text-transparent flex gap-2 items-center justify-center
  ">
                {text1}
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <defs>
                        <linearGradient
                            id="orangeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor="#FFBE45" />
                            <stop offset="50%" stopColor="#FF6A16" />
                            <stop offset="100%" stopColor="#F0440A" />
                        </linearGradient>
                    </defs>

                    <path
                        d="M7 4.5L20 12L7 19.5V4.5Z"
                        stroke="url(#orangeGradient)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>

        </button>
    );
}
