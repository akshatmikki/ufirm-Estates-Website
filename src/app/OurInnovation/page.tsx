"use client";
import Link from "next/link";
import { NavBar } from "../../components/NavBar";
import FacilityManagement from "./FacilityManagement/page";
import SVGComponent from "../../components/Ufirm_estates";

export default function OurInnovation() {
    return (
        <div>
            <div className="absolute top-1 left-0 w-full z-50 ">
                <div className="flex items-center justify-between px-4 mt-1">
                    <Link href="/">
                        <SVGComponent className="w-28 h-27" />
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