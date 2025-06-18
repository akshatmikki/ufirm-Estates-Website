"use client";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import Image from "next/image";

function OurBusiness() {
  const slides = [
    {
      src: "/Banners/Banner1.png",
      title: "A Real Estate Platform driven by an entrepreneurial spirit",
      buttonLabel: "Facility Management",
      href: "https://urest.in/",
    },
    {
      src: "/Banners/Banner2.webp",
      title: "Celebrating the past & developing the future",
      buttonLabel: "Royal Nest Projects",
      href: "/RoyalNestPage",
    },
    {
      src: "/Banners/Product.jpeg",
      title: "The engine driving progress and competitive advantage in Real Estate",
      buttonLabel: "Our Product",
      href: "/OurInnovation",
    },
    {
      src: "/Banners/Banner3.jpg",
      title: "The engine powering innovation and transformation in technology",
      buttonLabel: "Our Technologies",
      href: "/TechnologiesPage",
    },
    {
      src: "/Banners/Banner4.jpg",
      title: "Serving as the backbone of successful Real Estate operations",
      buttonLabel: "Real Estate Advisory",
      href: "/Management&advisory",
    },
  ];
  const Business = [
    {
      title: "Urest: Facility Management",
      description:
        "Properties not only function efficiently but are also managed with long-term sustainability in mind",
      link: "https://urest.in/",
    },
    {
      title: "Royal Nest: Projects",
      description:
        "Celebrating the past & developing the future",
      link: "/RoyalNestPage",
    },
    {
      title: "Our Product: CMMS",
      description: "The engine driving progress and competitive advantage in Real Estate",
      link: "/OurInnovation",
    },
    // {
    //   title: "Technologies",
    //   description:
    //     "The engine powering innovation and transformation in technology",
    //   link: "/TechnologiesPage",
    // },
    {
      title: "Estates: Management & Advisory",
      description:
        "Serving as the backbone of successful Real Estate operations",
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
      <div className="relative z-10 max-w-auto mx-auto px-4 sm:px-6">
        <div className="text-center">
          <p className="mt-2 md:text-5xl leading-8 font-extrabold tracking-tight text-white sm:text-5xl">
            Our Business
          </p>
        </div>

        <div className="mt-8 ">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 py-2">
            {Business.map((item) => (
              <a
                href={item.link}
                key={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CardContainer>
                  <CardBody className="relative bg-slate-700/30 dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-40 sm:w-[30rem] h-40  rounded-xl p-6 border ">
                    <CardItem
                      translateZ="60"
                      as="div"
                      className="text-xl font-bold text-white dark:text-white text-center items-center"
                    >
                      {item.title}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-white text-sm max-w-sm mt-6 dark:text-white"
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
