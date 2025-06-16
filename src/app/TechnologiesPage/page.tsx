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
            <div className="bg-grey-300">
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
                <div className="relative">
                    <video
                        width="100%"
                        height="auto"
                        autoPlay={true}
                        muted
                        loop
                        className="shadow-md"
                    >
                        <source src="/Tech.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 flex items-center justify-center p-10">
                        <div className="bg-white/80 shadow-xl p-4 rounded-xl text-center max-w-full ">
                            <p className="text-sm text-zinc-900">
                                <TextGenerateEffect words="We develop, integrate, and modernize applications using the .NET framework, ReactJS & React Native.
                        Whether you need a web app, enterprise system, or cloud-based solution, our expert team ensures secure, high-performing software that meets your business needs while optimizing development time and costs." />
                            </p>
                        </div>
                    </div>
                </div>
                <div className="relative z-40 px-4 lg:px-10 pt-5 pb-10 bg-black/60">
                    <BackgroundBeams />
                    <div className="mt-5 mx-20 relative z-50"> 
                        <p className="text-white font-bold sm:text-lg md:text-4xl mb-10 mt-5 text-center">What We Offer</p>
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-12 justify-center">
                            {technologies.map((technology) => (
                                <BackgroundGradient
                                    key={technology.slug}
                                    className="flex flex-col rounded-[22px] bg-zinc-900 dark:bg-zinc-900 overflow-hidden h-full max-w-sm"
                                >
                                    <div className="p-2 sm:p-6 flex flex-col items-center text-center flex-grow">
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
