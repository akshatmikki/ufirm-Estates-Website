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
    <div className="relative py-20 overflow-hidden min-h-screen">
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/building-background.jpg"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>
      </div>
      <div className="relative z-10 max-w-auto mx-auto px-2 sm:px-4 md:px-6"> 
        <div className="text-center">
          <p className="mt-2 text-4xl md:text-5xl leading-8 font-bold tracking-tight text-white sm:text-5xl"> 
            Our Divisions
          </p>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 py-2 justify-items-center"> 
            {Business.map((item) => (
              <a
                href={item.link}
                key={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CardContainer>
                  <CardBody className="relative bg-slate-700/30 dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] lg:w-[30rem] h-40 rounded-xl p-6 border flex flex-col justify-center items-center"> {/* Adjusted width and added flex properties */}
                    <CardItem
                      translateZ="60"
                      as="div"
                      className="text-xl font-bold text-white dark:text-white text-center"
                    >
                      {item.title}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-white text-sm mt-6 dark:text-white text-center max-w-xs" // Added max-w-xs for description
                    >
                      {item.description}
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurBusiness;