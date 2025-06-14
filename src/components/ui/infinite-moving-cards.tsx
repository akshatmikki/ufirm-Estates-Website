"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import Image from "next/image";

interface InfiniteMovingCardsProps {
  items: { alt: string; src: string }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
}

export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
}: InfiniteMovingCardsProps) {
  const baseSpeed = {
    slow: "80s",
    normal: "40s",
    fast: "20s",
  }[speed];

  return (
    <div className="overflow-hidden relative w-full py-6 perspective-[1000px]">
      <div
        className={cn(
          "flex gap-12 w-max animate-marquee whitespace-nowrap",
          direction === "right" ? "animate-marquee-reverse" : "",
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        )}
        style={{ animationDuration: baseSpeed }}
      >
        {items.concat(items).map((item, index) => (
          <div
            key={index}
            className="transform rotate-y-[20deg] hover:rotate-y-0 transition-transform duration-500"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={100}
              height={50}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}