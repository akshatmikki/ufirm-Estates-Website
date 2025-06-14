"use client";
import { HoverEffect } from "./ui/card-hover-effect";
import Image from "next/image";

function OurBusiness() {
  const featuredWebinars = [
    {
      title: "Urest: Facility Management",
      description:
        "Dive deep into the fundamentals of facility management and enhance your skills.",
      slug: "https://urest.in/",
    },
    {
      title: "Royal Nest: Projects",
      description:
        "Learn the craft of songwriting from experienced musicians and songwriters.",
      slug: "https://royalnestdharamshala.com/",
    },
    {
      title: "Technologies",
      description:
        "Advanced techniques to master your musical instrument of choice.",
      slug: "/technologies",
    },
    {
      title: "Estates: Management & Advisory",
      description:
        "Get started with music production with this comprehensive overview.",
      slug: "/estates",
    },
  ];

  return (
    <div className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/building-background.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <p className="mt-2 text-5xl leading-8 font-bold tracking-tight text-white sm:text-5xl">
            Our Business
          </p>
        </div>

        <div className="mt-10 ">
          <HoverEffect
            items={featuredWebinars.map((webinar) => ({
              title: webinar.title,
              description: webinar.description,
              link: webinar.slug,
            }))}
          />
        </div>
      </div>
    </div>
  );
}

export default OurBusiness;
