"use client";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { WavyBackground } from "@/components/ui/Wavy-background";
import Image from "next/image";
import { HamburgerMenu } from "@/components/Hamburger";

export default function ProductPage() {
    return (
        <>
            <div className="absolute top-1 left-0 w-full z-50">
                <div className="flex items-center justify-between px-4 mt-1">
                    <Link href="/">
                        <Image className="dark:invert mt-9"
                            src={"/UFIRM ESTATES LOGO.svg"} alt={"UFIRM ESTATES LOGO"} width={100} height={100} />
                    </Link>
                    <div className="block lg:hidden">
                        <HamburgerMenu />
                    </div>

                    <div className="hidden lg:block">
                        <NavBar />
                    </div>
                </div>
            </div>
            <WavyBackground className="max-w-4xl mx-auto pb-40">
                <p className="text-2xl md:text-4xl lg:text-6xl text-white font-bold inter-var text-center mt-40">
                    Our Products
                </p>
            </WavyBackground>
        </>
    );

}