"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from "next/navigation";
import { FaLinkedin, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;
    return (
        <footer className="bg-gray-800 text-gray-300 py-3 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="mb-3 md:mb-0">
                    <Image src="/UFIRM ESTATES LOGO.png" alt="Logo" width={120} height={50} />
                </div>
                <div className="flex flex-row items-center md:items-end">
                    <p className="text-white text-sm mr-4 text-center mb-1">Follow us on social</p>
                    <div className="flex space-x-4">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
                            <FaInstagram className="w-7 h-7 text-white hover:text-gray-300 transition-colors" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                            <FaLinkedin className="w-7 h-7 text-white hover:text-gray-300 transition-colors" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube">
                            <FaYoutube className="w-7 h-7 text-white hover:text-gray-300 transition-colors" />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
                            <FaFacebook className="w-7 h-7 text-white hover:text-gray-300 transition-colors" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/"
                                className={`transition-colors ${isActive("/") ? "text-yellow-400 font-bold" : "hover:text-white text-gray-300"
                                    }`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/Aboutuspage"
                                className={`transition-colors ${isActive("/about") ? "text-yellow-400 font-bold" : "hover:text-white text-gray-300"
                                    }`}
                            >
                                About us
                            </Link>
                        </li>
                        {/* <li>
                            <Link
                                href="/work-with-us"
                                className={`transition-colors ${isActive("/work-with-us") ? "text-yellow-400 font-bold" : "hover:text-white text-gray-300"
                                    }`}
                            >
                                Divisions
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/TechnologiesPage"
                                className={`transition-colors ${isActive("/our-impact") ? "text-yellow-400 font-bold" : "hover:text-white text-gray-300"
                                    }`}
                            >
                                Technologies
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/insights"
                                className={`transition-colors ${isActive("/insights") ? "text-yellow-400 font-bold" : "hover:text-white text-gray-300"
                                    }`}
                            >
                                Projects
                            </Link>
                        </li> */}
                        <li>
                            <Link
                                href="/CareerPage"
                                className={`transition-colors ${isActive("/insights") ? "text-yellow-400 font-bold" : "hover:text-white text-gray-300"
                                    }`}
                            >
                                Career
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/ContactPage"
                                className={`transition-colors ${isActive("/contact") ? "text-yellow-400 font-bold" : "hover:text-white text-gray-300"
                                    }`}
                            >
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm text-gray-400 font-semibold mb-4">Our Businesses</h3>
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="https://urest.in/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors"
                            >
                                Urest
                            </a>
                        </li>
                        <li>
                            <Link href="/RoyalNestPage" className="hover:text-white transition-colors">
                                Royal Nest
                            </Link>
                        </li>
                        <li>
                            <Link href="/OurInnovation" className="hover:text-white transition-colors">
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link href="/TechnologiesPage" className="hover:text-white transition-colors">
                                Technical Services
                            </Link>
                        </li>
                        <li>
                            <Link href="/real-estate-development" className="hover:text-white transition-colors">
                                Estates
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm text-gray-400 font-semibold mb-4">Corporate Office</h3>
                    <address className="not-italic leading-relaxed">
                        H-64, <br />
                        Sector 63, Noida, <br />
                        Uttar Pradesh - 201301
                    </address>

                    <div className="mt-6 w-full h-48 bg-gray-700 rounded overflow-hidden">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1751.0468951223284!2d77.37522785615947!3d28.626950993891608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef8a45d37eeb%3A0x4f7208dcb331580b!2sUrest%20Society%20%26%20Integrated%20Facility%20Management!5e0!3m2!1sen!2sin!4v1749201989331!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Ufirm HO Office Location"
                        ></iframe>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm text-gray-400 font-semibold mb-4">Stay informed with Real Estate updates from us.</h3>
                    <form className="flex flex-col space-y-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-yellow-500 text-white font-semibold py-2 px-6 rounded w-fit self-start hover:bg-yellow-600 transition-colors"
                        >
                            Subscribe Now
                        </button>
                    </form>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
                <p className="text-gray-400 mb-4 md:mb-0">
                    Copyright &copy; {new Date().getFullYear()} UFirm Technologies Pvt Ltd. All rights reserved.
                </p>
                <div className="flex space-x-6">
                    <Link href="/PrivacyPolicypage" className="hover:text-white transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/SecurityPolicyPage" className="hover:text-white transition-colors">
                        Security Policy
                    </Link>
                    <Link href="/TermsofUsePage" className="hover:text-white transition-colors">
                        Terms of Use
                    </Link>
                    <Link href="/Sitepage" className="hover:text-white transition-colors">
                        Site map
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;