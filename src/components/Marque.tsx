'use client';

import React from 'react';
import Image from 'next/image';

const Marque = () => {
  return (
    <section className="bg-[#fafbf9] py-12">
      {/* Title - Keep padding for title */}
      <div className="px-6 sm:px-12 md:px-16 lg:px-24">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#1e3143] text-center mb-6">
          Trusted by Enterprises Managing Complex Assets at Scale
        </h2>
      </div>

      {/* Marquee Container - Full width with no padding */}
      <div className="flex flex-col gap-8 mb-6 overflow-hidden">
        {/* First Marquee - Logo Set 1 */}
        <div className="marquee-wrapper h-[60px]">
          <div className="marquee-track px-0">
            <Image
              src="/Assets/Marque logo set 1.svg"
              alt="Partner Logos Set 1"
              width={1920}
              height={60}
              className="h-[30px] w-auto max-w-none flex-shrink-0"
              priority
            />
            <Image
              src="/Assets/Marque logo set 1.svg"
              alt="Partner Logos Set 1"
              width={1920}
              height={60}
              className="h-[10px] w-auto max-w-none flex-shrink-0"
              priority
            />
          </div>
        </div>

        {/* Second Marquee - Logo Set 2 */}
        <div className="marquee-wrapper h-[60px]">
          <div className="marquee-track marquee-reverse px-0">
            <Image
              src="/Assets/Marque logo set 2.svg"
              alt="Partner Logos Set 2"
              width={1920}
              height={60}
              className="h-[30px] w-auto max-w-none flex-shrink-0"
              priority
            />
            <Image
              src="/Assets/Marque logo set 2.svg"
              alt="Partner Logos Set 2"
              width={1920}
              height={60}
              className="h-[10px] w-auto max-w-none flex-shrink-0"
              priority
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 90s linear infinite;
        }

        .marquee-track.marquee-reverse {
          animation: marquee-reverse 90s linear infinite;
        }

        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Marque;
