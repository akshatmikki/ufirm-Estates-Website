"use client";
import Link from "next/link";
import { NavBar } from "../../components/NavBar";
import FacilityManagement from "./FacilityManagement/page";
import Image from "next/image";
import { HamburgerMenu } from "../../components/Hamburger";

export default function OurInnovation() {
    return (
        <div>
            <div className="absolute top-1 left-0 w-full z-50 ">
                <div className="flex items-center justify-between px-4 mt-1">
                    <Link href="/">
                        <Image className="dark:invert mt-9"
                            src={"/UFIRM ESTATES LOGO.webp"} alt={"UFIRM ESTATES LOGO"} width={100} height={100} />
                    </Link>
                    <div className="block lg:hidden">
                        <HamburgerMenu />
                    </div>

                    <div className="hidden lg:block">
                        <NavBar />
                    </div>
                </div>
            </div>
            <div >
                <FacilityManagement />
            </div>
        </div>
    );
}