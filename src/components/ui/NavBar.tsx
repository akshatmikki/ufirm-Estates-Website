"use client";

import React from "react";
import { motion } from "framer-motion";
import Link, { LinkProps } from "next/link";
import Image from "next/image";
import { cn } from "@/utils/cn";

type MenuItemProps = {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  href?: string;
  children?: React.ReactNode;
  isMegaMenu?: boolean;
};

export const MenuItem: React.FC<MenuItemProps> = ({
  setActive,
  active,
  item,
  href,
  children,
  isMegaMenu,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (children) {
      e.preventDefault();
      setActive(active === item ? null : item);
    }
  };

  return (
    <div className={cn("relative", isMegaMenu && "static")}>
      {href ? (
        <Link href={href} onClick={handleClick}>
          <motion.p
            transition={{ duration: 0.2 }}
            className={cn(
              "cursor-pointer text-sm transition-all duration-200 text-[#131720]",
              active === item ? "font-bold" : "font-normal hover:font-bold"
            )}
          >
            {item}
          </motion.p>
        </Link>
      ) : (
        <div onClick={handleClick} className="cursor-pointer">
          <motion.p
            transition={{ duration: 0.2 }}
            className={cn(
              "cursor-pointer text-sm transition-all duration-200 text-[#131720]",
              active === item ? "font-bold" : "font-normal hover:font-bold"
            )}
          >
            {item}
          </motion.p>
        </div>
      )}

      {active === item && children && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "z-50 mt-2",
            isMegaMenu ? "fixed left-0 top-[64px] w-screen" : "absolute left-0 top-full"
          )}
        >
          <div className={cn(
            "bg-white shadow-lg border border-gray-200 rounded-md overflow-hidden",
            isMegaMenu && "bg-transparent border-none shadow-none rounded-none"
          )}>
            {children}
          </div>
        </motion.div>
      )}
    </div>
  );
};

type MenuProps = {
  children: React.ReactNode;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
};

export const Menu: React.FC<MenuProps> = ({ children, logo, actions }) => {
  return (
    <nav
      className="relative bg-white shadow-md border-b border-gray-200 flex items-center justify-between px-6 sm:px-12 md:px-16 lg:px-24 py-4 z-50"
    >
      {logo && <div className="flex-shrink-0">{logo}</div>}
      <div className="flex items-center space-x-10">
        {children}
      </div>
      {actions && <div className="flex items-center space-x-3">{actions}</div>}
    </nav>
  );
};

type ProductItemProps = {
  title: string;
  description: string;
  href?: string;
  src: string;
  onClick?: () => void;
};

export const ProductItem: React.FC<ProductItemProps> = ({
  title,
  description,
  href,
  src,
  onClick,
}) => {
  const content = (
    <div className="flex space-x-2 items-start p-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition duration-200">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-sm"
      />
      <div>
        <h4 className="text-base font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-xs max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <div onClick={onClick} className="cursor-pointer">
        {content}
      </div>
    );
  }

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};

export const HoveredLink = ({ children, ...rest }: LinkProps & { children: React.ReactNode }) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black dark:hover:text-white"
    >
      {children}
    </Link>
  );
};
