"use client";
import React, { useState } from "react";
import { Menu, MenuItem } from "./ui/Navbar";
import { cn } from "@/utils/cn";
import Link from "next/link";

export function NavBar() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-3xl mx-auto")}
    >
      
      <Menu setActive={setActive}>
        <Link
          href="https://urest.in/" target="_blank" rel="noopener noreferrer" className="block w-full h-full ml-20"
        >
          <MenuItem
            setActive={setActive}
            active={active}
            item="Urest"
          />
        </Link>
        <Link href="https://royalnestdharamshala.com/" target="_blank" rel="noopener noreferrer" className="block w-full h-full mr-7">
          <MenuItem
            setActive={setActive}
            active={active}
            item="Royal Nest"
          />
        </Link>
        <Link href="https://tech.in/" target="_blank" rel="noopener noreferrer" className="block w-full h-full ml-7">
          <MenuItem
            setActive={setActive}
            active={active}
            item="Tech"
          />
        </Link>
        <Link href="https://estates.in/" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
          <MenuItem
            setActive={setActive}
            active={active}
            item="Estates"
          />
        </Link>

      </Menu>
    </div>
  );
}
