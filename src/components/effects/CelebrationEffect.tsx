
"use client";

import Confetti from "react-confetti";

export default function CelebrationEffect() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 40,
        overflow: "hidden",
      }}
    >
      <Confetti
        width={typeof window !== "undefined" ? window.innerWidth : 1440}
        height={typeof window !== "undefined" ? window.innerHeight : 900}
        numberOfPieces={35}
        recycle={true}
        gravity={0.035}
        friction={0.995}
        wind={0.005}
        initialVelocityY={1.2}
        initialVelocityX={0.5}
        tweenDuration={15000}
        colors={[
          "#D4AF37",
          "#FFD700",
          "#F4A261",
          "#E8B85C",
          "#FFF0C2",
        ]}
        opacity={0.75}
      />
    </div>
  );
}
