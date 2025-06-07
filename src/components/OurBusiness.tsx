"use client";

import React from "react";

const OurBusinesses = () => {
  return (
    <section
      className="relative bg-cover bg-center min-h-screen flex flex-col justify-center items-center dark:text-black"
      style={{ backgroundImage: "url('/building-background.jpg')", opacity: 0.8 }}
    >
      <div className="w-full py-8">
        <h2 className="text-4xl font-bold text-center mb-10">Our Businesses</h2>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Real Estate Services */}
          <div className="bg-gray-900 bg-opacity-70 p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-orange-400 mb-4">
              Real Estate Services
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Facility Management */}
              <div>
                <h4 className="text-lg font-semibold mb-2">FACILITY MANAGEMENT</h4>
                <p className="mb-4">
                  Using well-engineered processes and technology to efficiently
                  manage Real Estate across India.
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition">
                  Learn more <span aria-hidden="true">&rarr;</span>
                </button>
              </div>

              {/* Real Estate Advisory */}
              <div>
                <h4 className="text-lg font-semibold mb-2">REAL ESTATE ADVISORY</h4>
                <p className="mb-4">
                  Valuable consulting on all aspects of Real Estate investments.
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition">
                  Learn more <span aria-hidden="true">&rarr;</span>
                </button>
              </div>
            </div>
          </div>

          {/* Real Estate Development */}
          <div className="bg-gray-900 bg-opacity-70 p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-orange-400 mb-4">
              Real Estate Development
            </h3>
            <p className="mb-4">
              Using our expertise in planning, execution, and maintenance, our
              Development division aims to be Mumbai’s most trusted developer over
              the next decade.
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition">
              Learn more <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurBusinesses;
