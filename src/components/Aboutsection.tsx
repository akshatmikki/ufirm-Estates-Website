'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import IndiaMapStatic from '@/components/IndiaMapStatic';
import CountUp from 'react-countup';

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
    <section className="bg-white dark:bg-white min-h-screen py-10 px-6 sm:px-12 md:px-16 lg:px-32 flex flex-col gap-16">
      <div className="flex flex-col md:flex-row items-center gap-16">
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
            <Button borderRadius="1.75rem" className="bg-black/75 dark:bg-black/75 text-white border-slate-800 text-lg px-6 py-3">
              Read More <span aria-hidden="true">&rarr;</span>
            </Button>
          </Link>
        </div>
        <div className="relative w-full md:w-1/2 flex justify-center">
          <IndiaMapStatic />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 w-full sm:w-[45%] md:w-[22%] text-center hover:shadow-lg transition-all duration-300"
          >
            <div className="text-4xl mb-3">{stat.icon}</div>
            <p className="text-2xl font-bold text-orange-500">
              <CountUp end={stat.value} duration={2} separator="," /> {stat.suffix}
            </p>
            <p className="text-sm text-gray-800 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutUs;