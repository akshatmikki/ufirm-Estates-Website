"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, MenuItem, ProductItem } from "./ui/Navbar";
import { cn } from "@/utils/cn";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

export function NavBar() {
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navigateWithScroll = (path: string, hash: string) => {
    router.push(path); // navigate to the page
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 500); // delay until DOM updates
  };

  return (
        <div className={cn("fixed top-8 left-40 right-9 z-40")}>
      <div className="md:hidden flex justify-between items-center px-4 py-2 bg-black text-white rounded-xl shadow">
        <h1 className="text-lg font-semibold">Menu</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="focus:outline-none"
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className=" bg-black text-white rounded-xl mt-2 p-4 space-y-4 shadow-lg">
          <a href="https://urest.in/">Facility Management</a>
          <a href="/RoyalNestPage">Royal Nest Projects</a>
          <a href="/OurInnovation">Products</a>
          <div className="ml-4 space-y-2">
            <button onClick={() => navigateWithScroll("/OurInnovation", "#card-0")}>Facility Management</button>
            <button onClick={() => navigateWithScroll("/OurInnovation", "#AssetManagement")}>Asset Management</button>
            <button onClick={() => navigateWithScroll("/OurInnovation", "#InventoryManagement")}>Inventory Management</button>
            <button onClick={() => navigateWithScroll("/OurInnovation", "#ComplainManagement")}>Complain Management</button>
          </div>
          <a href="/TechnologiesPage">Technical Services</a>
          <div className="ml-4 space-y-2">
            <a href="/ReactDevelopment">React Development</a>
            <a href="/.NetDevelopment">Dotnet Development</a>
            <a href="/MobileDevelopment">Mobile Development</a>
          </div>
          <a href="/Management&advisory">Real Estate Advisory</a>
          <a href="/CareerPage">Hire</a>
        </div>
      )}

      {/* Desktop Menu */}
      <div className="hidden md:block">
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Facility Management" href="https://urest.in/" />
          <MenuItem setActive={setActive} active={active} item="Royal Nest Projects" href="/RoyalNestPage" />
          <MenuItem setActive={setActive} active={active} item="Products" href="/OurInnovation" />
          {active === "Products" && (
            <div className="absolute left-50 text-white mt-8 bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
              <div className="flex space-x-2">
                <div className="space-y-2">
                  <ProductItem
                    title="Facility Management"
                    src="/Navbar/Dashboard.jpg"
                    description="#1 AI-Powered CMMS for Maintenance Teams"
                    onClick={() => navigateWithScroll("/OurInnovation", "#card-0")}
                  />
                  <ProductItem
                    title="Inventory Management"
                    src="/Navbar/Inventory.jpg"
                    description="Get a full, granular view of your entire inventory, it's consuming and purchase"
                    onClick={() => navigateWithScroll("/OurInnovation", "#InventoryManagement")}
                  />
                  <ProductItem title="Employee Management" src="/Navbar/Employee.jpg" description="HRMS solution to track attendance, roles, and performance—all in one place" href="/OurInnovation/FacilityManagement" />
                </div>
                <div className="space-y-2">
                  <ProductItem
                    title="Asset Management"
                    src="/Navbar/Asset.jpg"
                    description="Digitize your asset lifecycle—from acquisition, maintenance to disposal"
                    onClick={() => navigateWithScroll("/OurInnovation", "#AssetManagement")}
                  />
                  <ProductItem
                    title="Complain Management"
                    src="/Navbar/Complain.jpeg"
                    description="Ensure smooth facility operations with real-time complaint resolution"
                    onClick={() => navigateWithScroll("/OurInnovation", "#ComplainManagement")}
                  />
                  <ProductItem title="Visitor Management" src="/Navbar/visitor.jpg" description="Effortless visitor logging, approvals, and notifications" href="/OurInnovation/FacilityManagement#InventoryManagement" />
                </div>
              </div>
            </div>
          )}
          <MenuItem setActive={setActive} active={active} item="Technical Services" href="/TechnologiesPage" />
          {active === "Technical Services" && (
            <div className="absolute left-120 text-white mt-7 bg-black/70 shadow-md rounded-lg p-8 z-30 text-sm">
              <div className="space-y-2"> 
                <ProductItem title="React Development" src="/Navbar/React.jpg" description="" href="/ReactDevelopment" />
                <ProductItem title="Dotnet Development" src="/Navbar/Dotnet.jpg" description="" href="/.NetDevelopment" />
                <ProductItem title="Mobile Development" src="/Navbar/Reactnative.jpg" description="" href="/MobileDevelopment" />
              </div>
            </div>
          )}
          <MenuItem setActive={setActive} active={active} item="Real Estate Advisory" href="/Management&advisory" />
          <MenuItem setActive={setActive} active={active} item="Hire" href="/CareerPage" />
        </Menu>
      </div>
    </div>
  );
}