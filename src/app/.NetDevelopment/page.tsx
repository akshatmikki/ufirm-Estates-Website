"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "../../components/NavBar";
// import { HamBurger } from "../../components/HamBurger";
import { BackgroundGradient } from "../../components/ui/Background-gradient"
import { ExpandableCardList } from "../../components/expandablescards"
import { BackgroundBeams } from "../../components/ui/Background-beams";

export default function DotNetServicesPage() {
  const dotnetCards = [
    {
      title: "ASP.NET App Development",
      content: () => (
        <p>
          Get scalable apps to meet the latest market trends and migrate legacy software while retaining their core features using our asp net application development services.
        </p>
      ),
    },
    {
      title: "Integration & API Development",
      content: () => (
        <p>
          Streamline your business processes with seamless integration and robust API development. Our .NET experts ensure efficient, scalable, and secure connections between diverse systems and applications.
        </p>
      ),
    },
    {
      title: "Enterprise .NET Development",
      content: () => (
        <p>
          For enterprises, we offer customized services such as designing and developing enterprise-level applications, integrating enterprise software solutions, and providing support and maintenance services.
        </p>
      ),
    },
    {
      title: "Cloud-Based Solutions",
      content: () => (
        <p>
          Utilize the power of cloud computing with our .NET cloud-based solutions. We offer scalable, flexible, and secure cloud applications to optimize performance and reduce operational costs.
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
            <NavBar />
          </div>
        </div>
        <div className="relative z-40 px-10 py-40 md:px-20 md:py-40 ">
          <BackgroundBeams />
          <div className="relative z-40 grid md:grid-cols-2 gap-10 items-start">
            <div>
              <h1 className="text-4xl font-bold text-white mb-6">
                Developing Applications with Advanced .NET Services
              </h1>
              <p className="text-white text-lg">
                Explore the full potential of your business with UFirm’s .NET development services. Our expert team delivers tailored, scalable, and secure solutions designed to meet your unique needs and drive growth.
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
                <ExpandableCardList cards={dotnetCards} />;
              </BackgroundGradient>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}     