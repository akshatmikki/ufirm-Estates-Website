'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FirmityIntroSection = () => {
    const features = [
        {
            title: 'Task-based Management',
            desc: 'Plan and track daily tasks with clarity',
            icon: '/Assets/clipboard.svg',
        },
        {
            title: 'Payroll and attendance management',
            desc: 'Digitize attendance and payroll records',
            icon: '/Assets/piechart.svg',
        },
        {
            title: 'QR based complaint management',
            desc: 'Log and resolve complaints via QR',
            icon: '/Assets/cycle.svg',
        },
        {
            title: 'Asset Management',
            desc: 'Track assets and maintenance centrally',
            icon: '/Assets/lock.svg',
        },
        {
            title: 'Inventory management',
            desc: 'Manage spares and consumables with automated records',
            icon: '/Assets/shirt.svg',
        },
    ];

    return (
        <section className="bg-white py-8 px-6 sm:px-12 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-[#1e3143] mb-2">
                        Introducing Firmity: Our CMMS Platform
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-[#1f4e7a]">
                        From work orders to preventative maintenance, Firmity brings structure to daily operations
                    </p>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-5 items-start">
                    {/* Left: Devices - 60% width (3 columns) */}
                    <div className="lg:col-span-3 relative -mt-14">
                        <div className="relative w-full h-[500px]">
                            {/* Laptop */}
                            <div className="absolute left-0 top-0 w-full h-full">
                                <Image
                                    src="/Assets/phone_laptop.svg"
                                    alt="Firmity dashboard on laptop"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Feature cards - 40% width (2 columns) */}
                    <div className="lg:col-span-2 flex flex-col gap-3 -mt-2">
                        {features.map((item, i) => (
                            <div
                                key={i}
                                className="
                  group relative flex items-start gap-3
                  bg-white rounded-lg p-3
                  shadow-lg ring-1 ring-inset ring-[#aec2cc]/40
                  transition-all duration-300
                  hover:bg-[#f0f3f5] hover:-translate-y-1
                  active:bg-[#aec2cc]
                  cursor-pointer
                "
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0 w-9 h-9 relative">
                                    <Image
                                        src={item.icon}
                                        alt={item.title}
                                        width={36}
                                        height={36}
                                        className="object-contain"
                                        style={{ filter: 'brightness(0) saturate(100%) invert(14%) sepia(18%) saturate(2072%) hue-rotate(168deg) brightness(95%) contrast(91%)' }}
                                    />
                                </div>

                                {/* Text */}
                                <div className="flex-grow">
                                    <p className="text-sm font-semibold text-[#1e3143]">
                                        {item.title}
                                    </p>
                                    <p className="text-xs text-[#1f4e7a]">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Hover Arrow */}
                                <div
                                    className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    opacity-0 translate-x-2
                    transition-all duration-300
                    group-hover:opacity-100 group-hover:translate-x-0
                  "
                                >
                                    <Image
                                        src="/Assets/arrow_firmity.svg"
                                        alt="Arrow"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* CTA - Aligned with phone bottom */}
                        <div className="mt-2">
                            <Link
                                href="https://firmity.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                  inline-flex items-center justify-center
                  px-6 py-2 rounded text-sm font-medium
                  bg-[#1e3143] text-white border-0
                  hover:bg-[#1f4e7a]
                  hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                  active:bg-[#1484bc] active:text-[#fafbf9]
                  active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]
                  transition-all duration-200
                "
                            >
                                Visit Firmity
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FirmityIntroSection;
