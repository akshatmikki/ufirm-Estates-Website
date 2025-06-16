"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "../../components/NavBar";
// import { HamBurger } from "../../components/HamBurger";
import { BackgroundGradient } from "../../components/ui/Background-gradient"
import { ExpandableCardList } from "../../components/expandablescards"
import { BackgroundBeams } from "../../components/ui/Background-beams";

export default function ReactServicesPage() {
  const ReactCards = [
    {
      title: "Hire Dedicated React Native Developers",
      content: () => (
        <p>
          You can access exceptional skills and distinctive knowledge by enlisting our committed React Native developers at affordable prices. Our hiring plans are simple and adaptable, allowing you to choose your preferred team on an hourly, part-time, or full-time basis.
        </p>
      ),
    },
    {
      title: "React Native Consulting",
      content: () => (
        <p>
          Leverage our React Native consulting solutions to obtain a comprehensive project plan and framework for developing a mobile application with a native appearance and user experience utilizing Agile methodology.
        </p>
      ),
    },
    {
      title: "Mobile App Backend & API Development",
      content: () => (
        <p>
          We offer complete backend and API development solutions for React Native-based mobile applications. Our engineers possess expertise in Node.js, PHP, and Python to develop personalized backend and API services to cater to your mobile application&apos;s requirements.
        </p>
      ),
    },
  ];

  return (
    <>
      <div>
        <div className="absolute top-1 left-0 w-full z-50">
          <div className="flex items-center justify-between px-4 mt-1">
            <Link href="/">
              <Image
                src="/UFIRM ESTATES LOGO.png"
                alt="logo"
                width={100}
                height={50}
                priority
              />
            </Link>
            <div className="flex-grow px-4 hidden lg:block">
              <NavBar />
            </div>
          </div>
        </div>
        <div className="relative z-40 px-10 py-40 md:px-20 md:py-40 ">
          <BackgroundBeams />
          <div className="relative z-40 grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-6">
                Developing Applications with React Native Services
              </h1>
              <p className="text-white text-lg">
                Our team of expert React Native Developers assesses your long-term organizational goals and current business model to create a tailored roadmap for your project. We provide a range of React Native app development services to meet your specific needs and requirements.
              </p>
              <div className=" mt-10">
                <Image
                  src="/DotnetPage.jpg"
                  alt="DotNet Development"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
            <div className="mt-30">
              <BackgroundGradient className="rounded-[22px] bg-white dark:bg-white overflow-hidden h-full w-full">
                <ExpandableCardList cards={ReactCards} />;
              </BackgroundGradient>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}     