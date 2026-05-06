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
//   () => import('react-pageflip').then((m) => m.default as unknown as React.ComponentType<AnyProps>),
//   { ssr: false },
// );

// const PDF_URL      = '/Assets/ufirmfinal.pdf';
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const WORKER_URL   = '/pdf.worker.min.mjs';

// const BASE_SCALE    = 1.0;
// const MAX_DPR       = 2.5;
// const JPEG_QUALITY  = 0.88;
// const MAX_BOOK_H    = 520;
// const CONTROLS_H    = 40;
// const ZOOM_MIN      = 1;
// const ZOOM_MAX      = 4;
// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// /* ── BuildingFillLoader ────────────────────────────────────────────────── */
// function BuildingFillLoader({ current, total }: { current: number; total: number }) {
//   const pct = total > 0 ? Math.min(current / total, 1) : 0;
//   return (
//     <span className="inline-flex items-center gap-1.5 text-[#1484bc] ml-2">
//       <svg width="20" height="22" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg"
//         aria-label={`Rendering: ${current} of ${total} pages`}>
//         <defs><clipPath id="bld-clip"><rect x="1" y="6" width="14" height="12"/></clipPath></defs>
//         <g clipPath="url(#bld-clip)">
//           <rect x="1" y="6" width="14" height="12" fill="#22c55e" opacity="0.38"
//             style={{ transformOrigin:'8px 18px', transform:`scaleY(${pct})`, transition:'transform 0.55s ease-out' }}/>
//           <rect x="1" y="6" width="14" height="1.5" fill="#00b126" opacity="0.55"
//             style={{ transformOrigin:'8px 18px', transform:`scaleY(${pct})`, transition:'transform 0.55s ease-out' }}/>
//         </g>
//         <rect x="1" y="6" width="14" height="12" rx="0.5" stroke="#22c55e" strokeWidth="1.2"/>
//         <path d="M0 6L8 1L16 6" stroke="#22c55e" strokeWidth="1.2" strokeLinejoin="round" fill="none"/>
//         <rect x="2.5"  y="8.5" width="2.5" height="1.8" rx="0.3" fill="#22c55e" opacity="0.6"/>
//         <rect x="6.75" y="8.5" width="2.5" height="1.8" rx="0.3" fill="#22c55e" opacity="0.6"/>
//         <rect x="11"   y="8.5" width="2.5" height="1.8" rx="0.3" fill="#22c55e" opacity="0.6"/>
//         <rect x="6.5" y="12.5" width="3" height="5.5" rx="0.3" fill="#22c55e" opacity="0.5"/>
//       </svg>
//       <span className="tabular-nums text-[10px] font-medium">{current}/{total}</span>
//     </span>
//   );
// }

// /* ── FlipPage ──────────────────────────────────────────────────────────── */
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
//   <div ref={ref} className="relative w-full h-full bg-white overflow-hidden">
//     {/* eslint-disable-next-line @next/next/no-img-element */}
//     <img id={`fp-img-${pageNum}`}
//       className="w-full h-full object-contain opacity-0 transition-opacity duration-500"
//       alt={`Page ${pageNum}`} src="" />
//     <div id={`fp-load-${pageNum}`} className="absolute inset-0 flex items-center justify-center bg-white">
//       <div className="w-5 h-5 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin"/>
//     </div>
//   </div>
// ));
// FlipPage.displayName = 'FlipPage';

// /* ── NewsletterViewer ──────────────────────────────────────────────────── */
// export default function NewsletterViewer() {
//   const [phase, setPhase]       = useState<'parsing'|'ready'|'error'>('parsing');
//   const [numPages, setNumPages] = useState(0);
//   const [curPage,  setCurPage]  = useState(0);
//   const [ready,    setReady]    = useState(0);
//   const [isFS,     setIsFS]     = useState(false);
//   const [bookH,    setBookH]    = useState(MAX_BOOK_H);

//   // ── Zoom + pan ────────────────────────────────────────────────────────
//   // zoomRef / panRef are always in sync with state — kept as refs so native
//   // event handlers (attached via addEventListener) read current values
//   // without re-attaching on every state change.
//   const [zoom, setZoom] = useState(1);
//   const [pan,  setPan]  = useState({ x: 0, y: 0 });
//   const zoomRef = useRef(1);
//   const panRef  = useRef({ x: 0, y: 0 });
//   // Keep refs in sync every render
//   zoomRef.current = zoom;
//   panRef.current  = pan;

//   const isZoomed = zoom > 1.01;

//   const resetZoom = useCallback(() => {
//     setZoom(1); zoomRef.current = 1;
//     setPan({ x: 0, y: 0 });
//   }, []);

//   // ── DPR ──────────────────────────────────────────────────────────────
//   const dprRef = useRef(1);
//   useEffect(() => { dprRef.current = Math.min(window.devicePixelRatio || 1, MAX_DPR); }, []);

//   // ── Book container height (ResizeObserver on <main>) ──────────────────
//   const mainRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       setBookH(Math.max(320, Math.min(el.clientHeight - pad - CONTROLS_H, MAX_BOOK_H)));
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el); calc();
//     return () => ro.disconnect();
//   }, []);

//   // ── Fullscreen ────────────────────────────────────────────────────────
//   const containerRef = useRef<HTMLDivElement>(null);
//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   // ── PDF render ────────────────────────────────────────────────────────
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef   = useRef<any>(null);
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const pdfDoc    = useRef<any>(null);
//   const rendering = useRef<Set<number>>(new Set());
//   const done      = useRef<Set<number>>(new Set());

//   const applyPage = useCallback((n: number, url: string) => {
//     const img = document.getElementById(`fp-img-${n}`) as HTMLImageElement|null;
//     const ldr = document.getElementById(`fp-load-${n}`) as HTMLElement|null;
//     if (!img) return;
//     img.onload = () => {
//       img.classList.replace('opacity-0','opacity-100');
//       if (ldr) ldr.style.display = 'none';
//     };
//     img.src = url;
//     done.current.add(n);
//     setReady(c => c + 1);
//   }, []);

//   const renderPage = useCallback(async (n: number) => {
//     if (!pdfDoc.current || done.current.has(n) || rendering.current.has(n)) return;
//     if (n < 1 || n > pdfDoc.current.numPages) return;
//     rendering.current.add(n);
//     try {
//       const pg  = await pdfDoc.current.getPage(n);
//       const vp  = pg.getViewport({ scale: BASE_SCALE * dprRef.current });
//       const cvs = document.createElement('canvas');
//       cvs.width = vp.width; cvs.height = vp.height;
//       await pg.render({ canvasContext: cvs.getContext('2d')!, viewport: vp }).promise;
//       applyPage(n, cvs.toDataURL('image/jpeg', JPEG_QUALITY));
//     } catch { /* leave spinner */ } finally { rendering.current.delete(n); }
//   }, [applyPage]);

//   const renderAround = useCallback((cur: number, total: number) => {
//     [cur, cur+1, cur+2, cur+3, cur-1, cur-2]
//       .filter(n => n >= 1 && n <= total)
//       .forEach(renderPage);
//   }, [renderPage]);

//   /* ── Load PDF, show book immediately, fill pages in background ───────── */
//   useEffect(() => {
//     let dead = false;
//     (async () => {
//       try {
//         // Dynamic import keeps pdfjs-dist out of the server bundle.
//         // Worker is a static public file — simple, reliable, no CORS.
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const pdfjs = await import('pdfjs-dist') as any;
//         pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;
//         if (dead) return;
//         const doc = await Promise.race([
//           pdfjs.getDocument(PDF_URL).promise,
//           new Promise<never>((_,r) => setTimeout(() => r(new Error('timeout')), 45_000)),
//         ]);
//         if (dead) return;
//         pdfDoc.current = doc;
//         setNumPages(doc.numPages);
//         setPhase('ready');
//         for (let i = 1; i <= Math.min(4, doc.numPages); i++) { if (dead) return; await renderPage(i); }
//         const rest = Array.from({length: doc.numPages}, (_,i) => i+1).filter(n => !done.current.has(n));
//         for (let i = 0; i < rest.length; i += 2) {
//           if (dead) break;
//           await Promise.all(rest.slice(i, i+2).map(renderPage));
//         }
//       } catch { if (!dead) setPhase('error'); }
//     })();
//     return () => { dead = true; };
//   }, [renderPage]);

//   const handleFlip = useCallback((e: {data:number}) => {
//     setCurPage(e.data);
//     renderAround(e.data+1, numPages);
//   }, [numPages, renderAround]);

//   // ── Keyboard ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (phase !== 'ready') return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return; // don't fight browser zoom shortcuts
//       if (e.key === 'Escape')                   { resetZoom(); return; }
//       if (e.key === 'f' || e.key === 'F')        { toggleFS(); return; }
//       if (e.key === '+' || e.key === '=')        { setZoom(z => { const n=clamp(z+0.5,ZOOM_MIN,ZOOM_MAX); zoomRef.current=n; return n; }); return; }
//       if (e.key === '-')                         { setZoom(z => { const n=clamp(z-0.5,ZOOM_MIN,ZOOM_MAX); zoomRef.current=n; if(n<=1.01)setPan({x:0,y:0}); return n; }); return; }
//       if (!isZoomed && bookRef.current) {
//         const pf = bookRef.current.pageFlip();
//         if (e.key === 'ArrowRight' || e.key === 'PageDown') pf.flipNext();
//         if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   pf.flipPrev();
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [phase, isZoomed, resetZoom, toggleFS]);

//   // ── Gesture listeners (single capture-phase effect, attached once) ────
//   //
//   // Architecture:
//   //   zoomContainerRef  ←  capture phase listeners (fire BEFORE react-pageflip)
//   //     └── scale wrapper
//   //           └── HTMLFlipBook  (react-pageflip handles its own events)
//   //
//   // When to intercept (stopPropagation stops event reaching flipbook):
//   //   • Wheel            → always (zoom)
//   //   • 2-finger touch   → always (pinch zoom)
//   //   • 1-finger + zoomed → always (pan / double-tap reset)
//   //   • 1-finger + 1×   → do NOT intercept → react-pageflip handles the flip
//   //   • Mouse + zoomed   → intercept (pan)
//   //   • Mouse + 1×       → do NOT intercept → react-pageflip handles the flip
//   //
//   const zoomContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const el = zoomContainerRef.current;
//     if (!el) return;

//     const g = {
//       // mouse
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//       // touch
//       pinching: false, pd0: 0, pz0: 1,
//       panning: false,  tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       // double tap
//       lastTap: 0,
//     };

//     const maxPan = (z: number) => ({ mx: (z-1)*400, my: (z-1)*320 });

//     // ── Wheel ────────────────────────────────────────────────────────
//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault(); e.stopPropagation();
//       const d = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY; // normalize line/pixel
//       setZoom(z => {
//         const n = clamp(z - d/500, ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = n;
//         if (n <= 1.01) setPan({ x: 0, y: 0 });
//         return n;
//       });
//     };

//     // ── Mouse drag ───────────────────────────────────────────────────
//     const onMouseDown = (e: MouseEvent) => {
//       if (zoomRef.current <= 1.01) return; // not zoomed → let flipbook flip
//       e.preventDefault(); e.stopPropagation();
//       g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onMouseMove = (e: MouseEvent) => {
//       if (!g.md) return;
//       const z = zoomRef.current;
//       const {mx, my} = maxPan(z);
//       setPan({
//         x: clamp(g.px0 + e.clientX - g.mx0, -mx, mx),
//         y: clamp(g.py0 + e.clientY - g.my0, -my, my),
//       });
//     };
//     const onMouseUp = () => { g.md = false; };

//     // ── Touch ────────────────────────────────────────────────────────
//     // touchstart: decide whether to intercept based on finger count + zoom state
//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         // ── Pinch: always intercept ──────────────────────────────────
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.pz0 = zoomRef.current;
//       } else if (e.touches.length === 1 && zoomRef.current > 1.01) {
//         // ── Single finger + zoomed: pan / double-tap reset ───────────
//         e.preventDefault(); e.stopPropagation();
//         g.panning = true; g.pinching = false;
//         // Double-tap to reset zoom
//         const now = Date.now();
//         if (now - g.lastTap < 300) {
//           setZoom(1); zoomRef.current = 1;
//           setPan({ x: 0, y: 0 });
//           g.lastTap = 0;
//           return;
//         }
//         g.lastTap = now;
//         g.tx0 = e.touches[0].clientX; g.ty0 = e.touches[0].clientY;
//         g.tpx0 = panRef.current.x;    g.tpy0 = panRef.current.y;
//       }
//       // else: 1 finger + not zoomed → don't intercept → react-pageflip flips
//     };

//     // touchmove: handle pinch zoom or pan (also handles pinch→pan transition)
//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const n = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//         setZoom(n); zoomRef.current = n;
//         if (n <= 1.01) setPan({ x: 0, y: 0 });
//       } else if (e.touches.length === 1 && zoomRef.current > 1.01) {
//         // Also handles pinch→pan: when one finger lifts during/after a pinch,
//         // remaining finger continues here. We initialize pan start on first move.
//         e.preventDefault(); e.stopPropagation();
//         if (!g.panning) {
//           // Pinch-to-pan transition: capture current touch position as new start
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//         const z = zoomRef.current;
//         const {mx, my} = maxPan(z);
//         setPan({
//           x: clamp(g.tpx0 + e.touches[0].clientX - g.tx0, -mx, mx),
//           y: clamp(g.tpy0 + e.touches[0].clientY - g.ty0, -my, my),
//         });
//       }
//       // else: 1 finger + not zoomed → don't intercept → react-pageflip flips
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//       if (e.touches.length === 0) { g.panning = false; }
//     };

//     // All listeners in capture phase so they fire before react-pageflip's own handlers.
//     // passive: false required for preventDefault() to work in touchmove/wheel.
//     el.addEventListener('wheel',      onWheel,      { capture: true, passive: false });
//     el.addEventListener('mousedown',  onMouseDown,  { capture: true });
//     el.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     el.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     el.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('mouseup',   onMouseUp);

//     return () => {
//       el.removeEventListener('wheel',      onWheel,      { capture: true });
//       el.removeEventListener('mousedown',  onMouseDown,  { capture: true });
//       el.removeEventListener('touchstart', onTouchStart, { capture: true });
//       el.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       el.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//       window.removeEventListener('mousemove', onMouseMove);
//       window.removeEventListener('mouseup',   onMouseUp);
//     };
//   }, []); // attach once — reads live values from refs

//   const displayPage = curPage + 1;

//   return (
//     <div ref={containerRef}
//       className={`relative flex flex-col ${isFS ? 'h-screen' : 'min-h-screen pt-16'}`}
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       {isFS && (
//         <button onClick={toggleFS}
//           className="absolute top-4 right-4 z-50 bg-[#1e3143]/80 backdrop-blur px-3 py-2 rounded text-white flex items-center gap-2">
//           <Minimize2 className="w-4 h-4"/> Exit full screen
//         </button>
//       )}

//       {!isFS && (
//         <div className="bg-[#1e3143]/90 backdrop-blur-sm border-b border-[#1484bc]/20 px-4 sm:px-8 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
//           <div>
//             <h1 className="text-[#fafbf9] font-bold text-sm sm:text-base leading-tight mt-1">
//               Annual Integrated Report 2025–26
//             </h1>
//             {phase === 'ready' && (
//               <p className="text-[#aec2cc] text-[11px] mt-0.5 flex items-center">
//                 Page {displayPage} of {numPages}
//                 {ready < numPages
//                   ? <BuildingFillLoader current={ready} total={numPages}/>
//                   : <span className="ml-2">· ← → or F to navigate</span>
//                 }
//               </p>
//             )}
//           </div>
//           <div className="flex items-center gap-3">
//             <button onClick={toggleFS} className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm">
//               <Maximize2 className="w-4 h-4"/><span className="hidden sm:inline">Full screen</span>
//             </button>
//             <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
//               className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm">
//               <Download className="w-4 h-4"/><span className="hidden sm:inline">Download PDF</span>
//             </a>
//           </div>
//         </div>
//       )}

//       <main ref={mainRef}
//         className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 overflow-hidden"
//       >
//         {phase === 'parsing' && (
//           <div className="flex flex-col items-center gap-4 text-[#aec2cc]">
//             <div className="w-10 h-10 border-2 border-[#1484bc] border-t-transparent rounded-full animate-spin"/>
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
//             <p className="text-sm">Could not load the report. Download directly:</p>
//             <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 bg-[#1484bc] hover:bg-[#006990] text-white px-6 py-2.5 text-sm font-medium rounded">
//               <Download className="w-4 h-4"/>Download PDF
//             </a>
//           </div>
//         )}

//         {/* Flipbook — shown as soon as PDF is parsed */}
//         {phase === 'ready' && numPages > 0 && (
//           <div className="flex flex-col items-center gap-4 w-full">

//             {/*
//               Zoom container — NO explicit height, NO overflow:hidden.
//               CSS transform (scale) does not affect layout, so siblings
//               (controls bar) stay put regardless of zoom level.
//               <main> overflow:hidden is the visual clip boundary.

//               cursor and touchAction update via React inline style on
//               every render, which is fine (no performance issue here).
//             */}
//             <div
//               ref={zoomContainerRef}
//               className="relative w-full"
//               style={{
//                 cursor: isZoomed ? 'grab' : 'default',
//                 // touchAction:none prevents browser scroll/pinch-zoom only
//                 // when zoomed. When at 1×, 'auto' lets react-pageflip's
//                 // mobileScrollSupport work naturally for page flipping.
//                 touchAction: isZoomed ? 'none' : 'auto',
//               }}
//             >
//               {/*
//                 Scale + translate wrapper.
//                 width:100% is critical — react-pageflip reads parentElement
//                 .offsetWidth for size="stretch". Without it the book collapses
//                 to single-page width.
//                 transform-origin:center top anchors zoom to the book top-centre.
//                 Transition kept short (0.08s) so drag/pinch feels immediate.
//               */}
//               <div style={{
//                 width: '100%',
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'center top',
//                 transition: 'transform 0.08s ease-out',
//                 willChange: 'transform',
//               }}>
//                 <HTMLFlipBook
//                   ref={bookRef}
//                   width={520}
//                   height={720}
//                   size="stretch"
//                   minWidth={260}
//                   maxWidth={620}
//                   minHeight={320}
//                   maxHeight={bookH}
//                   maxShadowOpacity={0.6}
//                   showCover={true}
//                   mobileScrollSupport={true}
//                   drawShadow={true}
//                   flippingTime={650}
//                   useMouseEvents={true}
//                   swipeDistance={30}
//                   onFlip={handleFlip}
//                   className="shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
//                 >
//                   {Array.from({ length: numPages }, (_, i) => (
//                     <FlipPage key={i+1} pageNum={i+1}/>
//                   ))}
//                 </HTMLFlipBook>
//               </div>

//               {/* Reset badge — floats at the bottom of the book area when zoomed.
//                   position:absolute relative to the zoom container (position:relative).
//                   z-index:20 keeps it above the flipbook shadow layer.             */}
//               {isZoomed && (
//                 <button
//                   onClick={resetZoom}
//                   className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20
//                     flex items-center gap-1.5
//                     bg-[#0d1f2e]/80 backdrop-blur border border-[#1484bc]/40
//                     text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                     text-[11px] px-3 py-1.5 rounded-full
//                     transition-colors select-none"
//                 >
//                   {zoom.toFixed(1)}× · tap to reset
//                 </button>
//               )}
//             </div>

//             {/* Controls row — outside zoom container, never affected by transform */}
//             {!isFS && (
//               <div className="flex items-center gap-3 text-[#aec2cc] text-sm">

//                 {/* Zoom out — mobile / tablet only. Desktop uses scroll wheel. */}
//                 <button
//                   onClick={() => { setZoom(z => { const n=clamp(z-0.5,ZOOM_MIN,ZOOM_MAX); zoomRef.current=n; if(n<=1.01)setPan({x:0,y:0}); return n; }); }}
//                   disabled={!isZoomed}
//                   aria-label="Zoom out"
//                   className="md:hidden text-[#aec2cc] hover:text-[#1484bc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ZoomOut className="w-4 h-4"/>
//                 </button>

//                 <span>Go to page</span>
//                 <input
//                   type="number" min={1} max={numPages}
//                   defaultValue={displayPage} key={displayPage}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' && bookRef.current) {
//                       const n = parseInt((e.target as HTMLInputElement).value, 10);
//                       if (n >= 1 && n <= numPages) bookRef.current.pageFlip().flip(n-1);
//                     }
//                   }}
//                   className="w-14 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-2 py-1 text-sm outline-none"
//                 />
//                 <span>of {numPages}</span>

//                 {/* Zoom in — mobile / tablet only */}
//                 <button
//                   onClick={() => { setZoom(z => { const n=clamp(z+0.5,ZOOM_MIN,ZOOM_MAX); zoomRef.current=n; return n; }); }}
//                   disabled={zoom >= ZOOM_MAX}
//                   aria-label="Zoom in"
//                   className="md:hidden text-[#aec2cc] hover:text-[#1484bc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ZoomIn className="w-4 h-4"/>
//                 </button>

//               </div>
//             )}

//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

















// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import { Download, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () => import('react-pageflip').then((m) => m.default as unknown as React.ComponentType<AnyProps>),
//   { ssr: false },
// );

// // ─── Config ───────────────────────────────────────────────────────────────────
// // Images live at /public/Assets/newsletter/pg1.jpg … pg36.jpg
// // Served by Vercel's CDN — no S3, no cost.
// const TOTAL_PAGES  = 36;
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const IMG = (n: number) => `/Assets/newsletterjpegs/pg${n}.jpg`;

// const MAX_BOOK_H  = 520;
// const CONTROLS_H  = 40;
// const ZOOM_MIN    = 1;
// const ZOOM_MAX    = 4;
// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// // ─── FlipPage ─────────────────────────────────────────────────────────────────
// // Plain <img> — no canvas, no pdfjs.
// // first 6 pages eager-loaded (cover + first spread visible immediately),
// // rest lazy so the browser doesn't fetch all 36 at once.
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(
//   ({ pageNum }, ref) => (
//     <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img
//         src={IMG(pageNum)}
//         alt={`Page ${pageNum}`}
//         className="w-full h-full object-contain"
//         loading={pageNum <= 6 ? 'eager' : 'lazy'}
//         draggable={false}
//       />
//     </div>
//   ),
// );
// FlipPage.displayName = 'FlipPage';

// // ─── NewsletterViewer ─────────────────────────────────────────────────────────
// export default function NewsletterViewer() {
//   const [mounted,  setMounted]  = useState(false); // gate client-only render
//   const [curPage,  setCurPage]  = useState(0);
//   const [isFS,     setIsFS]     = useState(false);
//   const [bookH,    setBookH]    = useState(MAX_BOOK_H);

//   // ── Zoom + pan ─────────────────────────────────────────────────────────
//   // zoomRef / panRef mirror state so native event handlers (attached once via
//   // useEffect) always read current values without re-subscribing on each render.
//   const [zoom, setZoom] = useState(1);
//   const [pan,  setPan]  = useState({ x: 0, y: 0 });
//   const zoomRef = useRef(1);
//   const panRef  = useRef({ x: 0, y: 0 });
//   zoomRef.current = zoom;
//   panRef.current  = pan;

//   const isZoomed = zoom > 1.01;

//   const resetZoom = useCallback(() => {
//     setZoom(1);   zoomRef.current = 1;
//     setPan({x:0,y:0}); panRef.current = {x:0,y:0};
//   }, []);

//   useEffect(() => { setMounted(true); }, []);

//   // ── Book height via ResizeObserver ─────────────────────────────────────
//   const mainRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       setBookH(Math.max(320, Math.min(el.clientHeight - pad - CONTROLS_H, MAX_BOOK_H)));
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el); calc();
//     return () => ro.disconnect();
//   }, []);

//   // ── Fullscreen ─────────────────────────────────────────────────────────
//   const containerRef = useRef<HTMLDivElement>(null);
//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   // ── Flipbook ref + URL hash ────────────────────────────────────────────
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef = useRef<any>(null);

//   // Restore page from URL hash on first mount
//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES) {
//       // Short delay lets react-pageflip finish its own init
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//     }
//   }, [mounted]);

//   const handleFlip = useCallback((e: { data: number }) => {
//     setCurPage(e.data);
//     window.history.replaceState(null, '', `#page/${e.data + 1}`);
//   }, []);

//   // ── Keyboard ───────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':
//           resetZoom(); break;
//         case 'f': case 'F':
//           toggleFS(); break;
//         case '+': case '=':
//           setZoom(z => clamp(z + 0.5, ZOOM_MIN, ZOOM_MAX)); break;
//         case '-':
//           setZoom(z => { const n = clamp(z - 0.5, ZOOM_MIN, ZOOM_MAX); if (n <= 1.01) setPan({x:0,y:0}); return n; }); break;
//         default:
//           if (!isZoomed && bookRef.current) {
//             const pf = bookRef.current.pageFlip();
//             if (e.key === 'ArrowRight' || e.key === 'PageDown') pf.flipNext();
//             if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   pf.flipPrev();
//           }
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, isZoomed, resetZoom, toggleFS]);

//   // ── Zoom / pan gesture listeners ───────────────────────────────────────
//   //
//   // Architecture (the ONLY correct approach):
//   //
//   //   zoomContainer  (position: relative)
//   //     ├── scaleWrapper  ←  CSS transform happens here
//   //     │     └── HTMLFlipBook  ←  react-pageflip owns all events here
//   //     └── overlay  (position: absolute, inset:0, z-index:10)
//   //           pointer-events: NONE  when zoom = 1× → events fall through to flipbook → flipping works
//   //           pointer-events: AUTO  when zoom > 1× → overlay is the hit target → flipbook gets nothing
//   //
//   // Why this works:
//   //   When pointer-events:auto, the browser's hit-test returns the overlay.
//   //   The event's propagation path is: document → … → zoomContainer → overlay.
//   //   HTMLFlipBook is NOT in the path (it's a sibling of overlay, not a parent).
//   //   react-pageflip never sees the event. No stopPropagation needed.
//   //
//   // Pinch-to-zoom (2 fingers, even when not zoomed):
//   //   The overlay is pointer-events:none so 2-finger touch hits the flipbook.
//   //   We intercept at zoomContainer in capture phase BEFORE react-pageflip sees it.
//   //   stopPropagation() in capture phase stops the event going to children.
//   //
//   const zoomContainerRef = useRef<HTMLDivElement>(null);
//   const overlayRef       = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const container = zoomContainerRef.current;
//     const overlay   = overlayRef.current;
//     if (!container || !overlay) return;

//     const maxPan = (z: number) => ({ mx: (z - 1) * 420, my: (z - 1) * 340 });

//     // Local gesture state — never triggers re-renders
//     const g = {
//       // mouse
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//       // pinch (2 fingers, captured at container level)
//       pinching: false, pd0: 0, pz0: 1,
//       // touch pan (1 finger, captured at overlay level when zoomed)
//       panning: false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap: 0,
//     };

//     // ── Wheel → zoom ───────────────────────────────────────────────────
//     // Attached to container (not overlay) so it fires whether or not we're zoomed.
//     // capture:true so it fires before any child scroll handlers.
//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const d = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
//       setZoom(z => {
//         const n = clamp(z - d / 480, ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = n;
//         if (n <= 1.01) setPan({x:0,y:0});
//         return n;
//       });
//     };
//     container.addEventListener('wheel', onWheel, { passive: false, capture: true });

//     // ── 2-finger pinch → zoom (container capture phase) ───────────────
//     // Even when not zoomed, overlay is pointer-events:none so 2-finger touch
//     // would go straight to the flipbook. We intercept here before it gets there.
//     const onContainerTouchStart = (e: TouchEvent) => {
//       if (e.touches.length < 2) return;
//       e.preventDefault(); e.stopPropagation(); // block flipbook
//       g.pinching = true;
//       g.pd0 = Math.hypot(
//         e.touches[0].clientX - e.touches[1].clientX,
//         e.touches[0].clientY - e.touches[1].clientY,
//       );
//       g.pz0 = zoomRef.current;
//     };
//     const onContainerTouchMove = (e: TouchEvent) => {
//       if (!g.pinching || e.touches.length < 2) return;
//       e.preventDefault(); e.stopPropagation();
//       const d = Math.hypot(
//         e.touches[0].clientX - e.touches[1].clientX,
//         e.touches[0].clientY - e.touches[1].clientY,
//       );
//       const n = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//       setZoom(n); zoomRef.current = n;
//       if (n <= 1.01) setPan({x:0,y:0});
//     };
//     const onContainerTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//     };
//     container.addEventListener('touchstart', onContainerTouchStart, { capture: true, passive: false });
//     container.addEventListener('touchmove',  onContainerTouchMove,  { capture: true, passive: false });
//     container.addEventListener('touchend',   onContainerTouchEnd,   { capture: true });

//     // ── Mouse drag → pan (overlay, only active when pointer-events:auto) ─
//     // When zoomed, overlay is the hit target. Mousedown fires on overlay.
//     // Mousemove/mouseup tracked on window so drag works if cursor leaves overlay.
//     const onOverlayMouseDown = (e: MouseEvent) => {
//       e.preventDefault();
//       g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onWindowMouseMove = (e: MouseEvent) => {
//       if (!g.md) return;
//       const z = zoomRef.current;
//       const { mx, my } = maxPan(z);
//       setPan({
//         x: clamp(g.px0 + e.clientX - g.mx0, -mx, mx),
//         y: clamp(g.py0 + e.clientY - g.my0, -my, my),
//       });
//     };
//     const onWindowMouseUp = () => { g.md = false; };
//     overlay.addEventListener('mousedown', onOverlayMouseDown);
//     window.addEventListener('mousemove', onWindowMouseMove);
//     window.addEventListener('mouseup',   onWindowMouseUp);

//     // ── 1-finger touch → pan + double-tap reset (overlay) ─────────────
//     // Overlay is pointer-events:auto only when zoomed, so these handlers
//     // only fire when the user is actually zoomed in. When not zoomed,
//     // overlay is pointer-events:none and events go directly to the flipbook.
//     const onOverlayTouchStart = (e: TouchEvent) => {
//       if (e.touches.length !== 1) return;
//       e.preventDefault(); // prevent browser scroll while panning
//       const now = Date.now();
//       // Double-tap to reset zoom
//       if (now - g.lastTap < 300) {
//         resetZoom(); g.lastTap = 0; return;
//       }
//       g.lastTap = now;
//       g.panning = true;
//       g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//       g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//     };
//     const onOverlayTouchMove = (e: TouchEvent) => {
//       if (!g.panning || e.touches.length !== 1) return;
//       e.preventDefault();
//       const z = zoomRef.current;
//       const { mx, my } = maxPan(z);
//       setPan({
//         x: clamp(g.tpx0 + e.touches[0].clientX - g.tx0, -mx, mx),
//         y: clamp(g.tpy0 + e.touches[0].clientY - g.ty0, -my, my),
//       });
//     };
//     const onOverlayTouchEnd = () => { g.panning = false; };
//     overlay.addEventListener('touchstart', onOverlayTouchStart, { passive: false });
//     overlay.addEventListener('touchmove',  onOverlayTouchMove,  { passive: false });
//     overlay.addEventListener('touchend',   onOverlayTouchEnd);

//     return () => {
//       container.removeEventListener('wheel',      onWheel,               { capture: true });
//       container.removeEventListener('touchstart', onContainerTouchStart, { capture: true });
//       container.removeEventListener('touchmove',  onContainerTouchMove,  { capture: true });
//       container.removeEventListener('touchend',   onContainerTouchEnd,   { capture: true });
//       overlay.removeEventListener('mousedown',  onOverlayMouseDown);
//       overlay.removeEventListener('touchstart', onOverlayTouchStart);
//       overlay.removeEventListener('touchmove',  onOverlayTouchMove);
//       overlay.removeEventListener('touchend',   onOverlayTouchEnd);
//       window.removeEventListener('mousemove', onWindowMouseMove);
//       window.removeEventListener('mouseup',   onWindowMouseUp);
//     };
//   }, [resetZoom]); // stable — resetZoom never changes

//   const displayPage = curPage + 1;

//   return (
//     <div
//       ref={containerRef}
//       className={`relative flex flex-col ${isFS ? 'h-screen' : 'min-h-screen pt-16'}`}
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       {/* Fullscreen exit button */}
//       {isFS && (
//         <button onClick={toggleFS}
//           className="absolute top-4 right-4 z-50 bg-[#1e3143]/80 backdrop-blur px-3 py-2 rounded text-white flex items-center gap-2">
//           <Minimize2 className="w-4 h-4"/> Exit full screen
//         </button>
//       )}

//       {/* Header */}
//       {!isFS && (
//         <div className="bg-[#1e3143]/90 backdrop-blur-sm border-b border-[#1484bc]/20 px-4 sm:px-8 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
//           <div>
//             <h1 className="text-[#fafbf9] font-bold text-sm sm:text-base leading-tight">
//               Annual Integrated Report 2025–26
//             </h1>
//             <p className="text-[#aec2cc] text-[11px] mt-0.5">
//               Page {displayPage} of {TOTAL_PAGES}
//               <span className="ml-2">· ← → or F to navigate</span>
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button onClick={toggleFS}
//               className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm">
//               <Maximize2 className="w-4 h-4"/>
//               <span className="hidden sm:inline">Full screen</span>
//             </button>
//             <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
//               className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm">
//               <Download className="w-4 h-4"/>
//               <span className="hidden sm:inline">Download PDF</span>
//             </a>
//           </div>
//         </div>
//       )}

//       {/* Main */}
//       <main ref={mainRef}
//         className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 overflow-hidden">

//         {/* Gate on mounted to prevent SSR hydration mismatch with react-pageflip */}
//         {mounted && (
//           <div className="flex flex-col items-center gap-4 w-full">

//             {/*
//               ── Zoom container ────────────────────────────────────────────────
//               position:relative is required so the overlay (position:absolute)
//               is positioned relative to this element, not the page.
//               NO explicit height — the container grows to fit the flipbook
//               naturally. overflow is clipped by <main>.
//             */}
//             <div ref={zoomContainerRef} className="relative w-full">

//               {/*
//                 ── Scale wrapper ─────────────────────────────────────────────
//                 width:100% is critical — react-pageflip with size="stretch"
//                 reads parentElement.offsetWidth to determine page dimensions.
//                 transform-origin:center top anchors zoom to the book's top edge.
//               */}
//               <div style={{
//                 width: '100%',
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'center top',
//                 transition: 'transform 0.07s ease-out',
//                 willChange: 'transform',
//               }}>
//                 <HTMLFlipBook
//                   ref={bookRef}
//                   width={520}
//                   height={720}
//                   size="stretch"
//                   minWidth={260}
//                   maxWidth={620}
//                   minHeight={320}
//                   maxHeight={bookH}
//                   maxShadowOpacity={0.6}
//                   showCover={true}
//                   mobileScrollSupport={true}
//                   drawShadow={true}
//                   flippingTime={650}
//                   useMouseEvents={true}
//                   swipeDistance={30}
//                   onFlip={handleFlip}
//                   className="shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
//                 >
//                   {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                     <FlipPage key={i + 1} pageNum={i + 1} />
//                   ))}
//                 </HTMLFlipBook>
//               </div>

//               {/*
//                 ── Overlay ───────────────────────────────────────────────────
//                 ALWAYS in the DOM (never conditionally rendered).
//                 Switching pointer-events via inline style is a CSS toggle,
//                 not a DOM mutation — the ref is always valid.

//                 pointer-events: none (zoom = 1×)
//                   → browser hit-test skips this element
//                   → events land on the flipbook beneath it
//                   → page flipping works normally

//                 pointer-events: auto (zoom > 1×)
//                   → browser hit-test returns THIS element (it's on top, z-10)
//                   → events never reach the flipbook (they're not in the path)
//                   → pan logic in the listeners above runs instead
//               */}
//               <div
//                 ref={overlayRef}
//                 style={{
//                   position: 'absolute',
//                   inset: 0,
//                   zIndex: 10,
//                   pointerEvents: isZoomed ? 'auto' : 'none',
//                   cursor: isZoomed ? 'grab' : 'default',
//                   touchAction: 'none',    // prevent browser scroll/zoom on overlay
//                   userSelect: 'none',
//                 }}
//               />

//               {/*
//                 ── Reset zoom badge ──────────────────────────────────────────
//                 Floats above the overlay (z-20 > overlay z-10).
//                 Always clickable (pointer-events not affected by overlay).
//                 Double-tap on mobile also resets (handled in overlay touchstart).
//                 Escape key also resets (keyboard handler above).
//               */}
//               {isZoomed && (
//                 <button
//                   onClick={resetZoom}
//                   style={{ zIndex: 20 }}
//                   className="absolute bottom-3 left-1/2 -translate-x-1/2
//                     flex items-center gap-1.5
//                     bg-[#0d1f2e]/85 backdrop-blur
//                     border border-[#1484bc]/40
//                     text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                     text-[11px] px-3 py-1.5 rounded-full transition-colors
//                     select-none"
//                 >
//                   {zoom.toFixed(1)}× — tap to reset
//                 </button>
//               )}
//             </div>

//             {/* ── Controls row ─────────────────────────────────────────── */}
//             {!isFS && (
//               <div className="flex items-center gap-3 text-[#aec2cc] text-sm">

//                 {/* Zoom out — hidden on desktop (use scroll wheel there) */}
//                 <button
//                   onClick={() => setZoom(z => { const n = clamp(z - 0.5, ZOOM_MIN, ZOOM_MAX); if (n <= 1.01) setPan({x:0,y:0}); return n; })}
//                   disabled={!isZoomed}
//                   aria-label="Zoom out"
//                   className="md:hidden text-[#aec2cc] hover:text-[#1484bc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ZoomOut className="w-4 h-4"/>
//                 </button>

//                 <span>Go to page</span>
//                 <input
//                   type="number" min={1} max={TOTAL_PAGES}
//                   defaultValue={displayPage} key={displayPage}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter' && bookRef.current) {
//                       const n = parseInt((e.target as HTMLInputElement).value, 10);
//                       if (n >= 1 && n <= TOTAL_PAGES) bookRef.current.pageFlip().flip(n - 1);
//                     }
//                   }}
//                   className="w-14 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-2 py-1 text-sm outline-none"
//                 />
//                 <span>of {TOTAL_PAGES}</span>

//                 {/* Zoom in — hidden on desktop */}
//                 <button
//                   onClick={() => setZoom(z => clamp(z + 0.5, ZOOM_MIN, ZOOM_MAX))}
//                   disabled={zoom >= ZOOM_MAX}
//                   aria-label="Zoom in"
//                   className="md:hidden text-[#aec2cc] hover:text-[#1484bc] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <ZoomIn className="w-4 h-4"/>
//                 </button>

//               </div>
//             )}

//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
















// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import {
//   Download, Maximize2, Minimize2,
//   ZoomIn, ZoomOut,
//   ChevronLeft, ChevronRight,
//   ChevronsLeft, ChevronsRight,
// } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () => import('react-pageflip').then((m) => m.default as unknown as React.ComponentType<AnyProps>),
//   { ssr: false },
// );

// // ─── Config ───────────────────────────────────────────────────────────────────
// const TOTAL_PAGES  = 36;
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const IMG          = (n: number) => `/Assets/newsletterjpegs/pg${n}.jpg`;

// const MAX_BOOK_H = 520;
// const ZOOM_MIN   = 1;
// const ZOOM_MAX   = 4;
// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// // ─── Toolbar button ───────────────────────────────────────────────────────────
// function TBtn({
//   onClick, disabled = false, title, href, children,
// }: {
//   onClick?: () => void;
//   disabled?: boolean;
//   title?: string;
//   href?: string;
//   children: React.ReactNode;
// }) {
//   const cls =
//     'flex items-center justify-center w-9 h-9 rounded ' +
//     'text-[#aec2cc] hover:text-white hover:bg-[#1484bc]/25 ' +
//     'disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0';

//   if (href) {
//     return (
//       <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>
//         {children}
//       </a>
//     );
//   }
//   return (
//     <button onClick={onClick} disabled={disabled} title={title} className={cls}>
//       {children}
//     </button>
//   );
// }

// // ─── FlipPage ─────────────────────────────────────────────────────────────────
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(
//   ({ pageNum }, ref) => (
//     <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img
//         src={IMG(pageNum)}
//         alt={`Page ${pageNum}`}
//         className="w-full h-full object-contain"
//         loading={pageNum <= 6 ? 'eager' : 'lazy'}
//         draggable={false}
//       />
//     </div>
//   ),
// );
// FlipPage.displayName = 'FlipPage';

// // ─── NewsletterViewer ─────────────────────────────────────────────────────────
// export default function NewsletterViewer() {
//   const [mounted,  setMounted]  = useState(false);
//   const [curPage,  setCurPage]  = useState(0);
//   const [isFS,     setIsFS]     = useState(false);
//   const [bookH,    setBookH]    = useState(MAX_BOOK_H);
//   const [zoom,     setZoom]     = useState(1);
//   const [pan,      setPan]      = useState({ x: 0, y: 0 });

//   // Refs mirror state for use inside native event handlers (attached once,
//   // no stale closures).
//   const zoomRef       = useRef(1);
//   const panRef        = useRef({ x: 0, y: 0 });
//   const isDragging    = useRef(false); // suppresses transition during drag
//   zoomRef.current     = zoom;
//   panRef.current      = pan;

//   const isZoomed = zoom > 1.01;

//   const resetZoom = useCallback(() => {
//     setZoom(1);          zoomRef.current = 1;
//     setPan({ x:0, y:0 }); panRef.current  = { x:0, y:0 };
//   }, []);

//   useEffect(() => { setMounted(true); }, []);

//   // ── Book height ──────────────────────────────────────────────────────────
//   // <main> height minus its padding. Toolbar is a separate flex child so it
//   // does not factor in here — no CONTROLS_H subtraction needed.
//   const mainRef = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       setBookH(Math.max(320, Math.min(el.clientHeight - pad, MAX_BOOK_H)));
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el); calc();
//     return () => ro.disconnect();
//   }, []);

//   // ── Fullscreen ───────────────────────────────────────────────────────────
//   const containerRef = useRef<HTMLDivElement>(null);
//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   // ── Flipbook ref + URL hash ───────────────────────────────────────────────
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef        = useRef<any>(null);
//   const prevPageRef    = useRef(0);
//   const zoomContainerRef = useRef<HTMLDivElement>(null);
//   const overlayRef       = useRef<HTMLDivElement>(null);
//   const scaleWrapperRef  = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   // ── handleFlip ───────────────────────────────────────────────────────────
//   // Auto-focus pan: after a flip, smoothly pan so the newly revealed page
//   // is centred in the viewport (only at 1× zoom — user controls pan when zoomed).
//   //
//   // Why this works visually:
//   //   In a double-spread, the container is ~W px wide. Each page is W/2.
//   //   The left-page centre is at −W/4 from the spread centre.
//   //   The right-page centre is at +W/4.
//   //   Pan = ±W/4 in screen pixels shifts the content so the active page is centred.
//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);

//     if (zoomRef.current <= 1.01) {
//       const W      = zoomContainerRef.current?.offsetWidth ?? 600;
//       const offset = W * 0.25;                // half of one page's width
//       const nextPan =
//         newPage === 0          ? { x: 0,        y: 0 }   // cover  → centre
//         : newPage > prev       ? { x: -offset,  y: 0 }   // forward → right page
//         :                        { x:  offset,  y: 0 };  // backward → left page
//       setPan(nextPan);
//       panRef.current = nextPan;
//     }
//   }, []);

//   // ── Navigation helpers ────────────────────────────────────────────────────
//   const goFirst = useCallback(() => bookRef.current?.pageFlip()?.flip(0), []);
//   const goLast  = useCallback(() => bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1), []);
//   const goPrev  = useCallback(() => bookRef.current?.pageFlip()?.flipPrev(), []);
//   const goNext  = useCallback(() => bookRef.current?.pageFlip()?.flipNext(), []);

//   // ── Keyboard ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape': resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=':
//           setZoom(z => clamp(z + 0.5, ZOOM_MIN, ZOOM_MAX)); break;
//         case '-':
//           setZoom(z => { const n = clamp(z - 0.5, ZOOM_MIN, ZOOM_MAX); if (n <= 1.01) setPan({x:0,y:0}); return n; }); break;
//         default:
//           if (!isZoomed && bookRef.current) {
//             const pf = bookRef.current.pageFlip();
//             if (e.key === 'ArrowRight' || e.key === 'PageDown') pf.flipNext();
//             if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   pf.flipPrev();
//           }
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, isZoomed, resetZoom, toggleFS]);

//   // ── Gesture listeners ─────────────────────────────────────────────────────
//   //
//   // Overlay architecture (definitive explanation):
//   //
//   //   zoomContainer  ←  position:relative, capture-phase wheel + 2-finger touch
//   //     ├── scaleWrapper  ←  CSS scale+translate, hosts HTMLFlipBook
//   //     └── overlay  ←  position:absolute inset-0 z-10
//   //           • pointer-events:NONE (zoom=1×) → hit-test skips overlay
//   //             → events land on flipbook → flipping works normally
//   //           • pointer-events:AUTO (zoom>1×) → overlay IS the hit target
//   //             → flipbook is a sibling, NOT in event path → never fires
//   //             → drag/pan runs here instead
//   //
//   // No stopPropagation needed for the overlay case because siblings are
//   // never in each other's propagation path.
//   //
//   // Transition is disabled during active drag (isDragging ref) to eliminate
//   // rubber-band lag. Since setPan triggers re-renders on every move event,
//   // the JSX reads isDragging.current correctly on each frame.
//   //
//   useEffect(() => {
//     const container = zoomContainerRef.current;
//     const overlay   = overlayRef.current;
//     if (!container || !overlay) return;

//     const maxPan = (z: number) => ({ mx: (z - 1) * 420, my: (z - 1) * 340 });

//     const g = {
//       // mouse
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//       // pinch
//       pinching: false, pd0: 0, pz0: 1,
//       // touch pan
//       panning: false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap: 0,
//     };

//     // ── Wheel → zoom ──────────────────────────────────────────────────────
//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const d = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
//       setZoom(z => {
//         const n = clamp(z - d / 480, ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = n;
//         if (n <= 1.01) setPan({ x: 0, y: 0 });
//         return n;
//       });
//     };
//     container.addEventListener('wheel', onWheel, { passive: false, capture: true });

//     // ── 2-finger pinch (container capture, fires before flipbook) ─────────
//     const onCTouchStart = (e: TouchEvent) => {
//       if (e.touches.length < 2) return;
//       e.preventDefault(); e.stopPropagation();
//       g.pinching = true;
//       g.pd0 = Math.hypot(
//         e.touches[0].clientX - e.touches[1].clientX,
//         e.touches[0].clientY - e.touches[1].clientY,
//       );
//       g.pz0 = zoomRef.current;
//     };
//     const onCTouchMove = (e: TouchEvent) => {
//       if (!g.pinching || e.touches.length < 2) return;
//       e.preventDefault(); e.stopPropagation();
//       const d = Math.hypot(
//         e.touches[0].clientX - e.touches[1].clientX,
//         e.touches[0].clientY - e.touches[1].clientY,
//       );
//       const n = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//       setZoom(n); zoomRef.current = n;
//       if (n <= 1.01) setPan({ x: 0, y: 0 });
//     };
//     const onCTouchEnd = (e: TouchEvent) => { if (e.touches.length < 2) g.pinching = false; };
//     container.addEventListener('touchstart', onCTouchStart, { capture: true, passive: false });
//     container.addEventListener('touchmove',  onCTouchMove,  { capture: true, passive: false });
//     container.addEventListener('touchend',   onCTouchEnd,   { capture: true });

//     // ── Overlay: mouse drag ───────────────────────────────────────────────
//     const onMD = (e: MouseEvent) => {
//       e.preventDefault();
//       isDragging.current = true;
//       g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onMM = (e: MouseEvent) => {
//       if (!g.md) return;
//       const z = zoomRef.current;
//       const { mx, my } = maxPan(z);
//       setPan({
//         x: clamp(g.px0 + e.clientX - g.mx0, -mx, mx),
//         y: clamp(g.py0 + e.clientY - g.my0, -my, my),
//       });
//     };
//     const onMU = () => { g.md = false; isDragging.current = false; };
//     overlay.addEventListener('mousedown', onMD);
//     window.addEventListener('mousemove',  onMM);
//     window.addEventListener('mouseup',    onMU);

//     // ── Overlay: 1-finger pan + double-tap reset ──────────────────────────
//     const onOTS = (e: TouchEvent) => {
//       if (e.touches.length !== 1) return;
//       e.preventDefault();
//       isDragging.current = true;
//       const now = Date.now();
//       if (now - g.lastTap < 300) { resetZoom(); g.lastTap = 0; isDragging.current = false; return; }
//       g.lastTap = now;
//       g.panning = true;
//       g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//       g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//     };
//     const onOTM = (e: TouchEvent) => {
//       if (!g.panning || e.touches.length !== 1) return;
//       e.preventDefault();
//       const z = zoomRef.current;
//       const { mx, my } = maxPan(z);
//       setPan({
//         x: clamp(g.tpx0 + e.touches[0].clientX - g.tx0, -mx, mx),
//         y: clamp(g.tpy0 + e.touches[0].clientY - g.ty0, -my, my),
//       });
//     };
//     const onOTE = () => { g.panning = false; isDragging.current = false; };
//     overlay.addEventListener('touchstart', onOTS, { passive: false });
//     overlay.addEventListener('touchmove',  onOTM, { passive: false });
//     overlay.addEventListener('touchend',   onOTE);

//     return () => {
//       container.removeEventListener('wheel',      onWheel,    { capture: true });
//       container.removeEventListener('touchstart', onCTouchStart, { capture: true });
//       container.removeEventListener('touchmove',  onCTouchMove,  { capture: true });
//       container.removeEventListener('touchend',   onCTouchEnd,   { capture: true });
//       overlay.removeEventListener('mousedown',  onMD);
//       overlay.removeEventListener('touchstart', onOTS);
//       overlay.removeEventListener('touchmove',  onOTM);
//       overlay.removeEventListener('touchend',   onOTE);
//       window.removeEventListener('mousemove', onMM);
//       window.removeEventListener('mouseup',   onMU);
//     };
//   }, [resetZoom]);

//   // ── Shared toolbar (rendered in both normal + fullscreen) ─────────────────
//   const displayPage = curPage + 1;

//   const toolbar = (
//     <div className="bg-[#1e3143] border-t border-[#1484bc]/15 px-2 py-1.5 flex items-center justify-center gap-0.5 flex-shrink-0 z-30">

//       <TBtn
//         onClick={() => setZoom(z => { const n = clamp(z - 0.5, ZOOM_MIN, ZOOM_MAX); if (n <= 1.01) setPan({x:0,y:0}); return n; })}
//         disabled={!isZoomed} title="Zoom out (−)"
//       >
//         <ZoomOut className="w-[18px] h-[18px]"/>
//       </TBtn>

//       <TBtn onClick={goFirst} title="First page">
//         <ChevronsLeft className="w-[18px] h-[18px]"/>
//       </TBtn>
//       <TBtn onClick={goPrev} title="Previous page">
//         <ChevronLeft className="w-[18px] h-[18px]"/>
//       </TBtn>

//       {/* Page jump */}
//       <div className="flex items-center gap-1 px-1">
//         <input
//           type="number" min={1} max={TOTAL_PAGES}
//           defaultValue={displayPage} key={displayPage}
//           onKeyDown={(e) => {
//             if (e.key !== 'Enter' || !bookRef.current) return;
//             const n = parseInt((e.target as HTMLInputElement).value, 10);
//             if (n >= 1 && n <= TOTAL_PAGES) bookRef.current.pageFlip().flip(n - 1);
//           }}
//           className="w-9 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-1 py-0.5 text-xs outline-none"
//         />
//         <span className="text-[#aec2cc] text-xs whitespace-nowrap">/ {TOTAL_PAGES}</span>
//       </div>

//       <TBtn onClick={goNext} title="Next page">
//         <ChevronRight className="w-[18px] h-[18px]"/>
//       </TBtn>
//       <TBtn onClick={goLast} title="Last page">
//         <ChevronsRight className="w-[18px] h-[18px]"/>
//       </TBtn>

//       <TBtn href={DOWNLOAD_URL} title="Download PDF">
//         <Download className="w-[18px] h-[18px]"/>
//       </TBtn>

//       <TBtn
//         onClick={() => setZoom(z => clamp(z + 0.5, ZOOM_MIN, ZOOM_MAX))}
//         disabled={zoom >= ZOOM_MAX} title="Zoom in (+)"
//       >
//         <ZoomIn className="w-[18px] h-[18px]"/>
//       </TBtn>

//     </div>
//   );

//   return (
//     <div
//       ref={containerRef}
//       className={`relative flex flex-col ${isFS ? 'h-screen' : 'min-h-screen pt-16'}`}
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >

//       {/* ── Top header (hidden in fullscreen) ─────────────────────────── */}
//       {!isFS && (
//         <div className="bg-[#1e3143]/90 backdrop-blur-sm border-b border-[#1484bc]/20 px-4 sm:px-8 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
//           <div>
//             <h1 className="text-[#fafbf9] font-bold text-sm sm:text-base leading-tight">
//               Annual Integrated Report 2025–26
//             </h1>
//             <p className="text-[#aec2cc] text-[11px] mt-0.5">
//               Page {displayPage} of {TOTAL_PAGES}
//               <span className="ml-2">· ← → or F to navigate</span>
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button
//               onClick={toggleFS}
//               className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm transition-colors"
//             >
//               <Maximize2 className="w-4 h-4"/>
//               <span className="hidden sm:inline">Full screen</span>
//             </button>
//             <a
//               href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
//               className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm transition-colors"
//             >
//               <Download className="w-4 h-4"/>
//               <span className="hidden sm:inline">Download PDF</span>
//             </a>
//           </div>
//         </div>
//       )}

//       {/* ── Fullscreen: exit button (top-right, above toolbar) ────────── */}
//       {isFS && (
//         <button
//           onClick={toggleFS}
//           className="absolute top-4 right-4 z-50 bg-[#1e3143]/80 backdrop-blur px-3 py-2 rounded text-white flex items-center gap-2 text-sm"
//         >
//           <Minimize2 className="w-4 h-4"/> Exit full screen
//         </button>
//       )}

//       {/* ── Book area ─────────────────────────────────────────────────── */}
//       <main
//         ref={mainRef}
//         className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 overflow-hidden"
//       >
//         {mounted && (
//           // zoomContainer: position:relative anchors the overlay.
//           // NO explicit height — container grows to fit the flipbook naturally.
//           // <main> overflow:hidden clips visual overflow from scaling.
//           <div ref={zoomContainerRef} className="relative w-full">

//             {/*
//               Scale + translate wrapper.
//               • width:100% — critical: react-pageflip reads parentElement.offsetWidth
//                 for size="stretch". Without it the flipbook collapses to single-page.
//               • transformOrigin:center top — zoom anchors to top of spread.
//               • transition disabled while isDragging to prevent rubber-band lag.
//                 isDragging.current is read on every render triggered by setPan.
//             */}
//             <div
//               ref={scaleWrapperRef}
//               style={{
//                 width: '100%',
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'center top',
//                 transition: isDragging.current ? 'none' : 'transform 0.25s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 minWidth={260}
//                 maxWidth={620}
//                 minHeight={320}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.6}
//                 showCover={true}
//                 mobileScrollSupport={true}
//                 drawShadow={true}
//                 flippingTime={650}
//                 useMouseEvents={true}
//                 swipeDistance={30}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             {/*
//               Overlay — always in DOM, pointer-events toggled via CSS.
//               pointer-events:none (1×) → events pass through to flipbook → flips work.
//               pointer-events:auto (>1×) → overlay is hit target, flipbook is a
//               sibling (not in event path) → flipbook never sees the event.
//             */}
//             <div
//               ref={overlayRef}
//               style={{
//                 position: 'absolute', inset: 0, zIndex: 10,
//                 pointerEvents: isZoomed ? 'auto' : 'none',
//                 cursor:        isZoomed ? 'grab'  : 'default',
//                 touchAction:   'none',
//                 userSelect:    'none',
//               }}
//             />

//             {/* Reset zoom badge — above overlay (z-20), always tappable */}
//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ zIndex: 20 }}
//                 className="absolute bottom-3 left-1/2 -translate-x-1/2
//                   bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — tap to reset
//               </button>
//             )}

//           </div>
//         )}
//       </main>

//       {/* ── Bottom toolbar — always visible, even in fullscreen ─────────── */}
//       {mounted && toolbar}

//     </div>
//   );
// }

























// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import {
//   Download, Maximize2, Minimize2,
//   ZoomIn, ZoomOut,
//   ChevronLeft, ChevronRight,
//   ChevronsLeft, ChevronsRight,
// } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () => import('react-pageflip').then((m) => m.default as unknown as React.ComponentType<AnyProps>),
//   { ssr: false },
// );

// // ─── Config ───────────────────────────────────────────────────────────────────
// const TOTAL_PAGES  = 36;
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const IMG          = (n: number) => `/Assets/newsletterjpegs/pg${n}.jpg`;

// const MAX_BOOK_H = 520;
// const ZOOM_MIN   = 1;
// const ZOOM_MAX   = 4;
// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// type FocusSide = 'left' | 'right' | 'center';

// // ─── Toolbar button ───────────────────────────────────────────────────────────
// function TBtn({
//   onClick, disabled = false, title, href, children,
// }: {
//   onClick?: () => void; disabled?: boolean;
//   title?: string; href?: string; children: React.ReactNode;
// }) {
//   const cls =
//     'flex items-center justify-center w-9 h-9 rounded ' +
//     'text-[#aec2cc] hover:text-white hover:bg-[#1484bc]/25 ' +
//     'disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0';
//   if (href) return <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>{children}</a>;
//   return <button onClick={onClick} disabled={disabled} title={title} className={cls}>{children}</button>;
// }

// // ─── FlipPage ─────────────────────────────────────────────────────────────────
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
//   <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
//     {/* eslint-disable-next-line @next/next/no-img-element */}
//     <img src={IMG(pageNum)} alt={`Page ${pageNum}`}
//       className="w-full h-full object-contain"
//       loading={pageNum <= 6 ? 'eager' : 'lazy'} draggable={false} />
//   </div>
// ));
// FlipPage.displayName = 'FlipPage';

// // ─── NewsletterViewer ─────────────────────────────────────────────────────────
// export default function NewsletterViewer() {
//   const [mounted, setMounted] = useState(false);
//   const [curPage, setCurPage] = useState(0);
//   const [isFS,    setIsFS]    = useState(false);
//   const [bookH,   setBookH]   = useState(MAX_BOOK_H);
//   const [zoom,    setZoom]    = useState(1);
//   const [pan,     setPan]     = useState({ x: 0, y: 0 });

//   // ── Stable refs (readable by event handlers without re-subscribing) ─────
//   const zoomRef      = useRef(1);
//   const panRef       = useRef({ x: 0, y: 0 });
//   const isDragging   = useRef(false);
//   // focusSide: which leaf is currently centred in the viewport
//   const focusSideRef = useRef<FocusSide>('left');
//   const curPageRef   = useRef(0);   // current book page index
//   const prevPageRef  = useRef(0);   // previous book page index (for swipe direction)

//   zoomRef.current = zoom;
//   panRef.current  = pan;
//   const isZoomed  = zoom > 1.01;

//   // ── Refs ──────────────────────────────────────────────────────────────────
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef          = useRef<any>(null);
//   const mainRef          = useRef<HTMLDivElement>(null);
//   const containerRef     = useRef<HTMLDivElement>(null);
//   const zoomContainerRef = useRef<HTMLDivElement>(null);
//   const overlayRef       = useRef<HTMLDivElement>(null);

//   // ── Helper: compute pan for a given focus side ────────────────────────────
//   // Uses Math.min so the offset accounts for maxWidth capping on desktop.
//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     const spreadW = zoomContainerRef.current?.offsetWidth ?? 600;
//     const bookW   = Math.min(spreadW, 620);   // maxWidth cap
//     const offset  = bookW / 4;                // half of one page
//     if (side === 'left')  return { x:  offset, y: 0 };
//     if (side === 'right') return { x: -offset, y: 0 };
//     return { x: 0, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return; // user controls pan when zoomed
//     focusSideRef.current = side;
//     const p = computePan(side);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   useEffect(() => { setMounted(true); }, []);

//   // ── Book height ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       setBookH(Math.max(280, Math.min(el.clientHeight - pad, MAX_BOOK_H)));
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el); calc();
//     return () => ro.disconnect();
//   }, []);

//   // ── Fullscreen ─────────────────────────────────────────────────────────────
//   const resetZoom = useCallback(() => {
//     setZoom(1); zoomRef.current = 1;
//     // Restore focus pan rather than snapping to dead centre
//     const p = computePan(focusSideRef.current);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   // ── URL hash restore ───────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   // ── handleFlip ─────────────────────────────────────────────────────────────
//   // Fires when the flip animation completes (react-pageflip fires at end of
//   // 650ms animation). This is the single source of truth for focus when a
//   // flip happens via swipe/keyboard/goFirst/goLast/page-jump.
//   // goNext/goPrev also call applyFocus directly for the non-flip focus shifts.
//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);

//     if (zoomRef.current <= 1.01) {
//       if (newPage === 0) {
//         applyFocus('center');
//       } else if (newPage > prev) {
//         applyFocus('left');   // flipped forward → focus newly revealed left page
//       } else {
//         applyFocus('right');  // flipped backward → focus newly revealed right page
//       }
//     }
//   }, [applyFocus]);

//   // ── Navigation ────────────────────────────────────────────────────────────
//   //
//   // Focus alternation pattern (matches the enviro India UX):
//   //   Each spread has two pages. The < and > buttons alternate focus between
//   //   them WITHIN a spread. Only when the "outer edge" is focused does pressing
//   //   again actually flip the page.
//   //
//   //   Forward:  left → right → (flip) → left → right → (flip) → …
//   //   Backward: right → left → (flip) → right → left → (flip) → …
//   //   Cover:    any direction → flip immediately (single page, no L/R)
//   //
//   const goNext = useCallback(() => {
//     const isOnCover = curPageRef.current === 0;

//     if (focusSideRef.current === 'right' || isOnCover) {
//       // At the right edge (or cover) → flip forward
//       if (curPageRef.current < TOTAL_PAGES - 1) {
//         // applyFocus will run via handleFlip after animation
//         bookRef.current?.pageFlip()?.flipNext();
//       }
//     } else {
//       // Was on left (or center after first load) → shift focus right, no flip
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const isOnCover = curPageRef.current === 0;

//     if (focusSideRef.current === 'left' || isOnCover) {
//       // At the left edge (or cover) → flip backward
//       if (curPageRef.current > 0) {
//         bookRef.current?.pageFlip()?.flipPrev();
//       }
//     } else {
//       // Was on right → shift focus left, no flip
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => {
//     bookRef.current?.pageFlip()?.flip(0);
//     // handleFlip will set 'center' for page 0
//   }, []);

//   const goLast = useCallback(() => {
//     bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1);
//     // handleFlip will set focus based on direction
//   }, []);

//   // ── Keyboard ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape': resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': setZoom(z => clamp(z + 0.5, ZOOM_MIN, ZOOM_MAX)); break;
//         case '-': setZoom(z => { const n = clamp(z - 0.5, ZOOM_MIN, ZOOM_MAX); if (n <= 1.01) resetZoom(); return n; }); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS]);

//   // ── Gesture listeners ──────────────────────────────────────────────────────
//   //
//   // ALL touch handling lives in container capture-phase listeners.
//   // The overlay only handles mouse drag.
//   //
//   // Touch decision tree (fires in capture phase before react-pageflip):
//   //   2+ fingers (any zoom)  → pinch zoom   → intercept
//   //   1 finger + zoom > 1   → pan/d-tap     → intercept
//   //   1 finger + zoom = 1   → flip (swipe)  → do NOT intercept → react-pageflip handles
//   //
//   // touchAction:'none' on the container tells the browser to deliver ALL touch
//   // events to JS and not attempt native scroll/zoom. React-pageflip's own JS
//   // listeners (registered on its child element) still fire when we don't intercept.
//   //
//   useEffect(() => {
//     const container = zoomContainerRef.current;
//     const overlay   = overlayRef.current;
//     if (!container || !overlay) return;

//     const maxPan = (z: number) => ({ mx: (z - 1) * 420, my: (z - 1) * 340 });

//     const g = {
//       pinching: false, pd0: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//       // mouse drag
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//     };

//     // ── Touch: all gestures ─────────────────────────────────────────────────
//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         // Pinch → always intercept
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.pz0 = zoomRef.current;
//       } else if (zoomRef.current > 1.01) {
//         // 1 finger while zoomed → pan (and block flipbook)
//         e.preventDefault(); e.stopPropagation();
//         // Double-tap to reset zoom
//         const now = Date.now();
//         if (now - g.lastTap < 300) {
//           setZoom(1); zoomRef.current = 1;
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//           g.lastTap = 0; g.panning = false; return;
//         }
//         g.lastTap = now;
//         g.panning = true; g.pinching = false;
//         g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//         g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//       }
//       // else: 1 finger, zoom=1 → don't intercept → react-pageflip flips
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const n = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//         setZoom(n); zoomRef.current = n;
//         if (n <= 1.01) { const p = computePan(focusSideRef.current); setPan(p); panRef.current = p; }
//       } else if (zoomRef.current > 1.01 && e.touches.length === 1) {
//         e.preventDefault(); e.stopPropagation();
//         // Handle pinch→pan transition: if touchstart didn't init pan, init here
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//         const z = zoomRef.current;
//         const { mx, my } = maxPan(z);
//         setPan({
//           x: clamp(g.tpx0 + e.touches[0].clientX - g.tx0, -mx, mx),
//           y: clamp(g.tpy0 + e.touches[0].clientY - g.ty0, -my, my),
//         });
//       }
//       // else: zoom=1, 1 finger → don't intercept
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//       if (e.touches.length === 0) { g.panning = false; isDragging.current = false; }
//     };

//     container.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     container.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     container.addEventListener('touchend',   onTouchEnd,   { capture: true });

//     // ── Wheel: zoom ─────────────────────────────────────────────────────────
//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const d = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
//       setZoom(z => {
//         const n = clamp(z - d / 480, ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = n;
//         if (n <= 1.01) { const p = computePan(focusSideRef.current); setPan(p); panRef.current = p; }
//         return n;
//       });
//     };
//     container.addEventListener('wheel', onWheel, { passive: false, capture: true });

//     // ── Mouse: drag to pan (overlay, active when pointer-events:auto) ───────
//     // When zoomed, overlay is the hit-target (pointer-events:auto).
//     // Flipbook is a sibling of overlay — NOT in the event propagation path.
//     const onMD = (e: MouseEvent) => {
//       e.preventDefault(); isDragging.current = true; g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onMM = (e: MouseEvent) => {
//       if (!g.md) return;
//       const z = zoomRef.current;
//       const { mx, my } = maxPan(z);
//       setPan({
//         x: clamp(g.px0 + e.clientX - g.mx0, -mx, mx),
//         y: clamp(g.py0 + e.clientY - g.my0, -my, my),
//       });
//     };
//     const onMU = () => { g.md = false; isDragging.current = false; };
//     overlay.addEventListener('mousedown', onMD);
//     window.addEventListener('mousemove',  onMM);
//     window.addEventListener('mouseup',    onMU);

//     return () => {
//       container.removeEventListener('touchstart', onTouchStart, { capture: true });
//       container.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       container.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//       container.removeEventListener('wheel',      onWheel,      { capture: true });
//       overlay.removeEventListener('mousedown', onMD);
//       window.removeEventListener('mousemove',  onMM);
//       window.removeEventListener('mouseup',    onMU);
//     };
//   }, [computePan]); // computePan is stable (useCallback, no deps)

//   const displayPage = curPage + 1;

//   const toolbar = (
//     <div className="bg-[#1e3143] border-t border-[#1484bc]/15 px-2 py-1.5 flex items-center justify-center gap-0.5 flex-shrink-0 z-30">
//       <TBtn onClick={() => setZoom(z => { const n = clamp(z - 0.5, ZOOM_MIN, ZOOM_MAX); if (n <= 1.01) resetZoom(); return n; })} disabled={!isZoomed} title="Zoom out (−)">
//         <ZoomOut className="w-[18px] h-[18px]"/>
//       </TBtn>
//       <TBtn onClick={goFirst} title="First page"><ChevronsLeft  className="w-[18px] h-[18px]"/></TBtn>
//       <TBtn onClick={goPrev}  title="Previous / focus left"><ChevronLeft   className="w-[18px] h-[18px]"/></TBtn>

//       <div className="flex items-center gap-1 px-1">
//         <input
//           type="number" min={1} max={TOTAL_PAGES}
//           defaultValue={displayPage} key={displayPage}
//           onKeyDown={(e) => {
//             if (e.key !== 'Enter' || !bookRef.current) return;
//             const n = parseInt((e.target as HTMLInputElement).value, 10);
//             if (n >= 1 && n <= TOTAL_PAGES) {
//               bookRef.current.pageFlip().flip(n - 1);
//             }
//           }}
//           className="w-9 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-1 py-0.5 text-xs outline-none"
//         />
//         <span className="text-[#aec2cc] text-xs whitespace-nowrap">/ {TOTAL_PAGES}</span>
//       </div>

//       <TBtn onClick={goNext}  title="Next / focus right"><ChevronRight  className="w-[18px] h-[18px]"/></TBtn>
//       <TBtn onClick={goLast}  title="Last page"><ChevronsRight className="w-[18px] h-[18px]"/></TBtn>
//       <TBtn href={DOWNLOAD_URL} title="Download PDF"><Download className="w-[18px] h-[18px]"/></TBtn>
//       <TBtn onClick={() => setZoom(z => clamp(z + 0.5, ZOOM_MIN, ZOOM_MAX))} disabled={zoom >= ZOOM_MAX} title="Zoom in (+)">
//         <ZoomIn className="w-[18px] h-[18px]"/>
//       </TBtn>
//     </div>
//   );

//   return (
//     <div ref={containerRef}
//       className={`relative flex flex-col ${isFS ? 'h-screen' : 'min-h-screen pt-16'}`}
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       {!isFS && (
//         <div className="bg-[#1e3143]/90 backdrop-blur-sm border-b border-[#1484bc]/20 px-4 sm:px-8 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
//           <div>
//             <h1 className="text-[#fafbf9] font-bold text-sm sm:text-base leading-tight">
//               Annual Integrated Report 2025–26
//             </h1>
//             <p className="text-[#aec2cc] text-[11px] mt-0.5">
//               Page {displayPage} of {TOTAL_PAGES}
//               <span className="ml-2">· ← → or F to navigate</span>
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button onClick={toggleFS} className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm transition-colors">
//               <Maximize2 className="w-4 h-4"/>
//               <span className="hidden sm:inline">Full screen</span>
//             </button>
//             <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
//               className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm transition-colors">
//               <Download className="w-4 h-4"/>
//               <span className="hidden sm:inline">Download PDF</span>
//             </a>
//           </div>
//         </div>
//       )}

//       {isFS && (
//         <button onClick={toggleFS}
//           className="absolute top-4 right-4 z-50 bg-[#1e3143]/80 backdrop-blur px-3 py-2 rounded text-white flex items-center gap-2 text-sm">
//           <Minimize2 className="w-4 h-4"/> Exit full screen
//         </button>
//       )}

//       <main ref={mainRef}
//         className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 overflow-hidden">
//         {mounted && (
//           <div
//             ref={zoomContainerRef}
//             className="relative w-full"
//             style={{
//               // touchAction:'none' tells the browser to deliver ALL touch events
//               // to JS and not attempt native scroll/pinch-zoom.
//               // React-pageflip's own JS listeners still fire for 1-finger touches
//               // at zoom=1 (we don't stopPropagation for those).
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             {/*
//               Scale wrapper:
//               width:100% required — react-pageflip reads parentElement.offsetWidth.
//               transition disabled during active drag (isDragging ref) to eliminate lag.
//               Since setPan triggers re-renders, isDragging.current is read correctly
//               each frame without any state overhead.
//             */}
//             <div style={{
//               width: '100%',
//               transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//               transformOrigin: 'center top',
//               transition: isDragging.current ? 'none' : 'transform 0.25s ease-out',
//               willChange: 'transform',
//             }}>
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"      // force double spread on all screen sizes
//                 minWidth={100}        // allow narrow pages on mobile (190px on 380px screen)
//                 maxWidth={620}
//                 minHeight={200}       // allow proportionally short pages on mobile
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.6}
//                 showCover={true}
//                 mobileScrollSupport={false}  // we handle all touch ourselves
//                 drawShadow={true}
//                 flippingTime={650}
//                 useMouseEvents={true}
//                 swipeDistance={30}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             {/*
//               Overlay — always in DOM. pointer-events toggled via CSS.
//               pointer-events:none (zoom=1) → events fall through to flipbook → flip works.
//               pointer-events:auto (zoom>1) → overlay is hit-target → flipbook (sibling)
//               is NOT in event path → never receives the event → pan works.
//               Touch is handled by the container above — overlay only handles mouse.
//             */}
//             <div
//               ref={overlayRef}
//               style={{
//                 position: 'absolute', inset: 0, zIndex: 10,
//                 pointerEvents: isZoomed ? 'auto' : 'none',
//                 cursor: isZoomed ? 'grab' : 'default',
//                 userSelect: 'none',
//               }}
//             />

//             {/* Reset zoom badge — z-20, above overlay, always tappable */}
//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ zIndex: 20 }}
//                 className="absolute bottom-3 left-1/2 -translate-x-1/2
//                   bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && toolbar}
//     </div>
//   );
// }













































// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import {
//   Download, Maximize2, Minimize2,
//   ZoomIn, ZoomOut,
//   ChevronLeft, ChevronRight,
//   ChevronsLeft, ChevronsRight,
// } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () => import('react-pageflip').then((m) => m.default as unknown as React.ComponentType<AnyProps>),
//   { ssr: false },
// );

// // ─── Config ───────────────────────────────────────────────────────────────────
// const TOTAL_PAGES  = 36;
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const IMG          = (n: number) => `/Assets/newsletterjpegs/pg${n}.jpg`;

// const MAX_BOOK_H = 520;
// const ZOOM_MIN   = 1;
// const ZOOM_MAX   = 4;
// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// type FocusSide = 'left' | 'right' | 'center';

// // ─── Toolbar button ───────────────────────────────────────────────────────────
// function TBtn({
//   onClick, disabled = false, title, href, children,
// }: {
//   onClick?: () => void; disabled?: boolean;
//   title?: string; href?: string; children: React.ReactNode;
// }) {
//   const cls =
//     'flex items-center justify-center w-9 h-9 rounded ' +
//     'text-[#aec2cc] hover:text-white hover:bg-[#1484bc]/25 ' +
//     'disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0';
//   if (href) return <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>{children}</a>;
//   return <button onClick={onClick} disabled={disabled} title={title} className={cls}>{children}</button>;
// }

// // ─── FlipPage ─────────────────────────────────────────────────────────────────
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
//   <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
//     {/* eslint-disable-next-line @next/next/no-img-element */}
//     <img src={IMG(pageNum)} alt={`Page ${pageNum}`}
//       className="w-full h-full object-contain"
//       loading={pageNum <= 6 ? 'eager' : 'lazy'} draggable={false} />
//   </div>
// ));
// FlipPage.displayName = 'FlipPage';

// // ─── NewsletterViewer ─────────────────────────────────────────────────────────
// export default function NewsletterViewer() {
//   const [mounted, setMounted] = useState(false);
//   const [curPage, setCurPage] = useState(0);
//   const [isFS,    setIsFS]    = useState(false);
//   const [bookH,   setBookH]   = useState(MAX_BOOK_H);
//   const [zoom,    setZoom]    = useState(1);
//   const [pan,     setPan]     = useState({ x: 0, y: 0 });

//   // ── Stable refs (readable by event handlers without re-subscribing) ─────
//   const zoomRef      = useRef(1);
//   const panRef       = useRef({ x: 0, y: 0 });
//   const isDragging   = useRef(false);
//   // focusSide: which leaf is currently centred in the viewport
//   const focusSideRef = useRef<FocusSide>('left');
//   const curPageRef   = useRef(0);   // current book page index
//   const prevPageRef  = useRef(0);   // previous book page index (for swipe direction)

//   zoomRef.current = zoom;
//   panRef.current  = pan;
//   const isZoomed  = zoom > 1.01;

//   // ── Refs ──────────────────────────────────────────────────────────────────
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef          = useRef<any>(null);
//   const mainRef          = useRef<HTMLDivElement>(null);
//   const containerRef     = useRef<HTMLDivElement>(null);
//   const zoomContainerRef = useRef<HTMLDivElement>(null);
//   const overlayRef       = useRef<HTMLDivElement>(null);

//   // ── Helper: compute pan for a given focus side ────────────────────────────
//   // Uses Math.min so the offset accounts for maxWidth capping on desktop.
//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     const spreadW = zoomContainerRef.current?.offsetWidth ?? 600;
//     const bookW   = Math.min(spreadW, 620);   // maxWidth cap
//     const offset  = bookW / 4;                // half of one page
//     if (side === 'left')  return { x:  offset, y: 0 };
//     if (side === 'right') return { x: -offset, y: 0 };
//     return { x: 0, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return; // user controls pan when zoomed
//     focusSideRef.current = side;
//     const p = computePan(side);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   useEffect(() => { setMounted(true); }, []);

//   // ── Book height ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       setBookH(Math.max(280, Math.min(el.clientHeight - pad, MAX_BOOK_H)));
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el); calc();
//     return () => ro.disconnect();
//   }, []);

//   // ── Fullscreen ─────────────────────────────────────────────────────────────
//   const resetZoom = useCallback(() => {
//     setZoom(1); zoomRef.current = 1;
//     // Restore focus pan rather than snapping to dead centre
//     const p = computePan(focusSideRef.current);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   // ── URL hash restore ───────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   // ── handleFlip ─────────────────────────────────────────────────────────────
//   // Fires when the flip animation completes (react-pageflip fires at end of
//   // 650ms animation). This is the single source of truth for focus when a
//   // flip happens via swipe/keyboard/goFirst/goLast/page-jump.
//   // goNext/goPrev also call applyFocus directly for the non-flip focus shifts.
//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);

//     if (zoomRef.current <= 1.01) {
//       if (newPage === 0) {
//         applyFocus('center');
//       } else if (newPage > prev) {
//         applyFocus('left');   // flipped forward → focus newly revealed left page
//       } else {
//         applyFocus('right');  // flipped backward → focus newly revealed right page
//       }
//     }
//   }, [applyFocus]);

//   // ── Navigation ────────────────────────────────────────────────────────────
//   //
//   // Focus alternation pattern (matches the enviro India UX):
//   //   Each spread has two pages. The < and > buttons alternate focus between
//   //   them WITHIN a spread. Only when the "outer edge" is focused does pressing
//   //   again actually flip the page.
//   //
//   //   Forward:  left → right → (flip) → left → right → (flip) → …
//   //   Backward: right → left → (flip) → right → left → (flip) → …
//   //   Cover:    any direction → flip immediately (single page, no L/R)
//   //
//   const goNext = useCallback(() => {
//     const isOnCover = curPageRef.current === 0;

//     if (focusSideRef.current === 'right' || isOnCover) {
//       // At the right edge (or cover) → flip forward
//       if (curPageRef.current < TOTAL_PAGES - 1) {
//         // applyFocus will run via handleFlip after animation
//         bookRef.current?.pageFlip()?.flipNext();
//       }
//     } else {
//       // Was on left (or center after first load) → shift focus right, no flip
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const isOnCover = curPageRef.current === 0;

//     if (focusSideRef.current === 'left' || isOnCover) {
//       // At the left edge (or cover) → flip backward
//       if (curPageRef.current > 0) {
//         bookRef.current?.pageFlip()?.flipPrev();
//       }
//     } else {
//       // Was on right → shift focus left, no flip
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => {
//     bookRef.current?.pageFlip()?.flip(0);
//     // handleFlip will set 'center' for page 0
//   }, []);

//   const goLast = useCallback(() => {
//     bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1);
//     // handleFlip will set focus based on direction
//   }, []);

//   // ── Keyboard ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape': resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': setZoom(z => clamp(z + 0.5, ZOOM_MIN, ZOOM_MAX)); break;
//         case '-': setZoom(z => { const n = clamp(z - 0.5, ZOOM_MIN, ZOOM_MAX); if (n <= 1.01) resetZoom(); return n; }); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS]);

//   // ── Gesture listeners ──────────────────────────────────────────────────────
//   //
//   // ALL touch handling lives in container capture-phase listeners.
//   // The overlay only handles mouse drag.
//   //
//   // Touch decision tree (fires in capture phase before react-pageflip):
//   //   2+ fingers (any zoom)  → pinch zoom   → intercept
//   //   1 finger + zoom > 1   → pan/d-tap     → intercept
//   //   1 finger + zoom = 1   → flip (swipe)  → do NOT intercept → react-pageflip handles
//   //
//   // touchAction:'none' on the container tells the browser to deliver ALL touch
//   // events to JS and not attempt native scroll/zoom. React-pageflip's own JS
//   // listeners (registered on its child element) still fire when we don't intercept.
//   //
//   useEffect(() => {
//     const container = zoomContainerRef.current;
//     const overlay   = overlayRef.current;
//     if (!container || !overlay) return;

//     const maxPan = (z: number) => ({ mx: (z - 1) * 420, my: (z - 1) * 340 });

//     const g = {
//       pinching: false, pd0: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//       // mouse drag
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//     };

//     // ── Touch: all gestures ─────────────────────────────────────────────────
//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         // Pinch → always intercept
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.pz0 = zoomRef.current;
//       } else if (zoomRef.current > 1.01) {
//         // 1 finger while zoomed → pan (and block flipbook)
//         e.preventDefault(); e.stopPropagation();
//         // Double-tap to reset zoom
//         const now = Date.now();
//         if (now - g.lastTap < 300) {
//           setZoom(1); zoomRef.current = 1;
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//           g.lastTap = 0; g.panning = false; return;
//         }
//         g.lastTap = now;
//         g.panning = true; g.pinching = false;
//         g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//         g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//       }
//       // else: 1 finger, zoom=1 → don't intercept → react-pageflip flips
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const n = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//         setZoom(n); zoomRef.current = n;
//         if (n <= 1.01) { const p = computePan(focusSideRef.current); setPan(p); panRef.current = p; }
//       } else if (zoomRef.current > 1.01 && e.touches.length === 1) {
//         e.preventDefault(); e.stopPropagation();
//         // Handle pinch→pan transition: if touchstart didn't init pan, init here
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//         const z = zoomRef.current;
//         const { mx, my } = maxPan(z);
//         setPan({
//           x: clamp(g.tpx0 + e.touches[0].clientX - g.tx0, -mx, mx),
//           y: clamp(g.tpy0 + e.touches[0].clientY - g.ty0, -my, my),
//         });
//       }
//       // else: zoom=1, 1 finger → don't intercept
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//       if (e.touches.length === 0) { g.panning = false; isDragging.current = false; }
//     };

//     container.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     container.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     container.addEventListener('touchend',   onTouchEnd,   { capture: true });

//     // ── Wheel: zoom ─────────────────────────────────────────────────────────
//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const d = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
//       setZoom(z => {
//         const n = clamp(z - d / 480, ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = n;
//         if (n <= 1.01) { const p = computePan(focusSideRef.current); setPan(p); panRef.current = p; }
//         return n;
//       });
//     };
//     container.addEventListener('wheel', onWheel, { passive: false, capture: true });

//     // ── Mouse: drag to pan (overlay, active when pointer-events:auto) ───────
//     // When zoomed, overlay is the hit-target (pointer-events:auto).
//     // Flipbook is a sibling of overlay — NOT in the event propagation path.
//     const onMD = (e: MouseEvent) => {
//       e.preventDefault(); isDragging.current = true; g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onMM = (e: MouseEvent) => {
//       if (!g.md) return;
//       const z = zoomRef.current;
//       const { mx, my } = maxPan(z);
//       setPan({
//         x: clamp(g.px0 + e.clientX - g.mx0, -mx, mx),
//         y: clamp(g.py0 + e.clientY - g.my0, -my, my),
//       });
//     };
//     const onMU = () => { g.md = false; isDragging.current = false; };
//     overlay.addEventListener('mousedown', onMD);
//     window.addEventListener('mousemove',  onMM);
//     window.addEventListener('mouseup',    onMU);

//     return () => {
//       container.removeEventListener('touchstart', onTouchStart, { capture: true });
//       container.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       container.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//       container.removeEventListener('wheel',      onWheel,      { capture: true });
//       overlay.removeEventListener('mousedown', onMD);
//       window.removeEventListener('mousemove',  onMM);
//       window.removeEventListener('mouseup',    onMU);
//     };
//   }, [computePan]); // computePan is stable (useCallback, no deps)

//   const displayPage = curPage + 1;

//   const toolbar = (
//     <div className="bg-[#1e3143] border-t border-[#1484bc]/15 px-2 py-1.5 flex items-center justify-center gap-0.5 flex-shrink-0 z-30">
//       <TBtn onClick={() => setZoom(z => { const n = clamp(z - 0.5, ZOOM_MIN, ZOOM_MAX); if (n <= 1.01) resetZoom(); return n; })} disabled={!isZoomed} title="Zoom out (−)">
//         <ZoomOut className="w-[18px] h-[18px]"/>
//       </TBtn>
//       <TBtn onClick={goFirst} title="First page"><ChevronsLeft  className="w-[18px] h-[18px]"/></TBtn>
//       <TBtn onClick={goPrev}  title="Previous / focus left"><ChevronLeft   className="w-[18px] h-[18px]"/></TBtn>

//       <div className="flex items-center gap-1 px-1">
//         <input
//           type="number" min={1} max={TOTAL_PAGES}
//           defaultValue={displayPage} key={displayPage}
//           onKeyDown={(e) => {
//             if (e.key !== 'Enter' || !bookRef.current) return;
//             const n = parseInt((e.target as HTMLInputElement).value, 10);
//             if (n >= 1 && n <= TOTAL_PAGES) {
//               bookRef.current.pageFlip().flip(n - 1);
//             }
//           }}
//           className="w-9 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-1 py-0.5 text-xs outline-none"
//         />
//         <span className="text-[#aec2cc] text-xs whitespace-nowrap">/ {TOTAL_PAGES}</span>
//       </div>

//       <TBtn onClick={goNext}  title="Next / focus right"><ChevronRight  className="w-[18px] h-[18px]"/></TBtn>
//       <TBtn onClick={goLast}  title="Last page"><ChevronsRight className="w-[18px] h-[18px]"/></TBtn>
//       <TBtn href={DOWNLOAD_URL} title="Download PDF"><Download className="w-[18px] h-[18px]"/></TBtn>
//       <TBtn onClick={() => setZoom(z => clamp(z + 0.5, ZOOM_MIN, ZOOM_MAX))} disabled={zoom >= ZOOM_MAX} title="Zoom in (+)">
//         <ZoomIn className="w-[18px] h-[18px]"/>
//       </TBtn>
//     </div>
//   );

//   return (
//     <div ref={containerRef}
//       className={`relative flex flex-col ${isFS ? 'h-screen' : 'min-h-screen pt-16'}`}
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       {!isFS && (
//         <div className="bg-[#1e3143]/90 backdrop-blur-sm border-b border-[#1484bc]/20 px-4 sm:px-8 py-2.5 flex items-center justify-between flex-shrink-0 z-10">
//           <div>
//             <h1 className="text-[#fafbf9] font-bold text-sm sm:text-base leading-tight">
//               Annual Integrated Report 2025–26
//             </h1>
//             <p className="text-[#aec2cc] text-[11px] mt-0.5">
//               Page {displayPage} of {TOTAL_PAGES}
//               <span className="ml-2">· ← → or F to navigate</span>
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <button onClick={toggleFS} className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm transition-colors">
//               <Maximize2 className="w-4 h-4"/>
//               <span className="hidden sm:inline">Full screen</span>
//             </button>
//             <a href={DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
//               className="flex items-center gap-1.5 text-[#aec2cc] hover:text-[#1484bc] text-sm transition-colors">
//               <Download className="w-4 h-4"/>
//               <span className="hidden sm:inline">Download PDF</span>
//             </a>
//           </div>
//         </div>
//       )}

//       {isFS && (
//         <button onClick={toggleFS}
//           className="absolute top-4 right-4 z-50 bg-[#1e3143]/80 backdrop-blur px-3 py-2 rounded text-white flex items-center gap-2 text-sm">
//           <Minimize2 className="w-4 h-4"/> Exit full screen
//         </button>
//       )}

//       <main ref={mainRef}
//         className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 overflow-hidden">
//         {mounted && (
//           <div
//             ref={zoomContainerRef}
//             className="relative w-full"
//             style={{
//               // touchAction:'none' tells the browser to deliver ALL touch events
//               // to JS and not attempt native scroll/pinch-zoom.
//               // React-pageflip's own JS listeners still fire for 1-finger touches
//               // at zoom=1 (we don't stopPropagation for those).
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             {/*
//               Scale wrapper:
//               width:100% required — react-pageflip reads parentElement.offsetWidth.
//               transition disabled during active drag (isDragging ref) to eliminate lag.
//               Since setPan triggers re-renders, isDragging.current is read correctly
//               each frame without any state overhead.
//             */}
//             <div style={{
//               width: '100%',
//               transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//               transformOrigin: 'center top',
//               transition: isDragging.current ? 'none' : 'transform 0.25s ease-out',
//               willChange: 'transform',
//             }}>
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"      // force double spread on all screen sizes
//                 minWidth={100}        // allow narrow pages on mobile (190px on 380px screen)
//                 maxWidth={620}
//                 minHeight={200}       // allow proportionally short pages on mobile
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.6}
//                 showCover={true}
//                 mobileScrollSupport={false}  // we handle all touch ourselves
//                 drawShadow={true}
//                 flippingTime={650}
//                 useMouseEvents={true}
//                 swipeDistance={30}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             {/*
//               Overlay — always in DOM. pointer-events toggled via CSS.
//               pointer-events:none (zoom=1) → events fall through to flipbook → flip works.
//               pointer-events:auto (zoom>1) → overlay is hit-target → flipbook (sibling)
//               is NOT in event path → never receives the event → pan works.
//               Touch is handled by the container above — overlay only handles mouse.
//             */}
//             <div
//               ref={overlayRef}
//               style={{
//                 position: 'absolute', inset: 0, zIndex: 10,
//                 pointerEvents: isZoomed ? 'auto' : 'none',
//                 cursor: isZoomed ? 'grab' : 'default',
//                 userSelect: 'none',
//               }}
//             />

//             {/* Reset zoom badge — z-20, above overlay, always tappable */}
//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ zIndex: 20 }}
//                 className="absolute bottom-3 left-1/2 -translate-x-1/2
//                   bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && toolbar}
//     </div>
//   );
// }




















// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import {
//   Download, Maximize2, Minimize2,
//   ZoomIn, ZoomOut,
//   ChevronLeft, ChevronRight,
//   ChevronsLeft, ChevronsRight,
// } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () => import('react-pageflip').then((m) => m.default as unknown as React.ComponentType<AnyProps>),
//   { ssr: false },
// );

// // ─── Config ───────────────────────────────────────────────────────────────────
// const TOTAL_PAGES  = 36;
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// // Pre-extracted static JPEGs — one per page, no PDF loading, instant display.
// // Generate with: python extract_pages.py  (see comment at bottom of file)
// const IMG = (n: number) => `/Assets/newsletterjpegs/pg${n}.jpg`;

// const MAX_BOOK_H = 520;
// const ZOOM_MIN   = 1;
// const ZOOM_MAX   = 4;
// const MOBILE_BP  = 768; // px — below this width = mobile layout
// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// type FocusSide = 'left' | 'right' | 'center';

// // ─── Toolbar button ───────────────────────────────────────────────────────────
// function TBtn({
//   onClick, disabled = false, title, href, children,
// }: {
//   onClick?: () => void; disabled?: boolean;
//   title?: string; href?: string; children: React.ReactNode;
// }) {
//   const cls =
//     'flex items-center justify-center w-9 h-9 rounded ' +
//     'text-[#aec2cc] hover:text-white hover:bg-[#1484bc]/25 ' +
//     'disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0';
//   if (href)
//     return (
//       <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>
//         {children}
//       </a>
//     );
//   return (
//     <button onClick={onClick} disabled={disabled} title={title} className={cls}>
//       {children}
//     </button>
//   );
// }

// // ─── FlipPage ─────────────────────────────────────────────────────────────────
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
//   <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
//     {/* eslint-disable-next-line @next/next/no-img-element */}
//     <img
//       src={IMG(pageNum)}
//       alt={`Page ${pageNum}`}
//       className="w-full h-full object-contain"
//       loading={pageNum <= 6 ? 'eager' : 'lazy'}
//       draggable={false}
//     />
//   </div>
// ));
// FlipPage.displayName = 'FlipPage';

// // ─── NewsletterViewer ─────────────────────────────────────────────────────────
// export default function NewsletterViewer() {
//   const [mounted,  setMounted]  = useState(false);
//   const [curPage,  setCurPage]  = useState(0);
//   const [isFS,     setIsFS]     = useState(false);
//   const [bookH,    setBookH]    = useState(MAX_BOOK_H);
//   const [zoom,     setZoom]     = useState(1);
//   const [pan,      setPan]      = useState({ x: 0, y: 0 });
//   const [isMobile, setIsMobile] = useState(false);

//   // ── Stable refs — readable by event handlers without re-subscribing ──────
//   const zoomRef      = useRef(1);
//   const panRef       = useRef({ x: 0, y: 0 });
//   const isMobileRef  = useRef(false);
//   const isDragging   = useRef(false);
//   const focusSideRef = useRef<FocusSide>('left');
//   const curPageRef   = useRef(0);
//   const prevPageRef  = useRef(0);
//   const containerWRef = useRef(0); // zoom container client width (for mobile math)

//   zoomRef.current    = zoom;
//   panRef.current     = pan;
//   isMobileRef.current = isMobile;

//   const isZoomed = zoom > 1.01;

//   // ── Refs ──────────────────────────────────────────────────────────────────
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef          = useRef<any>(null);
//   const mainRef          = useRef<HTMLDivElement>(null);
//   const containerRef     = useRef<HTMLDivElement>(null);   // fullscreen target
//   const zoomContainerRef = useRef<HTMLDivElement>(null);   // touch target
//   const overlayRef       = useRef<HTMLDivElement>(null);   // mouse-drag target

//   // ── computePan: pan position for a given focus side ──────────────────────
//   //
//   // Desktop: the spread is at most 620px (maxWidth) wide. Panning by ¼ of
//   // the spread width centres one page in the viewport.
//   //
//   // Mobile (isMobile=true): the scale wrapper is set to width:200% so each
//   // page fills the container. The spread starts at the wrapper's left edge
//   // (react-pageflip stretch-fills its parent). To show the LEFT page we keep
//   // pan.x = 0 (it already fills the clipped window). To show the RIGHT page
//   // we shift the wrapper left by one page width = containerW.
//   //
//   const computePan = useCallback(
//     (side: FocusSide): { x: number; y: number } => {
//       if (isMobileRef.current) {
//         const W = containerWRef.current;
//         if (side === 'right')  return { x: -W, y: 0 };
//         if (side === 'center') return { x: -W / 2, y: 0 };
//         return { x: 0, y: 0 }; // left
//       }
//       // Desktop
//       const spreadW = zoomContainerRef.current?.offsetWidth ?? 600;
//       const bookW   = Math.min(spreadW, 620);
//       const offset  = bookW / 4;
//       if (side === 'left')  return { x:  offset, y: 0 };
//       if (side === 'right') return { x: -offset, y: 0 };
//       return { x: 0, y: 0 };
//     },
//     [],
//   );

//   const applyFocus = useCallback(
//     (side: FocusSide) => {
//       if (zoomRef.current > 1.01) return; // user controls pan when zoomed
//       focusSideRef.current = side;
//       const p = computePan(side);
//       setPan(p);
//       panRef.current = p;
//     },
//     [computePan],
//   );

//   // ── Mount ─────────────────────────────────────────────────────────────────
//   useEffect(() => { setMounted(true); }, []);

//   // ── Mobile detection + container width tracking ───────────────────────────
//   useEffect(() => {
//     const el = zoomContainerRef.current;
//     const update = () => {
//       const mobile = window.innerWidth < MOBILE_BP;
//       setIsMobile(mobile);
//       isMobileRef.current = mobile;
//       if (el) containerWRef.current = el.clientWidth;
//       // Re-apply focus pan with new geometry
//       if (zoomRef.current <= 1.01) {
//         const p = computePan(focusSideRef.current);
//         setPan(p);
//         panRef.current = p;
//       }
//     };
//     update();
//     window.addEventListener('resize', update);
//     return () => window.removeEventListener('resize', update);
//   }, [computePan]);

//   // ── Book height (ResizeObserver on <main>) ────────────────────────────────
//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       setBookH(Math.max(280, Math.min(el.clientHeight - pad, MAX_BOOK_H)));
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el);
//     calc();
//     return () => ro.disconnect();
//   }, []);

//   // ── Fullscreen ─────────────────────────────────────────────────────────────
//   const resetZoom = useCallback(() => {
//     setZoom(1);
//     zoomRef.current = 1;
//     const p = computePan(focusSideRef.current);
//     setPan(p);
//     panRef.current = p;
//   }, [computePan]);

//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);

//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   // ── URL hash restore ───────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   // ── handleFlip ─────────────────────────────────────────────────────────────
//   const handleFlip = useCallback(
//     (e: { data: number }) => {
//       const newPage = e.data;
//       const prev    = prevPageRef.current;
//       prevPageRef.current = newPage;
//       curPageRef.current  = newPage;
//       setCurPage(newPage);
//       window.history.replaceState(null, '', `#page/${newPage + 1}`);

//       if (zoomRef.current <= 1.01) {
//         if (newPage === 0) {
//           applyFocus('center');
//         } else if (newPage > prev) {
//           applyFocus('left');
//         } else {
//           applyFocus('right');
//         }
//       }
//     },
//     [applyFocus],
//   );

//   // ── Navigation ─────────────────────────────────────────────────────────────
//   //
//   // Focus alternation pattern (enviro India UX):
//   //   Forward:  left → right → (flip) → left → right → …
//   //   Backward: right → left → (flip) → right → left → …
//   //   Cover:    any direction → flip immediately
//   //
//   const goNext = useCallback(() => {
//     const isOnCover = curPageRef.current === 0;
//     if (focusSideRef.current === 'right' || isOnCover) {
//       if (curPageRef.current < TOTAL_PAGES - 1)
//         bookRef.current?.pageFlip()?.flipNext();
//     } else {
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const isOnCover = curPageRef.current === 0;
//     if (focusSideRef.current === 'left' || isOnCover) {
//       if (curPageRef.current > 0)
//         bookRef.current?.pageFlip()?.flipPrev();
//     } else {
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => {
//     bookRef.current?.pageFlip()?.flip(0);
//   }, []);

//   const goLast = useCallback(() => {
//     bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1);
//   }, []);

//   // ── Keyboard ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':
//           resetZoom();
//           break;
//         case 'f': case 'F':
//           toggleFS();
//           break;
//         case '+': case '=':
//           setZoom(z => clamp(z + 0.5, ZOOM_MIN, ZOOM_MAX));
//           break;
//         case '-':
//           setZoom(z => {
//             const n = clamp(z - 0.5, ZOOM_MIN, ZOOM_MAX);
//             if (n <= 1.01) resetZoom();
//             return n;
//           });
//           break;
//         case 'ArrowRight': case 'PageDown':
//           goNext();
//           break;
//         case 'ArrowLeft': case 'PageUp':
//           goPrev();
//           break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS]);

//   // ── Gesture listeners ──────────────────────────────────────────────────────
//   //
//   // All touch handling in container capture-phase (fires before react-pageflip).
//   // Mouse drag handled by overlay element.
//   //
//   // Decision tree:
//   //   2+ fingers (any zoom)  → pinch zoom        → intercept
//   //   1 finger + zoom > 1   → pan / double-tap   → intercept
//   //   1 finger + zoom = 1   → page flip (swipe)  → do NOT intercept
//   //
//   useEffect(() => {
//     const container = zoomContainerRef.current;
//     const overlay   = overlayRef.current;
//     if (!container || !overlay) return;

//     const maxPan = (z: number) => {
//       if (isMobileRef.current) {
//         const W = containerWRef.current;
//         return { mx: W + (z - 1) * W, my: (z - 1) * 340 };
//       }
//       return { mx: (z - 1) * 420, my: (z - 1) * 340 };
//     };

//     const g = {
//       pinching: false, pd0: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//     };

//     // ── Touch ────────────────────────────────────────────────────────────────
//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         // Pinch — always intercept regardless of zoom level
//         e.preventDefault();
//         e.stopPropagation();
//         g.pinching = true;
//         g.panning  = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.pz0 = zoomRef.current;
//       } else if (zoomRef.current > 1.01) {
//         // Single finger while zoomed — pan and double-tap reset
//         e.preventDefault();
//         e.stopPropagation();
//         const now = Date.now();
//         if (now - g.lastTap < 300) {
//           // Double-tap: reset zoom
//           setZoom(1);
//           zoomRef.current = 1;
//           const p = computePan(focusSideRef.current);
//           setPan(p);
//           panRef.current = p;
//           g.lastTap  = 0;
//           g.panning  = false;
//           return;
//         }
//         g.lastTap  = now;
//         g.panning  = true;
//         g.pinching = false;
//         g.tx0  = e.touches[0].clientX;
//         g.ty0  = e.touches[0].clientY;
//         g.tpx0 = panRef.current.x;
//         g.tpy0 = panRef.current.y;
//       }
//       // else: zoom=1, single finger → don't intercept → react-pageflip flips
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault();
//         e.stopPropagation();
//         const d = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const n = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//         setZoom(n);
//         zoomRef.current = n;
//         if (n <= 1.01) {
//           const p = computePan(focusSideRef.current);
//           setPan(p);
//           panRef.current = p;
//         }
//       } else if (zoomRef.current > 1.01 && e.touches.length === 1) {
//         e.preventDefault();
//         e.stopPropagation();
//         // Handle pinch→pan transition: init pan state if not set yet
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX;
//           g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;
//           g.tpy0 = panRef.current.y;
//         }
//         const z = zoomRef.current;
//         const { mx, my } = maxPan(z);
//         const newPan = {
//           x: clamp(g.tpx0 + e.touches[0].clientX - g.tx0, -mx, mx),
//           y: clamp(g.tpy0 + e.touches[0].clientY - g.ty0, -my, my),
//         };
//         setPan(newPan);
//         panRef.current = newPan;
//       }
//       // else: zoom=1, single finger → don't intercept
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//       if (e.touches.length === 0) { g.panning = false; isDragging.current = false; }
//     };

//     // ── Wheel: zoom ──────────────────────────────────────────────────────────
//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const d = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
//       setZoom(z => {
//         const n = clamp(z - d / 480, ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = n;
//         if (n <= 1.01) {
//           const p = computePan(focusSideRef.current);
//           setPan(p);
//           panRef.current = p;
//         }
//         return n;
//       });
//     };

//     // ── Mouse: drag via overlay ──────────────────────────────────────────────
//     const onMD = (e: MouseEvent) => {
//       e.preventDefault();
//       isDragging.current = true;
//       g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onMM = (e: MouseEvent) => {
//       if (!g.md) return;
//       const z = zoomRef.current;
//       const { mx, my } = maxPan(z);
//       const newPan = {
//         x: clamp(g.px0 + e.clientX - g.mx0, -mx, mx),
//         y: clamp(g.py0 + e.clientY - g.my0, -my, my),
//       };
//       setPan(newPan);
//       panRef.current = newPan;
//     };
//     const onMU = () => { g.md = false; isDragging.current = false; };

//     container.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     container.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     container.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     container.addEventListener('wheel',      onWheel,      { capture: true, passive: false });
//     overlay.addEventListener('mousedown', onMD);
//     window.addEventListener('mousemove',  onMM);
//     window.addEventListener('mouseup',    onMU);

//     return () => {
//       container.removeEventListener('touchstart', onTouchStart, { capture: true });
//       container.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       container.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//       container.removeEventListener('wheel',      onWheel,      { capture: true });
//       overlay.removeEventListener('mousedown', onMD);
//       window.removeEventListener('mousemove',  onMM);
//       window.removeEventListener('mouseup',    onMU);
//     };
//   }, [computePan]);

//   const displayPage = curPage + 1;

//   // ── Toolbar ────────────────────────────────────────────────────────────────
//   const toolbar = (
//     <div className="bg-[#1e3143] border-t border-[#1484bc]/15 px-2 py-1.5 flex items-center justify-center gap-0.5 flex-shrink-0 z-30">
//       <TBtn
//         onClick={() => setZoom(z => { const n = clamp(z - 0.5, ZOOM_MIN, ZOOM_MAX); if (n <= 1.01) resetZoom(); return n; })}
//         disabled={!isZoomed}
//         title="Zoom out (−)"
//       >
//         <ZoomOut className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={goFirst}  title="First page"><ChevronsLeft  className="w-[18px] h-[18px]" /></TBtn>
//       <TBtn onClick={goPrev}   title="Previous"><ChevronLeft   className="w-[18px] h-[18px]" /></TBtn>

//       <div className="flex items-center gap-1 px-1">
//         <input
//           type="number" min={1} max={TOTAL_PAGES}
//           defaultValue={displayPage} key={displayPage}
//           onKeyDown={(e) => {
//             if (e.key !== 'Enter' || !bookRef.current) return;
//             const n = parseInt((e.target as HTMLInputElement).value, 10);
//             if (n >= 1 && n <= TOTAL_PAGES) bookRef.current.pageFlip().flip(n - 1);
//           }}
//           className="w-9 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-1 py-0.5 text-xs outline-none"
//         />
//         <span className="text-[#aec2cc] text-xs whitespace-nowrap">/ {TOTAL_PAGES}</span>
//       </div>

//       <TBtn onClick={goNext}  title="Next"><ChevronRight  className="w-[18px] h-[18px]" /></TBtn>
//       <TBtn onClick={goLast}  title="Last page"><ChevronsRight className="w-[18px] h-[18px]" /></TBtn>
//       <TBtn href={DOWNLOAD_URL} title="Download PDF"><Download className="w-[18px] h-[18px]" /></TBtn>
//       <TBtn
//         onClick={() => setZoom(z => clamp(z + 0.5, ZOOM_MIN, ZOOM_MAX))}
//         disabled={zoom >= ZOOM_MAX}
//         title="Zoom in (+)"
//       >
//         <ZoomIn className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={toggleFS} title={isFS ? 'Exit full screen' : 'Full screen'}>
//         {isFS ? <Minimize2 className="w-[18px] h-[18px]" /> : <Maximize2 className="w-[18px] h-[18px]" />}
//       </TBtn>
//     </div>
//   );

//   return (
//     /*
//       position:fixed inset-0 — sits on top of the site navbar/footer entirely.
//       The navbar/footer still render in the DOM but are invisible beneath this.
//       This avoids needing a separate Next.js layout file for the newsletter route.
//     */
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       <main
//         ref={mainRef}
//         className="flex-1 flex items-center justify-center px-2 sm:px-4 py-2 overflow-hidden"
//       >
//         {mounted && (
//           <div
//             ref={zoomContainerRef}
//             /*
//               On mobile: overflow-hidden clips the double spread so only the
//               focused page is visible. On desktop: overflow-hidden is still set
//               (on <main>) but the book is narrow enough that both pages show.

//               touchAction:'none' delivers ALL touch events to JS and suppresses
//               native browser scroll/pinch-zoom. React-pageflip's own listeners
//               still fire for 1-finger touches at zoom=1 (we don't stopPropagation
//               for those, only intercept 2-finger and zoomed-1-finger).
//             */
//             className="relative overflow-hidden"
//             style={{
//               /*
//                 Mobile: width:100% of the viewport so each page fills the screen.
//                 The scale wrapper inside is set to 200% so react-pageflip renders
//                 each page at viewport width, and the right page is naturally
//                 clipped by this container's overflow:hidden.

//                 Desktop: width:100% of <main> — same as before.
//               */
//               width: '100%',
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             {/*
//               Scale wrapper.
//               Mobile: width:200% so each page = container width. The right page
//               lives outside the overflow:hidden boundary until panned to.
//               Desktop: width:100% — normal stretch behaviour.

//               The pan transform shifts the book left/right to focus on the correct page.
//               Mobile left focus:  pan.x = 0          (left page fills container)
//               Mobile right focus: pan.x = -containerW (right page shifted into view)
//               Desktop:            pan.x = ±bookW/4   (centre a page in spread)
//             */}
//             <div
//               style={{
//                 width: isMobile ? '200%' : '100%',
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'left top',
//                 transition: isDragging.current ? 'none' : 'transform 0.25s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"
//                 minWidth={100}
//                 maxWidth={isMobile ? 99999 : 620}  // uncapped on mobile — fills the 200% wrapper
//                 minHeight={200}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.6}
//                 showCover={true}
//                 mobileScrollSupport={false}   // we handle all touch events ourselves
//                 drawShadow={true}
//                 flippingTime={650}
//                 useMouseEvents={true}
//                 swipeDistance={30}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             {/*
//               Overlay — transparent div covering the book.
//               pointer-events:none at zoom=1 → events fall through → react-pageflip flips.
//               pointer-events:auto when zoomed → captures mouse drag → react-pageflip
//               (a sibling, NOT a descendant) never receives the event.
//               Touch is handled entirely by the container's capture listeners above.
//             */}
//             <div
//               ref={overlayRef}
//               style={{
//                 position: 'absolute', inset: 0, zIndex: 10,
//                 pointerEvents: isZoomed ? 'auto' : 'none',
//                 cursor: isZoomed ? 'grab' : 'default',
//                 userSelect: 'none',
//               }}
//             />

//             {/* Reset zoom badge — z-20, above overlay, always tappable */}
//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ zIndex: 20 }}
//                 className="absolute bottom-3 left-1/2 -translate-x-1/2
//                   bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && toolbar}
//     </div>
//   );
// }

// /*
//   ── How to generate the page JPEGs ──────────────────────────────────────────

//   pip install pymupdf
//   python3 -c "
//   import fitz, os
//   doc = fitz.open('public/Assets/ufirmfinal.pdf')
//   out = 'public/Assets/newsletterjpegs'
//   os.makedirs(out, exist_ok=True)
//   for i, page in enumerate(doc, 1):
//       pix = page.get_pixmap(dpi=150)
//       pix.save(f'{out}/pg{i}.jpg')
//       print(f'pg{i}.jpg')
//   print('Done')
//   "

//   Commit the resulting folder. Each JPEG is ~150–300 KB vs the whole PDF
//   being loaded before any page is visible. Pages 1-6 load eagerly; the rest
//   are lazy-loaded by the browser as the user approaches them.
// */


























// works on phone with double leaf and focus, but pinch-zoom is very buggy and doesn't update the pan limits, and the zoomed-in pan experience isn't great. Desktop zoom+pan experience is good. Maybe revisit mobile pinch-zoom later if there's demand, but for now it's better than the old PDF viewer and we can ship it as-is.
// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import {
//   Download, Maximize2, Minimize2,
//   ZoomIn, ZoomOut,
//   ChevronLeft, ChevronRight,
//   ChevronsLeft, ChevronsRight,
// } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () => import('react-pageflip').then((m) => m.default as unknown as React.ComponentType<AnyProps>),
//   { ssr: false },
// );

// // ─── Config ───────────────────────────────────────────────────────────────────
// const TOTAL_PAGES  = 36;
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const IMG          = (n: number) => `/Assets/newsletterjpegs/pg${n}.jpg`;
// const MAX_BOOK_H   = 520;
// const ZOOM_MIN     = 1;
// const ZOOM_MAX     = 4;
// const MOBILE_BP    = 768; // px
// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// type FocusSide = 'left' | 'right' | 'center';

// // ─── Toolbar button ───────────────────────────────────────────────────────────
// function TBtn({ onClick, disabled = false, title, href, children }: {
//   onClick?: () => void; disabled?: boolean; title?: string;
//   href?: string; children: React.ReactNode;
// }) {
//   const cls =
//     'flex items-center justify-center w-9 h-9 rounded ' +
//     'text-[#aec2cc] hover:text-white hover:bg-[#1484bc]/25 ' +
//     'disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0';
//   if (href)
//     return <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>{children}</a>;
//   return <button onClick={onClick} disabled={disabled} title={title} className={cls}>{children}</button>;
// }

// // ─── FlipPage ─────────────────────────────────────────────────────────────────
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
//   <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
//     {/* eslint-disable-next-line @next/next/no-img-element */}
//     <img
//       src={IMG(pageNum)}
//       alt={`Page ${pageNum}`}
//       className="w-full h-full object-cover"
//       loading={pageNum <= 6 ? 'eager' : 'lazy'}
//       draggable={false}
//     />
//   </div>
// ));
// FlipPage.displayName = 'FlipPage';

// // ─── Main component ───────────────────────────────────────────────────────────
// export default function NewsletterViewer() {
//   const [mounted,  setMounted]  = useState(false);
//   const [curPage,  setCurPage]  = useState(0);
//   const [isFS,     setIsFS]     = useState(false);
//   const [bookH,    setBookH]    = useState(MAX_BOOK_H);
//   const [zoom,     setZoom]     = useState(1);
//   const [pan,      setPan]      = useState({ x: 0, y: 0 });
//   const [isMobile, setIsMobile] = useState(false);

//   // ── Stable refs (read by gesture handlers without re-subscribing) ─────────
//   const zoomRef        = useRef(1);
//   const panRef         = useRef({ x: 0, y: 0 });
//   const isMobileRef    = useRef(false);
//   const bookHRef       = useRef(MAX_BOOK_H);
//   const containerWRef  = useRef(0);   // clientWidth of zoomContainerRef
//   const focusSideRef   = useRef<FocusSide>('left');
//   const curPageRef     = useRef(0);
//   const prevPageRef    = useRef(0);

//   zoomRef.current      = zoom;
//   panRef.current       = pan;
//   isMobileRef.current  = isMobile;
//   bookHRef.current     = bookH;

//   const isZoomed = zoom > 1.01;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef          = useRef<any>(null);
//   const mainRef          = useRef<HTMLDivElement>(null);
//   const containerRef     = useRef<HTMLDivElement>(null);   // fullscreen target
//   const zoomContainerRef = useRef<HTMLDivElement>(null);   // touch / wheel target
//   const overlayRef       = useRef<HTMLDivElement>(null);   // desktop mouse-drag target

//   // ─────────────────────────────────────────────────────────────────────────
//   // Pan limits
//   //
//   // Mobile transform:  screen_x = x_wrapper * zoom + pan.x
//   //   Scale wrapper = 200% wide → each page = containerW.
//   //   Left page spans  [0,  W], right page spans [W, 2W].
//   //   At zoom=1: pan ∈ [-W, 0]  (0 = left page, -W = right page).
//   //   At zoom=z: can pan further to see all of the zoomed content.
//   //     xMin = W*(1 - 2z)   (right edge of right page at right of viewport)
//   //     xMax = 0
//   //     yMin = -(bookH*(z-1))
//   //     yMax = 0
//   //
//   // Desktop: symmetric ± limits growing with zoom.
//   // ─────────────────────────────────────────────────────────────────────────
//   const getPanLimits = useCallback((z: number) => {
//     if (isMobileRef.current) {
//       const W  = containerWRef.current;
//       const bH = bookHRef.current;
//       return {
//         xMin: W * (1 - 2 * z),
//         xMax: 0,
//         yMin: -(bH * (z - 1)),
//         yMax: 0,
//       };
//     }
//     const m = (z - 1) * 500;
//     return { xMin: -m, xMax: m, yMin: -(m * 0.8), yMax: m * 0.8 };
//   }, []);

//   const applyPan = useCallback((x: number, y: number, z: number) => {
//     const lims = getPanLimits(z);
//     const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
//     setPan(np);
//     panRef.current = np;
//     // On mobile, update focusSide based on which half the pan is closer to
//     if (isMobileRef.current && z <= 1.01) {
//       const W = containerWRef.current;
//       focusSideRef.current = np.x > -W / 2 ? 'left' : 'right';
//     }
//   }, [getPanLimits]);

//   // ─────────────────────────────────────────────────────────────────────────
//   // computePan — target pan position for a focus side at zoom = 1.
//   //
//   // Mobile: left=0, right=-W, center=-W/2 (cover page is single, centred).
//   // Desktop: nudge the spread by ¼ book width to centre one page.
//   // ─────────────────────────────────────────────────────────────────────────
//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     if (isMobileRef.current) {
//       const W = containerWRef.current;
//       if (side === 'right')  return { x: -W,     y: 0 };
//       if (side === 'center') return { x: -W / 2, y: 0 };
//       return { x: 0, y: 0 };
//     }
//     // Desktop
//     const spreadW = zoomContainerRef.current?.offsetWidth ?? 600;
//     const bookW   = Math.min(spreadW, 840);
//     const offset  = bookW / 4;
//     if (side === 'left')  return { x:  offset, y: 0 };
//     if (side === 'right') return { x: -offset, y: 0 };
//     return { x: 0, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return; // leave pan alone while zoomed
//     focusSideRef.current = side;
//     const p = computePan(side);
//     setPan(p);
//     panRef.current = p;
//   }, [computePan]);

//   // ─────────────────────────────────────────────────────────────────────────
//   // zoomTo — zoom to a target level while keeping the given pivot point
//   // (or viewport centre by default) fixed on screen.
//   //
//   // Math (transformOrigin = 'left top'):
//   //   screen_x = x_wrapper * zoom + pan.x
//   //   To keep pivot px fixed:  px = xp*z2 + pan2.x = xp*z1 + pan1.x
//   //   → pan2.x = pan1.x + xp*(z1-z2)
//   //   where xp = (px - pan1.x) / z1  (wrapper coord of pivot)
//   //   ⟹  pan2.x = pan1.x + (px - pan1.x)*(1 - z2/z1)
//   //             = px - (px - pan1.x)*z2/z1
//   // ─────────────────────────────────────────────────────────────────────────
//   const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
//     newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
//     const oldZ = zoomRef.current;
//     const W    = containerWRef.current;
//     const bH   = bookHRef.current;
//     const old  = panRef.current;
//     const px   = pivot?.x ?? W / 2;
//     const py   = pivot?.y ?? bH / 2;

//     if (newZ <= 1.01) {
//       setZoom(1);
//       zoomRef.current = 1;
//       const p = computePan(focusSideRef.current);
//       setPan(p);
//       panRef.current = p;
//       return;
//     }

//     const nx = px - (px - old.x) * newZ / oldZ;
//     const ny = py - (py - old.y) * newZ / oldZ;
//     const lims = getPanLimits(newZ);

//     setZoom(newZ);
//     zoomRef.current = newZ;
//     const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
//     setPan(np);
//     panRef.current = np;
//   }, [computePan, getPanLimits]);

//   const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

//   // ── Mount ─────────────────────────────────────────────────────────────────
//   useEffect(() => { setMounted(true); }, []);

//   // ── Measure container + mobile detection ──────────────────────────────────
//   useEffect(() => {
//     const el = zoomContainerRef.current;
//     if (!el) return;
//     const update = () => {
//       const mobile = window.innerWidth < MOBILE_BP;
//       setIsMobile(mobile);
//       isMobileRef.current = mobile;
//       containerWRef.current = el.clientWidth;
//       if (zoomRef.current <= 1.01) {
//         const p = computePan(focusSideRef.current);
//         setPan(p);
//         panRef.current = p;
//       }
//     };
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     update();
//     return () => ro.disconnect();
//   }, [computePan]);

//   // ── Book height ────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       const h   = Math.max(280, Math.min(el.clientHeight - pad, MAX_BOOK_H));
//       setBookH(h);
//       bookHRef.current = h;
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el);
//     calc();
//     return () => ro.disconnect();
//   }, []);

//   // ── Fullscreen ─────────────────────────────────────────────────────────────
//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   // ── URL hash restore ───────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   // ── handleFlip (fires at end of flip animation) ────────────────────────────
//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);
//     if (zoomRef.current <= 1.01) {
//       if (newPage === 0)       applyFocus('center');
//       else if (newPage > prev) applyFocus('left');
//       else                     applyFocus('right');
//     }
//   }, [applyFocus]);

//   // ─────────────────────────────────────────────────────────────────────────
//   // Navigation — focus alternation pattern:
//   //   Forward:  left → right → (flip) → left → right → …
//   //   Backward: right → left → (flip) → right → left → …
//   //   Cover:    any → flip immediately
//   // ─────────────────────────────────────────────────────────────────────────
//   const goNext = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'right') {
//       if (curPageRef.current < TOTAL_PAGES - 1)
//         bookRef.current?.pageFlip()?.flipNext();
//     } else {
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'left') {
//       if (curPageRef.current > 0)
//         bookRef.current?.pageFlip()?.flipPrev();
//     } else {
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
//   const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);

//   // ── Keyboard ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':       resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
//         case '-':           zoomTo(zoomRef.current - 0.5); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

//   // ─────────────────────────────────────────────────────────────────────────
//   // Gesture listeners — all in capture phase on zoomContainerRef.
//   //
//   // MOBILE strategy (no swipe-to-flip):
//   //   • 1 finger → pan (always, even at zoom=1 — drag shifts between pages)
//   //   • 2 fingers → pinch zoom
//   //   • double-tap → reset zoom
//   //   • Buttons flip pages.
//   //   All touch is intercepted (preventDefault + stopPropagation).
//   //   react-pageflip never receives touch events on mobile.
//   //
//   // DESKTOP strategy:
//   //   • 1 finger + zoom=1 → don't intercept → react-pageflip flips
//   //   • 1 finger + zoom>1 → intercept → pan
//   //   • 2 fingers → pinch zoom
//   //   • Scroll wheel → zoom (towards cursor)
//   //   • Mouse drag (overlay, zoom>1) → pan
//   //   • Mouse click (zoom=1) → react-pageflip flip (overlay pointer-events:none)
//   // ─────────────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const container = zoomContainerRef.current;
//     const overlay   = overlayRef.current;
//     if (!container || !overlay) return;

//     const g = {
//       pinching: false, pd0: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//     };

//     // ── Touch ──────────────────────────────────────────────────────────────
//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         // Pinch — always intercept on both mobile and desktop
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.pz0 = zoomRef.current;
//         return;
//       }

//       // Single finger
//       const mobile  = isMobileRef.current;
//       const zoomed  = zoomRef.current > 1.01;

//       if (mobile || zoomed) {
//         // Intercept: pan + double-tap
//         e.preventDefault(); e.stopPropagation();

//         const now = Date.now();
//         if (now - g.lastTap < 300) {
//           // Double-tap → reset zoom
//           g.lastTap = 0; g.panning = false;
//           setZoom(1); zoomRef.current = 1;
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//           return;
//         }
//         g.lastTap = now;
//         g.panning = true; g.pinching = false;
//         g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//         g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//       }
//       // Desktop + not zoomed → don't intercept → react-pageflip flips
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d  = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const newZ = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = newZ;
//         setZoom(newZ);
//         if (newZ <= 1.01) {
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//         }
//         return;
//       }

//       if (e.touches.length === 1) {
//         const mobile = isMobileRef.current;
//         const zoomed = zoomRef.current > 1.01;
//         if (!mobile && !zoomed) return; // desktop not-zoomed → let flipbook handle

//         e.preventDefault(); e.stopPropagation();

//         // Handle pinch→pan transition (second finger lifted during pinch)
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }

//         applyPan(
//           g.tpx0 + e.touches[0].clientX - g.tx0,
//           g.tpy0 + e.touches[0].clientY - g.ty0,
//           zoomRef.current,
//         );
//       }
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//       if (e.touches.length === 0) g.panning = false;
//     };

//     // ── Wheel: zoom towards cursor ─────────────────────────────────────────
//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const rect  = container.getBoundingClientRect();
//       const pivot = { x: e.clientX - rect.left, y: e.clientY - rect.top };
//       const d     = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
//       zoomTo(zoomRef.current - d / 480, pivot);
//     };

//     // ── Mouse drag (desktop only, via overlay when zoomed) ─────────────────
//     const onMD = (e: MouseEvent) => {
//       e.preventDefault(); g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onMM = (e: MouseEvent) => {
//       if (!g.md) return;
//       applyPan(g.px0 + e.clientX - g.mx0, g.py0 + e.clientY - g.my0, zoomRef.current);
//     };
//     const onMU = () => { g.md = false; };

//     container.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     container.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     container.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     container.addEventListener('wheel',      onWheel,      { capture: true, passive: false });
//     overlay.addEventListener('mousedown', onMD);
//     window.addEventListener('mousemove',  onMM);
//     window.addEventListener('mouseup',    onMU);

//     return () => {
//       container.removeEventListener('touchstart', onTouchStart, { capture: true });
//       container.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       container.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//       container.removeEventListener('wheel',      onWheel,      { capture: true });
//       overlay.removeEventListener('mousedown', onMD);
//       window.removeEventListener('mousemove',  onMM);
//       window.removeEventListener('mouseup',    onMU);
//     };
//   }, [applyPan, computePan, zoomTo]);

//   // ── Toolbar ────────────────────────────────────────────────────────────────
//   const displayPage = curPage + 1;

//   const toolbar = (
//     <div className="bg-[#1e3143] border-t border-[#1484bc]/15 px-2 py-1.5 flex items-center justify-center gap-0.5 flex-shrink-0 z-30">
//       <TBtn onClick={() => zoomTo(zoom - 0.5)} disabled={!isZoomed} title="Zoom out (−)">
//         <ZoomOut className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={goFirst} title="First page">
//         <ChevronsLeft className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={goPrev} title="Previous / focus left page">
//         <ChevronLeft className="w-[18px] h-[18px]" />
//       </TBtn>

//       <div className="flex items-center gap-1 px-1">
//         <input
//           type="number" min={1} max={TOTAL_PAGES}
//           defaultValue={displayPage} key={displayPage}
//           onKeyDown={(e) => {
//             if (e.key !== 'Enter' || !bookRef.current) return;
//             const n = parseInt((e.target as HTMLInputElement).value, 10);
//             if (n >= 1 && n <= TOTAL_PAGES) bookRef.current.pageFlip().flip(n - 1);
//           }}
//           className="w-9 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-1 py-0.5 text-xs outline-none"
//         />
//         <span className="text-[#aec2cc] text-xs whitespace-nowrap">/ {TOTAL_PAGES}</span>
//       </div>

//       <TBtn onClick={goNext} title="Next / focus right page">
//         <ChevronRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={goLast} title="Last page">
//         <ChevronsRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn href={DOWNLOAD_URL} title="Download PDF">
//         <Download className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={() => zoomTo(zoom + 0.5)} disabled={zoom >= ZOOM_MAX} title="Zoom in (+)">
//         <ZoomIn className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={toggleFS} title={isFS ? 'Exit full screen' : 'Full screen'}>
//         {isFS
//           ? <Minimize2 className="w-[18px] h-[18px]" />
//           : <Maximize2 className="w-[18px] h-[18px]" />
//         }
//       </TBtn>
//     </div>
//   );

//   return (
//     /*
//       fixed inset-0 z-40 — sits on top of the site navbar and footer entirely.
//       They still render in the DOM but are invisible beneath this layer.
//     */
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       <main
//         ref={mainRef}
//        className="flex-1 flex items-center justify-center overflow-hidden"
//         style={{
//           // Mobile: no padding so page fills edge-to-edge
//           // Desktop: horizontal padding for the dark side gutters like enviro
//           padding: isMobile ? '4px 0' : '8px 24px',
//         }}
//       >
//         {mounted && (
//           /*
//             Zoom container.
//             Mobile:  width 100%, overflow hidden — clips the 200% scale wrapper
//                      so only one page is visible at a time.
//             Desktop: max-width 900px, centred — gives dark gutters on wide monitors.
//                      overflow visible — both pages of the spread are shown.
//             touchAction:'none' — all touch events delivered to JS, no native
//                      scroll/pinch-zoom from the browser.
//           */
//           <div
//             ref={zoomContainerRef}
//             className={isMobile ? 'relative w-full overflow-visible' : 'relative w-full overflow-visible mx-auto'}
//             style={{
//               maxWidth: isMobile ? undefined : '900px',
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             {/*
//               Scale + translate wrapper.

//               Mobile:   width 200% so react-pageflip renders each page at full
//                         container width. Right page naturally sits outside the
//                         overflow:hidden boundary. pan.x = 0 → left page, -W → right.

//               Desktop:  width 100% — normal stretch behaviour.

//               transformOrigin 'left top' makes the math straightforward:
//                 screen_x = x_wrapper * zoom + pan.x
//               The zoomTo() function uses this equation to keep the pivot fixed.

//               Transition is quick (0.15s) for button-driven zoom; during touch
//               drag we want it near-instant so we use 0ms.
//             */}
//             <div
//               style={{
//                width: '100%',
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'left top',
//                 transition: 'transform 0.15s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display={isMobile ? "single" : "double"}
//                 minWidth={100}
//                 /*
//                   Mobile:   uncapped — fills the 200% wrapper fully so each page = container width.
//                   Desktop:  420px per page → 840px spread max, centred in 900px container
//                             giving ~30px dark margin each side (matching enviro proportions).
//                 */
//                maxWidth={isMobile ? 1000 : 420}
//                 minHeight={200}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.5}
//                 showCover={true}
//                 /*
//                   Mobile:  mobileScrollSupport=false + useMouseEvents=false.
//                            We intercept ALL touch in capture phase. react-pageflip
//                            never sees a touch event on mobile. Buttons flip pages.
//                   Desktop: mobileScrollSupport=false (we handle wheel ourselves).
//                            useMouseEvents=true allows clicking page corners to flip.
//                 */
//                 mobileScrollSupport={false}
//                 useMouseEvents={!isMobile}
//                 drawShadow={true}
//                 flippingTime={650}
//                 swipeDistance={isMobile ? 99999 : 30}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             {/*
//               Overlay — transparent div.
//               Mobile:   pointer-events:none always. Touch is handled by the
//                         container's capture listeners.
//               Desktop:  pointer-events:none when not zoomed → clicks fall through
//                         to react-pageflip for flipping.
//                         pointer-events:auto when zoomed → captures mouse drag.
//             */}
//             <div
//               ref={overlayRef}
//               style={{
//                 position: 'absolute', inset: 0, zIndex: 10,
//                 pointerEvents: (!isMobile && isZoomed) ? 'auto' : 'none',
//                 cursor: isZoomed ? 'grab' : 'default',
//                 userSelect: 'none',
//               }}
//             />

//             {/* Reset badge — z-20, above overlay, always tappable */}
//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ zIndex: 20 }}
//                 className="absolute left-1/2 -translate-x-1/2
//                   bg-[#0d1f2e]/5 backdrop-blur border border-[#1484bc]/0
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none text-black"
//               >
//                 {zoom.toFixed(1)}×
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && toolbar}
//     </div>
//   );
// }
























// this one works but the mobile version is single page only
// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import {
//   Download, Maximize2, Minimize2,
//   ZoomIn, ZoomOut,
//   ChevronLeft, ChevronRight,
//   ChevronsLeft, ChevronsRight,
// } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () => import('react-pageflip').then((m) => m.default as unknown as React.ComponentType<AnyProps>),
//   { ssr: false },
// );

// // ─── Config ───────────────────────────────────────────────────────────────────
// const TOTAL_PAGES  = 36;
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const IMG          = (n: number) => `/Assets/newsletterjpegs/pg${n}.jpg`;
// const MAX_BOOK_H   = 520;
// const ZOOM_MIN     = 1;
// const ZOOM_MAX     = 4;
// const MOBILE_BP    = 768;
// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// type FocusSide = 'left' | 'right' | 'center';

// // ─── Shared: Toolbar button ───────────────────────────────────────────────────
// function TBtn({ onClick, disabled = false, title, href, children }: {
//   onClick?: () => void; disabled?: boolean; title?: string;
//   href?: string; children: React.ReactNode;
// }) {
//   const cls =
//     'flex items-center justify-center w-9 h-9 rounded ' +
//     'text-[#aec2cc] hover:text-white hover:bg-[#1484bc]/25 ' +
//     'disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0';
//   if (href)
//     return <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>{children}</a>;
//   return <button onClick={onClick} disabled={disabled} title={title} className={cls}>{children}</button>;
// }

// // ─── Shared: Toolbar ──────────────────────────────────────────────────────────
// function Toolbar({
//   curPage, zoom, isZoomed, isFS,
//   onZoomOut, onZoomIn, onFirst, onPrev, onNext, onLast, onToggleFS, onJump,
// }: {
//   curPage: number; zoom: number; isZoomed: boolean; isFS: boolean;
//   onZoomOut: () => void; onZoomIn: () => void;
//   onFirst: () => void; onPrev: () => void; onNext: () => void; onLast: () => void;
//   onToggleFS: () => void; onJump: (n: number) => void;
// }) {
//   const displayPage = curPage + 1;
//   return (
//     <div className="bg-[#1e3143] border-t border-[#1484bc]/15 px-2 py-1.5 flex items-center justify-center gap-0.5 flex-shrink-0 z-30">
//       <TBtn onClick={onZoomOut} disabled={!isZoomed} title="Zoom out (−)">
//         <ZoomOut className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onFirst} title="First page">
//         <ChevronsLeft className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onPrev} title="Previous">
//         <ChevronLeft className="w-[18px] h-[18px]" />
//       </TBtn>
//       <div className="flex items-center gap-1 px-1">
//         <input
//           type="number" min={1} max={TOTAL_PAGES}
//           defaultValue={displayPage} key={displayPage}
//           onKeyDown={(e) => {
//             if (e.key !== 'Enter') return;
//             const n = parseInt((e.target as HTMLInputElement).value, 10);
//             if (n >= 1 && n <= TOTAL_PAGES) onJump(n - 1);
//           }}
//           className="w-9 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-1 py-0.5 text-xs outline-none"
//         />
//         <span className="text-[#aec2cc] text-xs whitespace-nowrap">/ {TOTAL_PAGES}</span>
//       </div>
//       <TBtn onClick={onNext} title="Next">
//         <ChevronRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onLast} title="Last page">
//         <ChevronsRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn href={DOWNLOAD_URL} title="Download PDF">
//         <Download className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onZoomIn} disabled={zoom >= ZOOM_MAX} title="Zoom in (+)">
//         <ZoomIn className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onToggleFS} title={isFS ? 'Exit full screen' : 'Full screen'}>
//         {isFS ? <Minimize2 className="w-[18px] h-[18px]" /> : <Maximize2 className="w-[18px] h-[18px]" />}
//       </TBtn>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // MOBILE VIEWER
// // No react-pageflip. Full-viewport image with custom pinch-zoom + pan.
// // Buttons navigate pages. All gesture logic is self-contained.
// // ═══════════════════════════════════════════════════════════════════════════════
// function MobileViewer() {
//   const [mounted,  setMounted]  = useState(false);
//   const [curPage,  setCurPage]  = useState(0);
//   const [zoom,     setZoom]     = useState(1);
//   const [pan,      setPan]      = useState({ x: 0, y: 0 });
//   const [isFS,     setIsFS]     = useState(false);

//   const zoomRef      = useRef(1);
//   const panRef       = useRef({ x: 0, y: 0 });
//   const curPageRef   = useRef(0);
//   const containerRef = useRef<HTMLDivElement>(null); // fullscreen target
//   const viewportRef  = useRef<HTMLDivElement>(null); // touch target + size ref

//   const isZoomed = zoom > 1.01;

//   useEffect(() => { setMounted(true); }, []);

//   // ── URL hash restore ────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES) {
//       setCurPage(n - 1);
//       curPageRef.current = n - 1;
//     }
//   }, [mounted]);

//   // ── Zoom reset ──────────────────────────────────────────────────────────────
//   const resetZoom = useCallback(() => {
//     setZoom(1); zoomRef.current = 1;
//     setPan({ x: 0, y: 0 }); panRef.current = { x: 0, y: 0 };
//   }, []);

//   // ── Pan with limits: at zoom=z, content grows z× so pan is bounded to
//   //    half the overflow in each axis to keep content inside viewport. ─────────
//   const applyPan = useCallback((x: number, y: number, z: number) => {
//     const el = viewportRef.current;
//     if (!el) return;
//     const xLim = (el.clientWidth  * (z - 1)) / 2;
//     const yLim = (el.clientHeight * (z - 1)) / 2;
//     const np = { x: clamp(x, -xLim, xLim), y: clamp(y, -yLim, yLim) };
//     setPan(np); panRef.current = np;
//   }, []);

//   const zoomTo = useCallback((newZ: number) => {
//     newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
//     setZoom(newZ); zoomRef.current = newZ;
//     if (newZ <= 1.01) { setPan({ x: 0, y: 0 }); panRef.current = { x: 0, y: 0 }; }
//   }, []);

//   // ── Navigate: always resets zoom when changing page ─────────────────────────
//   const goTo = useCallback((n: number) => {
//     const target = clamp(n, 0, TOTAL_PAGES - 1);
//     setCurPage(target); curPageRef.current = target;
//     resetZoom();
//     window.history.replaceState(null, '', `#page/${target + 1}`);
//   }, [resetZoom]);

//   // ── Fullscreen ──────────────────────────────────────────────────────────────
//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   // ── Touch gestures ──────────────────────────────────────────────────────────
//   // 1 finger → pan (only moves content when zoomed, no-op at zoom=1)
//   // 2 fingers → pinch zoom
//   // double-tap → reset zoom
//   // All touch is fully intercepted — no native scroll, no react-pageflip involved.
//   useEffect(() => {
//     const el = viewportRef.current;
//     if (!el) return;

//     const g = {
//       pinching: false, pd0: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, px0: 0, py0: 0,
//       lastTap:  0,
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.pz0 = zoomRef.current;
//         return;
//       }
//       e.preventDefault(); e.stopPropagation();
//       const now = Date.now();
//       if (now - g.lastTap < 300) {
//         // Double-tap → reset zoom
//         g.lastTap = 0; g.panning = false;
//         setZoom(1); zoomRef.current = 1;
//         setPan({ x: 0, y: 0 }); panRef.current = { x: 0, y: 0 };
//         return;
//       }
//       g.lastTap = now;
//       g.panning = true; g.pinching = false;
//       g.tx0 = e.touches[0].clientX; g.ty0 = e.touches[0].clientY;
//       g.px0 = panRef.current.x;     g.py0 = panRef.current.y;
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       e.preventDefault(); e.stopPropagation();

//       if (g.pinching && e.touches.length >= 2) {
//         const d   = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const newZ = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//         setZoom(newZ); zoomRef.current = newZ;
//         if (newZ <= 1.01) { setPan({ x: 0, y: 0 }); panRef.current = { x: 0, y: 0 }; }
//         return;
//       }

//       if (e.touches.length === 1) {
//         // Handle pinch→pan transition (second finger lifted during pinch)
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0 = e.touches[0].clientX; g.ty0 = e.touches[0].clientY;
//           g.px0 = panRef.current.x;     g.py0 = panRef.current.y;
//         }
//         applyPan(
//           g.px0 + e.touches[0].clientX - g.tx0,
//           g.py0 + e.touches[0].clientY - g.ty0,
//           zoomRef.current,
//         );
//       }
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//       if (e.touches.length === 0) g.panning = false;
//     };

//     el.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     el.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     el.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     return () => {
//       el.removeEventListener('touchstart', onTouchStart, { capture: true });
//       el.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       el.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//     };
//   }, [applyPan]);

//   // ── Keyboard (e.g. Bluetooth keyboard paired with phone) ────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'ArrowRight': case 'PageDown': goTo(curPageRef.current + 1); break;
//         case 'ArrowLeft':  case 'PageUp':   goTo(curPageRef.current - 1); break;
//         case 'Escape':       resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
//         case '-':            zoomTo(zoomRef.current - 0.5); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goTo, resetZoom, toggleFS, zoomTo]);

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       {/* Viewport: fills all space above toolbar */}
//       <div
//         ref={viewportRef}
//         className="flex-1 relative overflow-hidden"
//         style={{ touchAction: 'none' }}
//       >
//         {/*
//           Transform wrapper: scale + pan at center origin.
//           translate() args divided by zoom so they are in pre-scale (wrapper)
//           coords — this keeps applyPan's viewport-space limits correct.
//         */}
//         <div
//           style={{
//             position: 'absolute',
//             inset: 0,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//             transformOrigin: 'center center',
//             transition: 'transform 0.12s ease-out',
//             willChange: 'transform',
//           }}
//         >
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img
//             src={IMG(curPage + 1)}
//             alt={`Page ${curPage + 1}`}
//             style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
//             loading="eager"
//             draggable={false}
//           />
//         </div>

//         {isZoomed && (
//           <button
//             onClick={resetZoom}
//             style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
//             className="bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40 text-[#aec2cc] hover:text-white hover:border-[#1484bc] text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//           >
//             {zoom.toFixed(1)}× — tap to reset
//           </button>
//         )}
//       </div>

//       {mounted && (
//         <Toolbar
//           curPage={curPage}
//           zoom={zoom}
//           isZoomed={isZoomed}
//           isFS={isFS}
//           onZoomOut={() => zoomTo(zoom - 0.5)}
//           onZoomIn={() => zoomTo(zoom + 0.5)}
//           onFirst={() => goTo(0)}
//           onPrev={() => goTo(curPage - 1)}
//           onNext={() => goTo(curPage + 1)}
//           onLast={() => goTo(TOTAL_PAGES - 1)}
//           onToggleFS={toggleFS}
//           onJump={goTo}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // DESKTOP VIEWER
// // Original react-pageflip double-spread with all focus/gesture logic preserved
// // exactly. No mobile branches remain — isMobile is gone entirely.
// // ═══════════════════════════════════════════════════════════════════════════════

// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
//   <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
//     {/* eslint-disable-next-line @next/next/no-img-element */}
//     <img
//       src={IMG(pageNum)}
//       alt={`Page ${pageNum}`}
//       className="w-full h-full object-cover"
//       loading={pageNum <= 6 ? 'eager' : 'lazy'}
//       draggable={false}
//     />
//   </div>
// ));
// FlipPage.displayName = 'FlipPage';

// function DesktopViewer() {
//   const [mounted,  setMounted]  = useState(false);
//   const [curPage,  setCurPage]  = useState(0);
//   const [isFS,     setIsFS]     = useState(false);
//   const [bookH,    setBookH]    = useState(MAX_BOOK_H);
//   const [zoom,     setZoom]     = useState(1);
//   const [pan,      setPan]      = useState({ x: 0, y: 0 });

//   const zoomRef        = useRef(1);
//   const panRef         = useRef({ x: 0, y: 0 });
//   const bookHRef       = useRef(MAX_BOOK_H);
//   const containerWRef  = useRef(0);
//   const focusSideRef   = useRef<FocusSide>('left');
//   const curPageRef     = useRef(0);
//   const prevPageRef    = useRef(0);

//   zoomRef.current  = zoom;
//   panRef.current   = pan;
//   bookHRef.current = bookH;

//   const isZoomed = zoom > 1.01;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef          = useRef<any>(null);
//   const mainRef          = useRef<HTMLDivElement>(null);
//   const containerRef     = useRef<HTMLDivElement>(null);
//   const zoomContainerRef = useRef<HTMLDivElement>(null);
//   const overlayRef       = useRef<HTMLDivElement>(null);

//   // ── Pan limits (symmetric ± growing with zoom) ───────────────────────────────
//   const getPanLimits = useCallback((z: number) => {
//     const m = (z - 1) * 500;
//     return { xMin: -m, xMax: m, yMin: -(m * 0.8), yMax: m * 0.8 };
//   }, []);

//   const applyPan = useCallback((x: number, y: number, z: number) => {
//     const lims = getPanLimits(z);
//     const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [getPanLimits]);

//   // ── computePan: nudges spread by ¼ book width to centre the focused page ─────
//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     const spreadW = zoomContainerRef.current?.offsetWidth ?? 600;
//     const bookW   = Math.min(spreadW, 840);
//     const offset  = bookW / 4;
//     if (side === 'left')  return { x:  offset, y: 0 };
//     if (side === 'right') return { x: -offset, y: 0 };
//     return { x: 0, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return;
//     focusSideRef.current = side;
//     const p = computePan(side);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   // ── zoomTo: keeps pivot point fixed on screen ────────────────────────────────
//   // Math (transformOrigin = 'left top'):
//   //   screen_x = x_wrapper * zoom + pan.x
//   //   pan2.x = px - (px - pan1.x) * z2 / z1
//   const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
//     newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
//     const oldZ = zoomRef.current;
//     const W    = containerWRef.current;
//     const bH   = bookHRef.current;
//     const old  = panRef.current;
//     const px   = pivot?.x ?? W / 2;
//     const py   = pivot?.y ?? bH / 2;

//     if (newZ <= 1.01) {
//       setZoom(1); zoomRef.current = 1;
//       const p = computePan(focusSideRef.current);
//       setPan(p); panRef.current = p;
//       return;
//     }

//     const nx = px - (px - old.x) * newZ / oldZ;
//     const ny = py - (py - old.y) * newZ / oldZ;
//     const lims = getPanLimits(newZ);

//     setZoom(newZ); zoomRef.current = newZ;
//     const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [computePan, getPanLimits]);

//   const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

//   useEffect(() => { setMounted(true); }, []);

//   // ── Measure container width ──────────────────────────────────────────────────
//   useEffect(() => {
//     const el = zoomContainerRef.current;
//     if (!el) return;
//     const update = () => {
//       containerWRef.current = el.clientWidth;
//       if (zoomRef.current <= 1.01) {
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//       }
//     };
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     update();
//     return () => ro.disconnect();
//   }, [computePan]);

//   // ── Book height ──────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       const h   = Math.max(280, Math.min(el.clientHeight - pad, MAX_BOOK_H));
//       setBookH(h); bookHRef.current = h;
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el);
//     calc();
//     return () => ro.disconnect();
//   }, []);

//   // ── Fullscreen ───────────────────────────────────────────────────────────────
//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   // ── URL hash restore ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   // ── handleFlip ───────────────────────────────────────────────────────────────
//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);
//     if (zoomRef.current <= 1.01) {
//       if (newPage === 0)       applyFocus('center');
//       else if (newPage > prev) applyFocus('left');
//       else                     applyFocus('right');
//     }
//   }, [applyFocus]);

//   // ── Navigation: focus alternation pattern ────────────────────────────────────
//   // Forward:  left → right → (flip) → left → right → …
//   // Backward: right → left → (flip) → right → left → …
//   // Cover:    flip immediately (single page, no side to focus)
//   const goNext = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'right') {
//       if (curPageRef.current < TOTAL_PAGES - 1)
//         bookRef.current?.pageFlip()?.flipNext();
//     } else {
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'left') {
//       if (curPageRef.current > 0)
//         bookRef.current?.pageFlip()?.flipPrev();
//     } else {
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
//   const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);
//   const goJump  = useCallback((n: number) => { bookRef.current?.pageFlip()?.flip(n); }, []);

//   // ── Keyboard ─────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':       resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
//         case '-':           zoomTo(zoomRef.current - 0.5); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

//   // ── Gesture listeners ─────────────────────────────────────────────────────────
//   // zoom=1:  1-finger touch not intercepted → react-pageflip handles corner clicks
//   // zoom>1:  1-finger touch intercepted → pan
//   // always:  2-finger → pinch zoom
//   // wheel:   zoom towards cursor
//   // overlay: mouse drag when zoomed
//   useEffect(() => {
//     const container = zoomContainerRef.current;
//     const overlay   = overlayRef.current;
//     if (!container || !overlay) return;

//     const g = {
//       pinching: false, pd0: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.pz0 = zoomRef.current;
//         return;
//       }
//       const zoomed = zoomRef.current > 1.01;
//       if (zoomed) {
//         e.preventDefault(); e.stopPropagation();
//         const now = Date.now();
//         if (now - g.lastTap < 300) {
//           g.lastTap = 0; g.panning = false;
//           setZoom(1); zoomRef.current = 1;
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//           return;
//         }
//         g.lastTap = now;
//         g.panning = true; g.pinching = false;
//         g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//         g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//       }
//       // not zoomed: don't intercept → react-pageflip receives the event
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d  = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const newZ = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = newZ; setZoom(newZ);
//         if (newZ <= 1.01) {
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//         }
//         return;
//       }
//       if (e.touches.length === 1) {
//         const zoomed = zoomRef.current > 1.01;
//         if (!zoomed) return;
//         e.preventDefault(); e.stopPropagation();
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//         applyPan(
//           g.tpx0 + e.touches[0].clientX - g.tx0,
//           g.tpy0 + e.touches[0].clientY - g.ty0,
//           zoomRef.current,
//         );
//       }
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//       if (e.touches.length === 0) g.panning = false;
//     };

//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const rect  = container.getBoundingClientRect();
//       const pivot = { x: e.clientX - rect.left, y: e.clientY - rect.top };
//       const d     = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
//       zoomTo(zoomRef.current - d / 480, pivot);
//     };

//     const onMD = (e: MouseEvent) => {
//       e.preventDefault(); g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onMM = (e: MouseEvent) => {
//       if (!g.md) return;
//       applyPan(g.px0 + e.clientX - g.mx0, g.py0 + e.clientY - g.my0, zoomRef.current);
//     };
//     const onMU = () => { g.md = false; };

//     container.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     container.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     container.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     container.addEventListener('wheel',      onWheel,      { capture: true, passive: false });
//     overlay.addEventListener('mousedown', onMD);
//     window.addEventListener('mousemove',  onMM);
//     window.addEventListener('mouseup',    onMU);

//     return () => {
//       container.removeEventListener('touchstart', onTouchStart, { capture: true });
//       container.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       container.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//       container.removeEventListener('wheel',      onWheel,      { capture: true });
//       overlay.removeEventListener('mousedown', onMD);
//       window.removeEventListener('mousemove',  onMM);
//       window.removeEventListener('mouseup',    onMU);
//     };
//   }, [applyPan, computePan, zoomTo]);

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       <main
//         ref={mainRef}
//         className="flex-1 flex items-center justify-center overflow-hidden"
//         style={{ padding: '8px 24px' }}
//       >
//         {mounted && (
//           <div
//             ref={zoomContainerRef}
//             className="relative w-full overflow-visible mx-auto"
//             style={{
//               maxWidth: '900px',
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             <div
//               style={{
//                 width: '100%',
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'left top',
//                 transition: 'transform 0.15s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"
//                 minWidth={100}
//                 maxWidth={420}
//                 minHeight={200}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.5}
//                 showCover={true}
//                 mobileScrollSupport={false}
//                 useMouseEvents={true}
//                 drawShadow={true}
//                 flippingTime={650}
//                 swipeDistance={30}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             {/*
//               Overlay:
//               - pointer-events:none at zoom=1 → clicks reach react-pageflip for
//                 corner-click flipping (individual leaf focus)
//               - pointer-events:auto when zoomed → captures mouse drag for pan
//             */}
//             <div
//               ref={overlayRef}
//               style={{
//                 position: 'absolute', inset: 0, zIndex: 10,
//                 pointerEvents: isZoomed ? 'auto' : 'none',
//                 cursor: isZoomed ? 'grab' : 'default',
//                 userSelect: 'none',
//               }}
//             />

//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ zIndex: 20 }}
//                 className="absolute bottom-3 left-1/2 -translate-x-1/2
//                   bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && (
//         <Toolbar
//           curPage={curPage}
//           zoom={zoom}
//           isZoomed={isZoomed}
//           isFS={isFS}
//           onZoomOut={() => zoomTo(zoom - 0.5)}
//           onZoomIn={() => zoomTo(zoom + 0.5)}
//           onFirst={goFirst}
//           onPrev={goPrev}
//           onNext={goNext}
//           onLast={goLast}
//           onToggleFS={toggleFS}
//           onJump={goJump}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ROOT
// // Detects mobile/desktop after mount and renders the correct viewer.
// // isMobile=null until useEffect fires → renders null to avoid hydration mismatch.
// // Both viewers use fixed inset-0 → zero layout shift on reveal.
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function NewsletterViewer() {
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
//     check();
//     window.addEventListener('resize', check);
//     return () => window.removeEventListener('resize', check);
//   }, []);

//   // null = not yet mounted; render nothing to prevent hydration mismatch
//   if (isMobile === null) return null;

//   return isMobile ? <MobileViewer /> : <DesktopViewer />;
// }















// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import {
//   Download, Maximize2, Minimize2,
//   ZoomIn, ZoomOut,
//   ChevronLeft, ChevronRight,
//   ChevronsLeft, ChevronsRight,
// } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () => import('react-pageflip').then((m) => m.default as unknown as React.ComponentType<AnyProps>),
//   { ssr: false },
// );

// // ─── Config ───────────────────────────────────────────────────────────────────
// const TOTAL_PAGES  = 36;
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const IMG          = (n: number) => `/Assets/newsletterjpegs/pg${n}.jpg`;
// const MAX_BOOK_H   = 520;
// const ZOOM_MIN     = 1;
// const ZOOM_MAX     = 4;
// const MOBILE_BP    = 768;

// // ─── FIX #2 (page size): increase WRAPPER_MULT to make pages larger.
// //   1.5 → each page = 75% of viewport width  (current)
// //   1.8 → each page = 90% of viewport width  (recommended starting point)
// //   2.0 → each page = 100% of viewport width (no peek of other page)
// // Nothing clips because maxHeight fills available height and maxWidth is uncapped.
// const WRAPPER_MULT = 1.8;

// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// type FocusSide = 'left' | 'right' | 'center';

// // ─── Shared: Toolbar button ───────────────────────────────────────────────────
// function TBtn({ onClick, disabled = false, title, href, children }: {
//   onClick?: () => void; disabled?: boolean; title?: string;
//   href?: string; children: React.ReactNode;
// }) {
//   const cls =
//     'flex items-center justify-center w-9 h-9 rounded ' +
//     'text-[#aec2cc] hover:text-white hover:bg-[#1484bc]/25 ' +
//     'disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0';
//   if (href)
//     return <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>{children}</a>;
//   return <button onClick={onClick} disabled={disabled} title={title} className={cls}>{children}</button>;
// }

// // ─── Shared: Toolbar ──────────────────────────────────────────────────────────
// function Toolbar({
//   curPage, zoom, isZoomed, isFS,
//   onZoomOut, onZoomIn, onFirst, onPrev, onNext, onLast, onToggleFS, onJump,
// }: {
//   curPage: number; zoom: number; isZoomed: boolean; isFS: boolean;
//   onZoomOut: () => void; onZoomIn: () => void;
//   onFirst: () => void; onPrev: () => void; onNext: () => void; onLast: () => void;
//   onToggleFS: () => void; onJump: (n: number) => void;
// }) {
//   const displayPage = curPage + 1;
//   return (
//     <div className="bg-[#1e3143] border-t border-[#1484bc]/15 px-2 py-1.5 flex items-center justify-center gap-0.5 flex-shrink-0 z-30">
//       <TBtn onClick={onZoomOut} disabled={!isZoomed} title="Zoom out (−)">
//         <ZoomOut className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onFirst} title="First page">
//         <ChevronsLeft className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onPrev} title="Previous">
//         <ChevronLeft className="w-[18px] h-[18px]" />
//       </TBtn>
//       <div className="flex items-center gap-1 px-1">
//         <input
//           type="number" min={1} max={TOTAL_PAGES}
//           defaultValue={displayPage} key={displayPage}
//           onKeyDown={(e) => {
//             if (e.key !== 'Enter') return;
//             const n = parseInt((e.target as HTMLInputElement).value, 10);
//             if (n >= 1 && n <= TOTAL_PAGES) onJump(n - 1);
//           }}
//           className="w-9 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-1 py-0.5 text-xs outline-none"
//         />
//         <span className="text-[#aec2cc] text-xs whitespace-nowrap">/ {TOTAL_PAGES}</span>
//       </div>
//       <TBtn onClick={onNext} title="Next">
//         <ChevronRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onLast} title="Last page">
//         <ChevronsRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn href={DOWNLOAD_URL} title="Download PDF">
//         <Download className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onZoomIn} disabled={zoom >= ZOOM_MAX} title="Zoom in (+)">
//         <ZoomIn className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onToggleFS} title={isFS ? 'Exit full screen' : 'Full screen'}>
//         {isFS ? <Minimize2 className="w-[18px] h-[18px]" /> : <Maximize2 className="w-[18px] h-[18px]" />}
//       </TBtn>
//     </div>
//   );
// }

// // ─── Shared: FlipPage ─────────────────────────────────────────────────────────
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
//   <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
//     {/* eslint-disable-next-line @next/next/no-img-element */}
//     <img
//       src={IMG(pageNum)}
//       alt={`Page ${pageNum}`}
//       className="w-full h-full object-cover"
//       loading={pageNum <= 6 ? 'eager' : 'lazy'}
//       draggable={false}
//     />
//   </div>
// ));
// FlipPage.displayName = 'FlipPage';

// // ═══════════════════════════════════════════════════════════════════════════════
// // MOBILE VIEWER
// // ═══════════════════════════════════════════════════════════════════════════════
// function MobileViewer() {
//   const [mounted,   setMounted]   = useState(false);
//   const [curPage,   setCurPage]   = useState(0);
//   const [bookH,     setBookH]     = useState(520);
//   const [zoom,      setZoom]      = useState(1);
//   const [pan,       setPan]       = useState({ x: 0, y: 0 });
//   const [isFS,      setIsFS]      = useState(false);

//   // FIX #1: cover page defaults to right focus, not center.
//   const [focusSide, setFocusSide] = useState<FocusSide>('right');

//   const zoomRef       = useRef(1);
//   const panRef        = useRef({ x: 0, y: 0 });
//   const bookHRef      = useRef(520);
//   const containerWRef = useRef(0);
//   // FIX #1: ref also initialised to 'right'
//   const focusSideRef  = useRef<FocusSide>('right');
//   const curPageRef    = useRef(0);
//   const prevPageRef   = useRef(0);

//   zoomRef.current  = zoom;
//   panRef.current   = pan;
//   bookHRef.current = bookH;

//   const isZoomed = zoom > 1.01;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef        = useRef<any>(null);
//   const containerRef   = useRef<HTMLDivElement>(null);
//   const mainRef        = useRef<HTMLDivElement>(null);
//   const clipRef        = useRef<HTMLDivElement>(null);
//   const bookWrapperRef = useRef<HTMLDivElement>(null);

//   // ── Pan limits ───────────────────────────────────────────────────────────────
//   // ±0.8 * W * z is wide enough to always include both focus positions:
//   //   left  focus ≈ +0.1W  (W/2 - pageW/2  where pageW = WRAPPER_MULT*W/2)
//   //   right focus ≈ -0.4W  (W/2 - 3*pageW/2)
//   // at WRAPPER_MULT = 1.8:
//   //   pageW = 0.9W
//   //   left  = W/2 - 0.45W =  0.05W
//   //   right = W/2 - 1.35W = -0.85W  ← needs limits wider than 0.8W
//   // So use 1.0 * W * z to be safe for any reasonable WRAPPER_MULT.
//   const getPanLimits = useCallback((z: number) => {
//     const W  = containerWRef.current;
//     const bH = bookHRef.current;
//     return {
//       xMin: -W * z,
//       xMax:  W * z,
//       yMin: -(bH * (z - 1)),
//       yMax: 0,
//     };
//   }, []);

//   const applyPan = useCallback((x: number, y: number, z: number) => {
//     const lims = getPanLimits(z);
//     const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [getPanLimits]);

//   // ── computePan ───────────────────────────────────────────────────────────────
//   // Returns pan.x that centres the focused page in the clip viewport at zoom=1.
//   // pageW = WRAPPER_MULT * clipW / 2
//   //
//   // screen_x  = wrapper_x * 1 + pan.x   (transformOrigin left top, zoom=1)
//   // centre left  page (wrapper [0, pageW]):           pan.x = W/2 - pageW/2
//   // centre right page (wrapper [pageW, 2*pageW]):     pan.x = W/2 - 3*pageW/2
//   // centre full spread:                               pan.x = -(WRAPPER_MULT-1)*W/2
//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     const W     = containerWRef.current;
//     const pageW = (WRAPPER_MULT * W) / 2;
//     if (side === 'left')
//       return { x: W / 2 - pageW / 2,           y: 0 };
//     if (side === 'right')
//       return { x: W / 2 - pageW - pageW / 2,   y: 0 };
//     return   { x: -(W * (WRAPPER_MULT - 1)) / 2, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return;
//     focusSideRef.current = side;
//     setFocusSide(side);
//     const p = computePan(side);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   // ── zoomTo ───────────────────────────────────────────────────────────────────
//   // Keeps pivot point fixed on screen (same math as DesktopViewer).
//   // pan2.x = px - (px - pan1.x) * z2 / z1
//   const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
//     newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
//     const oldZ = zoomRef.current;
//     const W    = containerWRef.current;
//     const bH   = bookHRef.current;
//     const old  = panRef.current;
//     const px   = pivot?.x ?? W / 2;
//     const py   = pivot?.y ?? bH / 2;

//     if (newZ <= 1.01) {
//       setZoom(1); zoomRef.current = 1;
//       const p = computePan(focusSideRef.current);
//       setPan(p); panRef.current = p;
//       return;
//     }

//     const nx   = px - (px - old.x) * newZ / oldZ;
//     const ny   = py - (py - old.y) * newZ / oldZ;
//     const lims = getPanLimits(newZ);
//     setZoom(newZ); zoomRef.current = newZ;
//     const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [computePan, getPanLimits]);

//   const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

//   useEffect(() => { setMounted(true); }, []);

//   // ── Measure clipRef width (re-runs after mounted flips true) ─────────────────
//   useEffect(() => {
//     const el = clipRef.current;
//     if (!el) return;
//     const update = () => {
//       containerWRef.current = el.clientWidth;
//       if (zoomRef.current <= 1.01) {
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//       }
//     };
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     update();
//     return () => ro.disconnect();
//   }, [computePan, mounted]);

//   // ── Book height ───────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       const h   = Math.max(280, el.clientHeight - pad);
//       setBookH(h); bookHRef.current = h;
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el);
//     calc();
//     return () => ro.disconnect();
//   }, []);

//   // ── Fullscreen ───────────────────────────────────────────────────────────────
//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   // ── URL hash restore ─────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   // ── handleFlip ───────────────────────────────────────────────────────────────
//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);
//     if (zoomRef.current <= 1.01) {
//       // FIX #1: cover page focuses right leaf (cover is on the right side of
//       // the spread, so right leaf is the natural reading start position).
//       if (newPage === 0)       applyFocus('right');
//       else if (newPage > prev) applyFocus('left');
//       else                     applyFocus('right');
//     }
//   }, [applyFocus]);

//   // ── Navigation ───────────────────────────────────────────────────────────────
//   const goNext = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'right') {
//       if (curPageRef.current < TOTAL_PAGES - 1)
//         bookRef.current?.pageFlip()?.flipNext();
//     } else {
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'left') {
//       if (curPageRef.current > 0)
//         bookRef.current?.pageFlip()?.flipPrev();
//     } else {
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
//   const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);
//   const goJump  = useCallback((n: number) => { bookRef.current?.pageFlip()?.flip(n); }, []);

//   // ── Keyboard ─────────────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':       resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
//         case '-':           zoomTo(zoomRef.current - 0.5); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

//   // ── Touch gesture listeners ───────────────────────────────────────────────────
//   useEffect(() => {
//     const el = clipRef.current;
//     if (!el) return;

//     const g = {
//       pinching: false,
//       pd0: 0,    // initial finger distance (for zoom ratio)
//       prevD: 0,  // FIX #4: distance from previous frame (incremental zoom)
//       pz0: 1,
//       panning:  false,
//       tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         // FIX #4: initialise prevD to pd0 so first move frame has ratio ≈ 1
//         g.prevD = g.pd0;
//         g.pz0   = zoomRef.current;
//         return;
//       }
//       e.preventDefault(); e.stopPropagation();
//       const now = Date.now();
//       if (now - g.lastTap < 300) {
//         g.lastTap = 0; g.panning = false;
//         setZoom(1); zoomRef.current = 1;
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//         return;
//       }
//       g.lastTap = now;
//       g.panning = true; g.pinching = false;
//       g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//       g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();

//         const d = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );

//         // FIX #4: use the midpoint of the two fingers as the zoom pivot so
//         // content under the fingers stays fixed, regardless of which leaf is
//         // focused. Previously zoom had no pivot → transformOrigin:left-top
//         // always pulled content toward the left edge of the wrapper.
//         const rect   = el.getBoundingClientRect();
//         const pivotX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
//         const pivotY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

//         // Incremental ratio so pivot stays accurate across the full gesture.
//         // Using g.pz0 * (d / g.pd0) accumulates error when the fingers move
//         // laterally between frames; d/prevD keeps it frame-accurate.
//         const ratio = g.prevD > 0 ? d / g.prevD : 1;
//         g.prevD     = d;

//         zoomTo(zoomRef.current * ratio, { x: pivotX, y: pivotY });
//         return;
//       }

//       if (e.touches.length === 1) {
//         e.preventDefault(); e.stopPropagation();
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//         applyPan(
//           g.tpx0 + e.touches[0].clientX - g.tx0,
//           g.tpy0 + e.touches[0].clientY - g.ty0,
//           zoomRef.current,
//         );
//       }
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) { g.pinching = false; g.prevD = 0; }
//       if (e.touches.length === 0) g.panning = false;
//     };

//     el.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     el.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     el.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     return () => {
//       el.removeEventListener('touchstart', onTouchStart, { capture: true });
//       el.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       el.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//     };
//   }, [applyPan, computePan, zoomTo, mounted]);

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       <main
//         ref={mainRef}
//         className="flex-1 flex items-center justify-center overflow-hidden"
//         style={{ padding: '4px 0' }}
//       >
//         {mounted && (
//           <div
//             ref={clipRef}
//             style={{
//               position: 'relative',
//               width: '100%',
//               overflow: 'hidden',
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             <div
//               ref={bookWrapperRef}
//               style={{
//                 width: `${WRAPPER_MULT * 100}%`,
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'left top',
//                 // FIX #3: smoother focus transition (was 0.18s)
//                 transition: 'transform 0.30s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"
//                 minWidth={100}
//                 maxWidth={99999}
//                 minHeight={200}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.5}
//                 showCover={true}
//                 mobileScrollSupport={false}
//                 useMouseEvents={false}
//                 drawShadow={true}
//                 flippingTime={1000}   // FIX #3: slower, more deliberate page flip
//                 swipeDistance={99999}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             {/* FIX #3: dim shadow overlay removed entirely */}

//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
//                 className="bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && (
//         <Toolbar
//           curPage={curPage}
//           zoom={zoom}
//           isZoomed={isZoomed}
//           isFS={isFS}
//           onZoomOut={() => zoomTo(zoom - 0.5)}
//           onZoomIn={() => zoomTo(zoom + 0.5)}
//           onFirst={goFirst}
//           onPrev={goPrev}
//           onNext={goNext}
//           onLast={goLast}
//           onToggleFS={toggleFS}
//           onJump={goJump}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // DESKTOP VIEWER — unchanged
// // ═══════════════════════════════════════════════════════════════════════════════
// function DesktopViewer() {
//   const [mounted,  setMounted]  = useState(false);
//   const [curPage,  setCurPage]  = useState(0);
//   const [isFS,     setIsFS]     = useState(false);
//   const [bookH,    setBookH]    = useState(MAX_BOOK_H);
//   const [zoom,     setZoom]     = useState(1);
//   const [pan,      setPan]      = useState({ x: 0, y: 0 });

//   const zoomRef        = useRef(1);
//   const panRef         = useRef({ x: 0, y: 0 });
//   const bookHRef       = useRef(MAX_BOOK_H);
//   const containerWRef  = useRef(0);
//   const focusSideRef   = useRef<FocusSide>('left');
//   const curPageRef     = useRef(0);
//   const prevPageRef    = useRef(0);

//   zoomRef.current  = zoom;
//   panRef.current   = pan;
//   bookHRef.current = bookH;

//   const isZoomed = zoom > 1.01;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef          = useRef<any>(null);
//   const mainRef          = useRef<HTMLDivElement>(null);
//   const containerRef     = useRef<HTMLDivElement>(null);
//   const zoomContainerRef = useRef<HTMLDivElement>(null);
//   const overlayRef       = useRef<HTMLDivElement>(null);

//   const getPanLimits = useCallback((z: number) => {
//     const m = (z - 1) * 500;
//     return { xMin: -m, xMax: m, yMin: -(m * 0.8), yMax: m * 0.8 };
//   }, []);

//   const applyPan = useCallback((x: number, y: number, z: number) => {
//     const lims = getPanLimits(z);
//     const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [getPanLimits]);

//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     const spreadW = zoomContainerRef.current?.offsetWidth ?? 600;
//     const bookW   = Math.min(spreadW, 840);
//     const offset  = bookW / 4;
//     if (side === 'left')  return { x:  offset, y: 0 };
//     if (side === 'right') return { x: -offset, y: 0 };
//     return { x: 0, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return;
//     focusSideRef.current = side;
//     const p = computePan(side);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
//     newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
//     const oldZ = zoomRef.current;
//     const W    = containerWRef.current;
//     const bH   = bookHRef.current;
//     const old  = panRef.current;
//     const px   = pivot?.x ?? W / 2;
//     const py   = pivot?.y ?? bH / 2;

//     if (newZ <= 1.01) {
//       setZoom(1); zoomRef.current = 1;
//       const p = computePan(focusSideRef.current);
//       setPan(p); panRef.current = p;
//       return;
//     }

//     const nx = px - (px - old.x) * newZ / oldZ;
//     const ny = py - (py - old.y) * newZ / oldZ;
//     const lims = getPanLimits(newZ);

//     setZoom(newZ); zoomRef.current = newZ;
//     const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [computePan, getPanLimits]);

//   const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     const el = zoomContainerRef.current;
//     if (!el) return;
//     const update = () => {
//       containerWRef.current = el.clientWidth;
//       if (zoomRef.current <= 1.01) {
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//       }
//     };
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     update();
//     return () => ro.disconnect();
//   }, [computePan, mounted]);

//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       const h   = Math.max(280, Math.min(el.clientHeight - pad, MAX_BOOK_H));
//       setBookH(h); bookHRef.current = h;
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el);
//     calc();
//     return () => ro.disconnect();
//   }, []);

//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);
//     if (zoomRef.current <= 1.01) {
//       if (newPage === 0)       applyFocus('center');
//       else if (newPage > prev) applyFocus('left');
//       else                     applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goNext = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'right') {
//       if (curPageRef.current < TOTAL_PAGES - 1)
//         bookRef.current?.pageFlip()?.flipNext();
//     } else {
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'left') {
//       if (curPageRef.current > 0)
//         bookRef.current?.pageFlip()?.flipPrev();
//     } else {
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
//   const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);
//   const goJump  = useCallback((n: number) => { bookRef.current?.pageFlip()?.flip(n); }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':       resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
//         case '-':           zoomTo(zoomRef.current - 0.5); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

//   useEffect(() => {
//     const container = zoomContainerRef.current;
//     const overlay   = overlayRef.current;
//     if (!container || !overlay) return;

//     const g = {
//       pinching: false, pd0: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.pz0 = zoomRef.current;
//         return;
//       }
//       const zoomed = zoomRef.current > 1.01;
//       if (zoomed) {
//         e.preventDefault(); e.stopPropagation();
//         const now = Date.now();
//         if (now - g.lastTap < 300) {
//           g.lastTap = 0; g.panning = false;
//           setZoom(1); zoomRef.current = 1;
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//           return;
//         }
//         g.lastTap = now;
//         g.panning = true; g.pinching = false;
//         g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//         g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//       }
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d  = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const newZ = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = newZ; setZoom(newZ);
//         if (newZ <= 1.01) {
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//         }
//         return;
//       }
//       if (e.touches.length === 1) {
//         const zoomed = zoomRef.current > 1.01;
//         if (!zoomed) return;
//         e.preventDefault(); e.stopPropagation();
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//         applyPan(
//           g.tpx0 + e.touches[0].clientX - g.tx0,
//           g.tpy0 + e.touches[0].clientY - g.my0,
//           zoomRef.current,
//         );
//       }
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//       if (e.touches.length === 0) g.panning = false;
//     };

//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const rect  = container.getBoundingClientRect();
//       const pivot = { x: e.clientX - rect.left, y: e.clientY - rect.top };
//       const d     = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
//       zoomTo(zoomRef.current - d / 480, pivot);
//     };

//     const onMD = (e: MouseEvent) => {
//       e.preventDefault(); g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onMM = (e: MouseEvent) => {
//       if (!g.md) return;
//       applyPan(g.px0 + e.clientX - g.mx0, g.py0 + e.clientY - g.my0, zoomRef.current);
//     };
//     const onMU = () => { g.md = false; };

//     container.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     container.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     container.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     container.addEventListener('wheel',      onWheel,      { capture: true, passive: false });
//     overlay.addEventListener('mousedown', onMD);
//     window.addEventListener('mousemove',  onMM);
//     window.addEventListener('mouseup',    onMU);

//     return () => {
//       container.removeEventListener('touchstart', onTouchStart, { capture: true });
//       container.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       container.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//       container.removeEventListener('wheel',      onWheel,      { capture: true });
//       overlay.removeEventListener('mousedown', onMD);
//       window.removeEventListener('mousemove',  onMM);
//       window.removeEventListener('mouseup',    onMU);
//     };
//   }, [applyPan, computePan, zoomTo, mounted]);

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       <main
//         ref={mainRef}
//         className="flex-1 flex items-center justify-center overflow-hidden"
//         style={{ padding: '8px 24px' }}
//       >
//         {mounted && (
//           <div
//             ref={zoomContainerRef}
//             className="relative w-full overflow-visible mx-auto"
//             style={{
//               maxWidth: '900px',
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             <div
//               style={{
//                 width: '100%',
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'left top',
//                 transition: 'transform 0.15s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"
//                 minWidth={100}
//                 maxWidth={420}
//                 minHeight={200}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.5}
//                 showCover={true}
//                 mobileScrollSupport={false}
//                 useMouseEvents={true}
//                 drawShadow={true}
//                 flippingTime={650}
//                 swipeDistance={30}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             <div
//               ref={overlayRef}
//               style={{
//                 position: 'absolute', inset: 0, zIndex: 10,
//                 pointerEvents: isZoomed ? 'auto' : 'none',
//                 cursor: isZoomed ? 'grab' : 'default',
//                 userSelect: 'none',
//               }}
//             />

//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ zIndex: 20 }}
//                 className="absolute bottom-3 left-1/2 -translate-x-1/2
//                   bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && (
//         <Toolbar
//           curPage={curPage}
//           zoom={zoom}
//           isZoomed={isZoomed}
//           isFS={isFS}
//           onZoomOut={() => zoomTo(zoom - 0.5)}
//           onZoomIn={() => zoomTo(zoom + 0.5)}
//           onFirst={goFirst}
//           onPrev={goPrev}
//           onNext={goNext}
//           onLast={goLast}
//           onToggleFS={toggleFS}
//           onJump={goJump}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ROOT — unchanged
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function NewsletterViewer() {
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
//     check();
//     window.addEventListener('resize', check);
//     return () => window.removeEventListener('resize', check);
//   }, []);

//   if (isMobile === null) return null;

//   return isMobile ? <MobileViewer /> : <DesktopViewer />;
// }
















// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import {
//   Download, Maximize2, Minimize2,
//   ZoomIn, ZoomOut,
//   ChevronLeft, ChevronRight,
//   ChevronsLeft, ChevronsRight,
// } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () =>
//     import('react-pageflip').then(
//       (m) => m.default as unknown as React.ComponentType<AnyProps>,
//     ),
//   { ssr: false },
// );

// // ─── Config ───────────────────────────────────────────────────────────────────
// const TOTAL_PAGES  = 36;
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const IMG          = (n: number) => `/Assets/newsletterjpegs/pg${n}.jpg`;
// const MAX_BOOK_H   = 520;
// const ZOOM_MIN     = 1;
// const ZOOM_MAX     = 4;
// const MOBILE_BP    = 768;
// const WRAPPER_MULT = 1.8;

// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// type FocusSide = 'left' | 'right' | 'center';

// // ─── Shared: Toolbar button ───────────────────────────────────────────────────
// function TBtn({ onClick, disabled = false, title, href, children }: {
//   onClick?: () => void; disabled?: boolean; title?: string;
//   href?: string; children: React.ReactNode;
// }) {
//   const cls =
//     'flex items-center justify-center w-9 h-9 rounded ' +
//     'text-[#aec2cc] hover:text-white hover:bg-[#1484bc]/25 ' +
//     'disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0';
//   if (href)
//     return <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>{children}</a>;
//   return <button onClick={onClick} disabled={disabled} title={title} className={cls}>{children}</button>;
// }

// // ─── Shared: Toolbar ──────────────────────────────────────────────────────────
// function Toolbar({
//   curPage, zoom, isZoomed, isFS,
//   onZoomOut, onZoomIn, onFirst, onPrev, onNext, onLast, onToggleFS, onJump,
// }: {
//   curPage: number; zoom: number; isZoomed: boolean; isFS: boolean;
//   onZoomOut: () => void; onZoomIn: () => void;
//   onFirst: () => void; onPrev: () => void; onNext: () => void; onLast: () => void;
//   onToggleFS: () => void; onJump: (n: number) => void;
// }) {
//   const displayPage = curPage + 1;
//   return (
//     <div className="bg-[#1e3143] border-t border-[#1484bc]/15 px-2 py-1.5 flex items-center justify-center gap-0.5 flex-shrink-0 z-30">
//       <TBtn onClick={onZoomOut} disabled={!isZoomed} title="Zoom out (−)">
//         <ZoomOut className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onFirst} title="First page">
//         <ChevronsLeft className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onPrev} title="Previous">
//         <ChevronLeft className="w-[18px] h-[18px]" />
//       </TBtn>
//       <div className="flex items-center gap-1 px-1">
//         <input
//           type="number" min={1} max={TOTAL_PAGES}
//           defaultValue={displayPage} key={displayPage}
//           onKeyDown={(e) => {
//             if (e.key !== 'Enter') return;
//             const n = parseInt((e.target as HTMLInputElement).value, 10);
//             if (n >= 1 && n <= TOTAL_PAGES) onJump(n - 1);
//           }}
//           className="w-9 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-1 py-0.5 text-xs outline-none"
//         />
//         <span className="text-[#aec2cc] text-xs whitespace-nowrap">/ {TOTAL_PAGES}</span>
//       </div>
//       <TBtn onClick={onNext} title="Next">
//         <ChevronRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onLast} title="Last page">
//         <ChevronsRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn href={DOWNLOAD_URL} title="Download PDF">
//         <Download className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onZoomIn} disabled={zoom >= ZOOM_MAX} title="Zoom in (+)">
//         <ZoomIn className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onToggleFS} title={isFS ? 'Exit full screen' : 'Full screen'}>
//         {isFS ? <Minimize2 className="w-[18px] h-[18px]" /> : <Maximize2 className="w-[18px] h-[18px]" />}
//       </TBtn>
//     </div>
//   );
// }

// // ─── Shared: FlipPage ─────────────────────────────────────────────────────────
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
//   <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
//     {/* eslint-disable-next-line @next/next/no-img-element */}
//     <img
//       src={IMG(pageNum)}
//       alt={`Page ${pageNum}`}
//       className="w-full h-full object-cover"
//       loading={pageNum <= 6 ? 'eager' : 'lazy'}
//       draggable={false}
//     />
//   </div>
// ));
// FlipPage.displayName = 'FlipPage';

// // ═══════════════════════════════════════════════════════════════════════════════
// // MOBILE VIEWER
// // ═══════════════════════════════════════════════════════════════════════════════
// function MobileViewer() {
//   const [mounted,   setMounted]   = useState(false);
//   const [curPage,   setCurPage]   = useState(0);
//   const [bookH,     setBookH]     = useState(520);
//   const [zoom,      setZoom]      = useState(1);
//   const [pan,       setPan]       = useState({ x: 0, y: 0 });
//   const [isFS,      setIsFS]      = useState(false);
//   const [focusSide, setFocusSide] = useState<FocusSide>('right');

//   const zoomRef       = useRef(1);
//   const panRef        = useRef({ x: 0, y: 0 });
//   const bookHRef      = useRef(520);
//   const containerWRef = useRef(0);
//   const focusSideRef  = useRef<FocusSide>('right');
//   const curPageRef    = useRef(0);
//   const prevPageRef   = useRef(0);

//   zoomRef.current  = zoom;
//   panRef.current   = pan;
//   bookHRef.current = bookH;

//   const isZoomed = zoom > 1.01;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef        = useRef<any>(null);
//   const containerRef   = useRef<HTMLDivElement>(null);
//   const mainRef        = useRef<HTMLDivElement>(null);
//   const clipRef        = useRef<HTMLDivElement>(null);
//   const bookWrapperRef = useRef<HTMLDivElement>(null);

//   // ── Pan limits ───────────────────────────────────────────────────────────────
//   //
//   // pageW  = WRAPPER_MULT * W / 2  (each page width inside the 150% wrapper)
//   //
//   // leftFocusPan  = W/2 - pageW/2  = the pan that centres the left  page → ~+0.05W
//   // rightFocusPan = W/2 - 3*pageW/2 = the pan that centres the right page → ~-0.85W
//   //
//   // xMax = leftFocusPan
//   //   Prevents panning further right than the left-focus position.
//   //   Beyond this point the wrapper shifts off the left edge of the viewport,
//   //   exposing empty dark background — exactly the bug being fixed.
//   //
//   // xMin = min(rightFocusPan, W*(1 - WRAPPER_MULT*z))
//   //   At z=1: ensures the right-focus position is always reachable.
//   //   At z>1: expands leftward so the full zoomed wrapper stays scrollable.
//   const getPanLimits = useCallback((z: number) => {
//     const W     = containerWRef.current;
//     const bH    = bookHRef.current;
//     const pageW = (WRAPPER_MULT * W) / 2;

//     const leftFocusPan  = W / 2 - pageW / 2;           // ~+0.05W
//     const rightFocusPan = W / 2 - pageW - pageW / 2;   // ~-0.85W

//     return {
//       xMin: Math.min(rightFocusPan, W * (1 - WRAPPER_MULT * z)),
//       xMax: leftFocusPan,
//       yMin: -(bH * (z - 1)),
//       yMax: 0,
//     };
//   }, []);

//   const applyPan = useCallback((x: number, y: number, z: number) => {
//     const lims = getPanLimits(z);
//     const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [getPanLimits]);

//   // ── computePan ───────────────────────────────────────────────────────────────
//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     const W     = containerWRef.current;
//     const pageW = (WRAPPER_MULT * W) / 2;
//     if (side === 'left')
//       return { x: W / 2 - pageW / 2,           y: 0 };
//     if (side === 'right')
//       return { x: W / 2 - pageW - pageW / 2,   y: 0 };
//     return   { x: -(W * (WRAPPER_MULT - 1)) / 2, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return;
//     focusSideRef.current = side;
//     setFocusSide(side);
//     const p = computePan(side);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   // ── zoomTo ───────────────────────────────────────────────────────────────────
//   const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
//     newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
//     const oldZ = zoomRef.current;
//     const W    = containerWRef.current;
//     const bH   = bookHRef.current;
//     const old  = panRef.current;
//     const px   = pivot?.x ?? W / 2;
//     const py   = pivot?.y ?? bH / 2;

//     if (newZ <= 1.01) {
//       setZoom(1); zoomRef.current = 1;
//       const p = computePan(focusSideRef.current);
//       setPan(p); panRef.current = p;
//       return;
//     }

//     const nx   = px - (px - old.x) * newZ / oldZ;
//     const ny   = py - (py - old.y) * newZ / oldZ;
//     const lims = getPanLimits(newZ);
//     setZoom(newZ); zoomRef.current = newZ;
//     const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [computePan, getPanLimits]);

//   const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     const el = clipRef.current;
//     if (!el) return;
//     const update = () => {
//       containerWRef.current = el.clientWidth;
//       if (zoomRef.current <= 1.01) {
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//       }
//     };
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     update();
//     return () => ro.disconnect();
//   }, [computePan, mounted]);

//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       const h   = Math.max(280, el.clientHeight - pad);
//       setBookH(h); bookHRef.current = h;
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el);
//     calc();
//     return () => ro.disconnect();
//   }, []);

//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) {
//         await containerRef.current?.requestFullscreen();
//       } else {
//         await document.exitFullscreen();
//       }
//     } catch {
//       // Browser may refuse (e.g. iframe sandbox) — fail silently
//     }
//   }, []);

//   useEffect(() => {
//     const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
//     document.addEventListener('fullscreenchange', onFsChange);
//     return () => document.removeEventListener('fullscreenchange', onFsChange);
//   }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);
//     if (zoomRef.current <= 1.01) {
//       if (newPage === 0)       applyFocus('right');
//       else if (newPage > prev) applyFocus('left');
//       else                     applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goNext = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'right') {
//       if (curPageRef.current < TOTAL_PAGES - 1)
//         bookRef.current?.pageFlip()?.flipNext();
//     } else {
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'left') {
//       if (curPageRef.current > 0)
//         bookRef.current?.pageFlip()?.flipPrev();
//     } else {
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
//   const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);
//   const goJump  = useCallback((n: number) => { bookRef.current?.pageFlip()?.flip(n); }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':       resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
//         case '-':           zoomTo(zoomRef.current - 0.5); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

//   useEffect(() => {
//     const el = clipRef.current;
//     if (!el) return;

//     const g = {
//       pinching: false, pd0: 0, prevD: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.prevD = g.pd0;
//         g.pz0   = zoomRef.current;
//         return;
//       }
//       e.preventDefault(); e.stopPropagation();
//       const now = Date.now();
//       if (now - g.lastTap < 300) {
//         g.lastTap = 0; g.panning = false;
//         setZoom(1); zoomRef.current = 1;
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//         return;
//       }
//       g.lastTap = now;
//       g.panning = true; g.pinching = false;
//       g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//       g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d      = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const rect   = el.getBoundingClientRect();
//         const pivotX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
//         const pivotY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
//         const ratio  = g.prevD > 0 ? d / g.prevD : 1;
//         g.prevD      = d;
//         zoomTo(zoomRef.current * ratio, { x: pivotX, y: pivotY });
//         return;
//       }
//       if (e.touches.length === 1) {
//         e.preventDefault(); e.stopPropagation();
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//         applyPan(
//           g.tpx0 + e.touches[0].clientX - g.tx0,
//           g.tpy0 + e.touches[0].clientY - g.ty0,
//           zoomRef.current,
//         );
//       }
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) { g.pinching = false; g.prevD = 0; }
//       if (e.touches.length === 0) g.panning = false;
//     };

//     el.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     el.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     el.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     return () => {
//       el.removeEventListener('touchstart', onTouchStart, { capture: true });
//       el.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       el.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//     };
//   }, [applyPan, computePan, zoomTo, mounted]);

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       <main
//         ref={mainRef}
//         className="flex-1 flex items-center justify-center overflow-hidden"
//         style={{ padding: '4px 0' }}
//       >
//         {mounted && (
//           <div
//             ref={clipRef}
//             style={{
//               position: 'relative',
//               width: '100%',
//               overflow: 'hidden',
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             <div
//               ref={bookWrapperRef}
//               style={{
//                 width: `${WRAPPER_MULT * 100}%`,
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'left top',
//                 transition: 'transform 0.30s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"
//                 minWidth={100}
//                 maxWidth={99999}
//                 minHeight={200}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.5}
//                 showCover={true}
//                 mobileScrollSupport={false}
//                 useMouseEvents={false}
//                 drawShadow={true}
//                 flippingTime={1000}
//                 swipeDistance={99999}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
//                 className="bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — double tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && (
//         <Toolbar
//           curPage={curPage}
//           zoom={zoom}
//           isZoomed={isZoomed}
//           isFS={isFS}
//           onZoomOut={() => zoomTo(zoom - 0.5)}
//           onZoomIn={() => zoomTo(zoom + 0.5)}
//           onFirst={goFirst}
//           onPrev={goPrev}
//           onNext={goNext}
//           onLast={goLast}
//           onToggleFS={toggleFS}
//           onJump={goJump}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // DESKTOP VIEWER — unchanged
// // ═══════════════════════════════════════════════════════════════════════════════
// function DesktopViewer() {
//   const [mounted,  setMounted]  = useState(false);
//   const [curPage,  setCurPage]  = useState(0);
//   const [isFS,     setIsFS]     = useState(false);
//   const [bookH,    setBookH]    = useState(MAX_BOOK_H);
//   const [zoom,     setZoom]     = useState(1);
//   const [pan,      setPan]      = useState({ x: 0, y: 0 });

//   const zoomRef        = useRef(1);
//   const panRef         = useRef({ x: 0, y: 0 });
//   const bookHRef       = useRef(MAX_BOOK_H);
//   const containerWRef  = useRef(0);
//   const focusSideRef   = useRef<FocusSide>('left');
//   const curPageRef     = useRef(0);
//   const prevPageRef    = useRef(0);

//   zoomRef.current  = zoom;
//   panRef.current   = pan;
//   bookHRef.current = bookH;

//   const isZoomed = zoom > 1.01;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef          = useRef<any>(null);
//   const mainRef          = useRef<HTMLDivElement>(null);
//   const containerRef     = useRef<HTMLDivElement>(null);
//   const zoomContainerRef = useRef<HTMLDivElement>(null);
//   const overlayRef       = useRef<HTMLDivElement>(null);

//   const getPanLimits = useCallback((z: number) => {
//     const m = (z - 1) * 500;
//     return { xMin: -m, xMax: m, yMin: -(m * 0.8), yMax: m * 0.8 };
//   }, []);

//   const applyPan = useCallback((x: number, y: number, z: number) => {
//     const lims = getPanLimits(z);
//     const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [getPanLimits]);

//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     const spreadW = zoomContainerRef.current?.offsetWidth ?? 600;
//     const bookW   = Math.min(spreadW, 840);
//     const offset  = bookW / 4;
//     if (side === 'left')  return { x:  offset, y: 0 };
//     if (side === 'right') return { x: -offset, y: 0 };
//     return { x: 0, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return;
//     focusSideRef.current = side;
//     const p = computePan(side);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
//     newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
//     const oldZ = zoomRef.current;
//     const W    = containerWRef.current;
//     const bH   = bookHRef.current;
//     const old  = panRef.current;
//     const px   = pivot?.x ?? W / 2;
//     const py   = pivot?.y ?? bH / 2;

//     if (newZ <= 1.01) {
//       setZoom(1); zoomRef.current = 1;
//       const p = computePan(focusSideRef.current);
//       setPan(p); panRef.current = p;
//       return;
//     }

//     const nx = px - (px - old.x) * newZ / oldZ;
//     const ny = py - (py - old.y) * newZ / oldZ;
//     const lims = getPanLimits(newZ);

//     setZoom(newZ); zoomRef.current = newZ;
//     const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [computePan, getPanLimits]);

//   const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     const el = zoomContainerRef.current;
//     if (!el) return;
//     const update = () => {
//       containerWRef.current = el.clientWidth;
//       if (zoomRef.current <= 1.01) {
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//       }
//     };
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     update();
//     return () => ro.disconnect();
//   }, [computePan, mounted]);

//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       const h   = Math.max(280, Math.min(el.clientHeight - pad, MAX_BOOK_H));
//       setBookH(h); bookHRef.current = h;
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el);
//     calc();
//     return () => ro.disconnect();
//   }, []);

//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);
//     if (zoomRef.current <= 1.01) {
//       if (newPage === 0)       applyFocus('center');
//       else if (newPage > prev) applyFocus('left');
//       else                     applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goNext = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'right') {
//       if (curPageRef.current < TOTAL_PAGES - 1)
//         bookRef.current?.pageFlip()?.flipNext();
//     } else {
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'left') {
//       if (curPageRef.current > 0)
//         bookRef.current?.pageFlip()?.flipPrev();
//     } else {
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
//   const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);
//   const goJump  = useCallback((n: number) => { bookRef.current?.pageFlip()?.flip(n); }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':       resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
//         case '-':           zoomTo(zoomRef.current - 0.5); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

//   useEffect(() => {
//     const container = zoomContainerRef.current;
//     const overlay   = overlayRef.current;
//     if (!container || !overlay) return;

//     const g = {
//       pinching: false, pd0: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.pz0 = zoomRef.current;
//         return;
//       }
//       const zoomed = zoomRef.current > 1.01;
//       if (zoomed) {
//         e.preventDefault(); e.stopPropagation();
//         const now = Date.now();
//         if (now - g.lastTap < 300) {
//           g.lastTap = 0; g.panning = false;
//           setZoom(1); zoomRef.current = 1;
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//           return;
//         }
//         g.lastTap = now;
//         g.panning = true; g.pinching = false;
//         g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//         g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//       }
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d  = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const newZ = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = newZ; setZoom(newZ);
//         if (newZ <= 1.01) {
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//         }
//         return;
//       }
//       if (e.touches.length === 1) {
//         const zoomed = zoomRef.current > 1.01;
//         if (!zoomed) return;
//         e.preventDefault(); e.stopPropagation();
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//         applyPan(
//           g.tpx0 + e.clientX - g.mx0,
//           g.tpy0 + e.clientY - g.my0,
//           zoomRef.current,
//         );
//       }
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//       if (e.touches.length === 0) g.panning = false;
//     };

//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const rect  = container.getBoundingClientRect();
//       const pivot = { x: e.clientX - rect.left, y: e.clientY - rect.top };
//       const d     = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
//       zoomTo(zoomRef.current - d / 480, pivot);
//     };

//     const onMD = (e: MouseEvent) => {
//       e.preventDefault(); g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onMM = (e: MouseEvent) => {
//       if (!g.md) return;
//       applyPan(g.px0 + e.clientX - g.mx0, g.py0 + e.clientY - g.my0, zoomRef.current);
//     };
//     const onMU = () => { g.md = false; };

//     container.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     container.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     container.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     container.addEventListener('wheel',      onWheel,      { capture: true, passive: false });
//     overlay.addEventListener('mousedown', onMD);
//     window.addEventListener('mousemove',  onMM);
//     window.addEventListener('mouseup',    onMU);

//     return () => {
//       container.removeEventListener('touchstart', onTouchStart, { capture: true });
//       container.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       container.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//       container.removeEventListener('wheel',      onWheel,      { capture: true });
//       overlay.removeEventListener('mousedown', onMD);
//       window.removeEventListener('mousemove',  onMM);
//       window.removeEventListener('mouseup',    onMU);
//     };
//   }, [applyPan, computePan, zoomTo, mounted]);

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       <main
//         ref={mainRef}
//         className="flex-1 flex items-center justify-center overflow-hidden"
//         style={{ padding: '8px 24px' }}
//       >
//         {mounted && (
//           <div
//             ref={zoomContainerRef}
//             className="relative w-full overflow-visible mx-auto"
//             style={{
//               maxWidth: '900px',
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             <div
//               style={{
//                 width: '100%',
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'left top',
//                 transition: 'transform 0.15s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"
//                 minWidth={100}
//                 maxWidth={420}
//                 minHeight={200}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.5}
//                 showCover={true}
//                 mobileScrollSupport={false}
//                 useMouseEvents={true}
//                 drawShadow={true}
//                 flippingTime={650}
//                 swipeDistance={30}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             <div
//               ref={overlayRef}
//               style={{
//                 position: 'absolute', inset: 0, zIndex: 10,
//                 pointerEvents: isZoomed ? 'auto' : 'none',
//                 cursor: isZoomed ? 'grab' : 'default',
//                 userSelect: 'none',
//               }}
//             />

//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ zIndex: 20 }}
//                 className="absolute bottom-3 left-1/2 -translate-x-1/2
//                   bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — double tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && (
//         <Toolbar
//           curPage={curPage}
//           zoom={zoom}
//           isZoomed={isZoomed}
//           isFS={isFS}
//           onZoomOut={() => zoomTo(zoom - 0.5)}
//           onZoomIn={() => zoomTo(zoom + 0.5)}
//           onFirst={goFirst}
//           onPrev={goPrev}
//           onNext={goNext}
//           onLast={goLast}
//           onToggleFS={toggleFS}
//           onJump={goJump}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ROOT — unchanged
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function NewsletterViewer() {
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
//     check();
//     window.addEventListener('resize', check);
//     return () => window.removeEventListener('resize', check);
//   }, []);

//   if (isMobile === null) return null;

//   return isMobile ? <MobileViewer /> : <DesktopViewer />;
// }

























// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import {
//   Download, Maximize2, Minimize2,
//   ZoomIn, ZoomOut,
//   ChevronLeft, ChevronRight,
//   ChevronsLeft, ChevronsRight,
// } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () =>
//     import('react-pageflip').then(
//       (m) => m.default as unknown as React.ComponentType<AnyProps>,
//     ),
//   { ssr: false },
// );

// // ─── Config ───────────────────────────────────────────────────────────────────
// const TOTAL_PAGES  = 36;
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const IMG          = (n: number) => `/Assets/newsletterjpegs/pg${n}.jpg`;
// const MAX_BOOK_H   = 520;
// const ZOOM_MIN     = 1;
// const ZOOM_MAX     = 4;
// const MOBILE_BP    = 768;
// const WRAPPER_MULT = 1.8;

// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// type FocusSide = 'left' | 'right' | 'center';

// // ─── Shared: Toolbar button ───────────────────────────────────────────────────
// function TBtn({ onClick, disabled = false, title, href, children }: {
//   onClick?: () => void; disabled?: boolean; title?: string;
//   href?: string; children: React.ReactNode;
// }) {
//   const cls =
//     'flex items-center justify-center w-9 h-9 rounded ' +
//     'text-[#aec2cc] hover:text-white hover:bg-[#1484bc]/25 ' +
//     'disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0';
//   if (href)
//     return <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>{children}</a>;
//   return <button onClick={onClick} disabled={disabled} title={title} className={cls}>{children}</button>;
// }

// // ─── Shared: Toolbar ──────────────────────────────────────────────────────────
// function Toolbar({
//   curPage, zoom, isZoomed, isFS,
//   onZoomOut, onZoomIn, onFirst, onPrev, onNext, onLast, onToggleFS, onJump,
// }: {
//   curPage: number; zoom: number; isZoomed: boolean; isFS: boolean;
//   onZoomOut: () => void; onZoomIn: () => void;
//   onFirst: () => void; onPrev: () => void; onNext: () => void; onLast: () => void;
//   onToggleFS: () => void; onJump: (n: number) => void;
// }) {
//   const displayPage = curPage + 1;
//   return (
//     <div className="bg-[#1e3143] border-t border-[#1484bc]/15 px-2 py-1.5 flex items-center justify-center gap-0.5 flex-shrink-0 z-30">
//       <TBtn onClick={onZoomOut} disabled={!isZoomed} title="Zoom out (−)">
//         <ZoomOut className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onFirst} title="First page">
//         <ChevronsLeft className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onPrev} title="Previous">
//         <ChevronLeft className="w-[18px] h-[18px]" />
//       </TBtn>
//       <div className="flex items-center gap-1 px-1">
//         <input
//           type="number" min={1} max={TOTAL_PAGES}
//           defaultValue={displayPage} key={displayPage}
//           onKeyDown={(e) => {
//             if (e.key !== 'Enter') return;
//             const n = parseInt((e.target as HTMLInputElement).value, 10);
//             if (n >= 1 && n <= TOTAL_PAGES) onJump(n - 1);
//           }}
//           className="w-9 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-1 py-0.5 text-xs outline-none"
//         />
//         <span className="text-[#aec2cc] text-xs whitespace-nowrap">/ {TOTAL_PAGES}</span>
//       </div>
//       <TBtn onClick={onNext} title="Next">
//         <ChevronRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onLast} title="Last page">
//         <ChevronsRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn href={DOWNLOAD_URL} title="Download PDF">
//         <Download className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onZoomIn} disabled={zoom >= ZOOM_MAX} title="Zoom in (+)">
//         <ZoomIn className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onToggleFS} title={isFS ? 'Exit full screen' : 'Full screen'}>
//         {isFS ? <Minimize2 className="w-[18px] h-[18px]" /> : <Maximize2 className="w-[18px] h-[18px]" />}
//       </TBtn>
//     </div>
//   );
// }

// // ─── Shared: FlipPage ─────────────────────────────────────────────────────────
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
//   <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
//     {/* eslint-disable-next-line @next/next/no-img-element */}
//     <img
//       src={IMG(pageNum)}
//       alt={`Page ${pageNum}`}
//       className="w-full h-full object-cover"
//       loading={pageNum <= 6 ? 'eager' : 'lazy'}
//       draggable={false}
//     />
//   </div>
// ));
// FlipPage.displayName = 'FlipPage';

// // ═══════════════════════════════════════════════════════════════════════════════
// // MOBILE VIEWER
// // ═══════════════════════════════════════════════════════════════════════════════
// function MobileViewer() {
//   const [mounted,   setMounted]   = useState(false);
//   const [curPage,   setCurPage]   = useState(0);
//   const [bookH,     setBookH]     = useState(520);
//   const [zoom,      setZoom]      = useState(1);
//   const [pan,       setPan]       = useState({ x: 0, y: 0 });
//   const [isFS,      setIsFS]      = useState(false);
//   const [focusSide, setFocusSide] = useState<FocusSide>('right');

//   const zoomRef       = useRef(1);
//   const panRef        = useRef({ x: 0, y: 0 });
//   const bookHRef      = useRef(520);
//   const containerWRef = useRef(0);
//   const focusSideRef  = useRef<FocusSide>('right');
//   const curPageRef    = useRef(0);
//   const prevPageRef   = useRef(0);

//   zoomRef.current  = zoom;
//   panRef.current   = pan;
//   bookHRef.current = bookH;

//   const isZoomed = zoom > 1.01;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef        = useRef<any>(null);
//   const containerRef   = useRef<HTMLDivElement>(null);
//   const mainRef        = useRef<HTMLDivElement>(null);
//   const clipRef        = useRef<HTMLDivElement>(null);
//   const bookWrapperRef = useRef<HTMLDivElement>(null);

//   // ── Pan limits ───────────────────────────────────────────────────────────────
//   //
//   // pageW  = WRAPPER_MULT * W / 2  (each page width inside the 150% wrapper)
//   //
//   // leftFocusPan  = W/2 - pageW/2  = the pan that centres the left  page → ~+0.05W
//   // rightFocusPan = W/2 - 3*pageW/2 = the pan that centres the right page → ~-0.85W
//   //
//   // xMax = leftFocusPan
//   //   Prevents panning further right than the left-focus position.
//   //   Beyond this point the wrapper shifts off the left edge of the viewport,
//   //   exposing empty dark background — exactly the bug being fixed.
//   //
//   // xMin = min(rightFocusPan, W*(1 - WRAPPER_MULT*z))
//   //   At z=1: ensures the right-focus position is always reachable.
//   //   At z>1: expands leftward so the full zoomed wrapper stays scrollable.
//   const getPanLimits = useCallback((z: number) => {
//     const W     = containerWRef.current;
//     const bH    = bookHRef.current;
//     const pageW = (WRAPPER_MULT * W) / 2;

//     const leftFocusPan  = W / 2 - pageW / 2;           // ~+0.05W
//     const rightFocusPan = W / 2 - pageW - pageW / 2;   // ~-0.85W

//     return {
//       xMin: Math.min(rightFocusPan, W * (1 - WRAPPER_MULT * z)),
//       xMax: leftFocusPan,
//       yMin: -(bH * (z - 1)),
//       yMax: 0,
//     };
//   }, []);

//   const applyPan = useCallback((x: number, y: number, z: number) => {
//     const lims = getPanLimits(z);
//     const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [getPanLimits]);

//   // ── computePan ───────────────────────────────────────────────────────────────
//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     const W     = containerWRef.current;
//     const pageW = (WRAPPER_MULT * W) / 2;
//     if (side === 'left')
//       return { x: W / 2 - pageW / 2,           y: 0 };
//     if (side === 'right')
//       return { x: W / 2 - pageW - pageW / 2,   y: 0 };
//     return   { x: -(W * (WRAPPER_MULT - 1)) / 2, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return;
//     focusSideRef.current = side;
//     setFocusSide(side);
//     const p = computePan(side);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   // ── zoomTo ───────────────────────────────────────────────────────────────────
//   const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
//     newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
//     const oldZ = zoomRef.current;
//     const W    = containerWRef.current;
//     const bH   = bookHRef.current;
//     const old  = panRef.current;
//     const px   = pivot?.x ?? W / 2;
//     const py   = pivot?.y ?? bH / 2;

//     if (newZ <= 1.01) {
//       setZoom(1); zoomRef.current = 1;
//       const p = computePan(focusSideRef.current);
//       setPan(p); panRef.current = p;
//       return;
//     }

//     const nx   = px - (px - old.x) * newZ / oldZ;
//     const ny   = py - (py - old.y) * newZ / oldZ;
//     const lims = getPanLimits(newZ);
//     setZoom(newZ); zoomRef.current = newZ;
//     const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [computePan, getPanLimits]);

//   const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     const el = clipRef.current;
//     if (!el) return;
//     const update = () => {
//       containerWRef.current = el.clientWidth;
//       if (zoomRef.current <= 1.01) {
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//       }
//     };
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     update();
//     return () => ro.disconnect();
//   }, [computePan, mounted]);

//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       const h   = Math.max(280, el.clientHeight - pad);
//       setBookH(h); bookHRef.current = h;
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el);
//     calc();
//     return () => ro.disconnect();
//   }, []);

//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) {
//         await containerRef.current?.requestFullscreen();
//       } else {
//         await document.exitFullscreen();
//       }
//     } catch {
//       // Browser may refuse (e.g. iframe sandbox) — fail silently
//     }
//   }, []);

//   useEffect(() => {
//     const onFsChange = () => setIsFS(!!document.fullscreenElement);
//     document.addEventListener('fullscreenchange', onFsChange);
//     return () => document.removeEventListener('fullscreenchange', onFsChange);
//   }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);
//     if (zoomRef.current <= 1.01) {
//       if (newPage === 0)       applyFocus('right');
//       else if (newPage > prev) applyFocus('left');
//       else                     applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goNext = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'right') {
//       if (curPageRef.current < TOTAL_PAGES - 1)
//         bookRef.current?.pageFlip()?.flipNext();
//     } else {
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'left') {
//       if (curPageRef.current > 0)
//         bookRef.current?.pageFlip()?.flipPrev();
//     } else {
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
//   const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);
//   const goJump  = useCallback((n: number) => { bookRef.current?.pageFlip()?.flip(n); }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':       resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
//         case '-':           zoomTo(zoomRef.current - 0.5); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

//   useEffect(() => {
//     const el = clipRef.current;
//     if (!el) return;

//     const g = {
//       pinching: false, pd0: 0, prevD: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.prevD = g.pd0;
//         g.pz0   = zoomRef.current;
//         return;
//       }
//       e.preventDefault(); e.stopPropagation();
//       const now = Date.now();
//       if (now - g.lastTap < 300) {
//         g.lastTap = 0; g.panning = false;
//         setZoom(1); zoomRef.current = 1;
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//         return;
//       }
//       g.lastTap = now;
//       g.panning = true; g.pinching = false;
//       g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//       g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d      = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const rect   = el.getBoundingClientRect();
//         const pivotX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
//         const pivotY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
//         const ratio  = g.prevD > 0 ? d / g.prevD : 1;
//         g.prevD      = d;
//         zoomTo(zoomRef.current * ratio, { x: pivotX, y: pivotY });
//         return;
//       }
//       if (e.touches.length === 1) {
//         e.preventDefault(); e.stopPropagation();
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//         applyPan(
//           g.tpx0 + e.touches[0].clientX - g.tx0,
//           g.tpy0 + e.touches[0].clientY - g.ty0,
//           zoomRef.current,
//         );
//       }
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) { g.pinching = false; g.prevD = 0; }
//       if (e.touches.length === 0) g.panning = false;
//     };

//     el.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     el.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     el.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     return () => {
//       el.removeEventListener('touchstart', onTouchStart, { capture: true });
//       el.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       el.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//     };
//   }, [applyPan, computePan, zoomTo, mounted]);

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       <main
//         ref={mainRef}
//         className="flex-1 flex items-center justify-center overflow-hidden"
//         style={{ padding: '4px 0' }}
//       >
//         {mounted && (
//           <div
//             ref={clipRef}
//             style={{
//               position: 'relative',
//               width: '100%',
//               overflow: 'hidden',
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             <div
//               ref={bookWrapperRef}
//               style={{
//                 width: `${WRAPPER_MULT * 100}%`,
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'left top',
//                 transition: 'transform 0.30s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"
//                 minWidth={100}
//                 maxWidth={99999}
//                 minHeight={200}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.5}
//                 showCover={true}
//                 mobileScrollSupport={false}
//                 useMouseEvents={false}
//                 drawShadow={true}
//                 flippingTime={1000}
//                 swipeDistance={99999}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
//                 className="bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — double tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && (
//         <Toolbar
//           curPage={curPage}
//           zoom={zoom}
//           isZoomed={isZoomed}
//           isFS={isFS}
//           onZoomOut={() => zoomTo(zoom - 0.5)}
//           onZoomIn={() => zoomTo(zoom + 0.5)}
//           onFirst={goFirst}
//           onPrev={goPrev}
//           onNext={goNext}
//           onLast={goLast}
//           onToggleFS={toggleFS}
//           onJump={goJump}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // DESKTOP VIEWER — unchanged
// // ═══════════════════════════════════════════════════════════════════════════════
// function DesktopViewer() {
//   const [mounted,  setMounted]  = useState(false);
//   const [curPage,  setCurPage]  = useState(0);
//   const [isFS,     setIsFS]     = useState(false);
//   const [bookH,    setBookH]    = useState(MAX_BOOK_H);
//   const [zoom,     setZoom]     = useState(1);
//   const [pan,      setPan]      = useState({ x: 0, y: 0 });

//   const zoomRef        = useRef(1);
//   const panRef         = useRef({ x: 0, y: 0 });
//   const bookHRef       = useRef(MAX_BOOK_H);
//   const containerWRef  = useRef(0);
//   const focusSideRef   = useRef<FocusSide>('left');
//   const curPageRef     = useRef(0);
//   const prevPageRef    = useRef(0);

//   zoomRef.current  = zoom;
//   panRef.current   = pan;
//   bookHRef.current = bookH;

//   const isZoomed = zoom > 1.01;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef          = useRef<any>(null);
//   const mainRef          = useRef<HTMLDivElement>(null);
//   const containerRef     = useRef<HTMLDivElement>(null);
//   const zoomContainerRef = useRef<HTMLDivElement>(null);
//   const overlayRef       = useRef<HTMLDivElement>(null);

//   const getPanLimits = useCallback((z: number) => {
//     const m = (z - 1) * 500;
//     return { xMin: -m, xMax: m, yMin: -(m * 0.8), yMax: m * 0.8 };
//   }, []);

//   const applyPan = useCallback((x: number, y: number, z: number) => {
//     const lims = getPanLimits(z);
//     const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [getPanLimits]);

//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     const spreadW = zoomContainerRef.current?.offsetWidth ?? 600;
//     const bookW   = Math.min(spreadW, 840);
//     const offset  = bookW / 4;
//     if (side === 'left')  return { x:  offset, y: 0 };
//     if (side === 'right') return { x: -offset, y: 0 };
//     return { x: 0, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return;
//     focusSideRef.current = side;
//     const p = computePan(side);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
//     newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
//     const oldZ = zoomRef.current;
//     const W    = containerWRef.current;
//     const bH   = bookHRef.current;
//     const old  = panRef.current;
//     const px   = pivot?.x ?? W / 2;
//     const py   = pivot?.y ?? bH / 2;

//     if (newZ <= 1.01) {
//       setZoom(1); zoomRef.current = 1;
//       const p = computePan(focusSideRef.current);
//       setPan(p); panRef.current = p;
//       return;
//     }

//     const nx = px - (px - old.x) * newZ / oldZ;
//     const ny = py - (py - old.y) * newZ / oldZ;
//     const lims = getPanLimits(newZ);

//     setZoom(newZ); zoomRef.current = newZ;
//     const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [computePan, getPanLimits]);

//   const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     const el = zoomContainerRef.current;
//     if (!el) return;
//     const update = () => {
//       containerWRef.current = el.clientWidth;
//       if (zoomRef.current <= 1.01) {
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//       }
//     };
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     update();
//     return () => ro.disconnect();
//   }, [computePan, mounted]);

//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       const h   = Math.max(280, Math.min(el.clientHeight - pad, MAX_BOOK_H));
//       setBookH(h); bookHRef.current = h;
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el);
//     calc();
//     return () => ro.disconnect();
//   }, []);

//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);
//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);
//     if (zoomRef.current <= 1.01) {
//       if (newPage === 0)       applyFocus('center');
//       else if (newPage > prev) applyFocus('left');
//       else                     applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goNext = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'right') {
//       if (curPageRef.current < TOTAL_PAGES - 1)
//         bookRef.current?.pageFlip()?.flipNext();
//     } else {
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'left') {
//       if (curPageRef.current > 0)
//         bookRef.current?.pageFlip()?.flipPrev();
//     } else {
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
//   const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);
//   const goJump  = useCallback((n: number) => { bookRef.current?.pageFlip()?.flip(n); }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':       resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
//         case '-':           zoomTo(zoomRef.current - 0.5); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

//   useEffect(() => {
//     const container = zoomContainerRef.current;
//     const overlay   = overlayRef.current;
//     if (!container || !overlay) return;

//     const g = {
//       pinching: false, pd0: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.pz0 = zoomRef.current;
//         return;
//       }
//       const zoomed = zoomRef.current > 1.01;
//       if (zoomed) {
//         e.preventDefault(); e.stopPropagation();
//         const now = Date.now();
//         if (now - g.lastTap < 300) {
//           g.lastTap = 0; g.panning = false;
//           setZoom(1); zoomRef.current = 1;
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//           return;
//         }
//         g.lastTap = now;
//         g.panning = true; g.pinching = false;
//         g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//         g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//       }
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d  = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const newZ = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = newZ; setZoom(newZ);
//         if (newZ <= 1.01) {
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//         }
//         return;
//       }
//       if (e.touches.length === 1) {
//         const zoomed = zoomRef.current > 1.01;
//         if (!zoomed) return;
//         e.preventDefault(); e.stopPropagation();
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//        applyPan(
//   g.tpx0 + e.touches[0].clientX - g.tx0,
//   g.tpy0 + e.touches[0].clientY - g.ty0,
//   zoomRef.current,
// );
//       }
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//       if (e.touches.length === 0) g.panning = false;
//     };

//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const rect  = container.getBoundingClientRect();
//       const pivot = { x: e.clientX - rect.left, y: e.clientY - rect.top };
//       const d     = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
//       zoomTo(zoomRef.current - d / 480, pivot);
//     };

//     const onMD = (e: MouseEvent) => {
//       e.preventDefault(); g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onMM = (e: MouseEvent) => {
//       if (!g.md) return;
//       applyPan(g.px0 + e.clientX - g.mx0, g.py0 + e.clientY - g.my0, zoomRef.current);
//     };
//     const onMU = () => { g.md = false; };

//     container.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     container.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     container.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     container.addEventListener('wheel',      onWheel,      { capture: true, passive: false });
//     overlay.addEventListener('mousedown', onMD);
//     window.addEventListener('mousemove',  onMM);
//     window.addEventListener('mouseup',    onMU);

//     return () => {
//       container.removeEventListener('touchstart', onTouchStart, { capture: true });
//       container.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       container.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//       container.removeEventListener('wheel',      onWheel,      { capture: true });
//       overlay.removeEventListener('mousedown', onMD);
//       window.removeEventListener('mousemove',  onMM);
//       window.removeEventListener('mouseup',    onMU);
//     };
//   }, [applyPan, computePan, zoomTo, mounted]);

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       <main
//         ref={mainRef}
//         className="flex-1 flex items-center justify-center overflow-hidden"
//         style={{ padding: '8px 24px' }}
//       >
//         {mounted && (
//           <div
//             ref={zoomContainerRef}
//             className="relative w-full overflow-visible mx-auto"
//             style={{
//               maxWidth: '900px',
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             <div
//               style={{
//                 width: '100%',
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'left top',
//                 transition: 'transform 0.15s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"
//                 minWidth={100}
//                 maxWidth={420}
//                 minHeight={200}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.5}
//                 showCover={true}
//                 mobileScrollSupport={false}
//                 useMouseEvents={true}
//                 drawShadow={true}
//                 flippingTime={650}
//                 swipeDistance={30}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             <div
//               ref={overlayRef}
//               style={{
//                 position: 'absolute', inset: 0, zIndex: 10,
//                 pointerEvents: isZoomed ? 'auto' : 'none',
//                 cursor: isZoomed ? 'grab' : 'default',
//                 userSelect: 'none',
//               }}
//             />

//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ zIndex: 20 }}
//                 className="absolute bottom-3 left-1/2 -translate-x-1/2
//                   bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — double tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && (
//         <Toolbar
//           curPage={curPage}
//           zoom={zoom}
//           isZoomed={isZoomed}
//           isFS={isFS}
//           onZoomOut={() => zoomTo(zoom - 0.5)}
//           onZoomIn={() => zoomTo(zoom + 0.5)}
//           onFirst={goFirst}
//           onPrev={goPrev}
//           onNext={goNext}
//           onLast={goLast}
//           onToggleFS={toggleFS}
//           onJump={goJump}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ROOT — unchanged
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function NewsletterViewer() {
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
//     check();
//     window.addEventListener('resize', check);
//     return () => window.removeEventListener('resize', check);
//   }, []);

//   if (isMobile === null) return null;

//   return isMobile ? <MobileViewer /> : <DesktopViewer />;
// }





















// fully functional code, only issue is the image resolution
// 'use client';

// import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
// import dynamic from 'next/dynamic';
// import {
//   Download, Maximize2, Minimize2,
//   ZoomIn, ZoomOut,
//   ChevronLeft, ChevronRight,
//   ChevronsLeft, ChevronsRight,
// } from 'lucide-react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// type AnyProps = Record<string, any>;

// const HTMLFlipBook = dynamic<AnyProps>(
//   () =>
//     import('react-pageflip').then(
//       (m) => m.default as unknown as React.ComponentType<AnyProps>,
//     ),
//   { ssr: false },
// );

// // ─── Config ───────────────────────────────────────────────────────────────────
// const TOTAL_PAGES  = 36;
// const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
// const IMG          = (n: number) => `/Assets/newsletterjpegs/pg${n}.jpg`;
// const MAX_BOOK_H   = 520;
// const ZOOM_MIN     = 1;
// const ZOOM_MAX     = 4;
// const MOBILE_BP    = 768;
// const WRAPPER_MULT = 1.8;

// const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// type FocusSide = 'left' | 'right' | 'center';

// // ─── Shared: Toolbar button ───────────────────────────────────────────────────
// function TBtn({ onClick, disabled = false, title, href, children }: {
//   onClick?: () => void; disabled?: boolean; title?: string;
//   href?: string; children: React.ReactNode;
// }) {
//   const cls =
//     'flex items-center justify-center w-9 h-9 rounded ' +
//     'text-[#aec2cc] hover:text-white hover:bg-[#1484bc]/25 ' +
//     'disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0';
//   if (href)
//     return <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>{children}</a>;
//   return <button onClick={onClick} disabled={disabled} title={title} className={cls}>{children}</button>;
// }

// // ─── Shared: Toolbar ──────────────────────────────────────────────────────────
// function Toolbar({
//   curPage, zoom, isZoomed, isFS,
//   onZoomOut, onZoomIn, onFirst, onPrev, onNext, onLast, onToggleFS, onJump,
// }: {
//   curPage: number; zoom: number; isZoomed: boolean; isFS: boolean;
//   onZoomOut: () => void; onZoomIn: () => void;
//   onFirst: () => void; onPrev: () => void; onNext: () => void; onLast: () => void;
//   onToggleFS: () => void; onJump: (n: number) => void;
// }) {
//   const displayPage = curPage + 1;
//   return (
//     <div className="bg-[#1e3143] border-t border-[#1484bc]/15 px-2 py-1.5 flex items-center justify-center gap-0.5 flex-shrink-0 z-30">
//       <TBtn onClick={onZoomOut} disabled={!isZoomed} title="Zoom out (−)">
//         <ZoomOut className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onFirst} title="First page">
//         <ChevronsLeft className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onPrev} title="Previous">
//         <ChevronLeft className="w-[18px] h-[18px]" />
//       </TBtn>
//       <div className="flex items-center gap-1 px-1">
//         <input
//           type="number" min={1} max={TOTAL_PAGES}
//           defaultValue={displayPage} key={displayPage}
//           onKeyDown={(e) => {
//             if (e.key !== 'Enter') return;
//             const n = parseInt((e.target as HTMLInputElement).value, 10);
//             if (n >= 1 && n <= TOTAL_PAGES) onJump(n - 1);
//           }}
//           className="w-9 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-1 py-0.5 text-xs outline-none"
//         />
//         <span className="text-[#aec2cc] text-xs whitespace-nowrap">/ {TOTAL_PAGES}</span>
//       </div>
//       <TBtn onClick={onNext} title="Next">
//         <ChevronRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onLast} title="Last page">
//         <ChevronsRight className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn href={DOWNLOAD_URL} title="Download PDF">
//         <Download className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onZoomIn} disabled={zoom >= ZOOM_MAX} title="Zoom in (+)">
//         <ZoomIn className="w-[18px] h-[18px]" />
//       </TBtn>
//       <TBtn onClick={onToggleFS} title={isFS ? 'Exit full screen' : 'Full screen'}>
//         {isFS ? <Minimize2 className="w-[18px] h-[18px]" /> : <Maximize2 className="w-[18px] h-[18px]" />}
//       </TBtn>
//     </div>
//   );
// }

// // ─── Shared: FlipPage ─────────────────────────────────────────────────────────
// const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
//   <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
//     {/* eslint-disable-next-line @next/next/no-img-element */}
//     <img
//       src={IMG(pageNum)}
//       alt={`Page ${pageNum}`}
//       className="w-full h-full object-cover"
//       loading={pageNum <= 6 ? 'eager' : 'lazy'}
//       draggable={false}
//     />
//   </div>
// ));
// FlipPage.displayName = 'FlipPage';

// // ═══════════════════════════════════════════════════════════════════════════════
// // MOBILE VIEWER
// // ═══════════════════════════════════════════════════════════════════════════════
// function MobileViewer() {
//   const [mounted,  setMounted]  = useState(false);
//   const [curPage,  setCurPage]  = useState(0);
//   const [bookH,    setBookH]    = useState(520);
//   const [zoom,     setZoom]     = useState(1);
//   const [pan,      setPan]      = useState({ x: 0, y: 0 });
//   const [isFS,     setIsFS]     = useState(false);

//   const zoomRef       = useRef(1);
//   const panRef        = useRef({ x: 0, y: 0 });
//   const bookHRef      = useRef(520);
//   const containerWRef = useRef(0);
//   const focusSideRef  = useRef<FocusSide>('right');
//   const curPageRef    = useRef(0);
//   const prevPageRef   = useRef(0);

//   zoomRef.current  = zoom;
//   panRef.current   = pan;
//   bookHRef.current = bookH;

//   const isZoomed = zoom > 1.01;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef        = useRef<any>(null);
//   const containerRef   = useRef<HTMLDivElement>(null);
//   const mainRef        = useRef<HTMLDivElement>(null);
//   const clipRef        = useRef<HTMLDivElement>(null);
//   const bookWrapperRef = useRef<HTMLDivElement>(null);

//   const getPanLimits = useCallback((z: number) => {
//     const W     = containerWRef.current;
//     const bH    = bookHRef.current;
//     const pageW = (WRAPPER_MULT * W) / 2;

//     const leftFocusPan  = W / 2 - pageW / 2;
//     const rightFocusPan = W / 2 - pageW - pageW / 2;

//     return {
//       xMin: Math.min(rightFocusPan, W * (1 - WRAPPER_MULT * z)),
//       xMax: leftFocusPan,
//       yMin: -(bH * (z - 1)),
//       yMax: 0,
//     };
//   }, []);

//   const applyPan = useCallback((x: number, y: number, z: number) => {
//     const lims = getPanLimits(z);
//     const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [getPanLimits]);

//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     const W     = containerWRef.current;
//     const pageW = (WRAPPER_MULT * W) / 2;
//     if (side === 'left')
//       return { x: W / 2 - pageW / 2,             y: 0 };
//     if (side === 'right')
//       return { x: W / 2 - pageW - pageW / 2,     y: 0 };
//     return   { x: -(W * (WRAPPER_MULT - 1)) / 2, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return;
//     focusSideRef.current = side;          // ref only — no state needed
//     const p = computePan(side);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
//     newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
//     const oldZ = zoomRef.current;
//     const W    = containerWRef.current;
//     const bH   = bookHRef.current;
//     const old  = panRef.current;
//     const px   = pivot?.x ?? W / 2;
//     const py   = pivot?.y ?? bH / 2;

//     if (newZ <= 1.01) {
//       setZoom(1); zoomRef.current = 1;
//       const p = computePan(focusSideRef.current);
//       setPan(p); panRef.current = p;
//       return;
//     }

//     const nx   = px - (px - old.x) * newZ / oldZ;
//     const ny   = py - (py - old.y) * newZ / oldZ;
//     const lims = getPanLimits(newZ);
//     setZoom(newZ); zoomRef.current = newZ;
//     const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [computePan, getPanLimits]);

//   const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     const el = clipRef.current;
//     if (!el) return;
//     const update = () => {
//       containerWRef.current = el.clientWidth;
//       if (zoomRef.current <= 1.01) {
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//       }
//     };
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     update();
//     return () => ro.disconnect();
//   }, [computePan, mounted]);

//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       const h   = Math.max(280, el.clientHeight - pad);
//       setBookH(h); bookHRef.current = h;
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el);
//     calc();
//     return () => ro.disconnect();
//   }, []);

//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) {
//         await containerRef.current?.requestFullscreen();
//       } else {
//         await document.exitFullscreen();
//       }
//     } catch {
//       // Browser may refuse (e.g. iframe sandbox) — fail silently
//     }
//   }, []);

//   useEffect(() => {
//     const onFsChange = () => setIsFS(!!document.fullscreenElement);
//     document.addEventListener('fullscreenchange', onFsChange);
//     return () => document.removeEventListener('fullscreenchange', onFsChange);
//   }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);
//     if (zoomRef.current <= 1.01) {
//       if (newPage === 0)       applyFocus('right');
//       else if (newPage > prev) applyFocus('left');
//       else                     applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goNext = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'right') {
//       if (curPageRef.current < TOTAL_PAGES - 1)
//         bookRef.current?.pageFlip()?.flipNext();
//     } else {
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'left') {
//       if (curPageRef.current > 0)
//         bookRef.current?.pageFlip()?.flipPrev();
//     } else {
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
//   const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);
//   const goJump  = useCallback((n: number) => { bookRef.current?.pageFlip()?.flip(n); }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':       resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
//         case '-':           zoomTo(zoomRef.current - 0.5); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

//   useEffect(() => {
//     const el = clipRef.current;
//     if (!el) return;

//     const g = {
//       pinching: false, pd0: 0, prevD: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.prevD = g.pd0;
//         g.pz0   = zoomRef.current;
//         return;
//       }
//       e.preventDefault(); e.stopPropagation();
//       const now = Date.now();
//       if (now - g.lastTap < 300) {
//         g.lastTap = 0; g.panning = false;
//         setZoom(1); zoomRef.current = 1;
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//         return;
//       }
//       g.lastTap = now;
//       g.panning = true; g.pinching = false;
//       g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//       g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d      = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const rect   = el.getBoundingClientRect();
//         const pivotX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
//         const pivotY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
//         const ratio  = g.prevD > 0 ? d / g.prevD : 1;
//         g.prevD      = d;
//         zoomTo(zoomRef.current * ratio, { x: pivotX, y: pivotY });
//         return;
//       }
//       if (e.touches.length === 1) {
//         e.preventDefault(); e.stopPropagation();
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//         applyPan(
//           g.tpx0 + e.touches[0].clientX - g.tx0,
//           g.tpy0 + e.touches[0].clientY - g.ty0,
//           zoomRef.current,
//         );
//       }
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) { g.pinching = false; g.prevD = 0; }
//       if (e.touches.length === 0) g.panning = false;
//     };

//     el.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     el.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     el.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     return () => {
//       el.removeEventListener('touchstart', onTouchStart, { capture: true });
//       el.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       el.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//     };
//   }, [applyPan, computePan, zoomTo, mounted]);

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       <main
//         ref={mainRef}
//         className="flex-1 flex items-center justify-center overflow-hidden"
//         style={{ padding: '4px 0' }}
//       >
//         {mounted && (
//           <div
//             ref={clipRef}
//             style={{
//               position: 'relative',
//               width: '100%',
//               overflow: 'hidden',
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             <div
//               ref={bookWrapperRef}
//               style={{
//                 width: `${WRAPPER_MULT * 100}%`,
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'left top',
//                 transition: 'transform 0.30s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"
//                 minWidth={100}
//                 maxWidth={99999}
//                 minHeight={200}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.5}
//                 showCover={true}
//                 mobileScrollSupport={false}
//                 useMouseEvents={false}
//                 drawShadow={true}
//                 flippingTime={1000}
//                 swipeDistance={99999}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
//                 className="bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — double tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && (
//         <Toolbar
//           curPage={curPage}
//           zoom={zoom}
//           isZoomed={isZoomed}
//           isFS={isFS}
//           onZoomOut={() => zoomTo(zoom - 0.5)}
//           onZoomIn={() => zoomTo(zoom + 0.5)}
//           onFirst={goFirst}
//           onPrev={goPrev}
//           onNext={goNext}
//           onLast={goLast}
//           onToggleFS={toggleFS}
//           onJump={goJump}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // DESKTOP VIEWER
// // ═══════════════════════════════════════════════════════════════════════════════
// function DesktopViewer() {
//   const [mounted,  setMounted]  = useState(false);
//   const [curPage,  setCurPage]  = useState(0);
//   const [isFS,     setIsFS]     = useState(false);
//   const [bookH,    setBookH]    = useState(MAX_BOOK_H);
//   const [zoom,     setZoom]     = useState(1);
//   const [pan,      setPan]      = useState({ x: 0, y: 0 });

//   const zoomRef        = useRef(1);
//   const panRef         = useRef({ x: 0, y: 0 });
//   const bookHRef       = useRef(MAX_BOOK_H);
//   const containerWRef  = useRef(0);
//   const focusSideRef   = useRef<FocusSide>('left');
//   const curPageRef     = useRef(0);
//   const prevPageRef    = useRef(0);

//   zoomRef.current  = zoom;
//   panRef.current   = pan;
//   bookHRef.current = bookH;

//   const isZoomed = zoom > 1.01;

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const bookRef          = useRef<any>(null);
//   const mainRef          = useRef<HTMLDivElement>(null);
//   const containerRef     = useRef<HTMLDivElement>(null);
//   const zoomContainerRef = useRef<HTMLDivElement>(null);
//   const overlayRef       = useRef<HTMLDivElement>(null);

//   const getPanLimits = useCallback((z: number) => {
//     const m = (z - 1) * 500;
//     return { xMin: -m, xMax: m, yMin: -(m * 0.8), yMax: m * 0.8 };
//   }, []);

//   const applyPan = useCallback((x: number, y: number, z: number) => {
//     const lims = getPanLimits(z);
//     const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [getPanLimits]);

//   const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
//     const spreadW = zoomContainerRef.current?.offsetWidth ?? 600;
//     const bookW   = Math.min(spreadW, 840);
//     const offset  = bookW / 4;
//     if (side === 'left')  return { x:  offset, y: 0 };
//     if (side === 'right') return { x: -offset, y: 0 };
//     return { x: 0, y: 0 };
//   }, []);

//   const applyFocus = useCallback((side: FocusSide) => {
//     if (zoomRef.current > 1.01) return;
//     focusSideRef.current = side;
//     const p = computePan(side);
//     setPan(p); panRef.current = p;
//   }, [computePan]);

//   const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
//     newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
//     const oldZ = zoomRef.current;
//     const W    = containerWRef.current;
//     const bH   = bookHRef.current;
//     const old  = panRef.current;
//     const px   = pivot?.x ?? W / 2;
//     const py   = pivot?.y ?? bH / 2;

//     if (newZ <= 1.01) {
//       setZoom(1); zoomRef.current = 1;
//       const p = computePan(focusSideRef.current);
//       setPan(p); panRef.current = p;
//       return;
//     }

//     const nx = px - (px - old.x) * newZ / oldZ;
//     const ny = py - (py - old.y) * newZ / oldZ;
//     const lims = getPanLimits(newZ);

//     setZoom(newZ); zoomRef.current = newZ;
//     const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
//     setPan(np); panRef.current = np;
//   }, [computePan, getPanLimits]);

//   const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

//   useEffect(() => { setMounted(true); }, []);

//   useEffect(() => {
//     const el = zoomContainerRef.current;
//     if (!el) return;
//     const update = () => {
//       containerWRef.current = el.clientWidth;
//       if (zoomRef.current <= 1.01) {
//         const p = computePan(focusSideRef.current);
//         setPan(p); panRef.current = p;
//       }
//     };
//     const ro = new ResizeObserver(update);
//     ro.observe(el);
//     update();
//     return () => ro.disconnect();
//   }, [computePan, mounted]);

//   useEffect(() => {
//     const el = mainRef.current;
//     if (!el) return;
//     const calc = () => {
//       const s   = getComputedStyle(el);
//       const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
//       const h   = Math.max(280, Math.min(el.clientHeight - pad, MAX_BOOK_H));
//       setBookH(h); bookHRef.current = h;
//     };
//     const ro = new ResizeObserver(calc);
//     ro.observe(el);
//     calc();
//     return () => ro.disconnect();
//   }, []);

//   const toggleFS = useCallback(async () => {
//     try {
//       if (!document.fullscreenElement) await containerRef.current?.requestFullscreen();
//       else await document.exitFullscreen();
//     } catch { /* ignore */ }
//   }, []);

//   useEffect(() => {
//     const h = () => { setIsFS(!!document.fullscreenElement); resetZoom(); };
//     document.addEventListener('fullscreenchange', h);
//     return () => document.removeEventListener('fullscreenchange', h);
//   }, [resetZoom]);

//   useEffect(() => {
//     if (!mounted) return;
//     const m = window.location.hash.match(/page\/(\d+)/);
//     if (!m) return;
//     const n = parseInt(m[1], 10);
//     if (n >= 1 && n <= TOTAL_PAGES)
//       setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
//   }, [mounted]);

//   const handleFlip = useCallback((e: { data: number }) => {
//     const newPage = e.data;
//     const prev    = prevPageRef.current;
//     prevPageRef.current = newPage;
//     curPageRef.current  = newPage;
//     setCurPage(newPage);
//     window.history.replaceState(null, '', `#page/${newPage + 1}`);
//     if (zoomRef.current <= 1.01) {
//       if (newPage === 0)       applyFocus('center');
//       else if (newPage > prev) applyFocus('left');
//       else                     applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goNext = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'right') {
//       if (curPageRef.current < TOTAL_PAGES - 1)
//         bookRef.current?.pageFlip()?.flipNext();
//     } else {
//       applyFocus('right');
//     }
//   }, [applyFocus]);

//   const goPrev = useCallback(() => {
//     const onCover = curPageRef.current === 0;
//     if (onCover || focusSideRef.current === 'left') {
//       if (curPageRef.current > 0)
//         bookRef.current?.pageFlip()?.flipPrev();
//     } else {
//       applyFocus('left');
//     }
//   }, [applyFocus]);

//   const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
//   const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);
//   const goJump  = useCallback((n: number) => { bookRef.current?.pageFlip()?.flip(n); }, []);

//   useEffect(() => {
//     if (!mounted) return;
//     const h = (e: KeyboardEvent) => {
//       if (e.ctrlKey || e.metaKey) return;
//       switch (e.key) {
//         case 'Escape':       resetZoom(); break;
//         case 'f': case 'F': toggleFS(); break;
//         case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
//         case '-':           zoomTo(zoomRef.current - 0.5); break;
//         case 'ArrowRight': case 'PageDown': goNext(); break;
//         case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
//       }
//     };
//     window.addEventListener('keydown', h);
//     return () => window.removeEventListener('keydown', h);
//   }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

//   useEffect(() => {
//     const container = zoomContainerRef.current;
//     const overlay   = overlayRef.current;
//     if (!container || !overlay) return;

//     const g = {
//       pinching: false, pd0: 0, pz0: 1,
//       panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
//       lastTap:  0,
//       md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
//     };

//     const onTouchStart = (e: TouchEvent) => {
//       if (e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         g.pinching = true; g.panning = false;
//         g.pd0 = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         g.pz0 = zoomRef.current;
//         return;
//       }
//       const zoomed = zoomRef.current > 1.01;
//       if (zoomed) {
//         e.preventDefault(); e.stopPropagation();
//         const now = Date.now();
//         if (now - g.lastTap < 300) {
//           g.lastTap = 0; g.panning = false;
//           setZoom(1); zoomRef.current = 1;
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//           return;
//         }
//         g.lastTap = now;
//         g.panning = true; g.pinching = false;
//         g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//         g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//       }
//     };

//     const onTouchMove = (e: TouchEvent) => {
//       if (g.pinching && e.touches.length >= 2) {
//         e.preventDefault(); e.stopPropagation();
//         const d  = Math.hypot(
//           e.touches[0].clientX - e.touches[1].clientX,
//           e.touches[0].clientY - e.touches[1].clientY,
//         );
//         const newZ = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
//         zoomRef.current = newZ; setZoom(newZ);
//         if (newZ <= 1.01) {
//           const p = computePan(focusSideRef.current);
//           setPan(p); panRef.current = p;
//         }
//         return;
//       }
//       if (e.touches.length === 1) {
//         const zoomed = zoomRef.current > 1.01;
//         if (!zoomed) return;
//         e.preventDefault(); e.stopPropagation();
//         if (!g.panning) {
//           g.panning = true;
//           g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
//           g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
//         }
//         applyPan(
//           g.tpx0 + e.touches[0].clientX - g.tx0,
//           g.tpy0 + e.touches[0].clientY - g.ty0,
//           zoomRef.current,
//         );
//       }
//     };

//     const onTouchEnd = (e: TouchEvent) => {
//       if (e.touches.length < 2) g.pinching = false;
//       if (e.touches.length === 0) g.panning = false;
//     };

//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault();
//       const rect  = container.getBoundingClientRect();
//       const pivot = { x: e.clientX - rect.left, y: e.clientY - rect.top };
//       const d     = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
//       zoomTo(zoomRef.current - d / 480, pivot);
//     };

//     const onMD = (e: MouseEvent) => {
//       e.preventDefault(); g.md = true;
//       g.mx0 = e.clientX; g.my0 = e.clientY;
//       g.px0 = panRef.current.x; g.py0 = panRef.current.y;
//     };
//     const onMM = (e: MouseEvent) => {
//       if (!g.md) return;
//       applyPan(g.px0 + e.clientX - g.mx0, g.py0 + e.clientY - g.my0, zoomRef.current);
//     };
//     const onMU = () => { g.md = false; };

//     container.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
//     container.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
//     container.addEventListener('touchend',   onTouchEnd,   { capture: true });
//     container.addEventListener('wheel',      onWheel,      { capture: true, passive: false });
//     overlay.addEventListener('mousedown', onMD);
//     window.addEventListener('mousemove',  onMM);
//     window.addEventListener('mouseup',    onMU);

//     return () => {
//       container.removeEventListener('touchstart', onTouchStart, { capture: true });
//       container.removeEventListener('touchmove',  onTouchMove,  { capture: true });
//       container.removeEventListener('touchend',   onTouchEnd,   { capture: true });
//       container.removeEventListener('wheel',      onWheel,      { capture: true });
//       overlay.removeEventListener('mousedown', onMD);
//       window.removeEventListener('mousemove',  onMM);
//       window.removeEventListener('mouseup',    onMU);
//     };
//   }, [applyPan, computePan, zoomTo, mounted]);

//   return (
//     <div
//       ref={containerRef}
//       className="fixed inset-0 flex flex-col z-40"
//       style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
//     >
//       <main
//         ref={mainRef}
//         className="flex-1 flex items-center justify-center overflow-hidden"
//         style={{ padding: '8px 24px' }}
//       >
//         {mounted && (
//           <div
//             ref={zoomContainerRef}
//             className="relative w-full overflow-visible mx-auto"
//             style={{
//               maxWidth: '900px',
//               touchAction: 'none',
//               cursor: isZoomed ? 'grab' : 'default',
//             }}
//           >
//             <div
//               style={{
//                 width: '100%',
//                 transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
//                 transformOrigin: 'left top',
//                 transition: 'transform 0.15s ease-out',
//                 willChange: 'transform',
//               }}
//             >
//               <HTMLFlipBook
//                 ref={bookRef}
//                 width={520}
//                 height={720}
//                 size="stretch"
//                 display="double"
//                 minWidth={100}
//                 maxWidth={420}
//                 minHeight={200}
//                 maxHeight={bookH}
//                 maxShadowOpacity={0.5}
//                 showCover={true}
//                 mobileScrollSupport={false}
//                 useMouseEvents={true}
//                 drawShadow={true}
//                 flippingTime={650}
//                 swipeDistance={30}
//                 onFlip={handleFlip}
//                 className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
//               >
//                 {Array.from({ length: TOTAL_PAGES }, (_, i) => (
//                   <FlipPage key={i + 1} pageNum={i + 1} />
//                 ))}
//               </HTMLFlipBook>
//             </div>

//             <div
//               ref={overlayRef}
//               style={{
//                 position: 'absolute', inset: 0, zIndex: 10,
//                 pointerEvents: isZoomed ? 'auto' : 'none',
//                 cursor: isZoomed ? 'grab' : 'default',
//                 userSelect: 'none',
//               }}
//             />

//             {isZoomed && (
//               <button
//                 onClick={resetZoom}
//                 style={{ zIndex: 20 }}
//                 className="absolute bottom-3 left-1/2 -translate-x-1/2
//                   bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
//                   text-[#aec2cc] hover:text-white hover:border-[#1484bc]
//                   text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
//               >
//                 {zoom.toFixed(1)}× — double tap to reset
//               </button>
//             )}
//           </div>
//         )}
//       </main>

//       {mounted && (
//         <Toolbar
//           curPage={curPage}
//           zoom={zoom}
//           isZoomed={isZoomed}
//           isFS={isFS}
//           onZoomOut={() => zoomTo(zoom - 0.5)}
//           onZoomIn={() => zoomTo(zoom + 0.5)}
//           onFirst={goFirst}
//           onPrev={goPrev}
//           onNext={goNext}
//           onLast={goLast}
//           onToggleFS={toggleFS}
//           onJump={goJump}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════════
// // ROOT
// // ═══════════════════════════════════════════════════════════════════════════════
// export default function NewsletterViewer() {
//   const [isMobile, setIsMobile] = useState<boolean | null>(null);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
//     check();
//     window.addEventListener('resize', check);
//     return () => window.removeEventListener('resize', check);
//   }, []);

//   if (isMobile === null) return null;

//   return isMobile ? <MobileViewer /> : <DesktopViewer />;
// }











































'use client';

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Download, Maximize2, Minimize2,
  ZoomIn, ZoomOut,
  ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight,
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProps = Record<string, any>;

const HTMLFlipBook = dynamic<AnyProps>(
  () => import('react-pageflip').then((m) => m.default as unknown as React.ComponentType<AnyProps>),
  { ssr: false },
);

// ─── Config ───────────────────────────────────────────────────────────────────
const TOTAL_PAGES  = 36;
const DOWNLOAD_URL = 'https://drive.google.com/uc?export=download&id=1ZeymzZzCOQIaqtIiOjhncyw6jV_mJxfT';
const IMG          = (n: number) => `/Assets/newsletterjpegs/${n}.jpg`;
const MAX_BOOK_H   = 520;
const ZOOM_MIN     = 1;
const ZOOM_MAX     = 4;
const MOBILE_BP    = 768;
const WRAPPER_MULT = 1.8;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type FocusSide = 'left' | 'right' | 'center';

// ─── Shared: Toolbar button ───────────────────────────────────────────────────
function TBtn({ onClick, disabled = false, title, href, children }: {
  onClick?: () => void; disabled?: boolean; title?: string;
  href?: string; children: React.ReactNode;
}) {
  const cls =
    'flex items-center justify-center w-9 h-9 rounded ' +
    'text-[#aec2cc] hover:text-white hover:bg-[#1484bc]/25 ' +
    'disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0';
  if (href)
    return <a href={href} target="_blank" rel="noopener noreferrer" title={title} className={cls}>{children}</a>;
  return <button onClick={onClick} disabled={disabled} title={title} className={cls}>{children}</button>;
}

// ─── Shared: Toolbar ──────────────────────────────────────────────────────────
function Toolbar({
  curPage, zoom, isZoomed, isFS,
  onZoomOut, onZoomIn, onFirst, onPrev, onNext, onLast, onToggleFS, onJump,
}: {
  curPage: number; zoom: number; isZoomed: boolean; isFS: boolean;
  onZoomOut: () => void; onZoomIn: () => void;
  onFirst: () => void; onPrev: () => void; onNext: () => void; onLast: () => void;
  onToggleFS: () => void; onJump: (n: number) => void;
}) {
  const displayPage = curPage + 1;
  return (
    <div className="bg-[#1e3143] border-t border-[#1484bc]/15 px-2 py-1.5 flex items-center justify-center gap-0.5 flex-shrink-0 z-30">
      <TBtn onClick={onZoomOut} disabled={!isZoomed} title="Zoom out (−)">
        <ZoomOut className="w-[18px] h-[18px]" />
      </TBtn>
      <TBtn onClick={onFirst} title="First page">
        <ChevronsLeft className="w-[18px] h-[18px]" />
      </TBtn>
      <TBtn onClick={onPrev} title="Previous">
        <ChevronLeft className="w-[18px] h-[18px]" />
      </TBtn>
      <div className="flex items-center gap-1 px-1">
        <input
          type="number" min={1} max={TOTAL_PAGES}
          defaultValue={displayPage} key={displayPage}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            const n = parseInt((e.target as HTMLInputElement).value, 10);
            if (n >= 1 && n <= TOTAL_PAGES) onJump(n - 1);
          }}
          className="w-9 text-center bg-[#0d1f2e] border border-[#1484bc]/30 text-[#fafbf9] rounded px-1 py-0.5 text-xs outline-none"
        />
        <span className="text-[#aec2cc] text-xs whitespace-nowrap">/ {TOTAL_PAGES}</span>
      </div>
      <TBtn onClick={onNext} title="Next">
        <ChevronRight className="w-[18px] h-[18px]" />
      </TBtn>
      <TBtn onClick={onLast} title="Last page">
        <ChevronsRight className="w-[18px] h-[18px]" />
      </TBtn>
      <TBtn href={DOWNLOAD_URL} title="Download PDF">
        <Download className="w-[18px] h-[18px]" />
      </TBtn>
      <TBtn onClick={onZoomIn} disabled={zoom >= ZOOM_MAX} title="Zoom in (+)">
        <ZoomIn className="w-[18px] h-[18px]" />
      </TBtn>
      <TBtn onClick={onToggleFS} title={isFS ? 'Exit full screen' : 'Full screen'}>
        {isFS ? <Minimize2 className="w-[18px] h-[18px]" /> : <Maximize2 className="w-[18px] h-[18px]" />}
      </TBtn>
    </div>
  );
}

// ─── Shared: FlipPage ─────────────────────────────────────────────────────────
const FlipPage = forwardRef<HTMLDivElement, { pageNum: number }>(({ pageNum }, ref) => (
  <div ref={ref} className="relative w-full h-full bg-white overflow-hidden select-none">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
  src={IMG(pageNum)}
  alt={`Page ${pageNum}`}
  className="w-full h-full object-contain"
  loading={pageNum <= 6 ? 'eager' : 'lazy'}
  draggable={false}
    decoding="async"
  style={{
    imageRendering: 'auto',
    backfaceVisibility: 'hidden',
    transform: 'translateZ(0)',
    WebkitFontSmoothing: 'antialiased',
  }}
/>
  </div>
));
FlipPage.displayName = 'FlipPage';

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE VIEWER
// ═══════════════════════════════════════════════════════════════════════════════
function MobileViewer() {
  const [mounted,   setMounted]   = useState(false);
  const [curPage,   setCurPage]   = useState(0);
  const [bookH,     setBookH]     = useState(520);
  const [zoom,      setZoom]      = useState(1);
  const [pan,       setPan]       = useState({ x: 0, y: 0 });
  const [isFS,      setIsFS]      = useState(false);
  // const [focusSide, setFocusSide] = useState<FocusSide>('right');
// added this comment for a new commit
  const zoomRef       = useRef(1);
  const panRef        = useRef({ x: 0, y: 0 });
  const bookHRef      = useRef(520);
  const containerWRef = useRef(0);
  const focusSideRef  = useRef<FocusSide>('right');
  const curPageRef    = useRef(0);
  const prevPageRef   = useRef(0);

  zoomRef.current  = zoom;
  panRef.current   = pan;
  bookHRef.current = bookH;

  const isZoomed = zoom > 1.01;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef        = useRef<any>(null);
  const containerRef   = useRef<HTMLDivElement>(null);
  const mainRef        = useRef<HTMLDivElement>(null);
  const clipRef        = useRef<HTMLDivElement>(null);
  const bookWrapperRef = useRef<HTMLDivElement>(null);

  // ── Pan limits ───────────────────────────────────────────────────────────────
  //
  // pageW  = WRAPPER_MULT * W / 2  (each page width inside the 150% wrapper)
  //
  // leftFocusPan  = W/2 - pageW/2  = the pan that centres the left  page → ~+0.05W
  // rightFocusPan = W/2 - 3*pageW/2 = the pan that centres the right page → ~-0.85W
  //
  // xMax = leftFocusPan
  //   Prevents panning further right than the left-focus position.
  //   Beyond this point the wrapper shifts off the left edge of the viewport,
  //   exposing empty dark background — exactly the bug being fixed.
  //
  // xMin = min(rightFocusPan, W*(1 - WRAPPER_MULT*z))
  //   At z=1: ensures the right-focus position is always reachable.
  //   At z>1: expands leftward so the full zoomed wrapper stays scrollable.
  const getPanLimits = useCallback((z: number) => {
    const W     = containerWRef.current;
    const bH    = bookHRef.current;
    const pageW = (WRAPPER_MULT * W) / 2;

    const leftFocusPan  = W / 2 - pageW / 2;           // ~+0.05W
    const rightFocusPan = W / 2 - pageW - pageW / 2;   // ~-0.85W

    return {
      xMin: Math.min(rightFocusPan, W * (1 - WRAPPER_MULT * z)),
      xMax: leftFocusPan,
      yMin: -(bH * (z - 1)),
      yMax: 0,
    };
  }, []);

  const applyPan = useCallback((x: number, y: number, z: number) => {
    const lims = getPanLimits(z);
    const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
    setPan(np); panRef.current = np;
  }, [getPanLimits]);

  // ── computePan ───────────────────────────────────────────────────────────────
  const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
    const W     = containerWRef.current;
    const pageW = (WRAPPER_MULT * W) / 2;
    if (side === 'left')
      return { x: W / 2 - pageW / 2,           y: 0 };
    if (side === 'right')
      return { x: W / 2 - pageW - pageW / 2,   y: 0 };
    return   { x: -(W * (WRAPPER_MULT - 1)) / 2, y: 0 };
  }, []);

  const applyFocus = useCallback((side: FocusSide) => {
    if (zoomRef.current > 1.01) return;
    focusSideRef.current = side;
    // setFocusSide(side);
    const p = computePan(side);
    setPan(p); panRef.current = p;
  }, [computePan]);

  // ── zoomTo ───────────────────────────────────────────────────────────────────
  const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
    newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
    const oldZ = zoomRef.current;
    const W    = containerWRef.current;
    const bH   = bookHRef.current;
    const old  = panRef.current;
    const px   = pivot?.x ?? W / 2;
    const py   = pivot?.y ?? bH / 2;

    if (newZ <= 1.01) {
      setZoom(1); zoomRef.current = 1;
      const p = computePan(focusSideRef.current);
      setPan(p); panRef.current = p;
      return;
    }

    const nx   = px - (px - old.x) * newZ / oldZ;
    const ny   = py - (py - old.y) * newZ / oldZ;
    const lims = getPanLimits(newZ);
    setZoom(newZ); zoomRef.current = newZ;
    const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
    setPan(np); panRef.current = np;
  }, [computePan, getPanLimits]);

  const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const el = clipRef.current;
    if (!el) return;
    const update = () => {
      containerWRef.current = el.clientWidth;
      if (zoomRef.current <= 1.01) {
        const p = computePan(focusSideRef.current);
        setPan(p); panRef.current = p;
      }
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [computePan, mounted]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const calc = () => {
      const s   = getComputedStyle(el);
      const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
      const h   = Math.max(280, el.clientHeight - pad);
      setBookH(h); bookHRef.current = h;
    };
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    calc();
    return () => ro.disconnect();
  }, []);

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

  useEffect(() => {
    if (!mounted) return;
    const m = window.location.hash.match(/page\/(\d+)/);
    if (!m) return;
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= TOTAL_PAGES)
      setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
  }, [mounted]);

  const handleFlip = useCallback((e: { data: number }) => {
    const newPage = e.data;
    const prev    = prevPageRef.current;
    prevPageRef.current = newPage;
    curPageRef.current  = newPage;
    setCurPage(newPage);
    window.history.replaceState(null, '', `#page/${newPage + 1}`);
    if (zoomRef.current <= 1.01) {
      if (newPage === 0)       applyFocus('right');
      else if (newPage > prev) applyFocus('left');
      else                     applyFocus('right');
    }
  }, [applyFocus]);

  const goNext = useCallback(() => {
    const onCover = curPageRef.current === 0;
    if (onCover || focusSideRef.current === 'right') {
      if (curPageRef.current < TOTAL_PAGES - 1)
        bookRef.current?.pageFlip()?.flipNext();
    } else {
      applyFocus('right');
    }
  }, [applyFocus]);

  const goPrev = useCallback(() => {
    const onCover = curPageRef.current === 0;
    if (onCover || focusSideRef.current === 'left') {
      if (curPageRef.current > 0)
        bookRef.current?.pageFlip()?.flipPrev();
    } else {
      applyFocus('left');
    }
  }, [applyFocus]);

  const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
  const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);
  const goJump  = useCallback((n: number) => { bookRef.current?.pageFlip()?.flip(n); }, []);

  useEffect(() => {
    if (!mounted) return;
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      switch (e.key) {
        case 'Escape':       resetZoom(); break;
        case 'f': case 'F': toggleFS(); break;
        case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
        case '-':           zoomTo(zoomRef.current - 0.5); break;
        case 'ArrowRight': case 'PageDown': goNext(); break;
        case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

  useEffect(() => {
    const el = clipRef.current;
    if (!el) return;

    const g = {
      pinching: false, pd0: 0, prevD: 0, pz0: 1,
      panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
      lastTap:  0,
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        e.preventDefault(); e.stopPropagation();
        g.pinching = true; g.panning = false;
        g.pd0 = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        g.prevD = g.pd0;
        g.pz0   = zoomRef.current;
        return;
      }
      e.preventDefault(); e.stopPropagation();
      const now = Date.now();
      if (now - g.lastTap < 300) {
        g.lastTap = 0; g.panning = false;
        setZoom(1); zoomRef.current = 1;
        const p = computePan(focusSideRef.current);
        setPan(p); panRef.current = p;
        return;
      }
      g.lastTap = now;
      g.panning = true; g.pinching = false;
      g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
      g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (g.pinching && e.touches.length >= 2) {
        e.preventDefault(); e.stopPropagation();
        const d      = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const rect   = el.getBoundingClientRect();
        const pivotX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const pivotY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
        const ratio  = g.prevD > 0 ? d / g.prevD : 1;
        g.prevD      = d;
        zoomTo(zoomRef.current * ratio, { x: pivotX, y: pivotY });
        return;
      }
      if (e.touches.length === 1) {
        e.preventDefault(); e.stopPropagation();
        if (!g.panning) {
          g.panning = true;
          g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
          g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
        }
        applyPan(
          g.tpx0 + e.touches[0].clientX - g.tx0,
          g.tpy0 + e.touches[0].clientY - g.ty0,
          zoomRef.current,
        );
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) { g.pinching = false; g.prevD = 0; }
      if (e.touches.length === 0) g.panning = false;
    };

    el.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
    el.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
    el.addEventListener('touchend',   onTouchEnd,   { capture: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart, { capture: true });
      el.removeEventListener('touchmove',  onTouchMove,  { capture: true });
      el.removeEventListener('touchend',   onTouchEnd,   { capture: true });
    };
  }, [applyPan, computePan, zoomTo, mounted]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col z-40"
      style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
    >
      <main
        ref={mainRef}
        className="flex-1 flex items-center justify-center overflow-hidden"
        style={{ padding: '4px 0' }}
      >
        {mounted && (
          <div
            ref={clipRef}
            style={{
              position: 'relative',
              width: '100%',
              overflow: 'hidden',
              touchAction: 'none',
              cursor: isZoomed ? 'grab' : 'default',
            }}
          >
            <div
              ref={bookWrapperRef}
              style={{
                width: `${WRAPPER_MULT * 100}%`,
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: 'left top',
                transition: 'transform 0.30s ease-out',
                willChange: 'transform',
              }}
            >
              <HTMLFlipBook
                ref={bookRef}
                width={520}
                height={720}
                size="stretch"
                display="double"
                minWidth={100}
                maxWidth={99999}
                minHeight={200}
                maxHeight={bookH}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={false}
                useMouseEvents={false}
                drawShadow={true}
                flippingTime={1000}
                swipeDistance={99999}
                onFlip={handleFlip}
                className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              >
                {Array.from({ length: TOTAL_PAGES }, (_, i) => (
                  <FlipPage key={i + 1} pageNum={i + 1} />
                ))}
              </HTMLFlipBook>
            </div>

            {isZoomed && (
              <button
                onClick={resetZoom}
                style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}
                className="bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
                  text-[#aec2cc] hover:text-white hover:border-[#1484bc]
                  text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
              >
                {zoom.toFixed(1)}× — tap to reset
              </button>
            )}
          </div>
        )}
      </main>

      {mounted && (
        <Toolbar
          curPage={curPage}
          zoom={zoom}
          isZoomed={isZoomed}
          isFS={isFS}
          onZoomOut={() => zoomTo(zoom - 0.5)}
          onZoomIn={() => zoomTo(zoom + 0.5)}
          onFirst={goFirst}
          onPrev={goPrev}
          onNext={goNext}
          onLast={goLast}
          onToggleFS={toggleFS}
          onJump={goJump}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DESKTOP VIEWER — unchanged
// ═══════════════════════════════════════════════════════════════════════════════
function DesktopViewer() {
  const [mounted,  setMounted]  = useState(false);
  const [curPage,  setCurPage]  = useState(0);
  const [isFS,     setIsFS]     = useState(false);
  const [bookH,    setBookH]    = useState(MAX_BOOK_H);
  const [zoom,     setZoom]     = useState(1);
  const [pan,      setPan]      = useState({ x: 0, y: 0 });

  const zoomRef        = useRef(1);
  const panRef         = useRef({ x: 0, y: 0 });
  const bookHRef       = useRef(MAX_BOOK_H);
  const containerWRef  = useRef(0);
  const focusSideRef   = useRef<FocusSide>('left');
  const curPageRef     = useRef(0);
  const prevPageRef    = useRef(0);

  zoomRef.current  = zoom;
  panRef.current   = pan;
  bookHRef.current = bookH;

  const isZoomed = zoom > 1.01;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef          = useRef<any>(null);
  const mainRef          = useRef<HTMLDivElement>(null);
  const containerRef     = useRef<HTMLDivElement>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef       = useRef<HTMLDivElement>(null);

  const getPanLimits = useCallback((z: number) => {
    const m = (z - 1) * 500;
    return { xMin: -m, xMax: m, yMin: -(m * 0.8), yMax: m * 0.8 };
  }, []);

  const applyPan = useCallback((x: number, y: number, z: number) => {
    const lims = getPanLimits(z);
    const np   = { x: clamp(x, lims.xMin, lims.xMax), y: clamp(y, lims.yMin, lims.yMax) };
    setPan(np); panRef.current = np;
  }, [getPanLimits]);

  const computePan = useCallback((side: FocusSide): { x: number; y: number } => {
    const spreadW = zoomContainerRef.current?.offsetWidth ?? 600;
    const bookW   = Math.min(spreadW, 840);
    const offset  = bookW / 4;
    if (side === 'left')  return { x:  offset, y: 0 };
    if (side === 'right') return { x: -offset, y: 0 };
    return { x: 0, y: 0 };
  }, []);

  const applyFocus = useCallback((side: FocusSide) => {
    if (zoomRef.current > 1.01) return;
    focusSideRef.current = side;
    const p = computePan(side);
    setPan(p); panRef.current = p;
  }, [computePan]);

  const zoomTo = useCallback((newZ: number, pivot?: { x: number; y: number }) => {
    newZ = clamp(newZ, ZOOM_MIN, ZOOM_MAX);
    const oldZ = zoomRef.current;
    const W    = containerWRef.current;
    const bH   = bookHRef.current;
    const old  = panRef.current;
    const px   = pivot?.x ?? W / 2;
    const py   = pivot?.y ?? bH / 2;

    if (newZ <= 1.01) {
      setZoom(1); zoomRef.current = 1;
      const p = computePan(focusSideRef.current);
      setPan(p); panRef.current = p;
      return;
    }

    const nx = px - (px - old.x) * newZ / oldZ;
    const ny = py - (py - old.y) * newZ / oldZ;
    const lims = getPanLimits(newZ);

    setZoom(newZ); zoomRef.current = newZ;
    const np = { x: clamp(nx, lims.xMin, lims.xMax), y: clamp(ny, lims.yMin, lims.yMax) };
    setPan(np); panRef.current = np;
  }, [computePan, getPanLimits]);

  const resetZoom = useCallback(() => zoomTo(1), [zoomTo]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const el = zoomContainerRef.current;
    if (!el) return;
    const update = () => {
      containerWRef.current = el.clientWidth;
      if (zoomRef.current <= 1.01) {
        const p = computePan(focusSideRef.current);
        setPan(p); panRef.current = p;
      }
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, [computePan, mounted]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const calc = () => {
      const s   = getComputedStyle(el);
      const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
      const h   = Math.max(280, Math.min(el.clientHeight - pad, MAX_BOOK_H));
      setBookH(h); bookHRef.current = h;
    };
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    calc();
    return () => ro.disconnect();
  }, []);

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

  useEffect(() => {
    if (!mounted) return;
    const m = window.location.hash.match(/page\/(\d+)/);
    if (!m) return;
    const n = parseInt(m[1], 10);
    if (n >= 1 && n <= TOTAL_PAGES)
      setTimeout(() => bookRef.current?.pageFlip()?.flip(n - 1), 350);
  }, [mounted]);

  const handleFlip = useCallback((e: { data: number }) => {
    const newPage = e.data;
    const prev    = prevPageRef.current;
    prevPageRef.current = newPage;
    curPageRef.current  = newPage;
    setCurPage(newPage);
    window.history.replaceState(null, '', `#page/${newPage + 1}`);
    if (zoomRef.current <= 1.01) {
      if (newPage === 0)       applyFocus('center');
      else if (newPage > prev) applyFocus('left');
      else                     applyFocus('right');
    }
  }, [applyFocus]);

  const goNext = useCallback(() => {
    const onCover = curPageRef.current === 0;
    if (onCover || focusSideRef.current === 'right') {
      if (curPageRef.current < TOTAL_PAGES - 1)
        bookRef.current?.pageFlip()?.flipNext();
    } else {
      applyFocus('right');
    }
  }, [applyFocus]);

  const goPrev = useCallback(() => {
    const onCover = curPageRef.current === 0;
    if (onCover || focusSideRef.current === 'left') {
      if (curPageRef.current > 0)
        bookRef.current?.pageFlip()?.flipPrev();
    } else {
      applyFocus('left');
    }
  }, [applyFocus]);

  const goFirst = useCallback(() => { bookRef.current?.pageFlip()?.flip(0); }, []);
  const goLast  = useCallback(() => { bookRef.current?.pageFlip()?.flip(TOTAL_PAGES - 1); }, []);
  const goJump  = useCallback((n: number) => { bookRef.current?.pageFlip()?.flip(n); }, []);

  useEffect(() => {
    if (!mounted) return;
    const h = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) return;
      switch (e.key) {
        case 'Escape':       resetZoom(); break;
        case 'f': case 'F': toggleFS(); break;
        case '+': case '=': zoomTo(zoomRef.current + 0.5); break;
        case '-':           zoomTo(zoomRef.current - 0.5); break;
        case 'ArrowRight': case 'PageDown': goNext(); break;
        case 'ArrowLeft':  case 'PageUp':   goPrev(); break;
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [mounted, goNext, goPrev, resetZoom, toggleFS, zoomTo]);

  useEffect(() => {
    const container = zoomContainerRef.current;
    const overlay   = overlayRef.current;
    if (!container || !overlay) return;

    const g = {
      pinching: false, pd0: 0, pz0: 1,
      panning:  false, tx0: 0, ty0: 0, tpx0: 0, tpy0: 0,
      lastTap:  0,
      md: false, mx0: 0, my0: 0, px0: 0, py0: 0,
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length >= 2) {
        e.preventDefault(); e.stopPropagation();
        g.pinching = true; g.panning = false;
        g.pd0 = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        g.pz0 = zoomRef.current;
        return;
      }
      const zoomed = zoomRef.current > 1.01;
      if (zoomed) {
        e.preventDefault(); e.stopPropagation();
        const now = Date.now();
        if (now - g.lastTap < 300) {
          g.lastTap = 0; g.panning = false;
          setZoom(1); zoomRef.current = 1;
          const p = computePan(focusSideRef.current);
          setPan(p); panRef.current = p;
          return;
        }
        g.lastTap = now;
        g.panning = true; g.pinching = false;
        g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
        g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (g.pinching && e.touches.length >= 2) {
        e.preventDefault(); e.stopPropagation();
        const d  = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        );
        const newZ = clamp(g.pz0 * (d / g.pd0), ZOOM_MIN, ZOOM_MAX);
        zoomRef.current = newZ; setZoom(newZ);
        if (newZ <= 1.01) {
          const p = computePan(focusSideRef.current);
          setPan(p); panRef.current = p;
        }
        return;
      }
      if (e.touches.length === 1) {
        const zoomed = zoomRef.current > 1.01;
        if (!zoomed) return;
        e.preventDefault(); e.stopPropagation();
        if (!g.panning) {
          g.panning = true;
          g.tx0  = e.touches[0].clientX; g.ty0  = e.touches[0].clientY;
          g.tpx0 = panRef.current.x;     g.tpy0 = panRef.current.y;
        }
        applyPan(
          g.tpx0 + e.clientX - g.mx0,
          g.tpy0 + e.clientY - g.my0,
          zoomRef.current,
        );
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) g.pinching = false;
      if (e.touches.length === 0) g.panning = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect  = container.getBoundingClientRect();
      const pivot = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const d     = e.deltaMode === 1 ? e.deltaY * 30 : e.deltaY;
      zoomTo(zoomRef.current - d / 480, pivot);
    };

    const onMD = (e: MouseEvent) => {
      e.preventDefault(); g.md = true;
      g.mx0 = e.clientX; g.my0 = e.clientY;
      g.px0 = panRef.current.x; g.py0 = panRef.current.y;
    };
    const onMM = (e: MouseEvent) => {
      if (!g.md) return;
      applyPan(g.px0 + e.clientX - g.mx0, g.py0 + e.clientY - g.my0, zoomRef.current);
    };
    const onMU = () => { g.md = false; };

    container.addEventListener('touchstart', onTouchStart, { capture: true, passive: false });
    container.addEventListener('touchmove',  onTouchMove,  { capture: true, passive: false });
    container.addEventListener('touchend',   onTouchEnd,   { capture: true });
    container.addEventListener('wheel',      onWheel,      { capture: true, passive: false });
    overlay.addEventListener('mousedown', onMD);
    window.addEventListener('mousemove',  onMM);
    window.addEventListener('mouseup',    onMU);

    return () => {
      container.removeEventListener('touchstart', onTouchStart, { capture: true });
      container.removeEventListener('touchmove',  onTouchMove,  { capture: true });
      container.removeEventListener('touchend',   onTouchEnd,   { capture: true });
      container.removeEventListener('wheel',      onWheel,      { capture: true });
      overlay.removeEventListener('mousedown', onMD);
      window.removeEventListener('mousemove',  onMM);
      window.removeEventListener('mouseup',    onMU);
    };
  }, [applyPan, computePan, zoomTo, mounted]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col z-40"
      style={{ background: 'linear-gradient(135deg, #0d1f2e 0%, #1a2f42 60%, #0d1f2e 100%)' }}
    >
      <main
        ref={mainRef}
        className="flex-1 flex items-center justify-center overflow-hidden"
        style={{ padding: '8px 24px' }}
      >
        {mounted && (
          <div
            ref={zoomContainerRef}
            className="relative w-full overflow-visible mx-auto"
            style={{
              maxWidth: '900px',
              touchAction: 'none',
              cursor: isZoomed ? 'grab' : 'default',
            }}
          >
            <div
              style={{
                width: '100%',
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: 'left top',
                transition: 'transform 0.15s ease-out',
                willChange: 'transform',
              }}
            >
              <HTMLFlipBook
                ref={bookRef}
                width={520}
                height={720}
                size="stretch"
                display="double"
                minWidth={100}
                maxWidth={420}
                minHeight={200}
                maxHeight={bookH}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={false}
                useMouseEvents={true}
                drawShadow={true}
                flippingTime={650}
                swipeDistance={30}
                onFlip={handleFlip}
                className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              >
                {Array.from({ length: TOTAL_PAGES }, (_, i) => (
                  <FlipPage key={i + 1} pageNum={i + 1} />
                ))}
              </HTMLFlipBook>
            </div>

            <div
              ref={overlayRef}
              style={{
                position: 'absolute', inset: 0, zIndex: 10,
                pointerEvents: isZoomed ? 'auto' : 'none',
                cursor: isZoomed ? 'grab' : 'default',
                userSelect: 'none',
              }}
            />

            {isZoomed && (
              <button
                onClick={resetZoom}
                style={{ zIndex: 20 }}
                className="absolute bottom-3 left-1/2 -translate-x-1/2
                  bg-[#0d1f2e]/85 backdrop-blur border border-[#1484bc]/40
                  text-[#aec2cc] hover:text-white hover:border-[#1484bc]
                  text-[11px] px-3 py-1.5 rounded-full transition-colors select-none"
              >
                {zoom.toFixed(1)}× — tap to reset
              </button>
            )}
          </div>
        )}
      </main>

      {mounted && (
        <Toolbar
          curPage={curPage}
          zoom={zoom}
          isZoomed={isZoomed}
          isFS={isFS}
          onZoomOut={() => zoomTo(zoom - 0.5)}
          onZoomIn={() => zoomTo(zoom + 0.5)}
          onFirst={goFirst}
          onPrev={goPrev}
          onNext={goNext}
          onLast={goLast}
          onToggleFS={toggleFS}
          onJump={goJump}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — unchanged
// ═══════════════════════════════════════════════════════════════════════════════
export default function NewsletterViewer() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BP);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile === null) return null;

  return isMobile ? <MobileViewer /> : <DesktopViewer />;
}