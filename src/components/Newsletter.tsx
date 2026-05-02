
// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import { Download, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () =>
//     import('react-pageflip').then(
//       (m) => m.default as unknown as React.ComponentType<AnyProps>,
//     ),
//   { ssr: false },
// );

// const PDF_URL      = '/Assets/AR2025-26-adobecompressed.pdf';
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const WORKER_URL   = '/pdf.worker.min.mjs';

// const BASE_SCALE    = 1.0;
// const MAX_DPR       = 2.5;
// const JPEG_QUALITY  = 0.88;

// const MAX_BOOK_HEIGHT_PX   = 520;
// const CONTROLS_RESERVED_PX = 40;

// // ─── ZOOM ─────────────────────────────────────────────────────────────────────
// // Discrete steps applied as a multiplier to maxWidth and maxHeight props.
// // react-pageflip with size="stretch" fills the width you give it — so
// // controlling maxWidth is the correct lever; no CSS transform needed.
// const ZOOM_STEPS   = [0.65, 0.80, 1.0, 1.2, 1.4] as const;
// const ZOOM_DEFAULT = 2; // index into ZOOM_STEPS → 1.0

// /* ──────────────────────────────────────────────────────────────────────────
//    BuildingFillLoader
// ──────────────────────────────────────────────────────────────────────────── */
// function BuildingFillLoader({ current, total }: { current: number; total: number }) {
//   const fillPct = total > 0 ? Math.min(current / total, 1) : 0;
//   return (
//     <span className="inline-flex items-center gap-1.5 text-[#1484bc] ml-2">
//       <svg width="20" height="22" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"
//         aria-label={`Rendering: ${current} of ${total} pages`}>
//         <defs>
//           <clipPath id="bld-body-clip">
//             <rect x="1" y="6" width="14" height="12" />
//           </clipPath>
//         </defs>
//         <g clipPath="url(#bld-body-clip)">
//           <rect x="1" y="6" width="14" height="12" fill="#22c55e" opacity="0.38"
//             style={{ transformOrigin: '8px 18px', transform: `scaleY(${fillPct})`, transition: 'transform 0.55s ease-out' }} />
//           <rect x="1" y="6" width="14" height="1.5" fill="#00b126" opacity="0.55"
//             style={{ transformOrigin: '8px 18px', transform: `scaleY(${fillPct})`, transition: 'transform 0.55s ease-out' }} />
//         </g>
//         <rect x="1" y="6" width="14" height="12" rx="0.5" stroke="#22c55e" strokeWidth="1.2" />
//         <path d="M0 6L8 1L16 6" stroke="#22c55e" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
//         <rect x="2.5"  y="8.5" width="2.5" height="1.8" rx="0.3" fill="#22c55e" opacity="0.6" />
//         <rect x="6.75" y="8.5" width="2.5" height="1.8" rx="0.3" fill="#22c55e" opacity="0.6" />
//         <rect x="11"   y="8.5" width="2.5" height="1.8" rx="0.3" fill="#22c55e" opacity="0.6" />
//         <rect x="6.5" y="12.5" width="3" height="5.5" rx="0.3" fill="#22c55e" opacity="0.5" />
//       </svg>
//       <span className="tabular-nums text-[10px] font-medium">{current}/{total}</span>
//     </span>
//   );
// }

// /* ──────────────────────────────────────────────────────────────────────────
//    FlipPage
// ──────────────────────────────────────────────────────────────────────────── */
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(
//   ({ pageNum }, ref) => (
//     <div ref={ref} className="relative w-full h-full bg-white overflow-hidden">
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img
//         id={`fp-img-${pageNum}`}
//         className="w-full h-full object-contain opacity-0 transition-opacity duration-500"
//         alt={`Page ${pageNum}`}
//         src=""
//       />
//       <div id={`fp-load-${pageNum}`} className="absolute inset-0 flex items-center justify-center bg-white">
//         <div className="w-5 h-5 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin" />
//       </div>
//     </div>
//   ),
// );
// FlipPage.displayName = 'FlipPage';

// /* ──────────────────────────────────────────────────────────────────────────
//    NewsletterViewer
// ──────────────────────────────────────────────────────────────────────────── */
// export default function NewsletterViewer() {
//   const [phase, setPhase]               = useState<'parsing' | 'ready' | 'error'>('parsing');
//   const [numPages, setNumPages]         = useState(0);
//   const [currentPage, setCurrentPage]   = useState(0);
//   const [readyPages, setReadyPages]     = useState(0);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [maxBookHeight, setMaxBookHeight] = useState(MAX_BOOK_HEIGHT_PX);

//   // ── Zoom state ───────────────────────────────────────────────────────
//   const [zoomIdx, setZoomIdx] = useState(ZOOM_DEFAULT);
//   const zoomFactor = ZOOM_STEPS[zoomIdx];
//   const canZoomIn  = zoomIdx < ZOOM_STEPS.length - 1;
//   const canZoomOut = zoomIdx > 0;

//   const dprRef = useRef(1);
//   useEffect(() => {
//     dprRef.current = Math.min(window.devicePixelRatio || 1, MAX_DPR);
//   }, []);

//   const mainRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const recalc = () => {
//       const styles    = getComputedStyle(el);
//       const padY      = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
//       const available = el.clientHeight - padY - CONTROLS_RESERVED_PX;
//       setMaxBookHeight(Math.max(320, Math.min(available, MAX_BOOK_HEIGHT_PX)));
//     };
//     const observer = new ResizeObserver(recalc);
//     observer.observe(el);
//     recalc();
//     return () => observer.disconnect();
//   }, []);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const toggleFullscreen = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) {
//         await containerRef.current?.requestFullscreen();
//       } else {
//         await document.exitFullscreen();
//       }
//     } catch { /* fail silently */ }
//   }, []);

//   useEffect(() => {
//     const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
//     document.addEventListener('fullscreenchange', onFsChange);
//     return () => document.removeEventListener('fullscreenchange', onFsChange);
//   }, []);

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef   = useRef<any>(null);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const pdfDoc    = useRef<any>(null);
//   const rendering = useRef<Set<number>>(new Set());
//   const done      = useRef<Set<number>>(new Set());

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

//   const renderPage = useCallback(async (n: number): Promise<void> => {
//     if (!pdfDoc.current)                      return;
//     if (done.current.has(n))                  return;
//     if (rendering.current.has(n))             return;
//     if (n < 1 || n > pdfDoc.current.numPages) return;

//     rendering.current.add(n);
//     try {
//       const page  = await pdfDoc.current.getPage(n);
//       const scale = BASE_SCALE * dprRef.current;
//       const vp    = page.getViewport({ scale });
//       const canvas  = document.createElement('canvas');
//       canvas.width  = vp.width;
//       canvas.height = vp.height;
//       const ctx     = canvas.getContext('2d')!;
//       await page.render({ canvasContext: ctx, viewport: vp }).promise;
//       applyPage(n, canvas.toDataURL('image/jpeg', JPEG_QUALITY));
//     } catch {
//       // leave spinner; doesn't block other pages
//     } finally {
//       rendering.current.delete(n);
//     }
//   }, [applyPage]);

//   const renderAround = useCallback((current: number, total: number) => {
//     [current, current + 1, current + 2, current + 3, current - 1, current - 2]
//       .filter((n) => n >= 1 && n <= total)
//       .forEach((n) => renderPage(n));
//   }, [renderPage]);

//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       try {
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
//         setPhase('ready');

//         for (let i = 1; i <= Math.min(4, doc.numPages); i++) {
//           if (cancelled) return;
//           await renderPage(i);
//         }
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

//   const handleFlip = useCallback(
//     (e: { data: number }) => {
//       setCurrentPage(e.data);
//       renderAround(e.data + 1, numPages);
//     },
//     [numPages, renderAround],
//   );

//   useEffect(() => {
//     if (phase !== 'ready') return;
//     const handler = (e: KeyboardEvent) => {
//       if (!bookRef.current) return;
//       const pf = bookRef.current.pageFlip();
//       if (e.key === 'ArrowRight' || e.key === 'PageDown') pf.flipNext();
//       if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   pf.flipPrev();
//       if (e.key === 'f' || e.key === 'F') toggleFullscreen();
//       if (e.key === '+' || e.key === '=') setZoomIdx((i) => Math.min(i + 1, ZOOM_STEPS.length - 1));
//       if (e.key === '-')                  setZoomIdx((i) => Math.max(i - 1, 0));
//     };
//     window.addEventListener('keydown', handler);
//     return () => window.removeEventListener('keydown', handler);
//   }, [phase, toggleFullscreen]);

//   const displayPage = currentPage + 1;

//   // Derived flipbook dimensions — zoom multiplied against base caps
//   const zoomedMaxWidth  = Math.round(620  * zoomFactor);
//   const zoomedMaxHeight = Math.round(maxBookHeight * zoomFactor);

//   return (
//     <div
//       ref={containerRef}
//       className={`relative flex flex-col ${isFullscreen ? 'h-screen' : 'min-h-screen pt-16'}`}
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       {isFullscreen && (
//         <button
//           onClick={toggleFullscreen}
//           className="absolute top-4 right-4 z-50 bg-[#1e3143]/80 backdrop-blur px-3 py-2 rounded text-white flex items-center gap-2"
//         >
//           <Minimize2 className="w-4 h-4" />
//           Exit full screen
//         </button>
//       )}

//       {!isFullscreen && (
//         <div className="bg-[#1e3143]/90 backdrop-blur-sm border-b border-[#1484bc]/20 px-4 sm:px-8 py-2.5 flex items-center justify-between flex-shrink-0 z-10 mt-1">
//           <div>
//             <h1 className="text-[#fafbf9] font-bold text-sm sm:text-base leading-tight">
//               Annual Integrated Report 2025–26
//             </h1>
//             {phase === 'ready' && (
//               <p className="text-[#aec2cc] text-[11px] mt-0.5 flex items-center">
//                 Page {displayPage} of {numPages}
//                 {readyPages < numPages ? (
//                   <BuildingFillLoader current={readyPages} total={numPages} />
//                 ) : (
//                   <span className="ml-2">· ← → or F to navigate</span>
//                 )}
//               </p>
//             )}
//           </div>
//           <div className="flex items-center gap-3">
//             <button onClick={toggleFullscreen} className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm">
//               <Maximize2 className="w-4 h-4" />
//               <span className="hidden sm:inline">Full screen</span>
//             </button>
//             <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
//               className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm">
//               <Download className="w-4 h-4" />
//               <span className="hidden sm:inline">Download PDF</span>
//             </a>
//           </div>
//         </div>
//       )}

//       <main ref={mainRef} className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 overflow-hidden">
//         {phase === 'parsing' && (
//           <div className="flex flex-col items-center gap-4 text-[#aec2cc]">
//             <div className="w-10 h-10 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin" />
//             <div className="text-center">
//               <p className="text-sm font-medium mb-1">Loading report…</p>
//               <p className="text-xs text-[#aec2cc]/60">Usually takes 3–8 seconds</p>
//             </div>
//           </div>
//         )}

//         {phase === 'error' && (
//           <div className="text-center text-[#f0f3f5] max-w-sm space-y-4">
//             <p className="text-sm leading-relaxed">
//               Could not load the report in the browser. Download directly:
//             </p>
//             <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 bg-[#1484bc] hover:bg-[#006990] text-white px-6 py-2.5 text-sm font-medium rounded">
//               <Download className="w-4 h-4" />
//               Download PDF
//             </a>
//           </div>
//         )}

//         {phase === 'ready' && numPages > 0 && (
//           <div className="flex flex-col items-center gap-4 w-full">
//             <HTMLFlipBook
//               ref={bookRef}
//               width={520}
//               height={720}
//               size="stretch"
//               minWidth={260}
//               maxWidth={zoomedMaxWidth}
//               minHeight={320}
//               maxHeight={zoomedMaxHeight}
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

//             {/* Controls row — hidden in fullscreen */}
//             {!isFullscreen && (
//               <div className="flex items-center gap-3 text-[#aec2cc] text-sm">

//                 {/* Zoom out */}
//                 <button
//                   onClick={() => setZoomIdx((i) => Math.max(i - 1, 0))}
//                   disabled={!canZoomOut}
//                   aria-label="Zoom out"
//                   className="flex items-center justify-center text-[#aec2cc] hover:text-[#1484bc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ZoomOut className="w-4 h-4" />
//                 </button>

//                 {/* Page jump */}
//                 <span>Go to page</span>
//                 <input
//                   type="number"
//                   min={1}
//                   max={numPages}
//                   defaultValue={displayPage}
//                   key={displayPage}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' && bookRef.current) {
//                       const n = parseInt((e.target as HTMLInputElement).value, 10);
//                       if (n >= 1 && n <= numPages) {
//                         bookRef.current.pageFlip().flip(n - 1);
//                       }
//                     }
//                   }}
//                   className="w-14 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-2 py-1 text-sm outline-none"
//                 />
//                 <span>of {numPages}</span>

//                 {/* Zoom in */}
//                 <button
//                   onClick={() => setZoomIdx((i) => Math.min(i + 1, ZOOM_STEPS.length - 1))}
//                   disabled={!canZoomIn}
//                   aria-label="Zoom in"
//                   className="flex items-center justify-center text-[#aec2cc] hover:text-[#1484bc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ZoomIn className="w-4 h-4" />
//                 </button>

//               </div>
//             )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }






'use client';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Download, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

const HTMLFlipBook = dynamic<AnyProps>(
  () => import('react-pageflip').then((m) => m.default as unknown as React.ComponentType<AnyProps>),
  { ssr: false },
);

const PDF_URL      = '/Assets/AR2025-26-adobecompressed.pdf';
const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
const WORKER_URL   = '/pdf.worker.min.mjs';

const BASE_SCALE    = 1.0;
const MAX_DPR       = 2.5;
const JPEG_QUALITY  = 0.88;
const MAX_BOOK_H    = 520;
const CONTROLS_H    = 40;
const ZOOM_MIN      = 1;
const ZOOM_MAX      = 4;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/* ── BuildingFillLoader ────────────────────────────────────────────────── */
function BuildingFillLoader({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.min(current / total, 1) : 0;
  return (
    <span className="inline-flex items-center gap-1.5 text-[#1484bc] ml-2">
      <svg width="20" height="22" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-label={`Rendering: ${current} of ${total} pages`}>
        <defs><clipPath id="bld-clip"><rect x="1" y="6" width="14" height="12"/></clipPath></defs>
        <g clipPath="url(#bld-clip)">
          <rect x="1" y="6" width="14" height="12" fill="#22c55e" opacity="0.38"
            style={{ transformOrigin:'8px 18px', transform:`scaleY(${pct})`, transition:'transform 0.55s ease-out' }}/>
          <rect x="1" y="6" width="14" height="1.5" fill="#00b126" opacity="0.55"
            style={{ transformOrigin:'8px 18px', transform:`scaleY(${pct})`, transition:'transform 0.55s ease-out' }}/>
        </g>
        <rect x="1" y="6" width="14" height="12" rx="0.5" stroke="#22c55e" strokeWidth="1.2"/>
        <path d="M0 6L8 1L16 6" stroke="#22c55e" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
        <rect x="2.5"  y="8.5" width="2.5" height="1.8" rx="0.3" fill="#22c55e" opacity="0.6"/>
        <rect x="6.75" y="8.5" width="2.5" height="1.8" rx="0.3" fill="#22c55e" opacity="0.6"/>
        <rect x="11"   y="8.5" width="2.5" height="1.8" rx="0.3" fill="#22c55e" opacity="0.6"/>
        <rect x="6.5" y="12.5" width="3" height="5.5" rx="0.3" fill="#22c55e" opacity="0.5"/>
      </svg>
      <span className="tabular-nums text-[10px] font-medium">{current}/{total}</span>
    </span>
  );
}

/* ── FlipPage ──────────────────────────────────────────────────────────── */
const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
  <div ref={ref} className="relative w-full h-full bg-white overflow-hidden">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img id={`fp-img-${pageNum}`}
      className="w-full h-full object-contain opacity-0 transition-opacity duration-500"
      alt={`Page ${pageNum}`} src="" />
    <div id={`fp-load-${pageNum}`} className="absolute inset-0 flex items-center justify-center bg-white">
      <div className="w-5 h-5 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin"/>
    </div>
  </div>
));
FlipPage.displayName = 'FlipPage';

/* ── NewsletterViewer ──────────────────────────────────────────────────── */
export default function NewsletterViewer() {
  const [phase, setPhase]       = useState<'parsing'|'ready'|'error'>('parsing');
  const [numPages, setNumPages] = useState(0);
  const [curPage,  setCurPage]  = useState(0);
  const [ready,    setReady]    = useState(0);
  const [isFS,     setIsFS]     = useState(false);
  const [bookH,    setBookH]    = useState(MAX_BOOK_H);

  // ── Zoom + pan ────────────────────────────────────────────────────────
  // zoomRef / panRef are always in sync with state — kept as refs so native
  // event handlers (attached via addEventListener) read current values
  // without re-attaching on every state change.
  const [zoom, setZoom] = useState(1);
  const [pan,  setPan]  = useState({ x: 0, y: 0 });
  const zoomRef = useRef(1);
  const panRef  = useRef({ x: 0, y: 0 });
  // Keep refs in sync every render
  zoomRef.current = zoom;
  panRef.current  = pan;

  const isZoomed = zoom > 1.01;

  const resetZoom = useCallback(() => {
    setZoom(1); zoomRef.current = 1;
    setPan({ x: 0, y: 0 });
  }, []);

  // ── DPR ──────────────────────────────────────────────────────────────
  const dprRef = useRef(1);
  useEffect(() => { dprRef.current = Math.min(window.devicePixelRatio || 1, MAX_DPR); }, []);

  // ── Book container height (ResizeObserver on <main>) ──────────────────
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const calc = () => {
      const s   = getComputedStyle(el);
      const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
      setBookH(Math.max(320, Math.min(el.clientHeight - pad - CONTROLS_H, MAX_BOOK_H)));
    };
    const ro = new ResizeObserver(calc);
    ro.observe(el); calc();
    return () => ro.disconnect();
  }, []);

  // ── Fullscreen ────────────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleFS = useCallback(async () => {
    try {
      if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
      else await document.exitFullscreen();
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, [resetZoom]);

  // ── PDF render ────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef   = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfDoc    = useRef<any>(null);
  const rendering = useRef<Set<number>>(new Set());
  const done      = useRef<Set<number>>(new Set());

  const applyPage = useCallback((n: number, url: string) => {
    const img = document.getElementById(`fp-img-${n}`) as HTMLImageElement|null;
    const ldr = document.getElementById(`fp-load-${n}`) as HTMLElement|null;
    if (!img) return;
    img.onload = () => {
      img.classList.replace('opacity-0','opacity-100');
      if (ldr) ldr.style.display = 'none';
    };
    img.src = url;
    done.current.add(n);
    setReady(c => c + 1);
  }, []);

  const renderPage = useCallback(async (n: number) => {
    if (!pdfDoc.current || done.current.has(n) || rendering.current.has(n)) return;
    if (n < 1 || n > pdfDoc.current.numPages) return;
    rendering.current.add(n);
    try {
      const pg  = await pdfDoc.current.getPage(n);
      const vp  = pg.getViewport({ scale: BASE_SCALE * dprRef.current });
      const cvs = document.createElement('canvas');
      cvs.width = vp.width; cvs.height = vp.height;
      await pg.render({ canvasContext: cvs.getContext('2d')!, viewport: vp }).promise;
      applyPage(n, cvs.toDataURL('image/jpeg', JPEG_QUALITY));
    } catch { /* leave spinner */ } finally { rendering.current.delete(n); }
  }, [applyPage]);

  const renderAround = useCallback((cur: number, total: number) => {
    [cur, cur+1, cur+2, cur+3, cur-1, cur-2]
      .filter(n => n >= 1 && n <= total)
      .forEach(renderPage);
  }, [renderPage]);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pdfjs = await import('pdfjs-dist') as any;
        pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;
        if (dead) return;
        const doc = await Promise.race([
          pdfjs.getDocument(PDF_URL).promise,
          new Promise<never>((_,r) => setTimeout(() => r(new Error('timeout')), 45_000)),
        ]);
        if (dead) return;
        pdfDoc.current = doc;
        setNumPages(doc.numPages);
        setPhase('ready');
        for (let i = 1; i <= Math.min(4, doc.numPages); i++) { if (dead) return; await renderPage(i); }
        const rest = Array.from({length: doc.numPages}, (_,i) => i+1).filter(n => !done.current.has(n));
        for (let i = 0; i < rest.length; i += 2) {
          if (dead) break;
          await Promise.all(rest.slice(i, i+2).map(renderPage));
        }
      } catch { if (!dead) setPhase('error'); }
    })();
    return () => { dead = true; };
  }, [renderPage]);

  const handleFlip = useCallback((e: {data:number}) => {
    setCurPage(e.data);
    renderAround(e.data+1, numPages);
  }, [numPages, renderAround]);

  // ── Keyboard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'ready') return;
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return; // don't fight browser zoom shortcuts
      if (e.key === 'Escape')                   { resetZoom(); return; }
      if (e.key === 'f' || e.key === 'F')        { toggleFS(); return; }
      if (e.key === '+' || e.key === '=')        { setZoom(z => { const n=clamp(z+0.5,ZOOM_MIN,ZOOM_MAX); zoomRef.current=n; return n; }); return; }
      if (e.key === '-')                         { setZoom(z => { const n=clamp(z-0.5,ZOOM_MIN,ZOOM_MAX); zoomRef.current=n; if(n<=1.01)setPan({x:0,y:0}); return n; }); return; }
      if (!isZoomed && bookRef.current) {
        const pf = bookRef.current.pageFlip();
        if (e.key === 'ArrowRight' || e.key === 'PageDown') pf.flipNext();
        if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   pf.flipPrev();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [phase, isZoomed, resetZoom, toggleFS]);

  // ── Gesture listeners (single capture-phase effect, attached once) ────
  //
  // Architecture:
  //   zoomContainerRef  ←  capture phase listeners (fire BEFORE react-pageflip)
  //     └── scale wrapper
  //           └── HTMLFlipBook  (react-pageflip handles its own events)
  //
  // When to intercept (stopPropagation stops event reaching flipbook):
  //   • Wheel            → always (zoom)
  //   • 2-finger touch   → always (pinch zoom)
  //   • 1-finger + zoomed → always (pan / double-tap reset)
  //   • 1-finger + 1×   → do NOT intercept → react-pageflip handles the flip
  //   • Mouse + zoomed   → intercept (pan)
  //   • Mouse + 1×       → do NOT intercept → react-pageflip handles the flip
  //
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = zoomContainerRef.current;
    if (!el) return;

    const g = {
      // mouse
      md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
      // touch
      pinching: false, pd0: 0, pz0: 1,
      panning: false,  tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
      // double tap
      lastTap: 0,
    };

    const maxPan = (z: number) => ({ mx: (z-1)*400, my: (z-1)*320 });

    // ── Wheel ────────────────────────────────────────────────────────
    const onWheel = (e: WheelEvent) => {
      e.preventDefault(); e.stopPropagation();
      const d = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY; // normalize line/pixel
      setZoom(z => {
        const n = clamp(z - d/500, ZOOM_MIN, ZOOM_MAX);
        zoomRef.current = n;
        if (n <= 1.01) setPan({ x: 0, y: 0 });
        return n;
      });
    };

    // ── Mouse drag ───────────────────────────────────────────────────
    const onMouseDown = (e: MouseEvent) => {
      if (zoomRef.current <= 1.01) return; // not zoomed → let flipbook flip
      e.preventDefault(); e.stopPropagation();
      g.md = true;
      g.mx0 = e.clientX; g.my0 = e.clientY;
      g.px0 = panRef.current.x; g.py0 = panRef.current.y;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!g.md) return;
      const z = zoomRef.current;
      const {mx, my} = maxPan(z);
      setPan({
        x: clamp(g.px0 + e.clientX - g.mx0, -mx, mx),
        y: clamp(g.py0 + e.clientY - g.my0, -my, my),
      });
    };
    const onMouseUp = () => { g.md = false; };

    // ── Touch ────────────────────────────────────────────────────────
    // touchstart: decide whether to intercept based on finger count + zoom state
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        // ── Pinch: always intercept ──────────────────────────────────
        e.preventDefault(); e.stopPropagation();
        g.pinching = true; g.panning = false;
        g.pd0 = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        g.pz0 = zoomRef.current;
      } else if (e.touches.length === 1 && zoomRef.current > 1.01) {
        // ── Single finger + zoomed: pan / double-tap reset ───────────
        e.preventDefault(); e.stopPropagation();
        g.panning = true; g.pinching = false;
        // Double-tap to reset zoom
        const now = Date.now();
        if (now - g.lastTap < 300) {
          setZoom(1); zoomRef.current = 1;
          setPan({ x: 0, y: 0 });
          g.lastTap = 0;
          return;
        }
        g.lastTap = now;
        g.tx0 = e.touches[0].clientX; g.ty0 = e.touches[0].clientY;
        g.tpx0 = panRef.current.x;    g.tpy0 = panRef.current.y;
      }
      // else: 1 finger + not zoomed → don't intercept → react-pageflip flips
    };

    // touchmove: handle pinch zoom or pan (also handles pinch→pan transition)
    const onTouchMove = (e: TouchEvent) => {
      if (g.pinching && e.touches.length >= 2) {
        e.preventDefault(); e.stopPropagation();
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const n = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
        setZoom(n); zoomRef.current = n;
        if (n <= 1.01) setPan({ x: 0, y: 0 });
      } else if (e.touches.length === 1 && zoomRef.current > 1.01) {
        // Also handles pinch→pan: when one finger lifts during/after a pinch,
        // remaining finger continues here. We initialize pan start on first move.
        e.preventDefault(); e.stopPropagation();
        if (!g.panning) {
          // Pinch-to-pan transition: capture current touch position as new start
          g.panning = true;
          g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
          g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
        }
        const z = zoomRef.current;
        const {mx, my} = maxPan(z);
        setPan({
          x: clamp(g.tpx0 + e.touches[0].clientX - g.tx0, -mx, mx),
          y: clamp(g.tpy0 + e.touches[0].clientY - g.ty0, -my, my),
        });
      }
      // else: 1 finger + not zoomed → don't intercept → react-pageflip flips
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) g.pinching = false;
      if (e.touches.length === 0) { g.panning = false; }
    };

    // All listeners in capture phase so they fire before react-pageflip's own handlers.
    // passive: false required for preventDefault() to work in touchmove/wheel.
    el.addEventListener('wheel',      onWheel,      { capture: true, passive: false });
    el.addEventListener('mousedown',  onMouseDown,  { capture: true });
    el.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
    el.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
    el.addEventListener('touchend',   onTouchEnd,   { capture: true });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);

    return () => {
      el.removeEventListener('wheel',      onWheel,      { capture: true });
      el.removeEventListener('mousedown',  onMouseDown,  { capture: true });
      el.removeEventListener('touchstart', onTouchStart, { capture: true });
      el.removeEventListener('touchmove',  onTouchMove,  { capture: true });
      el.removeEventListener('touchend',   onTouchEnd,   { capture: true });
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, []); // attach once — reads live values from refs

  const displayPage = curPage + 1;

  return (
    <div ref={containerRef}
      className={`relative flex flex-col ${isFS ? 'h-screen' : 'min-h-screen pt-16'}`}
      style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
    >
      {isFS && (
        <button onClick={toggleFS}
          className="absolute top-4 right-4 z-50 bg-[#1e3143]/80 backdrop-blur px-3 py-2 rounded text-white flex items-center gap-2">
          <Minimize2 className="w-4 h-4"/> Exit full screen
        </button>
      )}

      {!isFS && (
        <div className="bg-[#1e3143]/90 backdrop-blur-sm border-b border-[#1484bc]/20 px-4 sm:px-8 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
          <div>
            <h1 className="text-[#fafbf9] font-bold text-sm sm:text-base leading-tight mt-1">
              Annual Integrated Report 2025–26
            </h1>
            {phase === 'ready' && (
              <p className="text-[#aec2cc] text-[11px] mt-0.5 flex items-center">
                Page {displayPage} of {numPages}
                {ready < numPages
                  ? <BuildingFillLoader current={ready} total={numPages}/>
                  : <span className="ml-2">· ← → or F to navigate</span>
                }
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleFS} className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm">
              <Maximize2 className="w-4 h-4"/><span className="hidden sm:inline">Full screen</span>
            </button>
            <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm">
              <Download className="w-4 h-4"/><span className="hidden sm:inline">Download PDF</span>
            </a>
          </div>
        </div>
      )}

      <main ref={mainRef}
        className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 overflow-hidden"
      >
        {phase === 'parsing' && (
          <div className="flex flex-col items-center gap-4 text-[#aec2cc]">
            <div className="w-10 h-10 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin"/>
            <div className="text-center">
              <p className="text-sm font-medium mb-1">Loading report…</p>
              <p className="text-xs text-[#aec2cc]/60">Usually takes 3–8 seconds</p>
            </div>
          </div>
        )}

        {phase === 'error' && (
          <div className="text-center text-[#f0f3f5] max-w-sm space-y-4">
            <p className="text-sm">Could not load the report. Download directly:</p>
            <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1484bc] hover:bg-[#006990] text-white px-6 py-2.5 text-sm font-medium rounded">
              <Download className="w-4 h-4"/>Download PDF
            </a>
          </div>
        )}

        {phase === 'ready' && numPages > 0 && (
          <div className="flex flex-col items-center gap-4 w-full">

            {/*
              Zoom container — NO explicit height, NO overflow:hidden.
              CSS transform (scale) does not affect layout, so siblings
              (controls bar) stay put regardless of zoom level.
              <main> overflow:hidden is the visual clip boundary.

              cursor and touchAction update via React inline style on
              every render, which is fine (no performance issue here).
            */}
            <div
              ref={zoomContainerRef}
              className="relative w-full"
              style={{
                cursor: isZoomed ? 'grab' : 'default',
                // touchAction:none prevents browser scroll/pinch-zoom only
                // when zoomed. When at 1×, 'auto' lets react-pageflip's
                // mobileScrollSupport work naturally for page flipping.
                touchAction: isZoomed ? 'none' : 'auto',
              }}
            >
              {/*
                Scale + translate wrapper.
                width:100% is critical — react-pageflip reads parentElement
                .offsetWidth for size="stretch". Without it the book collapses
                to single-page width.
                transform-origin:center top anchors zoom to the book top-centre.
                Transition kept short (0.08s) so drag/pinch feels immediate.
              */}
              <div style={{
                width: '100%',
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: 'center top',
                transition: 'transform 0.08s ease-out',
                willChange: 'transform',
              }}>
                <HTMLFlipBook
                  ref={bookRef}
                  width={520}
                  height={720}
                  size="stretch"
                  minWidth={260}
                  maxWidth={620}
                  minHeight={320}
                  maxHeight={bookH}
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
                    <FlipPage key={i+1} pageNum={i+1}/>
                  ))}
                </HTMLFlipBook>
              </div>

              {/* Reset badge — floats at the bottom of the book area when zoomed.
                  position:absolute relative to the zoom container (position:relative).
                  z-index:20 keeps it above the flipbook shadow layer.             */}
              {isZoomed && (
                <button
                  onClick={resetZoom}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20
                    flex items-center gap-1.5
                    bg-[#0d1f2e]/80 backdrop-blur border border-[#1484bc]/40
                    text-[#aec2cc] hover:text-white hover:border-[#1484bc]
                    text-[11px] px-3 py-1.5 rounded-full
                    transition-colors select-none"
                >
                  {zoom.toFixed(1)}× · tap to reset
                </button>
              )}
            </div>

            {/* Controls row — outside zoom container, never affected by transform */}
            {!isFS && (
              <div className="flex items-center gap-3 text-[#aec2cc] text-sm">

                {/* Zoom out — mobile / tablet only. Desktop uses scroll wheel. */}
                <button
                  onClick={() => { setZoom(z => { const n=clamp(z-0.5,ZOOM_MIN,ZOOM_MAX); zoomRef.current=n; if(n<=1.01)setPan({x:0,y:0}); return n; }); }}
                  disabled={!isZoomed}
                  aria-label="Zoom out"
                  className="md:hidden text-[#aec2cc] hover:text-[#1484bc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ZoomOut className="w-4 h-4"/>
                </button>

                <span>Go to page</span>
                <input
                  type="number" min={1} max={numPages}
                  defaultValue={displayPage} key={displayPage}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && bookRef.current) {
                      const n = parseInt((e.target as HTMLInputElement).value, 10);
                      if (n >= 1 && n <= numPages) bookRef.current.pageFlip().flip(n-1);
                    }
                  }}
                  className="w-14 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-2 py-1 text-sm outline-none"
                />
                <span>of {numPages}</span>

                {/* Zoom in — mobile / tablet only */}
                <button
                  onClick={() => { setZoom(z => { const n=clamp(z+0.5,ZOOM_MIN,ZOOM_MAX); zoomRef.current=n; return n; }); }}
                  disabled={zoom >= ZOOM_MAX}
                  aria-label="Zoom in"
                  className="md:hidden text-[#aec2cc] hover:text-[#1484bc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ZoomIn className="w-4 h-4"/>
                </button>

              </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}