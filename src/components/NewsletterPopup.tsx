// 'use client';

// import { useEffect, useState } from 'react';
// import { X, BookOpen, ArrowRight } from 'lucide-react';
// import Link from 'next/link';

// // NOTE: pdfjs is NOT imported at module level.
// // NewsletterPopup is rendered on the server (as part of the homepage Server
// // Component), so any static import of pdfjs-dist would be included in the SSR
// // bundle — and pdfjs v5's ESM init crashes in Node.js.
// // Solution: dynamic import inside useEffect (guaranteed browser-only).

// const DISPLAY_PDF = '/Assets/ufirmcompressed.pdf';

// // ─── Minimized thumbnail ──────────────────────────────────────────────────────
// // Vertical card: cover image on top, label + CTA below.
// // bottom-32 (8rem / 128px) gives clearance over two ~44px FABs at bottom-4.
// // Adjust if your FAB stack height differs.
// function MinimizedThumbnail({
//   coverDataUrl,
//   onDismiss,
// }: {
//   coverDataUrl: string | null;
//   onDismiss: () => void;
// }) {
//   return (
//  <div className="fixed right-4 z-[200] w-[80px] bottom-24 md:bottom-40">
//       <Link
//         href="/newsletter"
//         target="_blank"
//         rel="noopener noreferrer"
//         onClick={onDismiss}
//         className="
//           flex flex-col
//           bg-[#1e3143] border border-[#1484bc]/25
//           rounded-lg shadow-2xl overflow-hidden
//           hover:border-[#1484bc]/60
//           transition-all duration-200
//           group
//         "
//       >
//         {/* Cover image — fixed aspect ratio matching a typical PDF page */}
//         <div className="w-full aspect-[3/4] bg-[#0d1f2e] flex items-center justify-center overflow-hidden">
//           {coverDataUrl ? (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img
//               src={coverDataUrl}
//               alt="Annual Report Cover"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <BookOpen className="w-6 h-6 text-[#1484bc]" />
//           )}
//         </div>

//         {/* Label row */}
//         <div className="px-2.5 py-2">
//           {/* <p className="text-[#fafbf9] text-[11px] font-semibold leading-tight">
//             Annual Report 2025–26
//           </p> */}
//           <p className="text-[#1484bc] text-[10px] mt-1 flex items-center gap-1">
//             View report
//             <ArrowRight className="w-2.5 h-2.5" />
//           </p>
//         </div>
//       </Link>

//       {/* Dismiss — top-right corner of the card */}
//       <button
//         onClick={onDismiss}
//         aria-label="Dismiss newsletter prompt"
//         className="
//           absolute -top-2 -right-2
//           w-5 h-5 rounded-full
//           bg-[#2a4257] border border-[#1484bc]/20
//           hover:bg-[#1484bc] transition-colors
//           flex items-center justify-center
//           text-[#aec2cc] hover:text-white
//         "
//       >
//         <X className="w-3 h-3" />
//       </button>
//     </div>
//   );
// }

// // ─── Main component ───────────────────────────────────────────────────────────
// export default function NewsletterPopup() {
//   const [visible, setVisible]           = useState(false);
//   const [minimized, setMinimized]       = useState(false);
//   const [coverDataUrl, setCoverDataUrl] = useState<string | null>(null);
//   const [coverLoading, setCoverLoading] = useState(true);

//   /* ── Show popup after short delay on every page load ───────────────── */
//   useEffect(() => {
//     const timer = setTimeout(() => setVisible(true), 700);
//     return () => clearTimeout(timer);
//   }, []);

//   /* ── Render PDF cover once the popup becomes visible ────────────────── */
//   // Cover is loaded once and persists in state, so the minimized thumbnail
//   // also benefits from it without re-triggering the PDF fetch.
//   useEffect(() => {
//     if (!visible) return;

//     let cancelled = false;
//     (async () => {
//       try {
//         // Dynamic import keeps pdfjs-dist out of the server bundle.
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const pdfjs = await import('pdfjs-dist') as any;
//         pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

//         if (cancelled) return;

//         const doc = await Promise.race([
//           pdfjs.getDocument(DISPLAY_PDF).promise,
//           new Promise<never>((_, rej) =>
//             setTimeout(() => rej(new Error('timeout')), 30_000),
//           ),
//         ]);
//         if (cancelled) return;

//         const page   = await doc.getPage(1);
//         const baseVp = page.getViewport({ scale: 1 });
//         const scale  = 360 / baseVp.width;
//         const vp     = page.getViewport({ scale });

//         const canvas    = document.createElement('canvas');
//         canvas.width    = vp.width;
//         canvas.height   = vp.height;
//         const ctx       = canvas.getContext('2d')!;
//         await page.render({ canvasContext: ctx, viewport: vp }).promise;

//         if (!cancelled) setCoverDataUrl(canvas.toDataURL('image/jpeg', 0.85));
//       } catch {
//         // fallback icon shown automatically
//       } finally {
//         if (!cancelled) setCoverLoading(false);
//       }
//     })();

//     return () => { cancelled = true; };
//   }, [visible]);

//   // ── Fully dismissed — render nothing ────────────────────────────────
//   if (!visible && !minimized) return null;

//   // ── Minimized thumbnail (user clicked "Later" or clicked outside modal) ──
//   if (minimized) {
//     return (
//       <MinimizedThumbnail
//         coverDataUrl={coverDataUrl}
//         onDismiss={() => setMinimized(false)}
//       />
//     );
//   }

//   // ── Full modal ───────────────────────────────────────────────────────
//   return (
//     <div
//       className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
//       // Clicking the backdrop minimizes rather than fully dismissing
//       onClick={(e) => {
//         if (e.target === e.currentTarget) {
//           setVisible(false);
//           setMinimized(true);
//         }
//       }}
//     >
//       {/*
//         Modal layout (flex-col, max-h-[90svh], overflow-hidden):
//         ┌─────────────────────────────┐  ← rounded-t-lg
//         │  cover image  (flex-1)      │  ← grows to fill available space
//         ├─────────────────────────────┤
//         │  text + CTA  (flex-shrink-0)│  ← always fully visible
//         └─────────────────────────────┘  ← rounded-b-lg
//       */}
//       <div className="relative bg-[#1e3143] rounded-lg shadow-2xl w-full max-w-sm border border-[#1484bc]/20 flex flex-col max-h-[90svh] overflow-hidden">

//         {/* Close — fully dismisses (does NOT minimize) */}
//         <button
//           onClick={() => {
//   setVisible(false);
//   setMinimized(true);
// }}
//           aria-label="Close"
//           className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#2a4257] hover:bg-[#1484bc] transition-colors flex items-center justify-center text-[#aec2cc] hover:text-white flex-shrink-0"
//         >
//           <X className="w-4 h-4" />
//         </button>

//         {/* Cover preview */}
//         <div className="flex-1 min-h-0 bg-[#131f2a] flex items-center justify-center overflow-hidden rounded-t-lg">
//           {coverLoading ? (
//             <div className="flex flex-col items-center gap-3 py-10 px-6">
//               <div className="w-8 h-8 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin" />
//               <p className="text-[#aec2cc] text-xs">Loading preview…</p>
//             </div>
//           ) : coverDataUrl ? (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img
//               src={coverDataUrl}
//               alt="Annual Report Cover"
//               className="w-full h-full object-contain"
//             />
//           ) : (
//             <div className="flex flex-col items-center justify-center py-10 gap-3 px-6">
//               <div className="w-14 h-14 rounded-full bg-[#1484bc]/20 flex items-center justify-center">
//                 <BookOpen className="w-7 h-7 text-[#1484bc]" />
//               </div>
//               <p className="text-[#fafbf9] font-semibold text-center text-sm leading-snug">
//                 UFirm Annual Integrated Report 2025–26
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Text + CTA */}
//         <div className="px-6 pt-4 pb-5 flex-shrink-0">
//           <p className="text-[#1484bc] text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5">
//             UFirm Newsletter
//           </p>
//           <h3 className="text-[#fafbf9] font-bold text-lg leading-tight mb-1.5">
//             Annual Integrated Report 2025–26
//           </h3>
//           <p className="text-[#aec2cc] text-xs leading-relaxed mb-4">
//             Expert perspectives on real estate, integrated facility management, and automated facility maintenance.
//           </p>

//           <div className="flex gap-3">
//             <Link
//               href="/newsletter"
//               target="_blank"
//               rel="noopener noreferrer"
//               onClick={() => setVisible(false)}
//               className="flex-1 flex items-center justify-center gap-2 bg-[#1484bc] hover:bg-[#006990] active:bg-[#005577] text-white py-2.5 px-4 text-sm font-medium transition-colors rounded-[4px]"
//             >
//               Read Our Report
//               <ArrowRight className="w-4 h-4" />
//             </Link>

//             {/* "Later" → minimizes to thumbnail, does NOT fully dismiss */}
//             <button
//               onClick={() => { setVisible(false); setMinimized(true); }}
//               className="px-4 py-2.5 border border-[#aec2cc]/25 text-[#aec2cc] hover:border-[#1484bc]/60 hover:text-[#c8d8e2] text-sm transition-colors rounded-[4px]"
//             >
//               Later
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }















'use client';

import { useEffect, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Cover is a pre-extracted static JPEG — no pdfjs, no PDF download, instant.
// Generate once with: python extract_cover.py
const COVER_SRC = '/Assets/newsletterjpegs/1.jpg';

// ─── Minimized thumbnail ──────────────────────────────────────────────────────
function MinimizedThumbnail({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed right-4 z-[200] w-[80px] bottom-24 md:bottom-40">
      <Link
        href="/newsletter"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onDismiss}
        className="
          flex flex-col
          bg-[#1e3143] border border-[#1484bc]/25
          rounded-lg shadow-2xl overflow-hidden
          hover:border-[#1484bc]/60
          transition-all duration-200
        "
      >
        <div className="w-full aspect-[3/4] bg-[#0d1f2e] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={COVER_SRC} alt="Annual Report Cover" className="w-full h-full object-cover" />
        </div>
        <div className="px-2 py-1.5">
          <p className="text-[#1484bc] text-[10px] flex items-center gap-0.5">
            View report
            <ArrowRight className="w-2.5 h-2.5 flex-shrink-0" />
          </p>
        </div>
      </Link>

      <button
        onClick={onDismiss}
        aria-label="Dismiss newsletter prompt"
        className="
          absolute -top-2 -right-2
          w-5 h-5 rounded-full
          bg-[#2a4257] border border-[#1484bc]/20
          hover:bg-[#1484bc] transition-colors
          flex items-center justify-center
          text-[#aec2cc] hover:text-white
        "
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function NewsletterPopup() {
  const [visible,   setVisible]   = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  if (!visible && !minimized) return null;
  if (minimized) return <MinimizedThumbnail onDismiss={() => setMinimized(false)} />;

  const minimize = () => { setVisible(false); setMinimized(true); };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) minimize(); }}
    >
      <div className="relative bg-[#1e3143] rounded-lg shadow-2xl w-full max-w-sm border border-[#1484bc]/20 flex flex-col overflow-hidden">

        <button
          onClick={minimize}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#2a4257] hover:bg-[#1484bc] transition-colors flex items-center justify-center text-[#aec2cc] hover:text-white flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cover — explicit height cap prevents it growing unboundedly on tall
            desktop monitors. On mobile this is ~200px; on desktop ~280px.
            object-contain letterboxes; no clipping at any aspect ratio.       */}
        <div className="bg-[#131f2a] flex items-center justify-center overflow-hidden rounded-t-lg h-[200px] sm:h-[280px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={COVER_SRC}
            alt="Annual Report Cover"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Text + CTA — always fully visible, never competes with image */}
        <div className="px-6 pt-4 pb-5 flex-shrink-0">
          <p className="text-[#1484bc] text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5">
            UFirm Newsletter
          </p>
          <h3 className="text-[#fafbf9] font-bold text-lg leading-tight mb-1.5">
            Annual Report 2025–26
          </h3>
          <p className="text-[#aec2cc] text-xs leading-relaxed mb-4">
            Expert perspectives on real estate, integrated facility management, and automated facility maintenance.
          </p>

          <div className="flex gap-3">
            <Link
              href="/newsletter"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setVisible(false)}
              className="flex-1 flex items-center justify-center gap-2 bg-[#1484bc] hover:bg-[#006990] active:bg-[#005577] text-white py-2.5 px-4 text-sm font-medium transition-colors rounded-[4px]"
            >
              Read Our Report
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={minimize}
              className="px-4 py-2.5 border border-[#aec2cc]/25 text-[#aec2cc] hover:border-[#1484bc]/60 hover:text-[#c8d8e2] text-sm transition-colors rounded-[4px]"
            >
              Later
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}