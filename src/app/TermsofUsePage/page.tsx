"use client";
import Link from "next/link";
import { NavBar } from "../../components/NavBar";
import Image from "next/image";
import { HamburgerMenu } from "../../components/Hamburger";

export default function TermsofUsePage() {
    return (
        <div className="bg-white text-black min-h-screen  ">

            <div className="absolute top-1 left-0 w-full z-50">
                <div className="flex items-center justify-between px-4 mt-1">
                    <Link href="/">
                        <Image className="dark:invert mt-9"
                                    src={"/UFIRM ESTATES LOGO.svg"} alt={"UFIRM ESTATES LOGO"} width={100} height={100}  />
                    </Link>
                    <div className="block lg:hidden">
                        <HamburgerMenu />
                    </div>

                    <div className="hidden lg:block">
                        <NavBar />
                    </div>
                </div>
            </div>
            <div className="max-w-4xl mx-auto p-6 sm:p-12 mt-20">
                <h1 className="text-3xl font-bold mb-6 text-center">Terms of Use</h1>

                <p className="mb-4">
                    By accessing and using this website (the &quot;Site&quot;), provided by UFIRM Technologies Private Limited (“UFIRM Technologies”), you acknowledge that you have read, understood, and agree to be bound by the following Terms and Conditions. UFIRM Technologies reserves the right to modify these Terms of Use at any time without prior notice. Your continued use of the Site constitutes your acceptance of any changes.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Accuracy of Information</h2>
                <p className="mb-4">
                    While UFIRM Technologies aims to provide accurate and reliable information, we do not guarantee the correctness or reliability of any content on the Site and assume no liability for errors or omissions.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Site Use Conditions</h2>
                <p className="mb-4">
                    You may download content solely for non-commercial, personal use. You must not copy, modify, display, distribute, or use content from the Site for commercial purposes without prior written permission.
                </p>
                <p className="mb-4">
                    You agree not to engage in unlawful activities or misuse the Site in any way that could harm its integrity or performance.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Unsolicited Submissions</h2>
                <p className="mb-4">
                    UFIRM Technologies does not accept unsolicited ideas or materials. Any submissions will be treated as non-confidential, and UFIRM Technologies is under no obligation to use or respond to them.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Disclaimers</h2>
                <ul className="list-disc ml-6 mb-4">
                    <li>The Site is provided &quot;as is&quot; without warranties of any kind.</li>
                    <li>UFIRM Technologies is not responsible for errors, omissions, or the content of linked third-party sites.</li>
                    <li>No liability is accepted for Site availability, software/equipment compatibility, or damages resulting from its use.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
                <p className="mb-4">
                    In no event will UFIRM Technologies or its affiliates be liable for any damages arising from the use of this Site. Total liability will not exceed the amount paid to UFIRM Technologies in the month of the liability event.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Indemnification</h2>
                <p className="mb-4">
                    You agree to indemnify and hold UFIRM Technologies harmless from any claims or damages resulting from your use of the Site or violation of these terms.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Copyright Infringement</h2>
                <p className="mb-2">
                    If you believe content on the Site infringes your copyright, contact us at <a href={`mailto:${"info@ufirm.in"}`} style={{ color: "blue" }}>
                        {"info@ufirm.in"}
                    </a> with:
                </p>
                <ul className="list-disc ml-6 mb-4">
                    <li>Your signature and contact details</li>
                    <li>Description and location of the allegedly infringing material</li>
                    <li>A statement of good faith belief</li>
                    <li>A statement under penalty of perjury confirming accuracy</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Jurisdiction</h2>
                <p className="mb-4">
                    This Site is operated from Noida, Uttar Pradesh, India and governed by Indian laws. Disputes must be raised within six months and will be subject to Noida jurisdiction.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Data Collection & Use</h2>
                <p className="mb-4">
                    UFIRM Technologies collects data such as IP addresses, usage patterns, and device details to enhance user experience and services. Information may also be shared with affiliates to monitor performance.
                </p>
                <p className="mb-4">
                    Personal information is collected where voluntarily submitted, such as when requesting services. We do not knowingly collect data from children under 16.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
                <p className="mb-4">
                    UFIRM Technologies PVT LTD<br />
                    Registered office at H-64,<br />
                    Sector 63,<br />
                    Noida – 201301<br />
                    Email: <a href={`mailto:${"info@ufirm.in"}`} style={{ color: "blue" }}>
                        {"info@ufirm.in"}
                    </a> | <a href={`mailto:${"support@ufirm.in"}`} style={{ color: "blue" }}>
                        {"support@ufirm.in"}
                    </a>
                </p>

                <p className="text-sm text-gray-500 mt-6">Revised: 20.06.2025</p>
            </div>
        </div>
    );
}