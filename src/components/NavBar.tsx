"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, MenuItem, ProductItem } from "./ui/Navbar";
import { cn } from "@/utils/cn";
import { useLoginDialog } from "../app/CareerPage/LoginDialogContext";


export function NavBar() {
  const [active, setActive] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { openLogin } = useLoginDialog();

  const navigateWithScroll = (path: string, hash: string) => {
    router.push(path);
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <div
      className={cn(
        "fixed top-9 left-1/2 -translate-x-1/2 z-40 lg:w-full max-w-5xl px-16 "
      )}
    >
      <div className="hidden lg:block">
        <Menu setActive={setActive}>
          <MenuItem
            setActive={setActive}
            active={active}
            item="Facility Management"
            href="https://urest.in/"
          />
          {active === "Facility Management" && (
            <div className="absolute text-white mt-8 bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <ProductItem
                    title="Green Building Services"
                    src="/Navbar/greenbuildingservices.webp"
                    description="Eco-friendly buildings with green solutions"
                  />
                  <ProductItem
                    title="Technical Maintenance"
                    src="/Navbar/Technical MEP.webp"
                    description="Comprehensive MEP and facility care"
                  />
                  <ProductItem
                    title="Deep cleaning & HK"
                    src="/Navbar/deep cleaning housekeeping.webp"
                    description="Expert cleaning, hygiene, and care"
                  />
                  <ProductItem
                    title="Hospitality Manpower"
                    src="/Navbar/Hospitality Manpower.webp"
                    description="Professional staffing for hospitality operations"
                  />
                </div>
                <div className="flex flex-col ml-4">
                  <ProductItem
                    title="Integrated Facility Mgmt"
                    src="/Navbar/Dashboard.webp"
                    description="Tech-enabled facility management services"
                  />
                  <ProductItem
                    title="Horticulture Services"
                    src="/Navbar/Horticulture.webp"
                    description="Sustainable gardens, greener tomorrow"
                  />
                  <ProductItem
                    title="Club & Pool Mgmt"
                    src="/Navbar/Club.webp"
                    description="Smooth operations, vibrant communities"
                  />
                  <ProductItem
                    title="Waste Management"
                    src="/Navbar/waste management.webp"
                    description="Efficient and eco-friendly waste management"
                  />
                </div>
              </div>
            </div>
          )}
          <MenuItem
            setActive={setActive}
            active={active}
            item="Royal Nest Projects"
            href="https://www.royalnestgroup.com/"
          />
          {active === "Royal Nest Projects" && (
            <div className="absolute left-30 text-white mt-8 bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
              <div className="flex flex-col space-y-2">
                <ProductItem
                  title="Forest View Dharamshala"
                  src="/Navbar/Forestview, Dharamshala_ Ongoing.webp"
                  description="Ongoing"
                />
                <ProductItem
                  title="Hill View Apartments Jammu"
                  src="/Navbar/Hillview Apartments, Jammu_ Ongoing.webp"
                  description="Ongoing"
                />
                <ProductItem
                  title="Radisson Hotel Amritsar"
                  src="/Navbar/Radisson Hotel, Amritsar_ On-going.webp"
                  description="Ongoing"
                />
              </div>
            </div>
          )}
          <MenuItem
            setActive={setActive}
            active={active}
            item="Facility Tech"
            href="/OurInnovation"
          />
          {active === "Facility Tech" && (
            <div className="absolute left-20 text-white mt-8 bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
              <h2 className="text-xl text-center mb-6">Facility Management</h2>
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <ProductItem
                    title="PPM Scheduler"
                    src="/Navbar/PPM.webp"
                    description="Plan. Prevent. Perform. Full control of facility tasks at your fingertips"
                    onClick={() =>
                      navigateWithScroll("/OurInnovation", "#PPMScheduler")
                    }
                  />
                  <ProductItem
                    title="Inventory Management"
                    src="/Navbar/Inventory.webp"
                    description="Granular inventory and purchase tracking"
                    onClick={() =>
                      navigateWithScroll(
                        "/OurInnovation",
                        "#InventoryManagement"
                      )
                    }
                  />
                  <ProductItem
                    title="Employee Management"
                    src="/Navbar/Employee.webp"
                    description="Unified HRMS for team management"
                    onClick={() =>
                      navigateWithScroll(
                        "/OurInnovation",
                        "#EmployeeManagement"
                      )
                    }
                  />
                </div>
                <div className="flex flex-col ml-4">
                  <ProductItem
                    title="Asset Management"
                    src="/Navbar/Asset.webp"
                    description="Digital control of asset lifecycle"
                    onClick={() =>
                      navigateWithScroll("/OurInnovation", "#AssetManagement")
                    }
                  />
                  <ProductItem
                    title="Complain Management"
                    src="/Navbar/Complain.webp"
                    description="Ensure smooth facility operations with real-time complaint resolution"
                    onClick={() =>
                      navigateWithScroll(
                        "/OurInnovation",
                        "#ComplainManagement"
                      )
                    }
                  />
                  <ProductItem
                    title="Visitor Management"
                    src="/Navbar/visitor.webp"
                    description="Effortless visitor logging, approvals, and notifications"
                    onClick={() =>
                      navigateWithScroll("/OurInnovation", "#VisitorManagement")
                    }
                  />
                </div>
              </div>
            </div>
          )}
          <MenuItem
            setActive={setActive}
            active={active}
            item="Technical Services"
            href="/TechnologiesPage"
          />
          {active === "Technical Services" && (
            <div className="absolute left-90 text-white mt-8 bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
              <div className="flex flex-col space-y-2">
                <ProductItem
                  title="React Development"
                  src="/Navbar/React.webp"
                  description="Dynamic, component-based frontends for modern web apps using React"
                  href="/ReactDevelopment"
                />
                <ProductItem
                  title="Dotnet Development"
                  src="/Navbar/Dotnet.webp"
                  description="Scalable and secure enterprise solutions built on Microsoft's .NET framework"
                  href="/.NetDevelopment"
                />
                <ProductItem
                  title="Mobile Development"
                  src="/Navbar/Reactnative.webp"
                  description="Cross-platform apps for iOS and Android with seamless UX"
                  href="/MobileDevelopment"
                />
              </div>
            </div>
          )}
          <MenuItem
            setActive={setActive}
            active={active}
            item="Real Estate Advisory"
            href="/Management&advisory"
          />
          {active === "Real Estate Advisory" && (
            <div className="absolute left-40 text-white mt-8 bg-black/70 shadow-md rounded-lg p-8 z-50 text-sm">
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <ProductItem
                    title="Property Management"
                    src="/Navbar/Property Management.webp"
                    description="Your property, our priority"
                  />
                  <ProductItem
                    title="Property Sale"
                    src="/Navbar/propertysale.webp"
                    description="Strategic sales, seamless closures"
                  />
                </div>
                <div className="flex flex-col ml-4">
                  <ProductItem
                    title="Interiors & Renovation"
                    src="/Navbar/renovation.webp"
                    description="Experience-backed transformative renovations"
                  />
                  <ProductItem
                    title="Estate & Landscape Development"
                    src="/Navbar/greenbuildingservices.webp"
                    description="Landscaping with lasting purpose"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="relative">
            <MenuItem
              setActive={setActive}
              active={active}
              item="Hire"
              href="/CareerPage"
            />
            {active === "Hire" && pathname === "/CareerPage" && (
              <div className="absolute right-3 mt-3 text-white bg-black/70 shadow-md rounded-lg p-6 z-50 text-sm min-w-[90px] flex justify-end">
                <button
                  className="text-lg font-semibold hover:text-blue-400 transition duration-200 text-left"
                  onClick={openLogin} // 👈 this will now work
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </Menu>
      </div>
    </div>
  );
}
