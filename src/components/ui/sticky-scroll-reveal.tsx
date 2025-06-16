"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function cn(...inputs: (string | undefined | null | boolean)[]) {
  return inputs.filter(Boolean).join(" ");
}

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
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

      if (scrollPosition < containerTop || scrollPosition > containerTop + containerHeight) return;

      const progress = (scrollPosition - containerTop) / containerHeight;
      const index = Math.min(Math.floor(progress * content.length), content.length - 1);
      setActiveCard(index);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // trigger immediately on mount

    return () => window.removeEventListener("scroll", onScroll);
  }, [content.length]);

  const backgroundColors = ["#0f172a", "#000000", "#171717"];
  const gradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)",
    "linear-gradient(to bottom right, #ec4899, #6366f1)",
    "linear-gradient(to bottom right, #f97316, #eab308)",
  ];

  const bgGradient = gradients[activeCard % gradients.length];
  const bgColor = backgroundColors[activeCard % backgroundColors.length];

  return (
    <motion.div
      ref={containerRef}
      animate={{ backgroundColor: bgColor }}
      className="relative w-full min-h-[calc((var(--card-length,1)*70vh))] px-4 md:px-10 py-10 flex flex-col lg:flex-row"
      style={{ "--card-length": content.length } as React.CSSProperties}
    >
      {/* LEFT TEXT SECTION */}
      <div className="w-full lg:w-1/2 space-y-[40vh] relative z-10">
        {content.map((item, index) => (
          <div
            id={`card-${index}`} 
            key={item.title + index}
            className="h-[60vh] flex flex-col justify-center sticky top-[20vh]"
          >
            <motion.div
              initial={{ opacity: 0.3, scale: 0.95 }}
              animate={{
                opacity: activeCard === index ? 1 : 0,
                scale: activeCard === index ? 1 : 0.95,
                display: activeCard === index ? "block" : "none",
              }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white">{item.title}</h2>
              <p className="text-lg text-slate-300 mt-4">{item.description}</p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* RIGHT STICKY CONTENT */}
      <div
        className={cn(
          "sticky top-[20vh] h-[60vh] w-full lg:w-1/2 rounded-xl shadow-xl overflow-hidden",
          contentClassName
        )}
        style={{
          background: bgGradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div
          key={activeCard}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {content[activeCard]?.content ?? null}
        </motion.div>
      </div>
    </motion.div>
  );
};