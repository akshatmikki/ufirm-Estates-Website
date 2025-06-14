"use client";

import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { HamBurger } from "@/components/HamBurger";
import { BackgroundGradient } from "@/components/ui/Background-gradient";
import { BackgroundBeams } from "@/components/ui/Background-beams";

const technologies = [
    {
        title: "Our Innovation",
        slug: "OurInnovation",
    },
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
                <div className="flex flex-col h-[70vh] bg-black relative text-white">
                    <div className="absolute inset-0">
                        <Image
                            src="/Technologies.jpg"
                            alt="Banner Image"
                            fill
                            objectFit="cover"
                        />
                    </div>
                </div>
                <div className="relative z-10 px-6 lg:px-20 pt-10 pb-10">
                    <p className="text-lg text-gray-300 mb-10">
                        We develop, integrate, and modernize applications using the .NET framework, ReactJS & React Native.
                        Whether you need a web app, enterprise system, or cloud-based solution, our expert team ensures secure, high-performing software that meets your business needs while optimizing development time and costs.
                    </p>

                    <div className="mt-10 mx-40">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 justify-center">
                            {technologies.map((technology) => (
                                <BackgroundGradient
                                    key={technology.slug}
                                    className="flex flex-col rounded-[22px] bg-Zinc-900 dark:bg-zinc-900 overflow-hidden h-full max-w-sm"
                                >
                                    <div className="p-2 sm:p-6 flex flex-col items-center text-center flex-grow">
                                        <Link href={`/${technology.slug}`}>
                                            <p className="text-lg sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">{technology.title}</p>
                                        </Link>
                                    </div>
                                </BackgroundGradient>
                            ))}
                        </div>
                    </div>
                    <BackgroundBeams />
                </div>
            </div>
        </>
    );
}
