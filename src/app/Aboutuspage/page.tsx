"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FaBuilding, FaHandshake, FaUsersCog, FaAward, FaGlobeAsia, FaMicrochip } from "react-icons/fa";
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

    const [activeStep, setActiveStep] = useState(0);

    return (
        <div className="bg-white text-gray-800">
            <div className="absolute top-1 left-0 w-full z-50">
                <div className="flex items-center justify-between px-4 mt-1">
                    <Link href="/">
                        <Image
                            src="/UFIRM ESTATES LOGO.png"
                            alt="logo"
                            width={120}
                            height={60}
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
                <p className="text-lg max-w-3xl mx-auto">
                    UFIRM is the powerhouse behind <span className="font-semibold text-yellow-300">Royal Nest</span>,
                    <span className="font-semibold text-yellow-300"> UREST Facility Management</span>, and
                    <span className="font-semibold text-yellow-300"> UFIRM Estates</span>.
                    Together, we shape better communities and enable smarter property experiences.
                </p>
            </section>

            {/* Legacy Section */}
            <section className="py-20 px-6 md:px-20 bg-gray-50">
                <div className="text-center mb-14">
                    <h2 className="text-5xl font-bold text-black">Our Legacy</h2>
                    <p className="text-lg max-w-3xl mx-auto mt-4">
                        From our roots in Delhi NCR, we’ve delivered 8M+ sq. ft. across 4 states. Backed by 100% delivery and award-winning quality.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-10">
                    <Feature icon={<FaBuilding />} title="8M+ Sq. Ft. Built" desc="Housing & commercial hubs across NCR, Punjab, HP & J&K" />
                    <Feature icon={<FaHandshake />} title="100% On-Time Delivery" desc="Projects delivered with absolute commitment." />
                    <Feature icon={<FaAward />} title="Nationally Awarded" desc="Recognized across platforms for excellence and ethics." />
                </div>
            </section>

            {/* Project Showcase */}
            <section className="py-20 px-6 md:px-20">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-bold text-black">Expansion Backed by Vision</h2>
                        <p className="text-lg">
                            Since our inception in 2000 under Omkar Nests Pvt. Ltd., we’ve scaled with integrity.
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

            {/* Subdivisions - Tech and Real Estate */}
            <section className="py-20 px-6 md:px-20 bg-purple-50">
                <div className="text-center mb-14">
                    <h2 className="text-5xl font-bold text-black">Our Divisions</h2>
                    <p className="text-lg max-w-3xl mx-auto mt-4">
                        From sales to service to smart solutions — every UFIRM arm is dedicated to excellence.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-10">
                    <Feature
                        icon={<FaGlobeAsia />}
                        title="UFIRM Estates"
                        desc="Your trusted partner in premium sales, leasing & brokerage. Unlocking commercial & residential opportunities with ease."
                    />
                    <Feature
                        icon={<FaUsersCog />}
                        title="UREST Facility Management"
                        desc="Green building services, skilled workforce & preventive maintenance, powered by Urest.in."
                    />
                    <Feature
                        icon={<FaBuilding />}
                        title="Royal Nest"
                        desc="Flagship residential brand offering gated communities and high-rises across North India, known for quality, timely delivery, and smart planning."
                    />
                    <Feature
                        icon={<FaMicrochip />}
                        title="UFIRM Technologies"
                        desc="Tech-driven platform powering smart property management, green maintenance, and AI-enabled facility services across India."
                    />
                </div>
            </section>
            
            <section className="bg-white py-20 px-6 md:px-20">
                <h2 className="text-3xl font-bold text-black mb-12 text-center">UFIRM Roadmap</h2>

                <div className="overflow-x-auto">
                    <div className="flex gap-6 min-w-full px-2 md:px-6 pb-4">
                        {roadmapSteps.map((step, index) => (
                            <div
                                key={index}
                                className="min-w-[250px] md:min-w-[300px] bg-purple-50 border border-purple-200 rounded-xl p-6 text-left shadow-md hover:shadow-xl transition duration-300"
                            >
                                <h3 className="text-xl font-bold text-black mb-2">{step.year} – {step.title}</h3>
                                <p className="text-gray-700 text-sm">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center bg-purple-50 text-black px-6">
                <h2 className="text-4xl font-bold mb-4">24+ Years of Real Estate Excellence</h2>
                <p className="text-lg max-w-xl mx-auto mb-6">
                    Whether you're buying, leasing, or maintaining — choose UFIRM for trust, technology, and transformation.
                </p>
                <Link href="/ContactPage">
                    <button className="bg-white text-purple-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition">
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
            <div className="text-purple-700 text-5xl mb-4">{icon}</div>
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-base">{desc}</p>
        </div>
    );
}

