"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  FaTools,
  FaUserShield,
  FaWind,
  FaBroom,
  FaUserCheck,
  FaEnvelopeOpenText,
  FaPaperclip,
} from "react-icons/fa";
import { TextGenerateEffect } from "@/components/ui/textgeneratoreffect";
import { HamburgerMenu } from "@/components/Hamburger";
import { LoginDialogProvider, useLoginDialog } from "./LoginDialogContext";
import { getJobs, createJob, deleteJob, JobInfo } from "@/app/api/job";

function CareerPageContent() {
  const { showLogin, closeLogin } = useLoginDialog();
  const [showPosterPopup, setShowPosterPopup] = useState(false);
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [showJobInfoForm, setShowJobInfoForm] = useState(false);
  const [appliedJobInfo, setAppliedJobInfo] = useState<JobInfo | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [resumeEmail, setResumeEmail] = useState("");
  const [resumeMobile, setResumeMobile] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("welcome");
  const [search, setSearch] = useState("");
  const [userJobs, setUserJobs] = useState<JobInfo[]>([]);
  const [newJob, setNewJob] = useState({
    Title: "",
    Type: "",
    Posted: new Date().toLocaleDateString().split("T")[0],
    Education: "",
    CTC: "",
    Company: "UFirm",
    Department: "",
    Designation: "",
    ImageUrl: "",
  });

  const latestJobWithImage = userJobs.findLast(job => job.ImageUrl);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const defaultEmail = "user@ufirm.com";
  const defaultPassword = "Password123";
  const canLogin = loginEmail.trim() !== "" && loginPassword.trim() !== "";

  // Fetch jobs on search change
  useEffect(() => {
    async function fetchJobs() {
      try {
        const jobs = await getJobs(search);
        setUserJobs(jobs);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    }
    fetchJobs();
  }, [search]);

  useEffect(() => {
    if (latestJobWithImage?.ImageUrl) {
      setShowPosterPopup(true);
    }
  }, [latestJobWithImage]);


  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      // Create job with uploaded image URL
      const postedJob = await createJob({
        ...newJob,
        ImageUrl: newJob.ImageUrl,
        Posted: new Date().toISOString().split("T")[0],
        Company: "UFirm",
      });

      setUserJobs(prev => [...prev, postedJob]);
      setShowJobInfoForm(false);
      setNewJob({
        Title: "",
        Type: "",
        Posted: new Date().toISOString().split("T")[0],
        Education: "",
        CTC: "",
        Company: "UFirm",
        Department: "",
        Designation: "",
        ImageUrl: "",
      });

      alert("Job posted successfully!");
    } catch (err: unknown) {
  console.error(err);

  if (err instanceof Error) {
    alert(err.message || "Failed to post job.");
  } else {
    alert("Failed to post job.");
  }
}
  };

  const filteredJobs = userJobs.filter((job) =>
    job.Title?.toLowerCase().includes(search.toLowerCase())
  );


  // ✅ After successful login → open job posting form
  const handleLogin = () => {
    if (loginEmail === defaultEmail && loginPassword === defaultPassword) {
      closeLogin();
      setShowJobInfoForm(true); // show job posting form
      setLoginEmail("");
      setLoginPassword("");
    } else {
      alert("Invalid email or password.");
    }
  };

  useEffect(() => {
    if (latestJobWithImage?.image) {
      setShowPosterPopup(true);
    }
  }, [latestJobWithImage]);

  const handleResumeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resumeFile) return;

    const fileType = resumeFile.type;
    const fileSize = resumeFile.size;
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(fileType)) {
      alert("Please upload a valid resume file (PDF, DOC, DOCX).");
      return;
    }
    if (fileSize > 5 * 1024 * 1024) {
      alert("File size should not exceed 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("name", resumeName);
    formData.append("email", resumeEmail);
    formData.append("mobile", resumeMobile);
    formData.append("file", resumeFile);

    if (appliedJobInfo) {
      const jobDetails = `
      Job Title: ${appliedJobInfo.Title}
      Job Type: ${appliedJobInfo.Type}
      Posted On: ${appliedJobInfo.Posted}
      Education: ${appliedJobInfo.Education}
      CTC: ${appliedJobInfo.CTC}
      Company: ${appliedJobInfo.Company}
      Department: ${appliedJobInfo.Department}
      Designation: ${appliedJobInfo.Designation}
    `;
      formData.append("jobDetails", jobDetails);
    }

    try {
      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Resume submitted successfully!");
        setShowResumeForm(false);
        setResumeName("");
        setResumeEmail("");
        setResumeMobile("");
        setResumeFile(null);
        setAppliedJobInfo(null);
      } else {
        alert("Failed to submit resume.");
      }
    } catch (error) {
      console.error("Resume submission error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className="absolute top-1 left-0 w-full z-50">
        <div className="flex items-center justify-between px-4 mt-1">
          <Link href="/">
            <Image
              className="dark:invert mt-9"
              src={"/UFIRM ESTATES LOGO.webp"}
              alt={"UFIRM ESTATES LOGO"}
              width={100}
              height={100}
            />
          </Link>
          <div className="block lg:hidden">
            <HamburgerMenu />
          </div>
          <div className="hidden lg:block">
            <NavBar />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white text-gray-900 min-h-screen">
        <div className="relative">
          <Image
            src="/career.webp"
            alt="Career banner"
            width={1600}
            height={900}
            className="w-full h-[80vh] object-cover"
          />
          <div className="absolute inset-0 bg-black/45"></div>
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-10">
            <div className="p-4 rounded-xl text-center max-w-full bg-opacity-50">
              <h1 className="text-6xl font-bold mb-4 sm:mt-4">
                <TextGenerateEffect words="Join a Future-Focused Team with UFirm Hiring Portal!" />
              </h1>
              <hr className="w-30 border-t-2 border-yellow-500 mx-auto mb-4" />
              <strong className="text-sm sm:text-base md:text-2xl">
                <TextGenerateEffect words="Looking for a meaningful career opportunity? We’re hiring passionate professionals across multiple sectors." />
              </strong>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {showPosterPopup && latestJobWithImage?.image && (
            <motion.div
              key="posterPopup"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-2"
            >
              <div className="bg-white p-4 rounded-lg shadow-lg relative max-w-2xl w-full">
                <button
                  onClick={() => setShowPosterPopup(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-white text-xl"
                >
                  ✕
                </button>

                <Image
                  src={latestJobWithImage.image}
                  alt={`${latestJobWithImage.title} Poster`}
                  width={200} // max width
                  height={100} // max height
                  className="rounded-lg object-containe max-h-[90vh] w-full mx-auto"
                  priority
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Poster Popup */}
        <AnimatePresence>
          {showPosterPopup && latestJobWithImage?.ImageUrl && (
            <motion.div
              key="posterPopup"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-2"
            >
              <div className="bg-white p-4 rounded-lg shadow-lg relative max-w-2xl w-full">
                <button
                  onClick={() => setShowPosterPopup(false)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-white text-xl"
                >
                  ✕
                </button>
                <Image
                  src={latestJobWithImage.ImageUrl}
                  alt={`${latestJobWithImage.Title} Poster`}
                  width={200}
                  height={100}
                  className="rounded-lg object-contain max-h-[90vh] w-full mx-auto"
                  priority
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
         <motion.div className="max-w-3xl mx-auto text-center mt-10 px-2">
          <p className="mb-4 mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-yellow-600">
            Join a Future-Focused Team with{" "}
            <span className="text-black">UFirm Hiring Portal!</span>
          </p>
          <p className="mb-2 text-base sm:text-lg text-gray-700">
            Looking for a meaningful career opportunity?{" "}
            <strong>We’re hiring passionate professionals</strong> across
            multiple sectors.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Whether you&apos;re actively job hunting or simply exploring, we
            welcome your resume.
          </p>
        </motion.div>
        <div className="z-60 bg-white">
          <div className="flex flex-wrap justify-center gap-3 py-10 px-2">
            {["hire", "job"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  "px-4 py-2 rounded font-semibold capitalize transition text-sm sm:text-base",
                  activeTab === tab
                    ? "bg-yellow-500 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-yellow-200"
                )}
              >
                {tab === "hire"
                  ? "Hire Now / स्टाफ भर्ती करें"
                  : "Get a Job / नौकरी पाएं"}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          <AnimatePresence mode="wait">
            {activeTab === "hire" && (
              <motion.div
                key="hire"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto text-center text-gray-800 px-2"
              >
                {/* Hire content here */}
                <h2 className="text-3xl font-bold mb-4">
                  Hire Trained Facility Staff
                </h2>
                <p className="text-lg mb-6">
                  UFirm offers skilled, verified manpower for your technical and
                  soft service needs. <br />
                  UFirm आपको काम के लिए अच्छे और जांचे-परखे कर्मचारी देता है।
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 text-left mb-8">
                  <div className="bg-yellow-50 p-6 rounded shadow hover:shadow-lg transition">
                    <h3 className="font-semibold text-lg mb-2">
                      What We Provide / हम क्या प्रदान करते हैं
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-4">
                      <li>
                        <FaUserCheck className="inline mr-2 text-yellow-500" />{" "}
                        Facility Staff
                      </li>
                      <li>
                        <FaTools className="inline mr-2 text-yellow-500" />{" "}
                        Electricians & Plumbers
                      </li>
                      <li>
                        <FaWind className="inline mr-2 text-yellow-500" /> HVAC
                        Technicians
                      </li>
                      <li>
                        <FaBroom className="inline mr-2 text-yellow-500" />{" "}
                        Housekeeping & Support Staff
                      </li>
                      <li>
                        <FaUserShield className="inline mr-2 text-yellow-500" />{" "}
                        Safety & Compliance Officers
                      </li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded shadow hover:shadow-lg transition">
                    <h3 className="font-semibold text-lg mb-2">
                      Why UFirm? / UFirm क्यों चुनें?
                    </h3>
                    <ul className="text-gray-700 space-y-4">
                      <li>✅ Professionally trained staff</li>
                      <li>✅ Background verified workers</li>
                      <li>✅ Flexible hiring – short or long term</li>
                      <li>✅ Services available across India</li>
                      <li>✅ Quick and easy onboarding process</li>
                    </ul>
                  </div>
                </div>
                <a
                  href={`mailto:crm@ufirm.in?subject=Connect with Us&body=${encodeURIComponent(
                    `Hello,\n\nPlease reach out to me,\nMy Name: \nCompany/ Society/ Organization/ Industry name: \nMobile no.: \nShort description of requirement: \nLocation: \n\nThanks`
                  )}`}
                >
                  <button className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-lg transition flex items-center gap-2 mx-auto">
                    <FaEnvelopeOpenText /> Request Staff / स्टाफ मांगें
                  </button>
                </a>
              </motion.div>
            )}

            {activeTab === "job" && (
              <motion.div
                key="job"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto text-black px-2"
              >
                {/* Job Listing & Search */}
                <h2 className="text-center text-3xl font-bold mb-4">
                  Open Positions / उपलब्ध नौकरियाँ
                </h2>
                <hr className="w-16 border-t-2 border-yellow-500 mx-auto mb-4" />
                <p className="text-center text-gray-700 mb-4">
                  We are hiring for various vacancies. You can also submit your
                  resume for future opportunities. <br />
                  हम विभिन्न पदों के लिए भर्ती कर रहे हैं। आप भविष्य की नौकरियों
                  के लिए अपना Resume भी भेज सकते हैं।
                </p>
                <div className="text-center mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300"
                    onClick={() => {
                      setAppliedJobInfo(null);
                      setShowResumeForm(true);
                    }}
                  >
                    🚀 Submit Resume Without Applying / बिना आवेदन के Resume
                    भेजें
                  </motion.button>
                </div>
                <input
                  type="text"
                  placeholder="Search Job Title or Skills / नौकरी या कौशल खोजें"
                  className="w-full px-4 py-2 rounded-md mb-6 text-black bg-white border border-gray-300 text-center"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {filteredJobs.length === 0 && (
                  <p className="text-center text-gray-500">
                    No jobs found / कोई नौकरी नहीं मिली।
                  </p>
                )}
                {filteredJobs.map((job, idx) => {
                  const isUserJob = userJobs.includes(job);
                  return (
                    <motion.div
                      key={idx}
                      className="bg-white text-black p-6 rounded-md shadow mb-6 hover:shadow-lg transition relative"
                    >
                      <h3 className="text-xl font-bold mb-2">{job.Title}</h3>
                      <p className="text-sm mb-2">{job.Type}</p>
                      <p className="text-sm mb-1">
                        Posted on {job.Posted} / पोस्ट की गई: {job.Posted}
                      </p>
                      <p className="text-sm mb-1">
                        Education: {job.Education} / शिक्षा: {job.Education}
                      </p>
                      <p className="text-sm mb-1">
                        CTC: {job.CTC} / CTC: {job.CTC}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Company: {job.Company}
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Department: {job.Department}
                        </span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Designation: {job.Designation}
                        </span>
                      </div>
                      {isUserJob && (
                        <button
                          onClick={async () => {
                            if (!job.Id) return;
                            try {
                              await deleteJob(job.Id);
                              setUserJobs(userJobs.filter(j => j.Id !== job.Id));
                            } catch (err) {
                              console.error(err);
                              alert("Failed to delete job.");
                            }
                          }}
                          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                          title="Remove Job"
                          aria-label="Remove Job"
                        >
                          &#10005;
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setAppliedJobInfo(job);
                          setShowResumeForm(true);
                        }}
                        className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      >
                        Apply Now / अभी फार्म भरें
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Resume Form */}
        {showResumeForm && (
          <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-0">
            <div className="bg-white p-6 sm:p-8 rounded shadow-lg w-full max-w-sm sm:max-w-md overflow-auto max-h-[90vh]">
              <h3 className="text-xl font-bold mb-6 text-center">
                Submit Your Resume / अपना रिज़्यूमे जमा करें
              </h3>
              <form onSubmit={handleResumeSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
                  value={resumeEmail}
                  onChange={(e) => setResumeEmail(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Your Mobile No."
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded"
                  value={resumeMobile}
                  onChange={(e) => setResumeMobile(e.target.value)}
                  required
                  pattern="[\d\s+()-]{7,15}"
                  title="Enter a valid phone number"
                />
                <label
                  htmlFor="resumeFileInput"
                  className="flex items-center justify-center gap-2 cursor-pointer mb-4 px-4 py-2 border border-gray-300 rounded hover:bg-yellow-50 text-gray-700"
                >
                  <FaPaperclip />
                  {resumeFile
                    ? resumeFile.name
                    : "Choose resume file (PDF, DOC, DOCX)"}
                </label>
                <input
                  id="resumeFileInput"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  required
                />
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                  >
                    Send / भेजें
                  </button>
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                    onClick={() => {
                      setShowResumeForm(false);
                      setAppliedJobInfo(null);
                      setResumeName("");
                      setResumeEmail("");
                      setResumeMobile("");
                      setResumeFile(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Job Posting Form */}
        <AnimatePresence>
          {showJobInfoForm && (
            <motion.div
              key="jobForm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
            >
              <div className="bg-white p-6 rounded max-w-md w-full shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Post a New Job
                </h2>
                <form onSubmit={handleJobSubmit} className="space-y-3">
                  {["Title", "Type", "Education", "CTC", "Department", "Designation"].map(
                    (field) => (
                      <input
                        key={field}
                        type="text"
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={newJob[field as keyof typeof newJob]}
                        onChange={(e) =>
                          setNewJob({ ...newJob, [field]: e.target.value })
                        }
                        required
                        className="w-full p-2 border rounded"
                      />
                    )
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    placeholder="Upload Image"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64String = reader.result as string; // keep the "data:image/png;base64," part
                        setNewJob({ ...newJob, ImageUrl: base64String });
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <div className="flex justify-between mt-4">
                    <button
                      type="submit"
                      onClick={handleJobSubmit}
                      className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Post Job
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowJobInfoForm(false)}
                      className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showLogin && (
            <motion.div
              key="loginDialog"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
            >
              <div className="bg-white p-6 rounded max-w-md w-full shadow-lg">
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                  className="space-y-4"
                >
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />

                  <div className="flex justify-between mt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                      disabled={!canLogin}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={closeLogin}
                      className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function CareersPage() {
  return (
    <LoginDialogProvider>
      <CareerPageContent />
    </LoginDialogProvider>
  );
}
