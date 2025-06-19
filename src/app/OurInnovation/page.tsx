"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "../../components/NavBar";
// import { HamBurger } from "../../components/HamBurger";
import FacilityManagement from "./FacilityManagement/page";

export default function OurInnovation() {
    return (
        <div>
            <div className="absolute top-1 left-0 w-full z-50 ">
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
            <div >
                <FacilityManagement />
            </div>
        </div>
    );
}