"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import CountUp from "react-countup"; 

interface Stat {
  icon: React.ReactNode;
  value: number;
  suffix?: string;
  label: string;
}

interface InfiniteStatCardsProps {
  stats: Stat[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
}

export function InfiniteStatCards({
  stats,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
}: InfiniteStatCardsProps) {
  const baseSpeed = {
    slow: "80s",
    normal: "40s",
    fast: "20s",
  }[speed];

  return (
    <div className="overflow-hidden relative w-full py-6 perspective-[1000px]">
      <div
        className={cn(
          "flex gap-6 w-max animate-marquee whitespace-nowrap",
          direction === "right" ? "animate-marquee-reverse" : "",
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        )}
        style={{ animationDuration: baseSpeed }}
      >
        {[...stats, ...stats].map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-4 min-w-[220px] text-center hover:shadow-lg transition-all duration-500 transform rotate-y-[20deg] hover:rotate-y-0"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-lg font-bold text-orange-500">
              <CountUp end={stat.value} duration={2} separator="," /> {stat.suffix}
            </p>
            <p className="text-sm text-gray-800 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
