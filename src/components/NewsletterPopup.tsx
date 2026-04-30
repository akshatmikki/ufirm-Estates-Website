// 'use client';

// import { useEffect, useState } from 'react';
// import { X, BookOpen, ArrowRight } from 'lucide-react';
// import Link from 'next/link';

// // NOTE: pdfjs is NOT imported at module level.
// // NewsletterPopup is rendered on the server (as part of the homepage Server
// // Component), so any static import of pdfjs-dist would be included in the SSR
// // bundle — and pdfjs v5's ESM init crashes in Node.js.
// // Solution: dynamic import inside useEffect (guaranteed browser-only).

// const DISPLAY_PDF = '/Assets/UFirm_Newsletter-2025-26.pdf';

// export default function NewsletterPopup() {
//   const [visible, setVisible]           = useState(false);
//   const [coverDataUrl, setCoverDataUrl] = useState<string | null>(null);
//   const [coverLoading, setCoverLoading] = useState(true);

//   /* ── Show on every page load after a short delay ────────────────────── */
//   useEffect(() => {
//     const timer = setTimeout(() => setVisible(true), 700);
//     return () => clearTimeout(timer);
//   }, []);

//   /* ── Render PDF cover once the popup becomes visible ────────────────── */
//   useEffect(() => {
//     if (!visible) return;

//     let cancelled = false;
//     (async () => {
//       try {
//         // Dynamic import keeps pdfjs-dist out of the server bundle.
//         // Worker is served as a static public file — no CDN, no CORS.
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
//         // fallback graphic shown automatically
//       } finally {
//         if (!cancelled) setCoverLoading(false);
//       }
//     })();

//     return () => { cancelled = true; };
//   }, [visible]);

//   if (!visible) return null;

//   return (
//     <div
//       className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
//       onClick={(e) => { if (e.target === e.currentTarget) setVisible(false); }}
//     >
//       <div className="relative bg-[#1e3143] rounded-lg shadow-2xl w-full max-w-sm border border-[#1484bc]/20 flex flex-col max-h-[92svh]">

//         {/* Close */}
//         <button
//           onClick={() => setVisible(false)}
//           aria-label="Close"
//           className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#2a4257] hover:bg-[#1484bc] transition-colors flex items-center justify-center text-[#aec2cc] hover:text-white flex-shrink-0"
//         >
//           <X className="w-4 h-4" />
//         </button>

//         {/* Cover preview */}
//         <div
//           className="flex-shrink-0 bg-[#131f2a] flex items-center justify-center overflow-hidden rounded-t-lg"
//           style={{ maxHeight: '55svh' }}
//         >
//           {coverLoading ? (
//             <div className="flex flex-col items-center gap-3 py-10 px-6">
//               <div className="w-8 h-8 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin" />
//               <p className="text-[#aec2cc] text-xs">Loading preview…</p>
//             </div>
//           ) : coverDataUrl ? (
//             /* eslint-disable-next-line @next/next/no-img-element */
//             <img src={coverDataUrl} alt="Annual Report Cover" className="w-full object-contain" />
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
//             Expert perspectives on real estate, facility management, and sustainable growth.
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
//             <button
//               onClick={() => setVisible(false)}
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
import { X, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// NOTE: pdfjs is NOT imported at module level.
// NewsletterPopup is rendered on the server (as part of the homepage Server
// Component), so any static import of pdfjs-dist would be included in the SSR
// bundle — and pdfjs v5's ESM init crashes in Node.js.
// Solution: dynamic import inside useEffect (guaranteed browser-only).

const DISPLAY_PDF = '/Assets/UFirm_Newsletter-2025-26.pdf';

export default function NewsletterPopup() {
  const [visible, setVisible]           = useState(false);
  const [coverDataUrl, setCoverDataUrl] = useState<string | null>(null);
  const [coverLoading, setCoverLoading] = useState(true);

  /* ── Show on every page load after a short delay ────────────────────── */
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 700);
    return () => clearTimeout(timer);
  }, []);

  /* ── Render PDF cover once the popup becomes visible ────────────────── */
  useEffect(() => {
    if (!visible) return;

    let cancelled = false;
    (async () => {
      try {
        // Dynamic import keeps pdfjs-dist out of the server bundle.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfjs = await import('pdfjs-dist') as any;
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

        if (cancelled) return;

        const doc = await Promise.race([
          pdfjs.getDocument(DISPLAY_PDF).promise,
          new Promise<never>((_, rej) =>
            setTimeout(() => rej(new Error('timeout')), 30_000),
          ),
        ]);
        if (cancelled) return;

        const page   = await doc.getPage(1);
        const baseVp = page.getViewport({ scale: 1 });
        const scale  = 360 / baseVp.width;
        const vp     = page.getViewport({ scale });

        const canvas    = document.createElement('canvas');
        canvas.width    = vp.width;
        canvas.height   = vp.height;
        const ctx       = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport: vp }).promise;

        if (!cancelled) setCoverDataUrl(canvas.toDataURL('image/jpeg', 0.85));
      } catch {
        // fallback graphic shown automatically
      } finally {
        if (!cancelled) setCoverLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) setVisible(false); }}
    >
      {/*
        Modal layout (flex-col, max-h-[90svh], overflow-hidden):
        ┌─────────────────────────────┐  ← rounded-t-lg
        │  cover image  (flex-1)      │  ← grows to fill available space;
        │  object-contain = no clip   │    image letterboxes, never clips
        ├─────────────────────────────┤
        │  text + CTA  (flex-shrink-0)│  ← always fully visible
        └─────────────────────────────┘  ← rounded-b-lg

        By making the cover section flex-1 min-h-0, it absorbs whatever
        vertical space is left after the fixed-height text block. The image
        inside uses h-full object-contain so the entire cover page is always
        visible with letterbox space rather than being clipped.
      */}
      <div className="relative bg-[#1e3143] rounded-lg shadow-2xl w-full max-w-sm border border-[#1484bc]/20 flex flex-col max-h-[90svh] overflow-hidden">

        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#2a4257] hover:bg-[#1484bc] transition-colors flex items-center justify-center text-[#aec2cc] hover:text-white flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cover preview — flex-1 so it takes all space above the text block */}
        <div className="flex-1 min-h-0 bg-[#131f2a] flex items-center justify-center overflow-hidden rounded-t-lg">
          {coverLoading ? (
            <div className="flex flex-col items-center gap-3 py-10 px-6">
              <div className="w-8 h-8 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#aec2cc] text-xs">Loading preview…</p>
            </div>
          ) : coverDataUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={coverDataUrl}
              alt="Annual Report Cover"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-3 px-6">
              <div className="w-14 h-14 rounded-full bg-[#1484bc]/20 flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-[#1484bc]" />
              </div>
              <p className="text-[#fafbf9] font-semibold text-center text-sm leading-snug">
                UFirm Annual Integrated Report 2025–26
              </p>
            </div>
          )}
        </div>

        {/* Text + CTA — always fully visible, never shrinks */}
        <div className="px-6 pt-4 pb-5 flex-shrink-0">
          <p className="text-[#1484bc] text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5">
            UFirm Newsletter
          </p>
          <h3 className="text-[#fafbf9] font-bold text-lg leading-tight mb-1.5">
            Annual Integrated Report 2025–26
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
              onClick={() => setVisible(false)}
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