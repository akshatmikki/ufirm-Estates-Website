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

            {/* Banner Section */}
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
                        <h1 className="text-3xl font-bold mb-4 text-black">
                            Work With Us / हमारे साथ काम करें
                        </h1>
                        <p className="text-lg text-gray-700">
                            Be a part of a culture of growth, innovation, and excellence. <br />
                            सीखने, नए आइडिया और अच्छा काम करने के माहौल का हिस्सा बनें।
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Tabs */}
            <div className="sticky top-0 z-40 bg-white">
                <div className="flex justify-center gap-4 py-4">
                    {["hire", "job"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as "welcome")}
                            className={clsx(
                                "px-4 py-2 rounded font-semibold capitalize transition",
                                activeTab === tab
                                    ? "bg-yellow-500 text-white shadow"
                                    : "bg-gray-200 text-gray-700 hover:bg-yellow-200"
                            )}
                        >
                            {tab === "hire" ? "Hire Now / स्टाफ भर्ती करें" : "Get a Job / नौकरी पाएं"}
                        </button>
                    ))}
                </div>
            </div>

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
                                Welcome to <strong>UFirm Hiring Portal !</strong> We're glad you're here.
                            </p>
                            <p className="mb-4">
                                Whether you're a company hiring staff or someone looking for a good job — we can help.
                            </p>
                            <Image src="/Hire.jpeg" alt="hire" width={1000} height={500} className="rounded rounded-full"/>
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
                            <h2 className="text-3xl font-bold mb-4">Hire Trained Facility Staff</h2>
                            <p className="text-lg mb-6">
                                UFirm offers skilled, verified manpower for your technical and soft service needs. <br />
                                UFirm आपको काम के लिए अच्छे और जांचे-परखे कर्मचारी देता है।
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
                                {/* What We Provide */}
                                <div className="bg-yellow-50 p-6 rounded shadow hover:shadow-lg transition">
                                    <h3 className="font-semibold text-lg mb-2">
                                        What We Provide / हम क्या प्रदान करते हैं
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>
                                            Facility Staff<br />
                                        </li>
                                        <li>
                                            Electricians & Plumbers <br />
                                        </li>
                                        <li>
                                            HVAC Technicians <br />
                                        </li>
                                        <li>
                                            Housekeeping & Support Staff<br />
                                        </li>
                                        <li>
                                            Safety & Compliance Officers  <br />
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 p-6 rounded shadow hover:shadow-lg transition">
                                    <h3 className="font-semibold text-lg mb-2">
                                        Why UFirm? / UFirm क्यों चुनें?
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                                        <li>
                                            Professionally trained staff <br />
                                        </li>
                                        <li>
                                            Background verified workers <br />
                                        </li>
                                        <li>
                                            Flexible hiring – short or long term <br />
                                        </li>
                                        <li>
                                            Services available across India <br />
                                        </li>
                                        <li>
                                            Quick and easy onboarding process <br />
                                        </li>
                                    </ul>
                                </div>
                            </div>


                            <button className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-lg transition">
                                Request Staff / स्टाफ मांगें
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
                            <h2 className="text-center text-3xl font-bold mb-4">Open Positions / उपलब्ध नौकरियाँ</h2>
                            <hr className="w-16 border-t-2 border-yellow-500 mx-auto mb-8" />
                            <input
                                type="text"
                                placeholder="Search Job Title or Skills / नौकरी या कौशल खोजें"
                                className="w-full px-4 py-2 rounded-md mb-6 text-black bg-white border border-gray-300"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {filteredJobs.length === 0 && (
                                <p className="text-center text-gray-500">
                                    No jobs found / कोई नौकरी नहीं मिली।
                                </p>
                            )}
                            {filteredJobs.map((job, idx) => (
                                <motion.div
                                    key={idx}
                                    className="bg-white text-black p-6 rounded-md shadow mb-6 hover:shadow-lg transition"
                                >
                                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                                    <p className="text-sm mb-2">{job.type}</p>
                                    <p className="text-sm mb-1">Posted on {job.posted} / पोस्ट की गई: {job.posted}</p>
                                    <p className="text-sm mb-1">Closes on {job.closes} / अंतिम तिथि: {job.closes}</p>
                                    <p className="text-sm mb-1">Experience: {job.experience} / अनुभव: {job.experience}</p>
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
                                        Apply Now / अभी फार्म भरें
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
