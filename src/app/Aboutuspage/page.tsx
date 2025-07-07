"use client";

import React, { useEffect } from "react";
import type { JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    FaBuilding,
    FaUsersCog,
    FaGlobeAsia,
    FaMicrochip,
    FaUsers,
    FaGlobe,
    FaCoins,
    FaChartLine, FaCogs, FaTools,
} from "react-icons/fa";
import { NavBar } from "../../components/NavBar";
import ClientCarousel from "@/components/ClientCarousel";
import SVGComponent from "../../components/Ufirm_estates";
import { HamburgerMenu } from "../../components/Hamburger";

export default function AboutusPage() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const roadmapSteps = [
        {
            year: "2016",
            title: "Incorporation",
            desc: "Incorporated from Royal Nest’s 25-year legacy; began delivering sustainable real estate services.",
        },
        {
            year: "2018",
            title: "Business Park Launch",
            desc: "Launched UFIRM Business Park, a professional co-working and flex-office space spanning 80,000+ ft².",
        },
        {
            year: "2020",
            title: "Urest.in IFM Launch",
            desc: "Established Urest.in as a dedicated Integrated Facility Management division, proving effectiveness during COVID-19 lockdowns.",
        },
        {
            year: "2022",
            title: "Green Residential Development",
            desc: "Commenced ‘Royal Nest Forest View’ in Dharamshala – green-compliant, RERA & TCP approved residential apartments.",
        },
        {
            year: "2024",
            title: "Tech Platform Deployment",
            desc: "Deployed 100% Made-in-India CMMS platform for real-time PPM, asset, inventory & workforce management.",
        },
        {
            year: "2025",
            title: "Profitability & Growth",
            desc: "Achieved company-wide profitability (EBIT margin 4.03%) with 76.64% YoY revenue growth.",
        },
    ];

    const iconMap: { [key: string]: JSX.Element } = {
        "BUILD – Projects": <FaBuilding className="text-white text-xl" />,
        "Estate Advisory": <FaChartLine className="text-white text-xl" />,
        "Facility Management": <FaTools className="text-white text-xl" />,
        "Estate Technology": <FaCogs className="text-white text-xl" />,
    };

    function Vision2030Card({
        category,
        target,
    }: {
        category: string;
        target: string;
    }) {
        return (
            <div
                data-aos="fade-up"
                className="bg-[#e6f3f8] p-6 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-[#146995] p-3 rounded-full w-12 h-12 flex items-center justify-center">
                        {iconMap[category]}
                    </div>
                    <h3 className="text-xl font-semibold text-[#146995]">{category}</h3>
                </div>
                <p className="text-gray-800">{target}</p>
            </div>
        );
    }

    const vision2030 = {
        title: "Vision 2030",
        desc: "By 2030, UFIRM aims to be India’s most trusted, tech-enabled, and sustainable real estate services company, delivering value across build, manage, maintain, and enhance verticals.",
        goals: [
            {
                category: "BUILD – Projects",
                target: "Estate development portfolio to grow by 100%.",
            },
            {
                category: "Estate Advisory",
                target: "Manage and enable sales of real estate assets worth ₹100+ Crores.",
            },
            {
                category: "Facility Management",
                target: "urest.in to achieve 120% revenue growth in integrated facility management and manpower outsourcing. ",
            },
            {
                category: "Estate Technology",
                target: "Launch 3 globally accessible technology and ESG tools for smarter estate construction, maintenance & management. ",
            },
        ],
    };

    return (
        <div className="bg-white text-gray-800">
            <div className="absolute top-1 left-0 w-full z-50">
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

            <div className="relative">
                <Image
                    src="/Aboutus.jpg"
                    alt="About Banner"
                    width={1600}
                    height={900}
                    className="w-full h-[60vh] sm:h-[50vh] lg:h-[80vh]  object-fill"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center px-10">
                    <div className="text-white max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">We Are UFIRM</h1>
                        <p className="text-xl">Purpose-driven real estate services company committed to building, managing, maintaining, and enhancing real estate for <strong>People, Planet & Profits</strong>.</p>
                    </div>
                </div>
            </div>

            <section className="p-10 px-20">
                <p className="text-lg">
                    Founded in 2016 as an extension of the Royal Nest Group—with over 25 years of legacy and 8 million sq. ft. of successfully delivered residential and commercial projects—Ufirm now integrates four synergistic divisions under one roof.
                </p>
            </section>

            <section className="py-10 px-6 md:px-20 bg-[#e6f3f8]">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-bold text-black">Our Divisions</h2>
                    <p className="text-lg max-w-3xl mx-auto mt-4">
                        From sales to service to smart solutions — every UFIRM arm is dedicated to excellence.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-10 p-4">
                    <Link href="https://urest.in/">
                        <Feature
                            icon={<FaUsersCog />}
                            title="MAINTAIN – Facility Management"
                            meaning='UREST.IN manages 95+ million ft² estates across India'
                            deliverables='Maintenance, housekeeping, security, energy & water mgmt.'
                        />
                    </Link>
                    <Link href="/RoyalNestPage">
                        <Feature
                            icon={<FaBuilding />}
                            title="BUILD – Projects"
                            meaning="Complete lifecycle of project development with green building focus"
                            deliverables='Feasibility → Design → Construction → Handover'
                        />
                    </Link>
                    <Link href="/OurInnovation">
                        <Feature
                            icon={<FaMicrochip />}
                            title="ENHANCE – Estate Technology"
                            meaning='In-house CMMS & IoT for smarter, safer buildings'
                            deliverables='Digital PPM, asset health, helpdesk, ESG dashboards'
                        />
                    </Link>
                    <Link href="/Management&advisory">
                        <Feature
                            icon={<FaGlobeAsia />}
                            title="MANAGE – Estate Advisory"
                            meaning='Comprehensive strategic & financial advisory services for asset owners'
                            deliverables='Market analysis, leasing strategy, CAPEX/OPEX optimization'
                        />
                    </Link>
                </div>
            </section>

            <section className="bg-white py-10">
                <h2 className="text-5xl font-bold text-black mb-15 text-center">
                    UFIRM Roadmap
                </h2>

                <div className="w-full overflow-x-auto custom-scrollbar hidden md:block">
                    <div className="relative inline-block">
                        <div className="min-w-[1600px] relative z-10">
                            <div className="flex gap-10 px-10">
                                {roadmapSteps.map((item, idx) => (
                                    <div key={idx} className="w-[300px] shrink-0">
                                        {item.title && (
                                            <span className="text-xs text-white font-bold bg-blue-500 px-2 py-1 rounded uppercase">
                                                {item.title}
                                            </span>
                                        )}
                                        <h3 className="text-xl font-bold mt-2">{item.year}</h3>
                                        <p className="text-gray-700 mt-2">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex overflow-hidden h-[200px]">
                                {[...Array(10)].map((_, i) => (
                                    <img
                                        key={i}
                                        src="/Aboutus/skyline.jpg"
                                        alt="Skyline"
                                        className="h-full object-contain"
                                        style={{ flexShrink: 0 }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full md:hidden max-h-[500px] overflow-y-auto">
                    <div className="flex flex-row items-stretch h-full">
                        <div className="w-full flex flex-col gap-6 px-4 py-4">
                            {roadmapSteps.reverse().map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="w-full">
                                        {item.title && (
                                            <span className="text-xs text-white font-bold bg-blue-500 px-2 py-1 rounded uppercase w-full">
                                                {item.title}
                                            </span>
                                        )}
                                        <h3 className="text-lg font-bold mt-1">{item.year}</h3>
                                        <p className="text-gray-700 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="w-1/2">
                            <img
                                src="/Aboutus/building.png"
                                alt="Building"
                                className="w-full h-full object-fill"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-15 px-6 md:px-20 bg-white text-black">
                <div className="text-center mb-10">
                    <h2 className="text-5xl font-bold text-black">{vision2030.title}</h2>
                    <p className="text-lg mt-4 max-w-3xl mx-auto text-gray-700">{vision2030.desc}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 p-10">
                    {vision2030.goals.map((goal, index) => (
                        <Vision2030Card
                            key={index}
                            category={goal.category}
                            target={goal.target}
                        />
                    ))}
                </div>
            </section>

            <section className="py-20 px-6 md:px-20 bg-gradient-to-br from-[#e6f3f8] via-white to-[#e6f3f8] text-black">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-bold">Our Vision & Mission</h2>
                    <p className="text-gray-700 text-lg mt-4 font-medium">We deeply care for...</p>
                    <div className="flex justify-center gap-8 mt-2">

                        <div className="flex flex-col items-center">
                            <FaUsers className="text-[#146995] text-4xl mb-2" />
                            <span className="text-sm font-semibold text-gray-600">People</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaGlobe className="text-green-600 text-4xl mb-2" />
                            <span className="text-sm font-semibold text-gray-600">Planet</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <FaCoins className="text-yellow-500 text-4xl mb-2" />
                            <span className="text-sm font-semibold text-gray-600">Profits</span>
                        </div>
                    </div>
                </div>

                <div className="mb-12 bg-white/70 p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: "#146995" }}>VISION</h3>
                    <h4 className="text-xl font-semibold mb-3">“Manage, Maintain, Enhance Estates”</h4>
                    <p className="text-gray-800 leading-relaxed">
                        We manage, maintain, and enhance estates with a focus on people, process, sustainability and technology.
                        We start by building a strong partnership with clients to ensure seamless facility management.
                        Next, we provide comprehensive maintenance to keep everything running smoothly.
                        Finally, we enhance each property by integrating smart solutions and green building practices
                        to elevate its value, sustainability and performance.
                    </p>
                </div>

                <div className="bg-white/70 p-6 rounded-xl shadow-lg">
                    <h3 className="text-2xl font-bold mb-2" style={{ color: "#146995" }}>MISSION</h3>
                    <h4 className="text-xl font-semibold mb-3">
                        “On mission to manage, maintain, and enhance estates while caring for people, planet, and profits.”
                    </h4>
                    <p className="text-gray-800 leading-relaxed">
                        Create value by consciously managing, maintaining, and enhancing estates.
                        We focus on building strong client relationships, providing efficient maintenance,
                        and improving properties through smart, sustainable solutions.
                        By caring for People, protecting the Planet, and driving Profits, we ensure long-term success
                        and positive impact for all our stakeholders.
                    </p>
                </div>
            </section>
            <ClientCarousel />
        </div>
    );
}

function Feature({ icon, title, meaning, deliverables }: { icon: React.ReactNode; title: string; meaning: string; deliverables: string }) {
    return (
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">
            <div className="text-[#146995] text-5xl mb-4">{icon}</div>
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-700 mb-1"><strong>Meaning:</strong> {meaning}</p>
            <p className="text-gray-700"><strong>Deliverables:</strong> {deliverables}</p>
        </div>
    );
}