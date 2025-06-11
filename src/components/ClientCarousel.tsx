"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const topClients = [
    { src: "/logos/Park-hyatt.png", alt: "Park Hyatt" },
    { src: "/logos/ITC Hotels.webp", alt: "ITC Hotels" },
    { src: "/logos/Sobha.webp", alt: "Sobha" },
    { src: "/logos/Sharda-university.webp", alt: "Sharda University" },
    { src: "/logos/indian-navy.webp", alt: "Indian Navy" },
    { src: "/logos/baincapital.png", alt: "Bain Capital" },
    { src: "/logos/fila.png", alt: "FILA" },
    { src: "/logos/indiabulls.png", alt: "Indiabulls" },
    { src: "/logos/thirdwave.png", alt: "Third Wave Coffee" },
];

const bottomClients = [
    { src: "/logos/baghmane.png", alt: "Baghmane" },
    { src: "/logos/citrix.png", alt: "Citrix" },
    { src: "/logos/7eleven.png", alt: "7-Eleven" },
    { src: "/logos/gianteagle.png", alt: "Giant Eagle" },
    { src: "/logos/delta.png", alt: "Delta" },
    { src: "/logos/kas.png", alt: "KAS Group Asia" },
    { src: "/logos/mfar.png", alt: "MFAR" },
    { src: "/logos/lululemon.png", alt: "Lululemon" },
    { src: "/logos/ansr.png", alt: "ANSR" },
    { src: "/logos/forum.png", alt: "Forum" },
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
                    speed="slow"
                    pauseOnHover={false}
                />
                <InfiniteMovingCards
                    items={bottomClients}
                    direction="left"
                    speed="slow"
                    pauseOnHover={false}
                />
            </div>
        </section>
    );
}
