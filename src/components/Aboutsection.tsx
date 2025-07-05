'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/Button';
import IndiaMapStatic from '@/components/IndiaMapStatic';

const AboutUs = () => {
  return (
    <>
      <section className="bg-white dark:bg-white min-h-screen py-5 px-8 sm:px-12 md:px-16 lg:px-25 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center gap-15">
          <div className="w-full text-center md:text-left md:w-1/2">
            <p className="text-blue-700 font-bold text-base sm:text-sm mb-4">About Us</p>
            <h4 className="text-2xl sm:text-md md:text-2xl font-bold text-black mb-6 leading-snug">
              Ufirm, founded in 2016 as part of the Royal Nest Group, aims to elevate India’s real estate services. With over 25 years of legacy and 8 million sq. ft. of delivered projects, we offer proven expertise and a commitment to excellence.
            </h4>
            <p className="text-grey-900 text-base sm:text-sm leading-relaxed mb-8">
              Ufirm integrates four core divisions—Green-Compliant Project Development, Profitable Estate Management, Skilled Facility Maintenance, and Value Enhancement through Technology—to serve the real estate lifecycle end-to-end. Our mission is rooted in delivering lasting value for People, Planet, and Profits, driven by a team deeply committed to quality and innovation.
            </p>

            <Link
              href="/Aboutuspage"
              className="w-fit text-left block mx-auto md:mx-0"
            >
              <Button
                className="w-full sm:w-auto text-center"
                borderClassName="px-4 sm:px-6 py-3 bg-black/75 dark:bg-black/75 border-slate-800"
                borderRadius="1.75rem"
              >
                Read More <span className="ml-2" aria-hidden="true">&rarr;</span>
              </Button>
            </Link>
          </div>
          <div className="w-full md:w-1/2 flex h-full justify-center">
            <IndiaMapStatic />
          </div>
        </div>
      </section>
      <section>
        <div className="flex flex-wrap gap-8 justify-center py-8 bg-[#e6f3f8] ">
          <Image src="/certifications/CERTIFICATION1.svg" alt="Certified" width={60} height={30} className=" object-contain shadow-lg rounded-full" />
          <Image src="/certifications/CERTIFICATION3.svg" alt="Certified" width={60} height={30} className="object-contain shadow-lg rounded-full" />
          <Image src="/certifications/CERTIFICATION4.svg" alt="Certified" width={60} height={30} className="object-contain shadow-lg " />
          <Image src="/certifications/CERTIFICATION5.svg" alt="Certified" width={60} height={30} className="object-contain shadow-lg rounded-full" />
          <Image src="/certifications/CERTIFICATION6.svg" alt="Certified" width={60} height={30} className=" object-contain shadow-lg rounded-full" />
          <Image src="/certifications/CERTIFICATION7.svg" alt="Certified" width={60} height={30} className=" object-contain shadow-lg rounded-full" />
        </div>
      </section>
    </>
  );
};

export default AboutUs;
