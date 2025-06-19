"use client";

import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
// import { HamBurger } from "@/components/HamBurger";
import { useState } from 'react';
import { FaLinkedin, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Contact() {
    const [form, setForm] = useState({
        name: '', email: '', phone: '', category: '', message: '', receiveComm: true
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (type === 'checkbox' && 'checked' in e.target) ? (e.target as HTMLInputElement).checked : undefined;
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    };

    return (
        <div>
            <div className="absolute top-1 left-0 w-full z-50">
                <div className="flex items-center justify-between px-4 mt-1">
                    <Link href="/">
                        <Image
                            src="/UFIRM ESTATES LOGO.png"
                            alt="logo"
                            width={100}
                            height={50}
                            priority
                        />
                    </Link>
                    <NavBar />
                </div>
            </div>
            <div className="min-h-screen  flex justify-center items-center relative">
                <div className="absolute right-0 bottom-0 w-full h-full">
                    <Image
                        src="/Contact.jpg"
                        alt="Handshake"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg z-10 mt-40 mb-20 text-black">
                    <h2 className="text-2xl font-bold mb-2 ">Connect with us today</h2>
                    <p className="mb-6">Fill out the form below to get started</p>

                    <form className="space-y-4">
                        <input name="name" onChange={handleChange} value={form.name} type="text" placeholder="Full name" className="w-full border px-4 py-2 rounded-md text-black" />
                        <input name="email" onChange={handleChange} value={form.email} type="email" placeholder="Email address" className="w-full border px-4 py-2 rounded-md" />
                        <input name="phone" onChange={handleChange} value={form.phone} type="tel" placeholder="Mobile Number" className="w-full border px-4 py-2 rounded-md" />

                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            id="category"
                            name="category"
                            onChange={handleChange}
                            value={form.category}
                            className="w-full border px-4 py-2 rounded-md"
                        >
                            <option value="">Select category</option>
                            <option value="support">Support</option>
                            <option value="sales">Sales</option>
                            <option value="feedback">Feedback</option>
                        </select>

                        <textarea name="message" onChange={handleChange} value={form.message} placeholder="How can we help you?" className="w-full border px-4 py-2 rounded-md h-24" />

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="receiveComm"
                                name="receiveComm"
                                checked={form.receiveComm}
                                onChange={handleChange}
                                title="Receive communications from SILA"
                            />
                            <label htmlFor="receiveComm">I would like to receive communications from UFIRM</label>
                        </div>

                        <div className="w-full h-[78px] bg-gray-200 flex items-center justify-center rounded-md">
                            <span className="text-sm text-gray-500">[ CAPTCHA PLACEHOLDER ]</span>
                        </div>

                        <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white w-full py-2 rounded-md font-medium">
                            Request a callback
                        </button>
                    </form>

                    <div className="mt-10">
                        <h3 className="text-lg font-semibold mb-4">Connect with us on Social</h3>
                        <div className="flex space-x-4">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram">
                                <FaInstagram className="w-7 h-7 text-black hover:text-gray-600 transition-colors" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                                <FaLinkedin className="w-7 h-7 text-black hover:text-gray-600 transition-colors" />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube">
                                <FaYoutube className="w-7 h-7 text-black hover:text-gray-600 transition-colors" />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
                                <FaFacebook className="w-7 h-7 text-black hover:text-gray-600 transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}