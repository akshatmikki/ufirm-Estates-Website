"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function CareersPage() {
    const [activeTab, setActiveTab] = useState<"welcome" | "hire" | "job">("welcome");
    const [search, setSearch] = useState("");

    const jobs = [
        {
            title: "Safety Officer",
            type: "Full Time",
            posted: "7th Jan 2025",
            closes: "31st Dec 2025",
            experience: "5 - 10 Years",
            company: "UFirm",
            department: "Facility Management",
            designation: "Safety Officer",
        },
    ];

    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white text-black">
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

            {/* Hero */}
            <div className="relative">
                <Image
                    src="/Career.jpg"
                    alt="Career Banner"
                    width={1600}
                    height={900}
                    className="w-full h-[80vh] object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-start p-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="bg-white/90 shadow-xl p-8 rounded text-center max-w-md"
                    >
                        <h1 className="text-3xl font-bold mb-4 text-black">Work With Us</h1>
                        <hr className="w-16 border-t-2 border-yellow-500 mx-auto mb-4" />
                        <p className="text-lg text-gray-700">
                            Be a part of a culture of growth, innovation, and excellence.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Tab Buttons */}
            <div className="sticky top-0 z-40 bg-white">
                <div className="flex justify-center gap-4 py-4">
                    {[ "hire", "job"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={clsx(
                                "px-4 py-2 rounded font-semibold capitalize transition",
                                activeTab === tab
                                    ? "bg-yellow-500 text-white shadow"
                                    : "bg-gray-200 text-gray-700 hover:bg-yellow-200"
                            )}
                        >
                            {tab === "hire" ? "Hire Now" : "Get a Job"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Animated Tab Content */}
            <div className="px-6 py-10 min-h-[60vh]">
                <AnimatePresence mode="wait">
                    {activeTab === "welcome" && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="text-center text-xl max-w-3xl mx-auto"
                        >
                            <p className="mb-4">
                                Welcome to <strong>UFirm Careers</strong>! We're glad you're here.
                            </p>
                            <p>
                                Whether you're a company looking to build a strong team or a candidate aiming to grow
                                your career, we have something for you. Click on "Hire Now" to hire employees or "Get a
                                Job" to explore openings.
                            </p>
                        </motion.div>
                    )}

                    {activeTab === "hire" && (
                        <motion.div
                            key="hire"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-4xl mx-auto text-center text-gray-800"
                        >
                            <h2 className="text-3xl font-bold mb-4">Hire Trained Maintenance & Facility Staff</h2>
                            <p className="text-lg mb-6">
                                UFirm provides reliable, professional manpower across all technical and soft services to
                                support your business operations without the hassle of hiring.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
                                <div className="bg-yellow-50 p-6 rounded shadow hover:shadow-lg transition">
                                    <h3 className="font-semibold text-lg mb-2">What We Provide</h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>Facility Management Staff</li>
                                        <li>Electricians & Plumbers</li>
                                        <li>HVAC Technicians</li>
                                        <li>Housekeeping & Support Staff</li>
                                        <li>Safety & Compliance Officers</li>
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 p-6 rounded shadow hover:shadow-lg transition">
                                    <h3 className="font-semibold text-lg mb-2">Why Choose UFirm?</h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>Professionally Trained Resources</li>
                                        <li>Background Verified</li>
                                        <li>Flexible Staffing (Short & Long Term)</li>
                                        <li>Pan India Coverage</li>
                                        <li>Quick Onboarding</li>
                                    </ul>
                                </div>
                            </div>

                            <button className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-lg transition">
                                Request Staff
                            </button>
                        </motion.div>
                    )}

                    {activeTab === "job" && (
                        <motion.div
                            key="job"
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-3xl mx-auto text-black"
                        >
                            <h2 className="text-center text-3xl font-bold mb-4">Open Positions</h2>
                            <hr className="w-16 border-t-2 border-yellow-500 mx-auto mb-8" />
                            <input
                                type="text"
                                placeholder="Search Job Title or Skills"
                                className="w-full px-4 py-2 rounded-md mb-6 text-black bg-white border border-gray-300"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {filteredJobs.length === 0 && (
                                <p className="text-center text-gray-500">No jobs found.</p>
                            )}
                            {filteredJobs.map((job, idx) => (
                                <motion.div
                                    key={idx}
                                    className="bg-white text-black p-6 rounded-md shadow mb-6 hover:shadow-lg transition"
                                >
                                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                    <p className="text-sm mb-2">{job.type}</p>
                                    <p className="text-sm mb-1">Posted on {job.posted}</p>
                                    <p className="text-sm mb-1">Closes on {job.closes}</p>
                                    <p className="text-sm mb-1">Experience: {job.experience}</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                            Company: {job.company}
                                        </span>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                            Department: {job.department}
                                        </span>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                            Designation: {job.designation}
                                        </span>
                                    </div>
                                    <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
                                        Apply Now
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
