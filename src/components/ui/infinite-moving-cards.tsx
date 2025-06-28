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
    <div className="overflow-hidden relative w-full py-6">
      <div
        className={cn(
          "flex gap-6 w-max animate-marquee whitespace-nowrap items-center",
          direction === "right" ? "animate-marquee-reverse" : "",
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        )}
        style={{ animationDuration: baseSpeed }}
      >
        {items.concat(items).map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center max-w-[120px] h-[60px] transition-transform hover:scale-105"
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={80}
              height={60}
              className="object-contain h-full w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}