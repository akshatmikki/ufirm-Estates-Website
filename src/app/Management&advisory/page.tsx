"use client";

import { motion } from "framer-motion";
import { FaBuilding, FaHome, FaTools, FaTree } from "react-icons/fa";
import ClientCarousel from "@/components/ClientCarousel";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";

const services = [
    {
        icon: <FaBuilding size={28} className="text-blue-300" />,
        title: "Property Management",
        description:
            "We manage investor-owned commercial properties and turn them into high-return business parks. From branding to leasing and daily operations—we take care of it all.",
    },
    {
        icon: <FaHome size={28} className="text-amber-900" />,
        title: "Property Sale",
        description:
            "We drive sales for residential and commercial projects through ethical and targeted strategies, ensuring a smooth journey from site visit to registration.",
    },
    {
        icon: <FaTools size={28} className="text-black" />,
        title: "Interiors & Renovation",
        description:
            "With 25+ years of experience, we transform homes and commercial buildings with stunning, durable, and technically excellent renovations.",
    },
    {
        icon: <FaTree size={28} className="text-green-500" />,
        title: "Estate & Landscape Development",
        description:
            "We design and maintain green zones, gardens, and spaces that enhance the aesthetic and functional value of your property.",
    },
];

export default function Managementadvisory() {
    return (
        <div>
            {/* Header */}
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

            <main className="bg-white text-gray-900">
                <div className="relative">
                    <div className="relative w-full h-[80vh]">
                        <Image
                            src="/Estate.jpg"
                            alt="Estate Banner"
                            width={1600}
                            height={900}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center p-10 flex-col">
                        <motion.h1
                            className="text-4xl md:text-5xl font-bold text-white"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            Welcome to UFIRM Estates
                        </motion.h1>
                        <p className="mt-4 text-lg md:text-xl text-white max-w-3xl mx-auto">
                            Your trusted real estate advisory partner offering expert services across India.
                        </p>
                        <motion.div
                            className="absolute top-0 right-0 w-32 h-32 md:w-52 md:h-52 bg-blue-200 rounded-full blur-3xl opacity-30"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 6, repeat: Infinity }}
                        />
                    </div>
                </div>
                
                <section className="px-6 md:px-20 py-10 text-center">
                    <motion.p
                        className="text-lg leading-relaxed text-gray-700"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        From selling residential and commercial projects to transforming properties into income-generating assets, we provide honest, experienced, and result-driven solutions. Our team works with developers, investors, NRIs, and businesses across Delhi NCR, Himachal Pradesh, Jammu & Kashmir, and beyond.
                    </motion.p>
                </section>

                <section className="px-6 md:px-20 py-16 bg-gray-50">
                    <h2 className="text-3xl font-bold text-black mb-12 text-center">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="hover:shadow-2xl transition-shadow rounded-2xl bg-white shadow-md border p-6 h-full"
                            >
                                <div className="space-y-4">
                                    <div className="mb-4">{service.icon}</div>
                                    <h3 className="text-xl font-bold mb-2 text-black">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="px-6 md:px-20 py-20 text-center relative">
                    <motion.h2
                        className="text-3xl font-bold text-black mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Why UFIRM Estates?
                    </motion.h2>
                    <motion.p
                        className="text-gray-700 text-lg max-w-4xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        We combine decades of experience, strong networks, and local market understanding to deliver real estate solutions that are profitable, transparent, and personalized. From single assets to multi-phase projects, our commercial logic and design sensitivity drive meaningful outcomes.
                    </motion.p>
                    <motion.div
                        className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-amber-100 rounded-full blur-2xl opacity-20"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                </section>
            </main>

            <ClientCarousel />

        </div>
    );
}
