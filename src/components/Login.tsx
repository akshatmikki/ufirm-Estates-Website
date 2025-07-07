"use client";
import React, { useState } from "react";
import { Menu, MenuItem, HoveredLink } from "./ui/Navbar";
import { cn } from "@/utils/cn";

export function Login() {
    const [active, setActive] = useState<string | null>(null);
    return (
        <div className={cn("absolute top-8 right-4")}>
            <div className="hidden lg:block">
                <Menu setActive={setActive}>
                    <MenuItem setActive={setActive} active={active} item="Login" href="/" />
                    {active === "Login" && (
                        <div className="absolute text-white mt-8 bg-black/70 shadow-md rounded-lg p-4 z-50 text-sm">
                            <div className="flex flex-col space-y-4">
                                <HoveredLink href="http://account.ufirm.in">Client Login</HoveredLink>
                                <HoveredLink href="https://admin.urest.in:8097/">Employee Login</HoveredLink>
                                <HoveredLink href="http://account.ufirm.in">Facility Manager Login</HoveredLink>
                            </div>
                        </div>
                    )}
                </Menu>
            </div>
        </div>
    );
}
