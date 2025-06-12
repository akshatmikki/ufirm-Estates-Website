"use client";
import React, { useEffect, useRef, useState } from "react";
// Corrected import: 'motion/react' is typically 'framer-motion'
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";

// Basic 'cn' utility function for combining class names
// This replaces the external "@/utils/cn" import which cannot be resolved in this environment.
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
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null); // Ref for the main StickyScroll component container

  // useScroll hook to track the scroll progress of this component within the viewport
  const { scrollYProgress } = useScroll({
    target: ref, // Tracks the scroll progress of the element referenced by 'ref'
    offset: ["start center", "end center"], // Animation starts when component top hits center, ends when component bottom hits center
  });

  const cardLength = content.length;

  // Listen for changes in scrollYProgress to update the active card
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Calculate breakpoints for each card based on scroll progress
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    // Find the closest breakpoint to the current scroll position
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    // Set the active card index
    setActiveCard(closestBreakpointIndex);
  });

  // Define background colors for the main container
  const backgroundColors = [
    "#0f172a", // slate-900
    "#000000", // black
    "#171717", // neutral-900
  ];

  // Define linear gradients for the dynamic content block
  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan-500 to emerald-500
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink-500 to indigo-500
    "linear-gradient(to bottom right, #f97316, #eab308)", // orange-500 to yellow-500
  ];

  // State for the background gradient of the dynamic content
  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0],
  );

  // Update background gradient when activeCard changes
  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    // Main container for the sticky scroll component
    // - w-full: Takes full width of its parent
    // - min-h-[calc((var(--card-length,1))*60vh)]: Dynamic minimum height
    //   to ensure enough scroll space for all content items.
    // - flex-col md:flex-row: Stacks vertically on mobile, horizontally on desktop
    // - justify-center md:justify-between: Centers content on mobile, spaces between on desktop
    // - px-4 md:px-8 lg:px-16 py-10: Responsive padding
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      ref={ref}
      // Pass cardLength as a CSS variable for dynamic height calculation
      style={{ '--card-length': cardLength } as React.CSSProperties}
      className="relative flex flex-col md:flex-row w-full 
                 min-h-[calc((var(--card-length,1))*60vh)]
                 justify-center md:justify-between px-4 md:px-8 lg:px-16 py-10"
    >
      {/* Left Column: Contains titles and descriptions */}
      {/* - flex-1: Allows it to grow and take available space
          - items-start: Aligns content to the start (left)
          - md:w-1/2: Takes half width on medium screens and above */}
      <div className="flex flex-col flex-1 items-start md:w-1/2 ">
        {/* Inner container for the text content, centered on mobile, left-aligned on desktop */}
        <div className="max-w-xl md:max-w-2xl mx-auto md:mx-0">
          {content.map((item, index) => (
            <div
              key={item.title + index}
              // h-[50vh]: Provides a specific height for each card,
              // making it transition more frequently as you scroll.
              className="h-[80vh] flex flex-col justify-center" // Added flex for vertical centering within its height
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-lg mt-10 max-w-sm text-slate-300"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          {/* This div creates additional scroll space at the very end,
              ensuring the last content item can fully become active. */}
          <div className="h-[20vh]" /> 
        </div>
      </div>

      {/* Right Column: Contains the sticky dynamic content (image, component, etc.) */}
      {/* - sticky top-10: Stays fixed 10px from the top of the viewport when scrolled
          - flex-shrink-0: Prevents it from shrinking
          - w-full md:w-1/2: Full width on mobile, half width on desktop
          - h-[calc(100vh-80px)]: Occupies most of the viewport height (adjusted for top offset/padding)
          - overflow-hidden: Ensures content doesn't spill out
          - lg:block: Only visible on large screens and above (original behavior maintained) */}
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-30 flex-shrink-0 w-full md:w-1/2 h-[calc(70vh-80px)] overflow-hidden rounded-md bg-white lg:block",
          contentClassName,
        )}
      >
        {/* Render the actual content provided for the active card */}
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};