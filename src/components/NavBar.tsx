"use client";
import React, { useState } from "react";
import { Menu, MenuItem, ProductItem } from "./ui/Navbar";
import { cn } from "@/utils/cn";
import Link from "next/link";

export function NavBar() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={cn("fixed top-8 left-40 right-9")}>
      <Menu setActive={setActive}>
        <Link
          href="https://urest.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MenuItem
            setActive={setActive}
            active={active}
            item="Facility Management"
          />
        </Link>

        <Link
          href="https://royalnestdharamshala.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MenuItem
            setActive={setActive}
            active={active}
            item="Royal Nest Projects"
          />
        </Link>
        {/* <div className="block w-full h-full"> */}
          <MenuItem
            setActive={setActive}
            active={active}
            item="Products"
          />
          {active === "Products" && (
            <div className="absolute left-50 text-white mt-8 bg-black/70 dark:bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
              <div className="flex space-x-8">
                <div className="space-y-8">
                  <ProductItem title="Facility Management" src="/Navbar/Dashboard.jpg" description="#1 AI-Powered CMMS for Maintenance Teams" href="/OurInnovation/FacilityManagement" />
                  <ProductItem title="Inventory Management" src="/Navbar/Inventory.jpg" description="Get a full, granular view of your entire inventory, it's consuming and purchase" href="/OurInnovation/FacilityManagement#InventoryManagement" />
                  <ProductItem title="Employee Management" src="/Navbar/Employee.jpg" description="HRMS solution to track attendance, roles, and performance—all in one place" href="/OurInnovation/FacilityManagement" />
                </div>
                <div className="space-y-8">
                  <ProductItem title="Asset Management" src="/Navbar/Asset.jpg" description="Digitize your asset lifecycle—from acquisition, maintenance to disposal" href="/OurInnovation/FacilityManagement#AssetManagement" />
                  <ProductItem title="Visitor Management" src="/Navbar/visitor.jpg" description="Effortless visitor logging, approvals, and notifications" href="/OurInnovation/FacilityManagement#InventoryManagement" />
                  <ProductItem title="Complain Management" src="/Navbar/Complain.jpeg" description="Ensure smooth facility operations with real-time complaint resolution" href="/OurInnovation/FacilityManagement#ComplainManagement" />
                </div>
              </div>
            </div>
          )}
        {/* </div> */}
        <Link href="/TechnologiesPage">
        {/* <div className="block w-full h-full "> */}
          <MenuItem
            setActive={setActive}
            active={active}
            item="Technical Services"
          />
          {active === "Technical Services" && (
            <div className="absolute left-90 text-white mt-2 bg-black/70 dark:bg-black/70 shadow-md rounded-lg p-8 z-30 text-sm">
              <div className="space-y-8">
                
                <ProductItem title="React Development" src="/Navbar/React.jpg" description="" href="/ReactDevelopment" />
                <ProductItem title="Dotnet Development" src="/Navbar/Dotnet.jpg" description="" href="/.NetDevelopment" />
                <ProductItem title="Mobile Development" src="/Navbar/Reactnative.jpg" description="" href="/MobileDevelopment" />
              </div>
            </div>
          )}
        {/* </div> */}
        </Link>
        <Link href="/Management&advisory" >
          <MenuItem
            setActive={setActive}
            active={active}
            item="Real Estate Advisory"
          />
        </Link>
        <Link href="/CareerPage" >
          <MenuItem
            setActive={setActive}
            active={active}
            item="Hire"
          />
        </Link>
        {/* <Link href="/ContactPage" >
          <MenuItem
            setActive={setActive}
            active={active}
            item="Contact"
          />
        </Link> */}
      </Menu>
    </div>
  );
}
