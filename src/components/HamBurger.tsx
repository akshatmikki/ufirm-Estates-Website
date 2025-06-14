"use client";
import { useState } from "react";
import { HoveredLink, MenuItem, Menu } from "./ui/Navbar";

export function HamBurger() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="pt-3 pl-6 relative z-50">
      <Menu setActive={setActive}>
        <MenuItem
          setActive={setActive}
          active={active}
          item="☰"
        />
        {active === "☰" && (
          <div className="absolute bg-black/70 dark:bg-black/70 shadow-md mt-8 p-4 rounded-md flex flex-col space-y-3 text-sm z-50">
            <HoveredLink href="/About">About</HoveredLink>
            <HoveredLink href="/Divisions">Divisions</HoveredLink>
            <HoveredLink href="/TechnologiesPage">Technologies</HoveredLink>
            <HoveredLink href="/Projects">Projects</HoveredLink>
            <HoveredLink href="/CareerPage">Career</HoveredLink>
            <HoveredLink href="/ContactPage">Contact</HoveredLink>
          </div>
        )}
      </Menu>
    </div>
  );
}