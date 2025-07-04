"use client";
import Link from 'next/link';
import SVGComponent from '@/components/Ufirm_estates';
import { usePathname } from "next/navigation";
import { FaLinkedin, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import React, { useState } from 'react';

const Footer = () => {
    const [form, setForm] = useState({ email: '' });
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });

        const data = await response.json();
        if (data.success) {
            alert("Your email has been subscribed!");
            setForm({ email: '' });
        } else {
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <footer className="bg-gray-800 text-gray-300 py-3 px-4 md:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8">
                <div className="mb-3 md:mb-0">
                    <SVGComponent className="w-28 h-27" />
                </div>
                <div className="flex flex-row items-center md:items-end">
                    <p className="text-white text-sm mr-4 text-center mb-1">Follow us on social</p>
                    <div className="flex space-x-4">
                        <a href="https://www.instagram.com/ufirm_technologies/" target="_blank" rel="noopener noreferrer" title="Instagram">
                            <FaInstagram className="w-7 h-7 text-white hover:text-gray-300 transition-colors" />
                        </a>
                        <a href="https://www.linkedin.com/company/ufirm-technologies-pvt-ltd/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                            <FaLinkedin className="w-7 h-7 text-white hover:text-gray-300 transition-colors" />
                        </a>
                        <a href="https://www.youtube.com/@ufirmtechnologies6437" target="_blank" rel="noopener noreferrer" title="YouTube">
                            <FaYoutube className="w-7 h-7 text-white hover:text-gray-300 transition-colors" />
                        </a>
                        <a href="https://www.facebook.com/ufirmtechnologies" target="_blank" rel="noopener noreferrer" title="Facebook">
                            <FaFacebook className="w-7 h-7 text-white hover:text-gray-300 transition-colors" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                    <ul className="space-y-2">
                        <li><Link href="/" className={`transition-colors ${isActive("/") ? "text-blue-400 font-bold" : "hover:text-white"}`}>Home</Link></li>
                        <li><Link href="/Aboutuspage" className={`transition-colors ${isActive("/Aboutuspage") ? "text-blue-400 font-bold" : "hover:text-white"}`}>About us</Link></li>
                        <li><Link href="/CareerPage" className={`transition-colors ${isActive("/CareerPage") ? "text-blue-400 font-bold" : "hover:text-white"}`}>Hire</Link></li>
                        <li><Link href="/ContactPage" className={`transition-colors ${isActive("/ContactPage") ? "text-blue-400 font-bold" : "hover:text-white"}`}>Contact Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-sm text-gray-400 font-semibold mb-4">Our Businesses</h3>
                    <ul className="space-y-2">
                        <li><a href="https://urest.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facility Management</a></li>
                        <li><Link href="/RoyalNestPage" className="hover:text-white transition-colors">Royal Nest Projects</Link></li>
                        <li><Link href="/OurInnovation" className="hover:text-white transition-colors">Facility Tech</Link></li>
                        <li><Link href="/TechnologiesPage" className="hover:text-white transition-colors">Technical Services</Link></li>
                        <li><Link href="/Management&advisory" className="hover:text-white transition-colors">Real Estates Advisory</Link></li>
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
                    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            placeholder="Email Address"
                            required
                            className="p-3 rounded bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-800 text-white font-semibold py-2 px-6 rounded w-fit self-start hover:bg-blue-500 transition-colors"
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
                    <Link href="/PrivacyPolicypage" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/SecurityPolicyPage" className="hover:text-white transition-colors">Security Policy</Link>
                    <Link href="/TermsofUsePage" className="hover:text-white transition-colors">Terms of Use</Link>
                    <Link href="/Sitepage" className="hover:text-white transition-colors">Site map</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
