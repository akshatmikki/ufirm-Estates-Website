"use client";
import SVGComponent from "@/components/Ufirm_estates";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { FaMapMarkedAlt } from "react-icons/fa";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving";
import { TextGenerateEffect } from "@/components/ui/textgeneratoreffect";

const Photos = [
    { src: "/Royal nest/Drawingroom.png", alt: "Drawing Room" },
    { src: "/Royal nest/Inside bedroom.jpeg", alt: "Bedroom" },
    { src: "/Royal nest/Dharamshala.jpg", alt: "Dharamshala" },
    { src: "/Royal nest/Washroom.png", alt: "Washroom" },
];

export default function Royalnest() {
    return (
        <div>
            <div className="absolute top-1 left-0 w-full z-50">
                <div className="flex items-center justify-between px-4 mt-1">
                    <Link href="/">
                        <SVGComponent className="w-28 h-27" />
                    </Link>
                    <NavBar />
                </div>
            </div>
            <div >
                <div className="relative">
                    <video
                        width="100%"
                        height="70%"
                        autoPlay={true}
                        muted
                        loop
                        className="shadow-md object-cover h-[70vh] md:h-[60vh] lg:h-[80vh] w-full bg-black/30"
                    >
                        <source src="/Royal nest/industrial-building.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                      <div className="absolute inset-0 bg-black/45"></div>
                    <div className="absolute inset-0 flex items-center justify-center p-4 md:p-10">
                        <div className="shadow-xl p-4 rounded-xl text-center max-w-full bg-opacity-50">
                            <h1 className="text-6xl font-bold mb-4 sm:mt-4"><TextGenerateEffect words="Royal Nest Projects" /></h1>
                            <hr className="w-30 border-t-2 border-yellow-500 mx-auto mb-4" />
                            <strong className="text-sm sm:text-base md:text-2xl">
                                <TextGenerateEffect words="For over two decades, Royal Nest Group has quietly yet steadfastly made its mark on North India real estate landscape." />
                            </strong>
                        </div>
                    </div>
                </div>
                <div className="text-center py-12">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        Our Developments
                    </h2>

                    <div className="my-4 text-orange-400 text-2xl animate-bounce">⌄</div>

                    <h3 className="text-2xl font-serif text-gray-600">
                        Forest View Apartments
                    </h3>

                    <p className="uppercase text-xs tracking-wider text-gray-400">
                        Shiv Nagar
                    </p>

                    <div className="flex justify-center items-center gap-2 mt-4 text-gray-600">
                        <FaMapMarkedAlt className="text-lg" />
                        <span className="text-md">Dharamshala, Himachal Pradesh</span>
                    </div>

                    <button className="mt-6 px-4 py-2 bg-gray-100 text-sm rounded-md shadow-sm text-gray-700 cursor-default">
                        Completed
                    </button>
                    <video
                        width="100%"
                        height="70%"
                        autoPlay={true}
                        muted
                        loop
                        className="shadow-md object-cover h-[40vh] md:h-[60vh] lg:h-[80vh] w-full mt-4"
                    >
                        <source src="/Royal nest/Dharamshala.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <InfiniteMovingCards items={Photos}
                        direction="left"
                        speed="fast"
                        pauseOnHover={false}
                    />
                    <div
                        className="min-h-screen bg-cover bg-center text-white flex items-center justify-center"
                        style={{ backgroundImage: "url('/Royal nest/Kitchen.png')" }}
                    >
                        <div className="max-w-4xl bg-black/60 p-10 rounded-xl shadow-lg">
                            <h1 className="text-3xl font-semibold mb-6">About Forest View Apartments</h1>
                            <p className="mb-4">
                                This limited-edition project consists of 68 fully furnished apartments located next to forest land, home to over 500 species of indigenous trees, offerening stunning views of the Dhauladhar Matterhorn mountains. Just 5 kilometers from the main Dharamshala market and half a kilometer from the renowned herbal cancer hospital, the project provides a peacefull environment, free from tourist congestion.
                            </p>
                            <p className="mb-6">
                                Residents can enjoy waking up to the sounds of birds and breathe in the fresh forest air while admiring the mountain scenery every day.
                            </p>

                            {/* <div className="flex gap-4 mb-6">
                                <span className="border border-white px-3 py-1 rounded-full">Simplex</span>
                                <span className="border border-yellow-400 bg-yellow-400 text-black px-3 py-1 rounded-full">Duplex</span>
                            </div> */}

                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <Link href="/Royal nest/Brochure.pdf" target="_blank">
                                    <div className="flex items-center gap-2 cursor-pointer text-yellow-400 hover:underline">
                                        <span>📥</span>
                                        <span>Download brochure</span>
                                    </div>
                                </Link>
                                {/* <Link href="https://maps.google.com" target="_blank">
                                    <div className="flex items-center gap-2 cursor-pointer hover:underline">
                                        <span>📍</span>
                                        <span>Get directions</span>
                                    </div>
                                </Link> */}
                            </div>
                            <Link href="https://royalnestdharamshala.com/" target="_blank"
                                rel="noopener noreferrer">
                                <button className="bg-yellow-400 text-black px-6 py-3 rounded-md font-medium hover:bg-yellow-300">
                                    Take a deeper look →
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}