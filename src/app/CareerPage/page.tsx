"use client";

import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
    FaTools,
    FaUserShield,
    FaWind,
    FaBroom,
    FaUserCheck,
    FaEnvelopeOpenText,
} from "react-icons/fa";

export default function CareersPage() {
    const [showResumeForm, setShowResumeForm] = useState(false);
    const [resumeName, setResumeName] = useState("");
    const [resumeEmail, setResumeEmail] = useState("");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState("welcome");
    const [search, setSearch] = useState("");

    const handleResumeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!resumeFile) return;

        const fileType = resumeFile.type;
        const fileSize = resumeFile.size;
        const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

        if (!validTypes.includes(fileType)) {
            alert("Please upload a valid resume file (PDF, DOC, DOCX).");
            return;
        }

        if (fileSize > 5 * 1024 * 1024) {
            alert("File size should not exceed 5MB.");
            return;
        }

        const formData = new FormData();
        formData.append("name", resumeName);
        formData.append("email", resumeEmail);
        formData.append("file", resumeFile);

        try {
            const res = await fetch("/api/upload-resume", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("Resume submitted successfully!");
                setShowResumeForm(false);
                setResumeName("");
                setResumeEmail("");
                setResumeFile(null);
            } else {
                alert("Failed to submit resume.");
            }
        } catch (error) {
            console.error("Resume submission error:", error);
            alert("An error occurred.");
        }
    };

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
        <div className="min-h-screen bg-white text-black px-4 sm:px-6 md:px-8">
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

            <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative text-center max-w-3xl mx-auto px-4 sm:px-6 mt-25 overflow-hidden"
            >
                <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: -10 }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "reverse",
                        duration: 6,
                        ease: "easeInOut",
                    }}
                    className="w-full"
                >
                    <Image
                        src="/hires.jpeg"
                        alt="hire"
                        width={2400}
                        height={700}
                        className="rounded-3xl w-full max-h-[300px] object-cover shadow-lg"
                    />
                </motion.div>

                <p className="mb-4 mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-yellow-600">
                    Join a Future-Focused Team with <span className="text-black">UFirm Hiring Portal!</span>
                </p>
                <p className="mb-2 text-base sm:text-lg text-gray-700">
                    Looking for a meaningful career opportunity? <strong>We’re hiring passionate professionals</strong> across multiple sectors.
                </p>
                <p className="text-sm text-gray-600 mb-6">
                    Whether you&apos;re actively job hunting or simply exploring, we welcome your resume.
                </p>
            </motion.div>

            <div className="sticky top-0 z-40 bg-white">
                <div className="flex flex-wrap justify-center gap-3 py-4 px-2">
                    {["hire", "job"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={clsx(
                                "px-4 py-2 rounded font-semibold capitalize transition text-sm sm:text-base",
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

            <div className="py-10">
                <AnimatePresence mode="wait">
                    {activeTab === "hire" && (
                        <motion.div
                            key="hire"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5 }}
                            className="max-w-4xl mx-auto text-center text-gray-800 px-2"
                        >
                            <h2 className="text-3xl font-bold mb-4">Hire Trained Facility Staff</h2>
                            <p className="text-lg mb-6">
                                UFirm offers skilled, verified manpower for your technical and soft service needs. <br />
                                UFirm आपको काम के लिए अच्छे और जांचे-परखे कर्मचारी देता है।
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 text-left mb-8">
                                <div className="bg-yellow-50 p-6 rounded shadow hover:shadow-lg transition">
                                    <h3 className="font-semibold text-lg mb-2">
                                        What We Provide / हम क्या प्रदान करते हैं
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700 space-y-4">
                                        <li><FaUserCheck className="inline mr-2 text-yellow-500" /> Facility Staff</li>
                                        <li><FaTools className="inline mr-2 text-yellow-500" /> Electricians & Plumbers</li>
                                        <li><FaWind className="inline mr-2 text-yellow-500" /> HVAC Technicians</li>
                                        <li><FaBroom className="inline mr-2 text-yellow-500" /> Housekeeping & Support Staff</li>
                                        <li><FaUserShield className="inline mr-2 text-yellow-500" /> Safety & Compliance Officers</li>
                                    </ul>
                                </div>
                                <div className="bg-yellow-50 p-6 rounded shadow hover:shadow-lg transition">
                                    <h3 className="font-semibold text-lg mb-2">
                                        Why UFirm? / UFirm क्यों चुनें?
                                    </h3>
                                    <ul className="text-gray-700 space-y-4">
                                        <li>✅ Professionally trained staff</li>
                                        <li>✅ Background verified workers</li>
                                        <li>✅ Flexible hiring – short or long term</li>
                                        <li>✅ Services available across India</li>
                                        <li>✅ Quick and easy onboarding process</li>
                                    </ul>
                                </div>
                            </div>
                            <a
                                href={`mailto:bhavesh.singh@ufirm.in?subject=Connect with Us&body=${encodeURIComponent(
                                    `Hello,\n\nPlease reach out to me,\nMy Name: \nCompany/ Society/ Organization/ Industry name: \nMobile no.: \nShort description of requirement: \nLocation: \n\nThanks`
                                )}`}
                            >
                                <button className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-lg transition flex items-center gap-2 mx-auto">
                                    <FaEnvelopeOpenText /> Request Staff / स्टाफ मांगें
                                </button>
                            </a>
                        </motion.div>
                    )}

                    {activeTab === "job" && (
                        <motion.div
                            key="job"
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-3xl mx-auto text-black px-2"
                        >
                            <h2 className="text-center text-3xl font-bold mb-4">Open Positions / उपलब्ध नौकरियाँ</h2>
                            <hr className="w-16 border-t-2 border-yellow-500 mx-auto mb-4" />
                            <p className="text-center text-gray-700 mb-4">
                                We are hiring for various vacancies. You can also submit your resume for future opportunities. <br />
                                हम विभिन्न पदों के लिए भर्ती कर रहे हैं। आप भविष्य की नौकरियों के लिए अपना Resume भी भेज सकते हैं।
                            </p>
                            <div className="text-center mb-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300"
                                    onClick={() => setShowResumeForm(true)}
                                >
                                    🚀 Submit Resume Without Applying / बिना आवेदन के Resume भेजें
                                </motion.button>
                            </div>
                            <input
                                type="text"
                                placeholder="Search Job Title or Skills / नौकरी या कौशल खोजें"
                                className="w-full px-4 py-2 rounded-md mb-6 text-black bg-white border border-gray-300 text-center"
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
                                    <button
                                        onClick={() => setShowResumeForm(true)}
                                        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                    >
                                        Apply Now / अभी फार्म भरें
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {showResumeForm && (
                <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-0">
                    <div className="bg-white p-4 sm:p-6 rounded shadow-lg w-full max-w-sm sm:max-w-md">
                        <h3 className="text-xl font-bold mb-4 text-center">
                            Submit Your Resume / अपना रिज़्यूमे जमा करें
                        </h3>
                        <form onSubmit={handleResumeSubmit}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full px-3 py-2 mb-3 border border-gray-300 rounded"
                                value={resumeName}
                                onChange={(e) => setResumeName(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full px-3 py-2 mb-3 border border-gray-300 rounded"
                                value={resumeEmail}
                                onChange={(e) => setResumeEmail(e.target.value)}
                                required
                            />
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                className="w-full mb-4"
                                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                required
                                placeholder="Upload your resume"
                                title="Upload your resume"
                            />
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                                >
                                    Send / भेजें
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                                    onClick={() => setShowResumeForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}