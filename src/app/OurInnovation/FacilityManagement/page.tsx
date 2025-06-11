"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { HamBurger } from "@/components/HamBurger";
import { useScroll, useTransform } from "motion/react";
import React from "react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";

// ✅ Helper to reuse DeviceFrameset with image
const renderMacbookDashboard = (imgSrc: string) => (
    <div className="flex justify-center">
        <DeviceFrameset device="MacBook Pro" width={800} height={500}>
            <Image src={imgSrc} alt="Dashboard" width={800} height={500} />
        </DeviceFrameset>
    </div>
);

// ✅ Content array with reusable frame
const content = [
    {
        title: "DashBoard",
        description:
            "By definition, a CMMS is a type of software designed to centralize maintenance information and streamline maintenance operations. " +
            "Manage multi-location, day-to-day maintenance life cycles. " +
            "Optimize asset utilization. " +
            "Gain insights into real-time performance data. " +
            "Employ an ecosystem approach. " +
            "Bridge the gaps between maintenance, reliability, and operations. " +
            "Be intuitive for every employee to use.",
        content: (<div className="bg-[#0f172a] flex items-center justify-center">
            <DeviceFrameset
                device="MacBook Pro"
                color="black"
                width={300}
                height={100} 
            >
                <div className="relative w-full h-full">
                    <Image
                        src="/FacilityManagement/Dashboard.png"
                        alt="Dashboard"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                    />
                </div>
            </DeviceFrameset>
        </div>),
    },
    {
        title: "Asset Management",
        description:
            "Boost productivity with our CMMS software, and gain robust insights to manage the full asset life cycle. With Urest's asset management solution, you can even automate preventive maintenance tasks on your mobile device, so you can keep business running smoothly all the time.",
        content: renderMacbookDashboard("/FacilityManagement/Dashboard.png"),
    },
    {
        title: "Inventory Management",
        description:
            "Reduce parts costs with an accurate inventory count, and direct the savings into growing your business. With powerful insights, you can better control costs, standardize maintenance, and ensure sufficient stock supply. Easily oversee parts consumption, purchasing, and more with Urest’s inventory management solution to boost your cash flow and optimize resources.",
        content: renderMacbookDashboard("/FacilityManagement/Dashboard.png"),
    },
    {
        title: "Complain Management",
        description:
            "Resolve Issues Faster and Keep Customers Happy with Smarter Complaint Management. Turn customer complaints into growth opportunities with Urest’s streamlined complaint management solution. Gain full visibility into issues, response times, and resolution progress to ensure nothing falls through the cracks. With actionable insights, you can identify recurring problems, standardize responses, and improve service quality.",
        content: renderMacbookDashboard("/FacilityManagement/Dashboard.png"),
    },
];

export default function FacilityManagement() {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
    const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
    const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
    const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
    const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

    return (
        <div className="py-10">
            {/* Navbar */}
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

            {/* Hero Section with Scroll Effect */}
            <div
                className="h-[100vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative pt-20 overflow-clip"
                ref={ref}
            >
                <GoogleGeminiEffect
                    pathLengths={[
                        pathLengthFirst,
                        pathLengthSecond,
                        pathLengthThird,
                        pathLengthFourth,
                        pathLengthFifth,
                    ]}
                />
            </div>

            {/* Sticky Scroll Content */}
            <div className="text-left px-20 mt-4">
                <StickyScroll content={content} />
            </div>
        </div>
    );
}
