"use client";

import React from "react";
import { motion } from "framer-motion";
import Link, { LinkProps } from "next/link";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

type MenuItemProps = {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  description?: string;
  children?: React.ReactNode;
};

export const MenuItem: React.FC<MenuItemProps> = ({
  setActive,
  active,
  item,
  description,
  children,
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative text-center">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-white hover:opacity-90 font-semibold"
      >
        {item}
      </motion.p>

      {/* Interactive, floating description */}
      {active === item && description && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-4 py-2 rounded-xl bg-white/10 text-sm text-white dark:text-white backdrop-blur-md border border-white/20 shadow-md whitespace-nowrap"
        >
          {description}
        </motion.div>
      )}

      {/* Optional submenu content */}
      {active === item && children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          <div className="absolute top-[calc(100%_+_3.5rem)] left-1/2 transform -translate-x-1/2 z-10">
            <motion.div
              transition={transition}
              layoutId="active"
              className="bg-black/30 dark:bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/[0.2] dark:border-white/[0.2] shadow-xl"
            >
              <motion.div layout className="w-max h-full p-4">
                {children}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

type MenuProps = {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
};

export const Menu: React.FC<MenuProps> = ({ setActive, children }) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative rounded-full border border-transparent dark:bg-black/25 dark:border-white/[0.2] bg-black/25 shadow-input flex justify-center space-x-4 px-8 py-6"
    >
      {children}
    </nav>
  );
};

type ProductItemProps = {
  title: string;
  description: string;
  href: string;
  src: string;
};

export const ProductItem: React.FC<ProductItemProps> = ({
  title,
  description,
  href,
  src,
}) => {
  return (
    <Link href={href} className="flex space-x-2">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-white dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-300 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

type HoveredLinkProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
  };

export const HoveredLink: React.FC<HoveredLinkProps> = ({
  children,
  ...rest
}) => {
  return (
    <Link
      {...rest}
      className="text-neutral-200 dark:text-neutral-200 hover:text-blue-500"
    >
      {children}
    </Link>
  );
};