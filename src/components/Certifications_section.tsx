'use client';

import React from 'react';
import Image from 'next/image';

const CertificationsSection = () => {
    const certifications = [
        {
            id: 1,
            image: '/assets/Certification1.svg',
            alt: 'Certification 1',
        },
        {
            id: 2,
            image: '/assets/Certification2.svg',
            alt: 'Certification 2',
        },
        {
            id: 3,
            image: '/assets/Certification3.svg',
            alt: 'Certification 3',
        },
        {
            id: 4,
            image: '/assets/Certification4.svg',
            alt: 'Certification 4',
        },
    ];

    return (
        <section className="bg-[#f0f3f5] py-7 px-6 sm:px-12 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto">
                {/* Certifications Grid */}
                <div className="flex flex-wrap justify-center items-center gap-30">
                    {certifications.map((cert) => (
                        <div
                            key={cert.id}
                            className="relative w-14 h-14 sm:w-24 sm:h-24 overflow-hidden"
                        >
                            <Image
                                src={cert.image}
                                alt={cert.alt}
                                fill
                                className="object-cover object-center"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CertificationsSection;
