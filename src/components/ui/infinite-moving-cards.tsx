"use client";

import * as React from "react";
import { motion } from "framer-motion";
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
                    "flex gap-8 w-max animate-marquee whitespace-nowrap",
                    direction === "right" ? "animate-marquee-reverse" : ""
                )}
                style={{ animationDuration: baseSpeed }}
            >
                {items.concat(items).map((item, index) => (
                    <motion.div
                        key={index}
                        className="flex-shrink-0 w-28 h-16 flex items-center justify-center rounded-lg bg-white shadow-sm border"
                    >
                        <Image
                            src={item.src}
                            alt={item.alt}
                            className="object-fill"
                            width={40}
                            height={25}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
