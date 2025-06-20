"use client";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "../../components/NavBar";

export default function PrivacyPolicy() {
    return (
        <div className="bg-white text-black min-h-screen ">

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
            <div className="pt-24 pb-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 max-w-6xl mx-auto mt-5">
                <p className="text-center font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4">Privacy Policy</p>
                <p className="text-right text-sm sm:text-base mb-6 ">Last updated 19-06-2025</p>

                <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">How We Protect You</p>
                <p className="text-sm sm:text-base md:text-lg mb-4 leading-relaxed">
                    UFIRM Technologies Pvt. Ltd. (“UFIRM”) is committed to protecting the privacy of information and data that may be used to identify you, your personal information. The intention of this privacy policy (the “Privacy Policy”) is to disclose our information-gathering practices and describe how we use your personal information. The effective date of this Privacy Policy is June 19, 2025.
                </p>

                <div className="mt-6">
                    <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">Information We Collect</p>
                    <p className="text-sm sm:text-base md:text-lg mb-2 leading-relaxed">
                        We collect personal information from you if you use our website, fill out forms on our website or on paper at events, or use any of our web-based products or services. The types of personal information we collect include,
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-sm sm:text-base md:text-lg leading-relaxed">
                        <li>Personalization information including, but not limited to, an uploaded profile photo</li>
                        <li>Identifiers: A real name, alias, postal address, email address, unique personal identifier, online identification, Internet Protocol address, email address, account name, Social Security number, driver’s license number, passport number, current or past job history, or other similar identifiers</li>
                        <li>Commercial Information: Records of personal property, products or services purchases, obtained, or considered, or other purchasing or consuming histories or tendencies.</li>
                        <li>Usage: Information on the user’s interaction the solution</li>
                        <li>Geolocation data: Physical location</li>
                    </ul>
                </div>

                <div className="mt-6">
                    <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">How We Use Your Personal Information</p>
                    <p className="text-sm sm:text-base md:text-lg mb-2 leading-relaxed">
                        The personal information that we collect is used to perform our contractual obligations and for our other legitimate interests. In some cases, we may ask you for your consent to use your personal information, but any consent will be presented to you separately from this Privacy Policy. We may use your personal information for purposes including, but not limited to, the following:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-sm sm:text-base md:text-lg leading-relaxed">
                        <li>To deliver services, products, or transactions that you have requested</li>
                        <li>To improve our website, including upgrading security measures</li>
                        <li>To send you promotional materials or communications regarding our content and services that we feel may be of interest to you</li>
                        <li>To evaluate the products and services that we offer and develop new or improved products or services and to better understand UFIRM’s business environment</li>
                        <li>For educational purposes, such as polls conducted in webinars</li>
                        <li>To conduct general research on topics of interests to UFIRM and its customers</li>
                    </ul>
                </div>

                <div className="mt-6">
                    <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">How We Share Your Personal Information</p>
                    <p className="text-sm sm:text-base md:text-lg mb-2 leading-relaxed">
                        We may share your information for any of these purposes with the following individuals and entities:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-sm sm:text-base md:text-lg leading-relaxed">
                        <li>Services used by UFIRM to aid our ability to provide the best possible experience to you.</li>
                        <li>UFIRM may need to share your information for law enforcement or other legal purposes. This type of sharing may be necessary in connection with a lawsuit, claim or investigation, governmental inquiry, court order, enforcement of legal rights (e.g., contract terms, intellectual property rights, etc.), safety issue, or other similar legal or security matter. Sharing your information for these reasons is not a regular event, but could arise from time to time. We will strive to limit the types and amount of information we may need to share for legal purposes to that which is reasonably necessary.</li>
                        <li>We may share (or receive) information about you, including personal contact information, in the event of an acquisition, merger, sale, corporate restructuring, bankruptcy, or other similar event that involves UFIRM. If such an event occurs, UFIRM will take reasonable steps to require that your information be handled in accordance with this Privacy Policy.</li>
                    </ul>
                </div>

                <div className="mt-6">
                    <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">Transfer of Information to the INDIA</p>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed">
                        UFIRM is headquartered in the INDIA. Information we collect from you will be processed in the INDIA. In particular, UFIRM collects and transfers personal information to the INDIA only with your consent, to perform on a contract with you (or in your interest), or to fulfil a compelling legitimate interest of UFIRM in a manner that does not outweigh your rights and freedoms. UFIRM endeavours to apply suitable safeguards to protect the privacy and security of your personal information and to use it in a manner that is consistent with this Privacy Policy. UFIRM does not collect sensitive data such as data concerning health, gender, racial or ethnic origins, or genetic or personal information from children.
                    </p>
                </div>

                <div className="mt-6 space-y-6">
                    <div className="text-sm sm:text-base md:text-lg leading-relaxed">
                        <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">Data Retention</p>
                        <p>UFIRM retains personal information for as long as we have a legitimate business relationship with you or with an organization with which you are affiliated (such as your employer). We may also retain personal information about prospective customers or prospective employees until we determine that it is unlikely that we will provide you with services and/or employ you. We also may retain your personal information for as long as necessary to comply with our legal or contractual obligations.</p>
                    </div>

                    <div className="text-sm sm:text-base md:text-lg leading-relaxed">
                        <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">Your Rights</p>
                        <p>If you do not want to receive promotional or marketing communications from UFIRM, you may opt-out at any time by clicking the “unsubscribe” link at the end of our emails. If you choose to unsubscribe, we will retain your contact information to ensure that we do not contact you again.</p>
                    </div>

                    <div className="text-sm sm:text-base md:text-lg leading-relaxed">
                        <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">Security</p>
                        <p>UFIRM uses a number of security technologies and procedures to ensure your personal information is protected from unauthorized access, use, or disclosure. However, we cannot guarantee that third parties will not overcome these measures and gain access to your information. To the fullest extent permitted by law, UFIRM disclaims any warranty or guarantee that your information will be protected from misuse, appropriation, alteration, or loss.</p>
                    </div>

                    <div className="text-sm sm:text-base md:text-lg leading-relaxed">
                        <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">Links to External Websites</p>
                        <p>This website contains links to websites that are not controlled by UFIRM. Please be aware that we are not responsible for the content, security, and privacy practices of external sites. We encourage you to familiarize yourself with the privacy policy of all websites where you submit personal information.</p>
                    </div>

                    <div className="text-sm sm:text-base md:text-lg leading-relaxed">
                        <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">Cookies We Use</p>
                        <p>We and our authorized partners may use cookies and other information gathering technologies for a variety of purposes. These technologies may provide us with personal information, information about devices and networks you utilize to access our Websites, and other information regarding your interactions with our Websites.</p>
                    </div>

                    <div className="text-sm sm:text-base md:text-lg leading-relaxed">
                        <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">Changes to Privacy Policy</p>
                        <p>From time to time, UFIRM may change or update this Privacy Policy. We recommend you regularly review this page. When we update this Privacy Policy, we will also revise the “last updated” date at the top of this page. UFIRM will use reasonable commercial efforts to notify you of changes to this Privacy Policy that materially change the disclosures made here.</p>
                    </div>

                    <div className="text-sm sm:text-base md:text-lg leading-relaxed">
                        <p className="text-xl sm:text-2xl md:text-3xl mb-2 font-bold">Contact Information</p>
                        <p>If you have any questions about our Security Policy, please contact us or send us a note at:</p>
                        <p className="mt-2">Landline: +91 120 424 5551</p>
                        <p>Email: <a href={`mailto:${"info@ufirm.in"}`} style={{ color: "blue" }}>
                            {"info@ufirm.in"}
                        </a> | <a href={`mailto:${"support@ufirm.in"}`} style={{ color: "blue" }}>
                                {"support@ufirm.in"}
                            </a></p>
                        <p>HO Address: H-64, Sector 63, Noida, Uttar Pradesh, India- 201307.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}