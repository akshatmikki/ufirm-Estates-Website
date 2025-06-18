"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const topClients = [
    { src: "/logos/Park-hyatt.png", alt: "Park Hyatt" },
    { src: "/logos/ITC Hotels.webp", alt: "ITC Hotels" },
    { src: "/logos/Sobha.png", alt: "Sobha" },
    { src: "/logos/Sharda-university.png", alt: "Sharda University" },
    { src: "/logos/indian-navy.webp", alt: "Indian Navy" },
    { src: "/logos/Marriott.png", alt: "Marriott" },
    { src: "/logos/sharda-hospital.png", alt: "Sharda Hospital" },
    { src: "/logos/LT.png", alt: "LT" },
    { src: "/logos/BigBasket.jpg", alt: "Big Basket" },
    { src: "/logos/Kailash.jpg", alt: "Kailash hospital" },
    { src: "/logos/Commure.jpg", alt: "Commure" },
    { src: "/logos/Modern-Automotive.png", alt: "Modern Automotive" },
    { src: "/logos/cinntra.jpeg", alt: "Cinntra" },
];

const bottomClients = [
    { src: "/logos/JMFlorence.jpeg", alt: "JM Florence" },
    { src: "/logos/Donaldson.png", alt: "Donaldson" },
    { src: "/logos/Signode.jpg", alt: "Signode" },
    { src: "/logos/selaqui.png", alt: "SelaQui" },
    { src: "/logos/Vicon.jpg", alt: "Vicon" },
    { src: "/logos/dpsg.png", alt: "DPSG" },
    { src: "/logos/SafeExpress.png", alt: "SafeExpress" },
    { src: "/logos/Schaeffler.jpg", alt: "Schaeffler" },
    { src: "/logos/Exotica.png", alt: "Exotica" },
    { src: "/logos/Ck-Birla-Hospital.png", alt: "CK Birla Hospital" },
    { src: "/logos/ace.png", alt: "ace" },
    { src: "/logos/iSprout.jpg", alt: "iSprout" },
    { src: "/logos/RG.jpeg", alt: "RG" },
];

export default function ClientCarousel() {
    return (
        <section className="relative w-full py-16 bg-gray-50">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Over 500 clients have trusted us with their
                    <br />
                    <span className="text-3xl font-bold text-black">Real Estate needs across India</span>
                </h2>
            </div>
            <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-gray-50 to-transparent z-10" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-gray-50 to-transparent z-10" />
                <InfiniteMovingCards
                    items={topClients}
                    direction="right"
                    speed="normal"
                    pauseOnHover={false}
                />
                <InfiniteMovingCards
                    items={bottomClients}
                    direction="left"
                    speed="normal"
                    pauseOnHover={false}
                />
            </div>
        </section>
    );
}
