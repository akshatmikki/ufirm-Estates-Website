"use client";
import Link from "next/link";
import { NavBar } from "../../components/NavBar";
import FacilityManagement from "./FacilityManagement/page";
import SVGComponent from "../../components/Ufirm_estates";
import { HamburgerMenu } from "../../components/Hamburger";

export default function OurInnovation() {
    return (
        <div>
            <div className="absolute top-1 left-0 w-full z-50 ">
                <div className="flex items-center justify-between px-4 mt-1">
                    <Link href="/">
                        <SVGComponent
                            className="w-16 h-16 sm:w-23 sm:h-23 md:w-26 md:h-26 lg:w-28 lg:h-28"
                        />
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