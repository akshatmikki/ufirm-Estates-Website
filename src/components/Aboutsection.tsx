'use client';

import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import {Button} from './ui/Button'

const AboutUs = () => {
  return (
    <section className="bg-white py-12 px-6 sm:px-8 md:px-12 lg:px-24 flex flex-col md:flex-row items-center gap-10">
      <div className="relative w-full md:w-1/2 flex justify-center">
        <div className="w-60 h-60 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-white shadow-lg z-10">
          <Image
            src="/Bigger-circle.jpg"
            alt="Team Group"
            width={288}
            height={288}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        <div className="absolute -bottom-6 right-6 w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md z-20">
          <Image
            src="/smaller-circle.jpg"
            alt="Team Member"
            width={112}
            height={112}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="w-full text-center md:text-left md:w-4/5 lg:w-2/3">
        <p className="text-[#146995] font-semibold text-sm sm:text-base mb-2">About Us</p>
        <h4 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900 mb-4 leading-snug">
          Leveraging our expertise across a range of services and projects, UFirm brings a holistic approach to Real Estate in India.
        </h4>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
          As a comprehensive Real Estate Platform, we use our experiences across different sectors within the industry to provide our clients with in-depth strategy, analysis and execution. Our clients include corporates, Real Estate funds, landowners and developers, across India.
        </p>
        <Link
          href="/about"
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit text-left mt-4 block mx-auto md:mx-0"
        >
          <Button
            borderRadius="2.50rem"
            className="bg-[#146995] text-black dark:text-white border-neutral-200 dark:border-slate-800"
          >
            Read More <span aria-hidden="true">&rarr;</span>
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default AboutUs;