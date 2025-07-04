'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import IndiaMapStatic from '@/components/IndiaMapStatic';
import { InfiniteStatCards } from './ui/Moving-card';

const stats = [
  {
    icon: '🏢',
    value: 200,
    suffix: 'Mn sqft',
    label: 'area under management',
  },
  {
    icon: '📈',
    value: 16000,
    suffix: 'cr',
    label: 'deals advised & monitored',
  },
  {
    icon: '🏗️',
    value: 2,
    suffix: 'Mn sqft',
    label: 'constructed area delivered',
  },
  {
    icon: '🚧',
    value: 750000,
    suffix: 'sqft',
    label: 'area under development',
  },
];

const AboutUs = () => {
  return (
    <section className="bg-white dark:bg-white min-h-screen py-5 px-8 sm:px-12 md:px-16 lg:px-25 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-center gap-15">
        <div className="w-full text-center md:text-left md:w-1/2">
          <p className="text-blue-700 font-bold text-base sm:text-sm mb-4">About Us</p>
          <h4 className="text-3xl sm:text-lg md:text-3xl font-bold text-black mb-6 leading-snug">
            Leveraging our expertise across a range of services and projects, UFirm brings a holistic approach to Real Estate in India.
          </h4>
          <p className="text-grey-900 text-base sm:text-sm leading-relaxed mb-8">
            As a comprehensive Real Estate Platform, we use our experiences across different sectors within the industry to provide our clients with in-depth strategy, analysis and execution. Our clients include corporates, Real Estate funds, landowners and developers, across India.
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
          <div className="flex flex-wrap gap-2 mt-4">
            <InfiniteStatCards stats={stats} direction="left" speed="normal" />
          </div>
        </div>
        <div className="relative w-full md:w-1/2 flex justify-center">
          <IndiaMapStatic />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
