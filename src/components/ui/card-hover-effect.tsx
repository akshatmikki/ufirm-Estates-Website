import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          href={item.link}
          key={item.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.title}
          className="relative group block p-2 h-full w-full rounded-3xl"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                layoutId="hoverBackground"
                className="absolute inset-0 w-full h-full bg-neutral-200/60 dark:bg-slate-800/60 rounded-3xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.1 } }}
              />
            )}
          </AnimatePresence>

          <Card>
            <CardTitle className="text-center text-2xl">{item.title}</CardTitle>
            <CardDescription className="text-white px-3 text-center">
              {item.description}
            </CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full overflow-hidden bg-black/40 border border-transparent dark:border-white/20 group-hover:border-slate-600 transition-all duration-300 ease-in-out",
        className
      )}
    >
      <div className="p-6 h-full flex flex-col justify-center">{children}</div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "text-zinc-100 font-semibold tracking-wide mt-4 text-lg sm:text-xl",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-4 text-zinc-300 tracking-wide leading-relaxed text-sm sm:text-base",
        className
      )}
    >
      {children}
    </p>
  );
};
