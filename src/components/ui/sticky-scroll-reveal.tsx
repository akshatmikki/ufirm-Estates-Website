"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "./Button";
import { motion } from "framer-motion";

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(" ");
}

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    id: string;
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;

      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      if (
        scrollPosition < containerTop ||
        scrollPosition > containerTop + containerHeight
      )
        return;

      const progress = (scrollPosition - containerTop) / containerHeight;
      const index = Math.min(
        Math.floor(progress * content.length),
        content.length - 1
      );
      setActiveCard(index);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [content.length]);

  const backgroundColors = ["#0f172a"];
  const bgColor = backgroundColors[activeCard % backgroundColors.length];

  return (
    <motion.div
      ref={containerRef}
      animate={{ backgroundColor: bgColor }}
      className="relative w-full min-h-[calc((var(--card-length,1)*100vh))] px-4 md:px-2 py-2"
      style={{ "--card-length": content.length } as React.CSSProperties}
    >
      {content.map((item) => (
        <div
          key={item.id}
          id={item.id}
          className="sticky top-[2vh] sm:top-[5vh] h-[95vh] sm:h-[100vh] w-full mx-auto shadow-lg bg-[#243660] p-4 sm:p-10 text-white flex flex-col md:flex-row items-center gap-4 sm:gap-8 mb-5"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full flex flex-col md:flex-row items-center gap-4 sm:gap-8"
          >
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                {item.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-2 sm:mt-4">
                {item.description}
              </p>
              <div className="mt-6">
              <Link href="https://calendly.com/bhavesh-singh-ufirm" target="_blank"
                rel="noopener noreferrer"><Button
                className="w-full sm:w-auto text-center"
                borderClassName="px-4 sm:px-6 py-3 bg-black/75 dark:bg-black/75 border-slate-800"
                borderRadius="1.75rem"
              >Book a Demo <span className="ml-2">&rarr;</span></Button></Link></div>
            </div>
            <div
              className={cn("flex-1", contentClassName)}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "100%",
              }}
            >
              {item.content ?? null}
            </div>
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
};