"use client";
import { TextGenerateEffect } from '@/components/ui/textgeneratoreffect';
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
// import { HamBurger } from "@/components/HamBurger";

const words = `Coming Soon`;

export default function Managementadvisory() {
    return (
        <div>
            <div className="absolute top-1 left-0 w-full z-50">
                <div className="flex items-center justify-between px-4 mt-1">
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
                </div>
            </div>
            <div className='text-center mt-40 mb-40 text-7xl'>
                <TextGenerateEffect words={words} />
            </div>
        </div>
    );
}