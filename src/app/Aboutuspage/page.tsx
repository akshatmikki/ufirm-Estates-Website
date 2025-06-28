"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import {
    FaBuilding,
    FaHandshake,
    FaUsersCog,
    FaAward,
    FaGlobeAsia,
    FaMicrochip,
    FaUsers,
    FaGlobe,
    FaCoins,
} from "react-icons/fa";
import { NavBar } from "../../components/NavBar";

export default function AboutusPage() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const roadmapSteps = [
        {
            year: "2000",
            title: "Founded",
            desc: "Omkar Nests Pvt. Ltd. established, focusing on quality residential development in Delhi NCR.",
        },
        {
            year: "2008",
            title: "Royal Nest Expansion",
            desc: "Expanded to Amritsar and Dharamshala, launching multiple high-rise and gated projects.",
        },
        {
            year: "2016",
            title: "UFIRM Technologies Launched",
            desc: "Introduced tech-enabled real estate care with smart solutions under UREST and UFIRM Estates.",
        },
        {
            year: "2022",
            title: "Award-Winning Growth",
            desc: "Received national recognition for excellence in infrastructure and on-time delivery.",
        },
        {
            year: "2025",
            title: "Vision 2025",
            desc: "Targeting pan-India smart city integrations with AI-based facility platforms and new regional offices.",
        },
    ];

    return (
        <div className="bg-white text-gray-800">
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

            <div className="relative">
                <Image
                    src="/Aboutus.jpg"
                    alt="About Banner"
                    width={1600}
                    height={900}
                    className="w-full h-[80vh] object-fill"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center px-10">
                    <div className="text-white max-w-xl">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">We Are UFIRM</h1>
                        <p className="text-xl">Powering smart living through technology, real estate, and infrastructure excellence.</p>
                    </div>
                </div>
            </div>

            <section className="text-black py-20 text-center px-6 md:px-20 bg-[#f8f8ff]">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Built on Trust. Driven by Innovation.</h2>
                <p className="text-lg max-w-4xl mx-auto">
                    UFIRM is the powerhouse behind <span className="font-bold text-[#146995]">Royal Nest</span>,
                    <span className="font-bold text-[#146995]"> UREST Facility Management</span>, and
                    <span className="font-bold text-[#146995]"> UFIRM Estates</span>.
                    Together, we shape better communities and enable smarter property experiences.
                </p>
            </section>

            <section className="py-20 px-6 md:px-20 bg-gray-50">
                <div className="text-center mb-14">
                    <h2 className="text-5xl font-bold text-black">Our Legacy</h2>
                    <p className="text-lg max-w-3xl mx-auto mt-4">
                        From our roots in Delhi NCR, we&apos;ve delivered 8M+ sq. ft. across 4 states. Backed by 100% delivery and award-winning quality.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-10">
                    <Feature icon={<FaBuilding />} title="8M+ Sq. Ft. Built" desc="Housing & commercial hubs across NCR, Punjab, HP & J&K" />
                    <Feature icon={<FaHandshake />} title="100% On-Time Delivery" desc="Projects delivered with absolute commitment." />
                    <Feature icon={<FaAward />} title="Nationally Awarded" desc="Recognized across platforms for excellence and ethics." />
                </div>
            </section>

            <section className="py-20 px-6 md:px-20">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-bold text-black">Expansion Backed by Vision</h2>
                        <p className="text-lg">
                            Since our inception in 2000 under Omkar Nests Pvt. Ltd., we&apos;ve scaled with integrity.
                            Our footprint extends across:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Delhi NCR</li>
                            <li>Amritsar, Punjab</li>
                            <li>Dharamshala, Himachal Pradesh</li>
                            <li>Jammu & Kashmir</li>
                        </ul>
                    </div>
                    <div className="md:w-1/2 grid grid-cols-2 gap-4 mt-10 md:mt-0">
                        {["/Aboutus/jammu.jpeg", "/Aboutus/Gn.jpg", "/Aboutus/Dharamshala.webp", "/Aboutus/Amritsar.png"].map((src, i) => (
                            <Image
                                key={i}
                                src={src}
                                alt={`project-${i}`}
                                width={300}
                                height={200}
                                className="rounded-xl shadow-xl hover:scale-105 transition-transform duration-300"
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 md:px-20 bg-[#e6f3f8]">
                <div className="text-center mb-14">
                    <h2 className="text-5xl font-bold text-black">Our Divisions</h2>
                    <p className="text-lg max-w-3xl mx-auto mt-4">
                        From sales to service to smart solutions — every UFIRM arm is dedicated to excellence.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-10 p-4">
                    <Link href="https://urest.in/">
                    <Feature
                        icon={<FaUsersCog />}
                        title="UREST Facility Management"
                        desc="Comprehensive green building services, a highly skilled workforce, and advanced preventive maintenance solutions — all powered by Urest.in."
                    />
                    </Link>
                    <Link href="/RoyalNestPage">
                    <Feature
                        icon={<FaBuilding />}
                        title="Royal Nest Projects"
                        desc="Flagship residential brand offering gated communities and high-rises across North India, known for quality, timely delivery, and smart planning."
                    />
                    </Link>
                    <Link href="/OurInnovation">
                    <Feature
                        icon={<FaMicrochip />}
                        title="UFIRM Technologies"
                        desc="Tech-driven platform powering smart property management, green maintenance, and AI-enabled facility services across India."
                    />
                    </Link>
                    <Link href="/Management&advisory">
                    <Feature
                        icon={<FaGlobeAsia />}
                        title="UFIRM Estates"
                        desc="Your trusted partner in premium sales, leasing & brokerage. Unlocking commercial & residential opportunities with ease."
                    />
                    </Link>
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

            <section className="bg-white py-10 ">
                <h2 className="text-3xl font-bold text-black mb-12 text-center">UFIRM Roadmap</h2>
                <div className="w-full overflow-x-auto">
                    <div className="relative inline-block">
                        <div className="min-w-[1600px] relative z-10">
                            <div className="flex gap-10 px-10">
                                {roadmapSteps.map((item, idx) => (
                                    <div key={idx} className="w-[300px] shrink-0">
                                        {item.title && (
                                            <span className="text-xs text-white font-bold bg-yellow-700 px-2 py-1 rounded uppercase">
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
            </section>

            <section className="py-20 text-center bg-[#e6f3f8] text-black px-6">
                <h2 className="text-4xl font-bold mb-4">24+ Years of Real Estate Excellence</h2>
                <p className="text-lg max-w-xl mx-auto mb-6">
                    Whether you&apos;re buying, leasing, or maintaining — choose UFIRM for trust, technology, and transformation.
                </p>
                <Link href="/ContactPage">
                    <button className="bg-white text-[#146995] font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition">
                        Get in Touch
                    </button>
                </Link>
            </section>
        </div>
    );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border border-gray-100">
            <div className="text-[#146995] text-5xl mb-4">{icon}</div>
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-base">{desc}</p>
        </div>
    );
}