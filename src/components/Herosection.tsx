"use client";
import { NavBar } from '@/components/NavBar';
import Image from "next/image";
import { HamBurger } from "@/components/HamBurger";

export default function Herosection() {
  return (
    <div className="relative w-full h-screen"> 
      <Image
        src="/Banner1.jpg"
        alt="Banner Image"
        fill
        className="object-cover -z-10 opacity-80"
        priority
      />

      <div className="fixed w-full h-full flex flex-col">
        <div className="flex items-center justify-between p-4">
          <Image src="/UFIRM ESTATES LOGO.png" alt="logo" width={100} height={50} />
          <div className="flex-grow px-4">
            <NavBar />
          </div>
          <HamBurger />
        </div>
      </div>
    </div>
  );
}
