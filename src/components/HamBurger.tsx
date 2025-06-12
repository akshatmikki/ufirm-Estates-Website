"use client";
import{useState} from "react";
import { HoveredLink, MenuItem, Menu } from "./ui/Navbar";

export function HamBurger(){
    const [active, setActive] = useState<string | null>(null);
    return (
          <div className="pt-3 pl-6">
            <Menu setActive={setActive}>
              <MenuItem setActive={setActive} active={active} item="☰">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="/About">
                    About
                  </HoveredLink>
                  <HoveredLink href="/Divisions">
                    Divisions
                  </HoveredLink>
                  <HoveredLink href="/TechnologiesPage">
                    Technologies
                  </HoveredLink>
                  <HoveredLink href="/Projects">
                    Projects
                  </HoveredLink>
                  <HoveredLink href="/CareerPage">
                    Career
                  </HoveredLink>
                  <HoveredLink href="/Contact">
                    Contact
                  </HoveredLink>
                </div>
              </MenuItem>
            </Menu>
          </div>
    );
}