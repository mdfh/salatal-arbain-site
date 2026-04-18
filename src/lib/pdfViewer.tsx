"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { motion, AnimatePresence, useMotionValue, useTransform, type Transition } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  Download, 
  Loader2 
} from "lucide-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

type Props = {
  fileUrl: string;
  startPage?: number;
  height?: number;

  onDownload?: () => void | Promise<void>;
  downloadAriaLabel?: string;
  direction?: "ltr" | "rtl";
};


// Physics settings for that "snappy yet organic" feel
const transitionConfig: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 25,
};

const THEME = {
  bg: "#150606",        // deep maroon-black background
  panel: "rgba(0,0,0,0.35)",
  border: "rgba(255,255,255,0.16)",
  maroon: "#5b0b0b",
  gold: "#f5c24b",
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    scale: 0.9,
    opacity: 0,
    zIndex: 0,
  }),
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    zIndex: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "50%" : "-50%",
    scale: 0.95,
    opacity: 0,
    zIndex: 0,
  }),
};

export default function PdfViewer({ fileUrl, startPage = 1, height = 620, onDownload,
  downloadAriaLabel}: Props) {
  const [numPages, setNumPages] = useState(0);
  const [[currentPage, direction], setPageWithDirection] = useState([startPage, 0]);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<HTMLDivElement | null>(null);

  const [boxW, setBoxW] = useState(0);
  const [boxH, setBoxH] = useState(0);
  const [pageW, setPageW] = useState<number | null>(null);
  const [pageH, setPageH] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, []);

  const paginate = (newDirection: number) => {
    const nextPage = currentPage + newDirection;
    if (nextPage >= 1 && nextPage <= (numPages || 1)) {
      setPageWithDirection([nextPage, newDirection]);
    }
  };

  // Setup for Drag gestures
  const dragX = useMotionValue(0);
  const dragProgress = useTransform(dragX, [-100, 100], [-0.5, 0.5]);

  useEffect(() => {
    const el = viewRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) {
        setBoxW(Math.floor(rect.width));
        setBoxH(Math.floor(rect.height));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = pageW && pageH && boxW > 0 && boxH > 0
      ? Math.min((boxW - 60) / pageW, (boxH - 60) / pageH)
      : 1;

  return (
    <div dir="rtl">
      <div
      ref={rootRef}
      className={`relative flex flex-col transition-colors duration-700 overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : "rounded-3xl border shadow-2xl"
      }`}
      style={{
        ...(isFullscreen ? { height: "100vh" } : { height }),
        backgroundColor: THEME.bg,
        borderColor: isFullscreen ? undefined : THEME.border,
      }}
    >
      {/* Sleek Floating Toolbar */}
      <div
  className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 backdrop-blur-xl p-1.5 rounded-2xl shadow-2xl"
  style={{ background: THEME.panel, border: `1px solid ${THEME.border}` }}
>
  <div className="px-3 text-xs font-bold tracking-widest uppercase text-white/70">
    {numPages ? `${currentPage} / ${numPages}` : "Loading"}
  </div>
  <div className="w-[1px] h-4 bg-white/20" />

  <button
    onClick={() =>
      rootRef.current &&
      (document.fullscreenElement ? document.exitFullscreen() : rootRef.current.requestFullscreen())
    }
    className="p-2 rounded-xl transition-colors"
    style={{ color: "white" }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
  >
    <Maximize size={16} />
  </button>

  {typeof onDownload === "function" ? (
    <button
      type="button"
      aria-label={downloadAriaLabel ?? "Download PDF"}
      onClick={onDownload}
      className="p-2 rounded-xl transition-all shadow-lg"
      style={{
        backgroundColor: THEME.gold,
        color: "#1a1203",
        boxShadow: "0 10px 25px rgba(245, 194, 75, 0.25)",
      }}
    >
      <Download size={16} />
    </button>
  ) : (
    <a
      href={fileUrl}
      download
      className="p-2 rounded-xl transition-all shadow-lg"
      style={{
        backgroundColor: THEME.gold,
        color: "#1a1203",
        boxShadow: "0 10px 25px rgba(245, 194, 75, 0.25)",
      }}
    >
      <Download size={16} />
    </a>
  )}
</div>


      {/* Main Interactive Area */}
      <div ref={viewRef} className="relative flex-1 flex items-center justify-center perspective-1000">
        
        {/* Navigation Arrows - Large & Minimalist */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-30 flex justify-between pointer-events-none">
          <button
            onClick={() => paginate(-1)}
            disabled={currentPage <= 1}
            className="pointer-events-auto p-4 rounded-full border transition-all disabled:opacity-0 group"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "rgba(245, 194, 75, 0.75)",
            }}
          >
            <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => paginate(1)}
            disabled={currentPage >= numPages}
            className="pointer-events-auto p-4 rounded-full border transition-all disabled:opacity-0 group"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "rgba(245, 194, 75, 0.75)",
            }}
          >
            <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <Document
          file={fileUrl}
          onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
          className="relative flex items-center justify-center"
          loading={<Loader2 className="animate-spin" style={{ color: THEME.gold }} size={40} />}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentPage}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                const swipe = info.offset.x;
                if (swipe < -50) paginate(1);
                else if (swipe > 50) paginate(-1);
              }}
              className="cursor-grab active:cursor-grabbing"
              style={{
                filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))"
              }}
            >
              <Page
                pageNumber={currentPage}
                onLoadSuccess={(lp) => {
                  setPageW(lp.getViewport({ scale: 1 }).width);
                  setPageH(lp.getViewport({ scale: 1 }).height);
                }}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={false}
                className="rounded-lg overflow-hidden border border-white/5"
              />
            </motion.div>
          </AnimatePresence>
        </Document>
      </div>

      {/* Modern Gradient Progress Bar */}
      <div className="h-1.5 w-full bg-white/5 relative">
        <motion.div
          className="absolute inset-y-0 left-0"
          initial={{ width: 0 }}
          animate={{ width: `${numPages ? (currentPage / numPages) * 100 : 0}%` }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          style={{
            background: `linear-gradient(90deg, ${THEME.gold}, ${THEME.gold}, ${THEME.gold})`,
            boxShadow: "0 0 16px rgba(245, 194, 75, 0.35)",
          }}
        />
      </div>
    </div>
    </div>
    );
}