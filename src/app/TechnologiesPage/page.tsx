"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { BackgroundGradient } from "@/components/ui/Background-gradient";
import { BackgroundBeams } from "@/components/ui/Background-beams";
import ClientCarousel from "@/components/ClientCarousel";
import { Button } from "@/components/ui/Button";
import { FlipWords } from "@/components/ui/flip-words";
import SVGComponent from "@/components/Ufirm_estates";

const technologies = [
    {
        title: ".NET Development",
        slug: ".NetDevelopment",
        description: "Scalable and secure enterprise solutions built on Microsoft’s .NET framework.",
        icon: "/Technical Services/dotnet.png",
    },
    {
        title: "React Development",
        slug: "ReactDevelopment",
        description: "Dynamic, component-based frontends for modern web apps using React.",
        icon: "/Technical Services/react.png",
    },
    {
        title: "Mobile App Development",
        slug: "MobileDevelopment",
        description: "Cross-platform apps for iOS and Android with seamless UX.",
        icon: "/Technical Services/react-native.png",
    },
];

const icons = [
    {
        title: "On-Time Delivery",
        description: "We respect your deadlines and deliver projects without delay.",
        icon: "/Technical Services/on-time-delivery.jpg",
    },
    {
        title: "Budget Brilliance",
        description: "We deliver smart, cost-effective solutions without compromising on quality.",
        icon: "/Technical Services/professional.jpeg",
    },
    {
        title: "Proficient Experts",
        description: "Skilled teams using the latest tools for effective results.",
        icon: "/Technical Services/proficient.jpg",
    },
];

const words = ["Web Development", "Mobile App Development", "Enterprise cloud solution"];

export default function TechnologiesPage() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.5;
        }
    }, []);
    return (
        <div>
            <div className="absolute top-1 left-0 w-full z-50">
                <div className="flex items-center justify-between px-4 mt-1">
                    <Link href="/">
                        <SVGComponent className="w-28 h-27" />
                    </Link>
                    <NavBar />
                </div>
            </div>

            <div className="relative">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop

                    className="shadow-md object-cover h-[40vh] sm:h-[60vh] lg:h-[80vh] w-full"
                >
                    <source src="/techno.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black/45"></div>
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-10">
                    <div className="rounded-xl text-center w-full max-w-full mx-auto px-8 py-6 sm:px-10">
                        <h2><FlipWords words={words} /></h2>
                    </div>
                </div>
            </div>
            <div className="relative z-40 px-4 pt-5 pb-20 bg-black/60">
                <BackgroundBeams />
                <div className="mt-5 mx-auto max-w-5xl relative z-50 px-4 sm:px-6">
                    <p className="text-white font-bold text-3xl md:text-4xl mb-10 text-center">Our Technical Services</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {technologies.map((tech) => (
                            <BackgroundGradient
                                key={tech.slug}
                                className="flex flex-col rounded-[22px] bg-zinc-900 overflow-hidden h-full max-w-sm mx-auto shadow-lg hover:scale-[1.02] transition"
                            >
                                <div className="p-6 flex flex-col items-center text-center flex-grow">
                                    <Image
                                        src={tech.icon}
                                        alt={`${tech.title} icon`}
                                        width={80}
                                        height={80}
                                        className="mb-4"
                                    />
                                    <Link href={`/${tech.slug}`}>
                                        <p className="text-xl text-neutral-200 font-semibold mb-2">
                                            {tech.title}
                                        </p>
                                    </Link>
                                    <p className="text-sm text-neutral-400 mb-4">{tech.description}</p>
                                    <Link href={`/${tech.slug}`}>
                                        <Button className="w-full sm:w-auto text-white border border-white hover:bg-white hover:text-black transition">
                                            Learn More
                                        </Button>
                                    </Link>
                                </div>
                            </BackgroundGradient>
                        ))}
                    </div>
                </div>
            </div>
            <div className="bg-[#f8f8ff]">
                <div className="py-10 mt-5 mx-auto max-w-5xl relative px-4 sm:px-6">
                    <p className="text-3xl sm:text-5xl text-center font-bold mb-9">What Sets Us Apart</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                        {icons.map((tech, idx) => (
                            <BackgroundGradient
                                key={idx}
                                className="flex flex-col rounded-[22px] bg-zinc-900 overflow-hidden h-full max-w-sm mx-auto shadow-lg hover:scale-[1.02] transition"
                            >
                                <div className="p-6 flex flex-col items-center text-center flex-grow">
                                    <Image
                                        src={tech.icon}
                                        alt={`${tech.title} icon`}
                                        width={80}
                                        height={80}
                                        className="mb-4 rounded-full"
                                    />
                                    <p className="text-xl text-neutral-200 font-semibold mb-2">{tech.title}</p>
                                    <p className="text-sm text-neutral-400 mb-4">{tech.description}</p>
                                </div>
                            </BackgroundGradient>
                        ))}
                    </div>
                </div>
            </div>
            <ClientCarousel />
        </div>
    );
}