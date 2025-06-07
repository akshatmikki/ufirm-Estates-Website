'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';

const AboutUs = () => {
  return (
    <section className="bg-white dark:bg-white min-h-screen py-20 px-6 sm:px-12 md:px-16 lg:px-32 flex flex-col md:flex-row items-center gap-16">
      {/* Image Section */}
      <div className="relative w-full md:w-1/2 flex justify-center">
        <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden border-4 border-white shadow-lg z-10">
          <Image
            src="/Bigger-circle.jpg"
            alt="Team Group"
            width={384}
            height={384}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        <div className="absolute -bottom-8 right-8 w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-md z-20">
          <Image
            src="/smaller-circle.jpg"
            alt="Team Member"
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Text Section */}
      <div className="w-full text-center md:text-left md:w-1/2">
        <p className="text-[#146995] font-semibold text-base sm:text-lg mb-4">About Us</p>
        <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-snug">
          Leveraging our expertise across a range of services and projects, UFirm brings a holistic approach to Real Estate in India.
        </h4>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8">
          As a comprehensive Real Estate Platform, we use our experiences across different sectors within the industry to provide our clients with in-depth strategy, analysis and execution. Our clients include corporates, Real Estate funds, landowners and developers, across India.
        </p>
        <Link
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit text-left block mx-auto md:mx-0"
        >
          <Button
            borderRadius="1.75rem"
            className="bg-black/75 dark:bg-black/75 text-white dark:text-white border-slate-800 dark:border-slate-800 text-lg px-6 py-3"
          >
            Read More <span aria-hidden="true">&rarr;</span>
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default AboutUs;