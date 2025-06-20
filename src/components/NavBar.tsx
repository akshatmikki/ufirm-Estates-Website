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
    router.push(path); 
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 500); 
  };

  return (
    <div className={cn("fixed top-8 right-4 z-40 w-auto md:w-auto md:right-10")}>
      <div className="md:hidden flex justify-end items-center px-4 py-2 text-white rounded-xl shadow z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="focus:outline-none bg-black/20 p-2 rounded-xl" 
          title={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden fixed right-0 top-0 bottom-0 w-64 bg-black/70 text-white p-4 space-y-4 shadow-lg z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="focus:outline-none text-white p-2 rounded"
              title="Close menu"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          <a href="https://urest.in/" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Facility Management</a>
          <a href="/RoyalNestPage" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Royal Nest Projects</a>
          <a href="/OurInnovation" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Products</a>
          <div className="ml-4 space-y-2">
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#card-0"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Facility Management</button>
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#AssetManagement"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Asset Management</button>
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#InventoryManagement"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Inventory Management</button>
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#ComplainManagement"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Complain Management</button>
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#EmployeeManagement"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Employee Management</button>
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#VisitorManagement"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Visitor Management</button>
          </div>
          <a href="/TechnologiesPage" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Technical Services</a>
          <div className="ml-4 space-y-2">
            <a href="/ReactDevelopment" className="block py-1 text-sm text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>React Development</a>
            <a href="/.NetDevelopment" className="block py-1 text-sm text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Dotnet Development</a>
            <a href="/MobileDevelopment" className="block py-1 text-sm text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Mobile Development</a>
          </div>
          <a href="/Management&advisory" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Real Estate Advisory</a>
          <a href="/CareerPage" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Hire</a>
        </div>
      )}

      <div className="hidden md:block">
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Facility Management" href="https://urest.in/" />
          <MenuItem setActive={setActive} active={active} item="Royal Nest Projects" href="/RoyalNestPage" />
          <MenuItem setActive={setActive} active={active} item="Products" href="/OurInnovation" />
          {active === "Products" && (
            <div className="absolute left-20 text-white mt-8 bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
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
                  <ProductItem title="Employee Management" src="/Navbar/Employee.jpg" description="HRMS solution to track attendance, roles, and performance—all in one place" onClick={() => navigateWithScroll("/OurInnovation", "#EmployeeManagement")} />
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
                  <ProductItem title="Visitor Management" src="/Navbar/visitor.jpg" description="Effortless visitor logging, approvals, and notifications" onClick={() => navigateWithScroll("/OurInnovation", "#VisitorManagement")} />
                </div>
              </div>
            </div>
          )}
          <MenuItem setActive={setActive} active={active} item="Technical Services" href="/TechnologiesPage" />
          {active === "Technical Services" && (
            <div className="absolute left-90 text-white mt-8 bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
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