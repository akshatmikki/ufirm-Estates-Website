"use client";

import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Image from "next/image";

function OurBusiness() {
  const Business = [
    {
      title: "Urest: Facility Management",
      description:
        "Properties not only function efficiently but are also managed with long-term sustainability in mind",
      link: "https://urest.in/",
    },
    {
      title: "Royal Nest: Projects",
      description: "Celebrating the past & developing the future",
      link: "/RoyalNestPage",
    },
    {
      title: "Our Product: CMMS",
      description: "The engine driving progress and competitive advantage in Real Estate",
      link: "/OurInnovation",
    },
    {
      title: "Estates: Management & Advisory",
      description: "Serving as the backbone of successful Real Estate operations",
      link: "/Management&advisory",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden min-h-screen">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/building-background.webp"
          alt="Office building background"
          fill
          loading="lazy"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Our Divisions
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
          {Business.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read more about ${item.title}`}
              className="w-full sm:w-[30rem] lg:w-[30rem]"
            >
              <CardContainer>
                <CardBody className="relative bg-slate-700/30 dark:bg-black border border-white/10 hover:shadow-2xl transition-shadow rounded-xl p-6 flex flex-col justify-center items-center h-40">
                  <CardItem
                    translateZ="60"
                    as="h3"
                    className="text-xl font-bold text-white text-center"
                  >
                    {item.title}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-white text-sm mt-4 text-center max-w-xs"
                  >
                    {item.description}
                  </CardItem>
                </CardBody>
              </CardContainer>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurBusiness;