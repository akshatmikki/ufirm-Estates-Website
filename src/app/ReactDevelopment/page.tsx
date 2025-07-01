"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "../../components/NavBar";
import { BackgroundGradient } from "../../components/ui/Background-gradient"
import { ExpandableCardList } from "../../components/expandablescards"
import { BackgroundBeams } from "../../components/ui/Background-beams";

export default function ReactServicesPage() {
  const ReactCards = [
    {
      title: "React Web Development",
      content: () => (
        <p>
          Utilize our React web development services to create dynamic, responsive websites that engage users and drive business growth with cutting-edge technology.
        </p>
      ),
    },
    {
      title: "Server-Side API",
      content: () => (
        <p>
          Integrate robust server-side APIs with React for efficient data handling and communication, enhancing your application&apos;s performance and reliability.
        </p>
      ),
    },
    {
      title: "React App Development",
      content: () => (
        <p>
          Build high-performance, user-friendly React applications with our expertise, ensuring enhanced functionality and seamless user experiences tailored to your business needs.
        </p>
      ),
    },
    {
      title: "SaaS Application Build and Migration",
      content: () => (
        <p>
          Develop and migrate SaaS applications seamlessly with our React expertise, ensuring scalability, security, and enhanced performance for your business growth.
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
          <div className="relative grid md:grid-cols-2 gap-10 items-start z-40">
            <div>
              <h1 className="text-4xl font-bold text-white mb-6">
                Developing Applications with React Services
              </h1>
              <p className="text-white text-lg">
                Explore the full potential of your business with UFirm&apos;s React development services. Our expert team delivers tailored, scalable, and secure solutions designed to meet your unique needs and drive growth.
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