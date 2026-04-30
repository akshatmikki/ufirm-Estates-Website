'use client';

import Link from 'next/link';

export default function NewsletterSection() {
  return (
    <section className="bg-[#1e3143] overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[440px]">

        {/* ── Left: text content ─────────────────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-16 lg:px-24 py-16 lg:py-20 order-2 lg:order-1">
          <p className="text-[#1484bc] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            UFirm Newsletter
          </p>

          <h2 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#fafbf9] leading-[1.1] mb-6">
            Annual Integrated<br />Report 2025–26
          </h2>

          <p className="text-[#c8d8e2] text-base sm:text-lg leading-relaxed mb-10 max-w-[420px]">
            Expert perspectives on real estate, integrated facility management, and automated facility maintenance.
          </p>

          <Link
            href="/newsletter"
            target="_blank"
            rel="noopener noreferrer"
            className="
              w-fit px-8 py-3 rounded-[4px] font-medium transition-all duration-200 text-center
              bg-[#006990] text-[#fafbf9]
              hover:bg-[#1f4e7a] hover:shadow-[inset_0_0_0_0.2px_#1e3143]
              active:bg-[#1484bc] active:shadow-[inset_0_0_0_0.2px_#1e3143]
              cursor-pointer
            "
          >
            Read More
          </Link>
        </div>

        {/* ── Right: stylised report cover ───────────────────────────── */}
        <div className="flex-1 relative min-h-[280px] lg:min-h-0 order-1 lg:order-2 flex items-center justify-center bg-[#0d1f2e]">
          {/* Gradient fade on the left edge (desktop) */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1e3143] to-transparent z-10 pointer-events-none" />

          {/* Report cover card */}
          <div className="relative z-0 mx-8 my-10 lg:my-0 w-64 sm:w-72 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.55)] rounded-sm overflow-hidden select-none">
            {/* Colour bar */}
            <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #006990 0%, #1484bc 50%, #0d3f5c 100%)' }} />

            {/* Cover body */}
            <div className="px-7 py-8 bg-[#0d1f2e] flex flex-col gap-5">
              {/* UFirm wordmark */}
              <p className="text-[#1484bc] text-[11px] font-bold tracking-[0.25em] uppercase">
                UFirm Estates
              </p>

              <div>
                <p className="text-[#aec2cc] text-xs tracking-widest uppercase mb-2">
                  Annual Integrated
                </p>
                <p className="text-[#fafbf9] text-4xl font-extrabold leading-none">
                  Report
                </p>
                <p className="text-[#1484bc] text-4xl font-extrabold leading-none mt-1">
                  2025–26
                </p>
              </div>

              {/* Decorative rule */}
              <div className="h-px w-full bg-gradient-to-r from-[#1484bc] via-[#006990] to-transparent" />

              <p className="text-[#aec2cc] text-[11px] leading-relaxed">
                Real estate · Facility management<br />Sustainable growth
              </p>
            </div>

            {/* Bottom colour bar */}
            <div className="h-1.5 w-full bg-[#006990]" />
          </div>
        </div>

      </div>
    </section>
  );
}
