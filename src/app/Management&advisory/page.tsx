"use client";
import { TextGenerateEffect } from '@/components/ui/textgeneratoreffect';
import ClientCarousel from "@/components/ClientCarousel";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";

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
                    <NavBar />
                </div>
            </div>
            <div className='text-center mt-40 mb-40 text-7xl text-black dark:text-black'>
                <TextGenerateEffect words={words} />
            </div>
            <ClientCarousel />
        </div>
    );
}