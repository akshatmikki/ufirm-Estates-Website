"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const topClients = [
    { src: "/logos/Park-hyatt.png", alt: "Park Hyatt" },
    { src: "/logos/ITC_Hotels.png", alt: "ITC Hotels" },
    { src: "/logos/Sobha.png", alt: "Sobha" },
    { src: "/logos/Sharda-university.png", alt: "Sharda University" },
    { src: "/logos/indian-navy.png", alt: "Indian Navy" },
    { src: "/logos/Marriott.png", alt: "Marriott" },
    { src: "/logos/sharda-hospital.png", alt: "Sharda Hospital" },
    { src: "/logos/LT.png", alt: "LT" },
    { src: "/logos/BigBasket.png", alt: "Big Basket" },
    { src: "/logos/Kailash.png", alt: "Kailash hospital" },
    { src: "/logos/Commure.png", alt: "Commure" },
    { src: "/logos/Modern-Automotive.png", alt: "Modern Automotive" },
    { src: "/logos/cinntra.png", alt: "Cinntra" },
];

const bottomClients = [
    { src: "/logos/JMFlorence.png", alt: "JM Florence" },
    { src: "/logos/Donaldson.png", alt: "Donaldson" },
    { src: "/logos/Signode.png", alt: "Signode" },
    { src: "/logos/selaqui.png", alt: "SelaQui" },
    { src: "/logos/Vicon.png", alt: "Vicon" },
    { src: "/logos/dpsg.png", alt: "DPSG" },
    { src: "/logos/SafeExpress.png", alt: "SafeExpress" },
    { src: "/logos/Schaeffler.png", alt: "Schaeffler" },
    { src: "/logos/Exotica.png", alt: "Exotica" },
    { src: "/logos/Ck-Birla-Hospital.png", alt: "CK Birla Hospital" },
    { src: "/logos/ace.png", alt: "ace" },
    { src: "/logos/iSprout.png", alt: "iSprout" },
    { src: "/logos/RG.png", alt: "RG" },
];

export default function ClientCarousel() {
    return (
        <section className="relative w-full py-10 sm:py-16 bg-gray-50">
            <div className="text-center mb-8 sm:mb-10 px-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                    <span className="text-2xl sm:text-3xl font-bold text-black">Trusted By 250+ clients across India</span>
                </h2>
            </div>
            <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-20 sm:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-20 sm:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
                <InfiniteMovingCards
                    items={topClients}
                    direction="right"
                    speed="slow"
                    pauseOnHover={true}
                />
                <InfiniteMovingCards
                    items={bottomClients}
                    direction="left"
                    speed="slow"
                    pauseOnHover={true}
                />
            </div>
        </section>
    );
}