"use client";

import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { HamBurger } from "@/components/HamBurger";

export default function MobileDevelopment(){
    return (
        <div>
            <div className="absolute top-1 left-0 w-full z-50 ">
                <div className="flex items-center justify-between px-4 py-4">
                    <Link href="/">
                        <Image
                            src="/UFIRM ESTATES LOGO.png"
                            alt="logo"
                            width={100}
                            height={50}
                            priority
                        />
                    </Link>
                    <div className="flex-grow px-4 hidden lg:block">
                        <NavBar />
                    </div>
                    <HamBurger />
                </div>
            </div>
            <div className="mt-40">
                <p>hello</p>
            </div>
        </div>
    );
}