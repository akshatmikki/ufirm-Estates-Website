"use client";
import React, { useState } from "react";
import { Menu, MenuItem } from "./ui/Navbar";
import { cn } from "@/utils/cn";
import Link from "next/link";

export function Login() {
    const [active, setActive] = useState<string | null>(null);
    return (
        <div className={cn("absolute top-8 right-4")}>
            <div className="hidden lg:block">
                <Menu setActive={setActive}>
                    <MenuItem setActive={setActive} active={active} item="Login" href="/" />
                    {active === "Login" && (
                        <div className="absolute mt-8 bg-[#1e3143] shadow-lg rounded-lg p-4 z-50 text-sm">
                            <div className="flex flex-col space-y-3">
                                <Link
                                    href="https://account.ufirm.in/Account/Login"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-[#f0f3f5] hover:bg-[blue] hover:text-white active:bg-[#1484bc] active:text-white transition-colors text-center py-2 rounded-md"
                                >
                                    Client Login
                                </Link>
                                <Link
                                    href="https://admin.urest.in:8097/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-[#f0f3f5] hover:bg-[#1f4e7a] hover:text-white active:bg-[#1484bc] active:text-white transition-colors text-center py-2 rounded-md"
                                >
                                    Employee Login
                                </Link>
                                <Link
                                    href="https://account.ufirm.in/Account/Login"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-[#f0f3f5] hover:bg-[#1f4e7a] hover:text-white active:bg-[#1484bc] active:text-white transition-colors text-center py-2 rounded-md"
                                >
                                    Facility Manager Login
                                </Link>
                            </div>
                        </div>
                    )}
                </Menu>
            </div>
        </div>
    );
}
