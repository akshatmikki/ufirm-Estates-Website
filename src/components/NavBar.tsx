"use client";
import React from "react";
import { Menu, MenuItem } from "./ui/Navbar";
import { cn } from "@/utils/cn";

interface NavBarProps {
  current: number;
  onNavClick: (index: number) => void;
}

const navItems = [
  { label: "Urest", href: "https://urest.in/" },
  { label: "Royal Nest", href: "https://royalnestdharamshala.com/" },
  { label: "Tech", href: "https://tech.in/" },
  { label: "Estates", href: "https://estates.in/" },
];

export function NavBar({ current, onNavClick }: NavBarProps) {
  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-3xl mx-auto")}>
      <Menu setActive={() => {}}>
        {navItems.map(({ label, href }, index) => (
          <div
            key={label}
            onClick={() => onNavClick(index)}
            className={cn(
              "cursor-pointer block w-full h-full px-4",
              current === index
                ? "font-bold"
                : "font-normal"
            )}
            title={`Go to ${label}`}
          >
            <MenuItem
              setActive={() => {}}
              active={current === index ? label : null}
              item={label}
            />
          </div>
        ))}
      </Menu>
    </div>
  );
}