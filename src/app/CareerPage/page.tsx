"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { useState } from "react";

export default function CareersPage() {
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
            subDepartment: "Technical Services",
        },
    ];

    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
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
                    <div className="flex-grow px-4 hidden lg:block">
                        <NavBar />
                    </div>
                </div>
            </div>
            <div >
                <div className="relative">
                    <Image
                        src="/Career.jpg"
                        alt="Team photo"
                        width={1600}
                        height={900}
                        className="w-full h-[80vh] object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-left px-10">
                        <div className="bg-white shadow-xl p-8 rounded text-center max-w-md">
                            <h1 className="text-3xl font-bold mb-4 text-black">Work With Us</h1>
                            <hr className="w-16 border-t-2 border-yellow-500 mx-auto mb-4" />
                            <p className="text-lg text-gray-700">
                                Come be a part of our journey as we work towards creating a culture of growth for all.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 py-12 px-6 text-center text-lg text-gray-700">
                    Join our dynamic and rapidly expanding team at <strong>UFirm</strong>, where we value the contributions of all our stakeholders — employees, clients, and capital providers. We are committed to fostering an environment that enables our employees to reach their full potential, both personally and professionally.
                </div>

                <div className="bg-gray-800 text-white py-16 px-6 justify-center content-center">
                    <h2 className="text-center text-3xl font-bold mb-4">Open Positions</h2>
                    <hr className="w-16 border-t-2 border-yellow-500 mx-auto mb-8" />
                    <div className="max-w-3xl mx-auto">
                        <input
                            type="text"
                            placeholder="Search Job Title or Skills"
                            className="w-full px-4 py-2 rounded-md mb-6 text-black bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {filteredJobs.map((job, idx) => (
                            <div
                                key={idx}
                                className="bg-white text-black p-6 rounded-md shadow mb-6"
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
                                <button className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="py-16 px-6 bg-gray-100">
                    <h2 className="text-center text-3xl font-bold mb-4 text-black">Employee Experiences</h2>
                    <hr className="w-16 border-t-2 border-yellow-500 mx-auto mb-8" />
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded shadow">
                            <p className="text-5xl text-yellow-500 mb-2">“</p>
                            <div className="flex items-center mb-4">
                                <Image
                                    src="/images/suresh.png"
                                    alt="Suresh Baria"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                                <div className="ml-3">
                                    <p className="font-bold text-black">Suresh Baria</p>
                                    <p className="text-sm text-black">Assistant General Manager, Operations (Since 2010)</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                I started my journey with UFirm 12 years ago as a field officer. UFirm feels like my own company... It's a fun place to work.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded shadow">
                            <p className="text-5xl text-yellow-500 mb-2">“</p>
                            <div className="flex items-center mb-4">
                                <Image
                                    src="/images/hareesh.png"
                                    alt="Hareesh Pillai"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                                <div className="ml-3">
                                    <p className="font-bold text-black">Hareesh Pillai</p>
                                    <p className="text-sm text-black">Senior Project Manager (Since 2015)</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                The industry we are in is dynamic and I have had opportunities to work on everything from Construction Management, Interior fit-outs, and Real Estate Advisory.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}