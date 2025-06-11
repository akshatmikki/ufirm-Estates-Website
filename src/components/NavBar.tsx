"use client";
import React, { useState } from "react";
import { Menu, MenuItem, HoveredLink } from "./ui/Navbar";
import { cn } from "@/utils/cn";
import Link from "next/link";

export function NavBar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-3xl mx-auto")}>
      <Menu setActive={setActive}>
        <Link
          href="https://urest.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full"
        >
          <MenuItem
            setActive={setActive}
            active={active}
            item="Urest"
            description="Facility Management"
          />
        </Link>

        <Link
          href="https://royalnestdharamshala.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full mr-7"
        >
          <MenuItem
            setActive={setActive}
            active={active}
            item="Royal Nest"
            description="Projects"
          />
        </Link>

        <Link href="/TechnologiesPage" className="relative block w-full h-full ml-7">
          <MenuItem
            setActive={setActive}
            active={active}
            item="Technologies"
          />
          {active === "Technologies" && (
            <div className="absolute left-0 text-white mt-2 bg-black/20 shadow-md rounded-lg p-8 z-50 flex flex-col space-y-2 text-sm font-bold">
              <div className="relative group">
                <HoveredLink href="/OurInnovation">Our Innovation</HoveredLink>
                {/* <div className="hidden group-hover:flex flex-col absolute left-full top-0 ml-2 bg-black/30 rounded-lg p-4 space-y-2 min-w-[200px] z-50">
                  <HoveredLink href="/OurInnovation/FacilityManagement">Facility Management</HoveredLink>
                  <HoveredLink href="/OurInnovation/cloud">Supervisor Management</HoveredLink>
                  <HoveredLink href="/OurInnovation/iot">Visitor Management</HoveredLink>
                </div> */}
              </div>
              <HoveredLink href="/.NetDevelopment">.Net Development</HoveredLink>
              <HoveredLink href="/ReactDevelopment">React Development</HoveredLink>
              <HoveredLink href="/MobileDevelopment">Mobile Development</HoveredLink>
            </div>
          )}
        </Link>

        <Link href="/estates" className="block w-full h-full">
          <MenuItem
            setActive={setActive}
            active={active}
            item="Estates"
            description="Management & Advisory"
          />
        </Link>
      </Menu>
    </div>
  );
}
