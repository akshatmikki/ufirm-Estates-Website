"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import ClientCarousel from "@/components/ClientCarousel";
import { useScroll, useTransform } from "motion/react";
import React from "react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { Login } from "@/components/Login";
import SVGComponent from "@/components/Ufirm_estates";
import { HamburgerMenu } from "@/components/Hamburger";

const content = [
  {
    id: "Dashboard",
    title: "DashBoard",
    description:
      "Stay ahead of every maintenance task with a centralized dashboard that brings clarity to your operations. Urest’s maintenance dashboard delivers real-time visibility into KPIs, work order status, asset performance, and team productivity—all in one place. Whether you're on-site or on the go, make faster, data-driven decisions that reduce downtime, improve accountability, and keep your maintenance operations running smoothly.",
    content: (
      <div className="relative w-[510px] h-[250px]">
        <Image
          src="/FacilityManagement/Dashboard.png"
          alt="Dashboard"
          layout="fill"
          className="object-cover"
        />
      </div>
    ),
  },
  {
    id: "PPMScheduler",
    title: "PPM Scheduler",
    description:
      "Streamline operations with our PPM Scheduler, and ensure every task is completed on time—every time. With Urest’s maintenance planning solution, you can easily schedule and automate daily housekeeping and technical checks, as well as weekly and yearly preventive tasks—all from your mobile device. Keep your facilities clean, compliant, and fully operational without missing a beat.",
    content: (
      <div className="relative w-[510px] h-[250px]">
        <Image
          src="/FacilityManagement/PPM.png"
          alt="Dashboard"
          layout="fill"
          className="object-cover"
        />
      </div>
    ),
  },
  {
    id: "AssetManagement",
    title: "Asset Management",
    description:
      "Boost productivity with our CMMS software, and gain robust insights to manage the full asset life cycle. With Urest's asset management solution, you can even automate preventive maintenance tasks on your mobile device, so you can keep business running smoothly all the time.",
    content: (
      <div className="relative w-[510px] h-[250px]">
        <Image
          src="/FacilityManagement/Asset.png"
          alt="Asset"
          layout="fill"
          className="object-cover"
        />
      </div>
    ),
  },
  {
    id: "InventoryManagement",
    title: "Inventory Management",
    description:
      "Reduce parts costs with an accurate inventory count, and direct the savings into growing your business. With powerful insights, you can better control costs, standardize maintenance, and ensure sufficient stock supply. Easily oversee parts consumption, purchasing, and more with Urest’s inventory management solution to boost your cash flow and optimize resources.",
    content: (
      <div className="relative w-[510px] h-[250px]">
        <Image
          src="/FacilityManagement/Inventory.png"
          alt="Inventory"
          layout="fill"
          className="object-cover"
        />
      </div>
    ),
  },
  {
    id: "ComplaintManagement",
    title: "Complaint Management",
    description:
      "Resolve Issues Faster and Keep Customers Happy with Smarter Complaint Management. Turn customer complaints into growth opportunities with Urest’s streamlined complaint management solution. Gain full visibility into issues, response times, and resolution progress to ensure nothing falls through the cracks. With actionable insights, you can identify recurring problems, standardize responses, and improve service quality.",
    content: (
      <div className="relative w-[510px] h-[250px]">
        <Image
          src="/FacilityManagement/Complain.png"
          alt="Complaint"
          layout="fill"
          className="object-cover"
        />
      </div>
    ),
  },
  {
    id: "EmployeeManagement",
    title: "Employee Management",
    description:
      "Simplify daily operations and enhance workforce accountability with Urest’s employee management system. From attendance tracking and access control to shift monitoring and real-time reporting—gain the tools you need to run a productive, compliant, and secure workplace. Identify trends, optimize schedules, and support your team with data-driven decisions that drive performance and satisfaction.",
    content: (
      <div className="relative w-[510px] h-[250px]">
        <Image
          src="/FacilityManagement/Employee.jpeg"
          alt="Employee"
          layout="fill"
          className="object-fill"
        />
      </div>
    ),
  },
  {
    id: "VisitorManagement",
    title: "Visitor Management",
    description:
      "Deliver a seamless first impression while enhancing security using Urest’s advanced visitor management solution. Track visitor check-ins, issue digital badges, and monitor access in real time—all from one platform. With complete visibility and instant insights, you can streamline front-desk operations, maintain compliance, and ensure every guest experience is smooth, safe, and professional.",
    content: (
      <div className="relative w-[510px] h-[250px]">
        <Image
          src="/Navbar/visitor.jpg"
          alt="Visitor"
          layout="fill"
          className="object-fill"
        />
      </div>
    ),
  },
];

export default function FacilityManagement() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div>
      <div className="absolute top-1 left-0 w-full z-50">
        <div className="flex items-center justify-between px-4 mt-1">
          <Link href="/">
            <SVGComponent
              className="w-16 h-16 sm:w-23 sm:h-23 md:w-26 md:h-26 lg:w-28 lg:h-28"
            />
          </Link>
          <div className="block lg:hidden">
            <HamburgerMenu />
          </div>

          <div className="hidden lg:block">
            <NavBar />
          </div>
          <Login />
        </div>
      </div>

      <div
        className="h-[100vh] sm:h-[100vh] bg-black w-full dark:border dark:border-white/[0.1] relative pt-30 sm:pt-20 overflow-clip"
        ref={ref}
      >
        <GoogleGeminiEffect
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>
      <div >
        <StickyScroll content={content} />
      </div>
      <ClientCarousel />
    </div>
  );
}
