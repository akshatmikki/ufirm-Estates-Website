// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import { Download } from 'lucide-react';

// // pdfjs is dynamically imported inside useEffect so it never touches the
// // server bundle (pdfjs v5/v4 ESM crashes in Node.js with webpack SSR).
// // The worker is served as a static file from /public — no CDN, no CORS,
// // no webpack import.meta.url tricks required.

// // react-pageflip accesses window on init — must stay ssr:false.
// // A typed alias is used so `any` only appears once, in the type declaration.
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () =>
//     import('react-pageflip').then(
//       (m) => m.default as React.ComponentType<AnyProps>,
//     ),
//   { ssr: false },
// );

// const PDF_URL      = '/Assets/UFirm_Newsletter-2025-26.pdf';
// const DOWNLOAD_URL =
//   'https://drive.google.com/uc?export=download&id=1CJnzepGUckn6k97spRCaxjdtbfCFHtdO';
// // Worker served from public/ — pdfjs v4, self-contained, no relative imports
// const WORKER_URL   = '/pdf.worker.min.mjs';

// const RENDER_SCALE = 1.0;
// const JPEG_QUALITY = 0.88;

// /* ──────────────────────────────────────────────────────────────────────────
//    FlipPage
//    react-pageflip clones children and injects a forwarded ref onto each —
//    we must forward it.  Content is injected directly into the DOM after
//    pdfjs finishes rendering so the book never resets mid-render.
// ────────────────────────────────────────────────────────────────────────── */
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(
//   ({ pageNum }, ref) => (
//     <div ref={ref} className="relative w-full h-full bg-white overflow-hidden">
//       {/* Populated via DOM once pdfjs renders the page.
//           Plain <img> is intentional here: src is set imperatively after
//           pdfjs renders, which is incompatible with next/image. */}
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img
//         id={`fp-img-${pageNum}`}
//         className="w-full h-full object-contain opacity-0 transition-opacity duration-500"
//         alt={`Page ${pageNum}`}
//         src=""
//       />
//       {/* Spinner shown until the image appears */}
//       <div
//         id={`fp-load-${pageNum}`}
//         className="absolute inset-0 flex items-center justify-center bg-white"
//       >
//         <div className="w-5 h-5 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin" />
//       </div>
//     </div>
//   ),
// );
// FlipPage.displayName = 'FlipPage';

// /* ──────────────────────────────────────────────────────────────────────────
//    NewsletterViewer
// ────────────────────────────────────────────────────────────────────────── */
// // ─── FLIPBOOK SIZE ──────────────────────────────────────────────────────────
// // Tweak MAX_BOOK_HEIGHT_PX to change how tall the flipbook can grow.
// // The viewport-aware hook below automatically shrinks it further when the
// // browser window is shorter than this value, so it always fits on screen.
// const MAX_BOOK_HEIGHT_PX = 720; // ← change this to make the book taller/shorter

// export default function NewsletterViewer() {
//   const [phase, setPhase]             = useState<'parsing' | 'ready' | 'error'>('parsing');
//   const [numPages, setNumPages]       = useState(0);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [readyPages, setReadyPages]   = useState(0);

//   // ── Viewport-aware max height ─────────────────────────────────────────
//   // Subtracts fixed chrome (navbar 64 + sub-header 50 + page-jump 48 +
//   // vertical padding 40 + safety buffer 18 = 220 px) from the window height,
//   // clamped to [360, MAX_BOOK_HEIGHT_PX].
//   const [maxBookHeight, setMaxBookHeight] = useState(MAX_BOOK_HEIGHT_PX);
//   useEffect(() => {
//     function onResize() {
//       setMaxBookHeight(
//         Math.max(360, Math.min(window.innerHeight - 220, MAX_BOOK_HEIGHT_PX))
//       );
//     }
//     onResize();
//     window.addEventListener('resize', onResize);
//     return () => window.removeEventListener('resize', onResize);
//   }, []);

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef   = useRef<any>(null);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const pdfDoc    = useRef<any>(null);
//   const rendering = useRef<Set<number>>(new Set());
//   const done      = useRef<Set<number>>(new Set());

//   /* ── Push rendered dataURL straight into the DOM ────────────────────── */
//   const applyPage = useCallback((n: number, dataUrl: string) => {
//     const img    = document.getElementById(`fp-img-${n}`) as HTMLImageElement | null;
//     const loader = document.getElementById(`fp-load-${n}`) as HTMLElement | null;
//     if (!img) return;
//     img.onload = () => {
//       img.classList.remove('opacity-0');
//       img.classList.add('opacity-100');
//       if (loader) loader.style.display = 'none';
//     };
//     img.src = dataUrl;
//     done.current.add(n);
//     setReadyPages((c) => c + 1);
//   }, []);

//   /* ── Render one PDF page → canvas → JPEG dataURL → DOM ──────────────── */
//   const renderPage = useCallback(async (n: number): Promise<void> => {
//     if (!pdfDoc.current)                       return;
//     if (done.current.has(n))                   return;
//     if (rendering.current.has(n))              return;
//     if (n < 1 || n > pdfDoc.current.numPages)  return;

//     rendering.current.add(n);
//     try {
//       const page   = await pdfDoc.current.getPage(n);
//       const vp     = page.getViewport({ scale: RENDER_SCALE });
//       const canvas = document.createElement('canvas');
//       canvas.width  = vp.width;
//       canvas.height = vp.height;
//       const ctx    = canvas.getContext('2d')!;
//       await page.render({ canvasContext: ctx, viewport: vp }).promise;
//       applyPage(n, canvas.toDataURL('image/jpeg', JPEG_QUALITY));
//     } catch {
//       // leave spinner; doesn't block other pages
//     } finally {
//       rendering.current.delete(n);
//     }
//   }, [applyPage]);

//   /* ── Render the spread around `current` at high priority ────────────── */
//   const renderAround = useCallback((current: number, total: number) => {
//     [current, current + 1, current + 2, current + 3, current - 1, current - 2]
//       .filter((n) => n >= 1 && n <= total)
//       .forEach((n) => renderPage(n));
//   }, [renderPage]);

//   /* ── Load PDF, show book immediately, fill pages in background ───────── */
//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       try {
//         // Dynamic import keeps pdfjs-dist out of the server bundle.
//         // Worker is a static public file — simple, reliable, no CORS.
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const pdfjs = await import('pdfjs-dist') as any;
//         pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;

//         if (cancelled) return;

//         const doc = await Promise.race([
//           pdfjs.getDocument(PDF_URL).promise,
//           new Promise<never>((_, rej) =>
//             setTimeout(() => rej(new Error('PDF load timed out')), 45_000),
//           ),
//         ]);
//         if (cancelled) return;

//         pdfDoc.current = doc;
//         setNumPages(doc.numPages);
//         setPhase('ready'); // ← book shown immediately; pages fill in as they render

//         // Pages 1–4: sequential, high priority (cover + first spread)
//         for (let i = 1; i <= Math.min(4, doc.numPages); i++) {
//           if (cancelled) return;
//           await renderPage(i);
//         }

//         // Remaining pages: 2 at a time in the background
//         const rest = Array.from({ length: doc.numPages }, (_, i) => i + 1)
//           .filter((n) => !done.current.has(n));

//         for (let i = 0; i < rest.length; i += 2) {
//           if (cancelled) break;
//           await Promise.all(rest.slice(i, i + 2).map((n) => renderPage(n)));
//         }
//       } catch {
//         if (!cancelled) setPhase('error');
//       }
//     })();

//     return () => { cancelled = true; };
//   }, [renderPage]);

//   /* ── On flip: ensure the upcoming spread is pre-rendered ────────────── */
//   const handleFlip = useCallback(
//     (e: { data: number }) => {
//       setCurrentPage(e.data);
//       renderAround(e.data + 1, numPages);
//     },
//     [numPages, renderAround],
//   );

//   /* ── Keyboard navigation ─────────────────────────────────────────────── */
//   useEffect(() => {
//     if (phase !== 'ready') return;
//     const handler = (e: KeyboardEvent) => {
//       if (!bookRef.current) return;
//       const pf = bookRef.current.pageFlip();
//       if (e.key === 'ArrowRight' || e.key === 'PageDown') pf.flipNext();
//       if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   pf.flipPrev();
//     };
//     window.addEventListener('keydown', handler);
//     return () => window.removeEventListener('keydown', handler);
//   }, [phase]);

//   const displayPage = currentPage + 1;

//   return (
//     <div
//       className="min-h-screen pt-16 flex flex-col"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       {/* ── Sub-header ─────────────────────────────────────────────────── */}
//       <div className="bg-[#1e3143]/90 backdrop-blur-sm border-b border-[#1484bc]/20 px-4 sm:px-8 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
//         <div>
//           <h1 className="text-[#fafbf9] font-bold text-sm sm:text-base leading-tight">
//             Annual Integrated Report 2025–26
//           </h1>
//           {phase === 'ready' && (
//             <p className="text-[#aec2cc] text-[11px] mt-0.5">
//               Page {displayPage} of {numPages}
//               {readyPages < numPages ? (
//                 <span className="ml-2 text-[#1484bc]">
//                   · Rendering {readyPages}/{numPages}…
//                 </span>
//               ) : (
//                 <span className="ml-2">· ← → keys to navigate</span>
//               )}
//             </p>
//           )}
//         </div>

//         <a
//           href={DOWNLOAD_URL}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] transition-colors text-sm"
//         >
//           <Download className="w-4 h-4" />
//           <span className="hidden sm:inline">Download PDF</span>
//         </a>
//       </div>

//       {/* ── Main ───────────────────────────────────────────────────────── */}
//       <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-hidden">

//         {/* Loading */}
//         {phase === 'parsing' && (
//           <div className="flex flex-col items-center gap-4 text-[#aec2cc]">
//             <div className="w-10 h-10 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin" />
//             <div className="text-center">
//               <p className="text-sm font-medium mb-1">Loading report…</p>
//               <p className="text-xs text-[#aec2cc]/60">
//                 Fetching 24 MB — usually takes 3–8 seconds
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Error */}
//         {phase === 'error' && (
//           <div className="text-center text-[#f0f3f5] max-w-sm space-y-4">
//             <p className="text-sm leading-relaxed">
//               Could not load the report in the browser. Download the full-quality
//               version directly:
//             </p>
//             <a
//               href={DOWNLOAD_URL}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 bg-[#1484bc] hover:bg-[#006990] text-white px-6 py-2.5 text-sm font-medium transition-colors rounded-[4px]"
//             >
//               <Download className="w-4 h-4" />
//               Download Full-Quality PDF
//             </a>
//           </div>
//         )}

//         {/* Flipbook — shown as soon as PDF is parsed */}
//         {phase === 'ready' && numPages > 0 && (
//           <div className="flex flex-col items-center gap-4 w-full">
//             <HTMLFlipBook
//               ref={bookRef}
//               width={520}
//               height={720}
//               size="stretch"
//               minWidth={260}
//               maxWidth={620}
//               minHeight={360}
//               maxHeight={maxBookHeight}
//               maxShadowOpacity={0.6}
//               showCover={true}
//               mobileScrollSupport={true}
//               drawShadow={true}
//               flippingTime={650}
//               useMouseEvents={true}
//               swipeDistance={30}
//               onFlip={handleFlip}
//               className="shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
//             >
//               {Array.from({ length: numPages }, (_, i) => (
//                 <FlipPage key={i + 1} pageNum={i + 1} />
//               ))}
//             </HTMLFlipBook>

//             {/* Page jump */}
//             <div className="flex items-center gap-2 text-[#aec2cc] text-sm">
//               <span>Go to page</span>
//               <input
//                 type="number"
//                 min={1}
//                 max={numPages}
//                 defaultValue={displayPage}
//                 key={displayPage}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && bookRef.current) {
//                     const n = parseInt((e.target as HTMLInputElement).value, 10);
//                     if (n >= 1 && n <= numPages) {
//                       bookRef.current.pageFlip().flip(n - 1);
//                     }
//                   }
//                 }}
//                 className="w-14 text-center bg-[#0d1f2e] border border-[#1484bc]/30 focus:border-[#1484bc] text-[#fafbf9] rounded px-2 py-1 text-sm outline-none transition-colors"
//               />
//               <span>of {numPages}</span>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


















'use client';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Download, Maximize2, Minimize2 } from 'lucide-react';

// pdfjs is dynamically imported inside useEffect so it never touches the
// server bundle (pdfjs v5/v4 ESM crashes in Node.js with webpack SSR).
// The worker is served as a static file from /public — no CDN, no CORS,
// no webpack import.meta.url tricks required.

// react-pageflip accesses window on init — must stay ssr:false.
// A typed alias is used so `any` only appears once, in the type declaration.
// The double cast (as unknown as ...) is required because the library's
// ForwardRefExoticComponent and ComponentType<AnyProps> don't overlap enough
// for TypeScript to accept a direct cast — using `unknown` as an intermediate
// is the compiler-endorsed escape hatch for exactly this situation.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

const HTMLFlipBook = dynamic<AnyProps>(
  () =>
    import('react-pageflip').then(
      (m) => m.default as unknown as React.ComponentType<AnyProps>,
    ),
  { ssr: false },
);

const PDF_URL      = '/Assets/UFirm_Newsletter-2025-26';
const DOWNLOAD_URL =
  'https://drive.google.com/uc?export=download&id=1CJnzepGUckn6k97spRCaxjdtbfCFHtdO';
const WORKER_URL   = '/pdf.worker.min.mjs';

const RENDER_SCALE = 1.0;
const JPEG_QUALITY = 0.88;

// ─── FLIPBOOK SIZE ────────────────────────────────────────────────────────────
// MAX_BOOK_HEIGHT_PX caps how tall the book can grow when the viewport is large.
// The ResizeObserver below will shrink it further on smaller viewports.
// ↓ Decrease this number to make the flipbook shorter across all screen sizes.
const MAX_BOOK_HEIGHT_PX = 520;

// Height reserved below the book for the page-jump controls row.
// gap-4 (16px) + input row (36px) + small buffer (8px) = 60px
const CONTROLS_RESERVED_PX = 40;

/* ──────────────────────────────────────────────────────────────────────────
   FlipPage
────────────────────────────────────────────────────────────────────────── */
const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(
  ({ pageNum }, ref) => (
    <div ref={ref} className="relative w-full h-full bg-white overflow-hidden">
      {/* Plain <img> is intentional: src is set imperatively after pdfjs
          renders, which is incompatible with next/image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        id={`fp-img-${pageNum}`}
        className="w-full h-full object-contain opacity-0 transition-opacity duration-500"
        alt={`Page ${pageNum}`}
        src=""
      />
      <div
        id={`fp-load-${pageNum}`}
        className="absolute inset-0 flex items-center justify-center bg-white"
      >
        <div className="w-5 h-5 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  ),
);
FlipPage.displayName = 'FlipPage';

/* ──────────────────────────────────────────────────────────────────────────
   NewsletterViewer
────────────────────────────────────────────────────────────────────────── */
export default function NewsletterViewer() {
  const [phase, setPhase]             = useState<'parsing' | 'ready' | 'error'>('parsing');
  const [numPages, setNumPages]       = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [readyPages, setReadyPages]   = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── Accurate book height via ResizeObserver on <main> ─────────────────
  // We measure <main>'s clientHeight and subtract its vertical padding
  // (read from getComputedStyle so we handle both p-4 and sm:p-6) plus the
  // controls row height.  This is more reliable than guessing from
  // window.innerHeight because it reacts to any layout change automatically.
  const [maxBookHeight, setMaxBookHeight] = useState(MAX_BOOK_HEIGHT_PX);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;

    const recalc = () => {
      const styles   = getComputedStyle(el);
      const padY     = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      const available = el.clientHeight - padY - CONTROLS_RESERVED_PX;
      setMaxBookHeight(Math.max(320, Math.min(available, MAX_BOOK_HEIGHT_PX)));
    };

    const observer = new ResizeObserver(recalc);
    observer.observe(el);
    recalc(); // run immediately on mount
    return () => observer.disconnect();
  }, []);

  // ── Fullscreen API ────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Browser may refuse (e.g. iframe sandbox) — fail silently
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef   = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDoc    = useRef<any>(null);
  const rendering = useRef<Set<number>>(new Set());
  const done      = useRef<Set<number>>(new Set());

  /* ── Push rendered dataURL straight into the DOM ────────────────────── */
  const applyPage = useCallback((n: number, dataUrl: string) => {
    const img    = document.getElementById(`fp-img-${n}`) as HTMLImageElement | null;
    const loader = document.getElementById(`fp-load-${n}`) as HTMLElement | null;
    if (!img) return;
    img.onload = () => {
      img.classList.remove('opacity-0');
      img.classList.add('opacity-100');
      if (loader) loader.style.display = 'none';
    };
    img.src = dataUrl;
    done.current.add(n);
    setReadyPages((c) => c + 1);
  }, []);

  /* ── Render one PDF page → canvas → JPEG dataURL → DOM ──────────────── */
  const renderPage = useCallback(async (n: number): Promise<void> => {
    if (!pdfDoc.current)                       return;
    if (done.current.has(n))                   return;
    if (rendering.current.has(n))              return;
    if (n < 1 || n > pdfDoc.current.numPages)  return;

    rendering.current.add(n);
    try {
      const page   = await pdfDoc.current.getPage(n);
      const vp     = page.getViewport({ scale: RENDER_SCALE });
      const canvas = document.createElement('canvas');
      canvas.width  = vp.width;
      canvas.height = vp.height;
      const ctx    = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      applyPage(n, canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    } catch {
      // leave spinner; doesn't block other pages
    } finally {
      rendering.current.delete(n);
    }
  }, [applyPage]);

  /* ── Render the spread around `current` at high priority ────────────── */
  const renderAround = useCallback((current: number, total: number) => {
    [current, current + 1, current + 2, current + 3, current - 1, current - 2]
      .filter((n) => n >= 1 && n <= total)
      .forEach((n) => renderPage(n));
  }, [renderPage]);

  /* ── Load PDF, show book immediately, fill pages in background ───────── */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Dynamic import keeps pdfjs-dist out of the server bundle.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfjs = await import('pdfjs-dist') as any;
        pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;

        if (cancelled) return;

        const doc = await Promise.race([
          pdfjs.getDocument(PDF_URL).promise,
          new Promise<never>((_, rej) =>
            setTimeout(() => rej(new Error('PDF load timed out')), 45_000),
          ),
        ]);
        if (cancelled) return;

        pdfDoc.current = doc;
        setNumPages(doc.numPages);
        setPhase('ready');

        for (let i = 1; i <= Math.min(4, doc.numPages); i++) {
          if (cancelled) return;
          await renderPage(i);
        }

        const rest = Array.from({ length: doc.numPages }, (_, i) => i + 1)
          .filter((n) => !done.current.has(n));

        for (let i = 0; i < rest.length; i += 2) {
          if (cancelled) break;
          await Promise.all(rest.slice(i, i + 2).map((n) => renderPage(n)));
        }
      } catch {
        if (!cancelled) setPhase('error');
      }
    })();

    return () => { cancelled = true; };
  }, [renderPage]);

  /* ── On flip ─────────────────────────────────────────────────────────── */
  const handleFlip = useCallback(
    (e: { data: number }) => {
      setCurrentPage(e.data);
      renderAround(e.data + 1, numPages);
    },
    [numPages, renderAround],
  );

  /* ── Keyboard navigation ─────────────────────────────────────────────── */
  useEffect(() => {
    if (phase !== 'ready') return;
    const handler = (e: KeyboardEvent) => {
      if (!bookRef.current) return;
      const pf = bookRef.current.pageFlip();
      if (e.key === 'ArrowRight' || e.key === 'PageDown') pf.flipNext();
      if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   pf.flipPrev();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, toggleFullscreen]);

  const displayPage = currentPage + 1;

  return (
  <div
    ref={containerRef}
    className={`relative flex flex-col ${isFullscreen ? 'h-screen' : 'min-h-screen pt-16'}`}
    style={{
      background:
        'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)',
    }}
  >
    {/* Floating fullscreen exit button */}
    {isFullscreen && (
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-50 bg-[#1e3143]/80 backdrop-blur px-3 py-2 rounded text-white flex items-center gap-2"
      >
        <Minimize2 className="w-4 h-4" />
        Exit full screen
      </button>
    )}

    {/* Header (hidden in fullscreen) */}
    {!isFullscreen && (
      <div className="bg-[#1e3143]/90 backdrop-blur-sm border-b border-[#1484bc]/20 px-4 sm:px-8 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
        <div>
          <h1 className="text-[#fafbf9] font-bold text-sm sm:text-base leading-tight">
            Annual Integrated Report 2025–26
          </h1>

          {phase === 'ready' && (
            <p className="text-[#aec2cc] text-[11px] mt-0.5">
              Page {displayPage} of {numPages}
              {readyPages < numPages ? (
                <span className="ml-2 text-[#1484bc]">
                  · Rendering {readyPages}/{numPages}…
                </span>
              ) : (
                <span className="ml-2">· ← → or F to navigate</span>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden sm:inline">Full screen</span>
          </button>

          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download PDF</span>
          </a>
        </div>
      </div>
    )}

    {/* Main */}
    <main
      ref={mainRef}
      className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 overflow-hidden"
    >
      {/* Loading */}
      {phase === 'parsing' && (
        <div className="flex flex-col items-center gap-4 text-[#aec2cc]">
          <div className="w-10 h-10 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium mb-1">Loading report…</p>
            <p className="text-xs text-[#aec2cc]/60">
              Fetching 24 MB — usually takes 3–8 seconds
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {phase === 'error' && (
        <div className="text-center text-[#f0f3f5] max-w-sm space-y-4">
          <p className="text-sm leading-relaxed">
            Could not load the report in the browser. Download directly:
          </p>
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1484bc] hover:bg-[#006990] text-white px-6 py-2.5 text-sm font-medium rounded"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
      )}

      {/* Flipbook */}
      {phase === 'ready' && numPages > 0 && (
        <div className="flex flex-col items-center gap-4 w-full">
          <HTMLFlipBook
            ref={bookRef}
            width={520}
            height={720}
            size="stretch"
            minWidth={260}
            maxWidth={620}
            minHeight={320}
            maxHeight={maxBookHeight}
            maxShadowOpacity={0.6}
            showCover={true}
            mobileScrollSupport={true}
            drawShadow={true}
            flippingTime={650}
            useMouseEvents={true}
            swipeDistance={30}
            onFlip={handleFlip}
            className="shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
          >
            {Array.from({ length: numPages }, (_, i) => (
              <FlipPage key={i + 1} pageNum={i + 1} />
            ))}
          </HTMLFlipBook>

          {/* Page jump */}
          <div className="flex items-center gap-2 text-[#aec2cc] text-sm">
            <span>Go to page</span>
            <input
              type="number"
              min={1}
              max={numPages}
              defaultValue={displayPage}
              key={displayPage}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && bookRef.current) {
                  const n = parseInt(
                    (e.target as HTMLInputElement).value,
                    10
                  );
                  if (n >= 1 && n <= numPages) {
                    bookRef.current.pageFlip().flip(n - 1);
                  }
                }
              }}
              className="w-14 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-2 py-1 text-sm outline-none"
            />
            <span>of {numPages}</span>
          </div>
        </div>
      )}
    </main>
  </div>
);
}