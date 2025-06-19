"use client";

import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { BackgroundGradient } from "@/components/ui/Background-gradient";
import { BackgroundBeams } from "@/components/ui/Background-beams";
import { TextGenerateEffect } from "@/components/ui/textgeneratoreffect";

const technologies = [
    {
        title: ".NET Development",
        slug: ".NetDevelopment",
    },
    {
        title: "React Development",
        slug: "ReactDevelopment",
    },
    {
        title: "Mobile App Development",
        slug: "MobileAppDevelopment",
    },
];

export default function TechnologiesPage() {
    return (
        <>
            <div className="bg-black min-h-screen"> 
                <div className="absolute top-1 left-0 w-full z-50">
                    <div className="flex items-center justify-between px-4 mt-1">
                        <Link href="/">
                            <Image
                                src="/UFIRM ESTATES LOGO.png"
                                alt="logo"
                                width={80} 
                                height={40} 
                                priority
                            />
                        </Link>
                        <NavBar />
                    </div>
                </div>
                <div className="relative">
                    <video
                        width="100%"
                        height="auto"
                        autoPlay={true}
                        muted
                        loop
                        className="shadow-md object-cover h-[40vh] md:h-[60vh] lg:h-[80vh] w-full" 
                    >
                        <source src="/Tech.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center p-4 md:p-10"> 
                        <div className="shadow-xl p-4 rounded-xl text-center max-w-full bg-opacity-50"> 
                            <p className="text-sm sm:text-base md:text-lg text-white"> 
                                <TextGenerateEffect words="We build and modernize web, enterprise, and cloud apps using .NET, ReactJS, and React Native—delivering secure, high-performance solutions that meet your needs efficiently and cost-effectively." />
                            </p>
                        </div>
                    </div>
                </div>
                <div className="relative z-40 px-4 pt-5 pb-10 bg-black/60"> 
                    <BackgroundBeams />
                    <div className="mt-5 mx-auto max-w-4xl relative z-50 px-2"> 
                        <p className="text-white font-bold text-xl sm:text-2xl md:text-4xl mb-8 mt-5 text-center">What We Offer</p> 
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"> 
                            {technologies.map((technology) => (
                                <BackgroundGradient
                                    key={technology.slug}
                                    className="flex flex-col rounded-[22px] bg-zinc-900 dark:bg-zinc-900 overflow-hidden h-full max-w-sm mx-auto" 
                                >
                                    <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow"> 
                                        <Link href={`/${technology.slug}`}>
                                            <p className="text-lg sm:text-xl text-neutral-200 mt-4 mb-2 dark:text-neutral-200 text-center">{technology.title}</p>
                                        </Link>
                                    </div>
                                </BackgroundGradient>
                            ))}
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}