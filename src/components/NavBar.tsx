"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
    <div className={cn("fixed top-8 right-4 z-40 w-auto md:w-auto md:right-35")}>
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

          <Link href="https://urest.in/" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Facility Management</Link>
          <Link href="/RoyalNestPage" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Royal Nest Projects</Link>
          <Link href="/OurInnovation" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
          <div className="ml-4 space-y-2">
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#card-0"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Facility Management</button>
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#AssetManagement"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Asset Management</button>
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#InventoryManagement"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Inventory Management</button>
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#ComplainManagement"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Complain Management</button>
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#EmployeeManagement"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Employee Management</button>
            <button onClick={() => { navigateWithScroll("/OurInnovation", "#VisitorManagement"); setIsMobileMenuOpen(false); }} className="block py-1 text-sm text-gray-300 hover:text-white text-left">Visitor Management</button>
          </div>
          <Link href="/TechnologiesPage" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Technical Services</Link>
          <div className="ml-4 space-y-2">
            <Link href="/ReactDevelopment" className="block py-1 text-sm text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>React Development</Link>
            <Link href="/.NetDevelopment" className="block py-1 text-sm text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Dotnet Development</Link>
            <Link href="/MobileDevelopment" className="block py-1 text-sm text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Mobile Development</Link>
          </div>
          <Link href="/Management&advisory" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Real Estate Advisory</Link>
          <Link href="/CareerPage" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Hire</Link>
          <Link href="/" className="block py-2 text-lg" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
          <div className="ml-4 space-y-2">
            <Link href="https://admin.urest.in:9056/" className="block py-1 text-sm text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>AOA Login</Link>
            <Link href="https://admin.urest.in:8097/" className="block py-1 text-sm text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Supervisor Login</Link>
            <Link href="https://ufirm.in/Account/Login" className="block py-1 text-sm text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Facility Management Login</Link>
          </div>
        </div>
      )}

      <div className="hidden md:block">
        <Menu setActive={setActive}>
          <MenuItem setActive={setActive} active={active} item="Facility Management" href="https://urest.in/" />
          {active === "Facility Management" && (
            <div className="absolute text-white mt-8 bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <ProductItem
                    title="Green Building Services"
                    src="/Navbar/greenbuildingservices.jpg"
                    description="Eco-friendly buildings with green solutions"
                  />
                  <ProductItem
                    title="Technical Maintenance"
                    src="/Navbar/Technicalmaintenance.jpeg"
                    description="End-to-end facility technical care"
                  />
                  <ProductItem
                    title="Deep cleaning & HK"
                    src="/Navbar/Deepcleaning.jpg"
                    description="Expert cleaning, hygiene, and care"
                  />
                </div>

                <div className="flex flex-col ml-4">
                  <ProductItem
                    title="Integrated Facility Mgmt"
                    src="/Navbar/Dashboard.jpg"
                    description="Tech-enabled facility management services"
                  />
                  <ProductItem
                    title="Horticulture Services"
                    src="/Navbar/horticulture.webp"
                    description="Sustainable gardens, greener tomorrow"
                  />
                  <ProductItem
                    title="Club & Pool Mgmt"
                    src="/Navbar/pool.webp"
                    description="Smooth operations, vibrant communities"
                  />
                </div>
              </div>
            </div>
          )}
          <MenuItem setActive={setActive} active={active} item="Royal Nest Projects" href="/RoyalNestPage" />
          <MenuItem setActive={setActive} active={active} item="Facility Tech" href="/OurInnovation" />
          {active === "Facility Tech" && (
            <div className="absolute left-20 text-white mt-8 bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
               <h2 className="text-xl text-center mb-6">Facility Management</h2>
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <ProductItem
                    title="Inventory Management"
                    src="/Navbar/Inventory.jpg"
                    description="Granular inventory and purchase tracking"
                    onClick={() => navigateWithScroll("/OurInnovation", "#InventoryManagement")}
                  />
                  <ProductItem
                    title="Employee Management"
                    src="/Navbar/Employee.jpg"
                    description="Unified HRMS for team management"
                    onClick={() => navigateWithScroll("/OurInnovation", "#EmployeeManagement")}
                  />
                  <ProductItem
                    title="Visitor Management"
                    src="/Navbar/visitor.jpg"
                    description="Effortless visitor logging, approvals, and notifications"
                    onClick={() => navigateWithScroll("/OurInnovation", "#VisitorManagement")}
                  />
                </div>

                <div className="flex flex-col ml-4">
                  <ProductItem
                    title="Asset Management"
                    src="/Navbar/Asset.jpg"
                    description="Digital control of asset lifecycle"
                    onClick={() => navigateWithScroll("/OurInnovation", "#AssetManagement")}
                  />
                  <ProductItem
                    title="Complain Management"
                    src="/Navbar/Complain.jpeg"
                    description="Ensure smooth facility operations with real-time complaint resolution"
                    onClick={() => navigateWithScroll("/OurInnovation", "#ComplainManagement")}
                  />
                </div>
              </div>
            </div>
          )}
          <MenuItem setActive={setActive} active={active} item="Technical Services" href="/TechnologiesPage" />
          {active === "Technical Services" && (
            <div className="absolute left-90 text-white mt-8 bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
              <div className="flex flex-col space-y-2">
                <ProductItem title="React Development" src="/Navbar/React.jpg" description="Dynamic, component-based frontends for modern web apps using React" href="/ReactDevelopment" />
                <ProductItem title="Dotnet Development" src="/Navbar/Dotnet.jpg" description="Scalable and secure enterprise solutions built on Microsoft&pos;s .NET framework" href="/.NetDevelopment" />
                <ProductItem title="Mobile Development" src="/Navbar/Reactnative.jpg" description="Cross-platform apps for iOS and Android with seamless UX" href="/MobileDevelopment" />
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