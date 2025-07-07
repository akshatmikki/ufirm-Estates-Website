'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/Button';
import IndiaMapStatic from '@/components/IndiaMapStatic';

const AboutUs = () => {
  return (
    <>
      {/* ABOUT SECTION */}
      <section className="bg-white dark:bg-white min-h-screen py-10 px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <p className="text-blue-700 font-semibold text-sm sm:text-base mb-3">
              About Us
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-5 leading-snug">
              Ufirm, founded in 2016 as part of the Royal Nest Group, aims to elevate India’s real estate services.
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6">
              With over 25 years of legacy and 8 million sq. ft. of delivered projects, we offer proven expertise and a commitment to excellence. Ufirm integrates four core divisions—Green-Compliant Project Development, Profitable Estate Management, Skilled Facility Maintenance, and Value Enhancement through Technology—to serve the real estate lifecycle end-to-end. Our mission is rooted in delivering lasting value for People, Planet, and Profits, driven by a team deeply committed to quality and innovation.
            </p>
            <Link href="/Aboutuspage" className="block w-fit mx-auto md:mx-0">
              <Button
                className="w-full sm:w-auto text-center"
                borderClassName="px-5 sm:px-6 py-3 bg-black/80 dark:bg-black/80 border-slate-800"
                borderRadius="1.75rem"
              >
                Read More <span className="ml-2" aria-hidden="true">&rarr;</span>
              </Button>
            </Link>
          </div>

          {/* Map */}
          <div className="w-full md:w-1/2 flex justify-center h-full">
            <IndiaMapStatic />
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS SECTION */}
      <section className="bg-[#e6f3f8] py-10">
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 px-4 sm:px-8">
          {[
            "CERTIFICATION1",
            "CERTIFICATION3",
            "CERTIFICATION4",
            "CERTIFICATION5",
            "CERTIFICATION6",
            "CERTIFICATION7"
          ].map((cert, i) => (
            <Image
              key={i}
              src={`/certifications/${cert}.svg`}
              alt={`Certified ${i + 1}`}
              width={60}
              height={30}
              className={`object-contain shadow-lg ${cert === "CERTIFICATION4" ? "" : "rounded-full"}`}
              loading="lazy"
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default AboutUs;