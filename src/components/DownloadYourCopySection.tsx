"use client";

import { useLang } from "./LangProvider";
import DownloadButton from "@/components/DownloadButton";
import { downloadFromPublic } from "@/lib/publicDownload";
import { incrementDownloadCount } from "@/lib/downloadCounter";
import { track } from "@/lib/firebase";
import dynamic from "next/dynamic";
import { requireTurnstileToken } from "@/lib/turnstileGate";


export default function DownloadYourCopySection() {
  const { lang } = useLang();

  // Keep consistent with DownloadButton defaults
  const pdfHref = "/pdf/salawatal-arbain.pdf";
  const filename = "salawatal-arbain.pdf";

  const ReactPdfViewer = dynamic(() => import("@/lib/ReactPdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="rounded-3xl border border-white/10 bg-black/20 h-[560px] flex items-center justify-center text-white/70">
      Loading preview…
    </div>
  ),
  });

  const onViewerDownload = async () => {
    try {
      const token = await requireTurnstileToken();
    if (!token) return; // user cancelled (or closed modal)
    
      await downloadFromPublic({ href: pdfHref, filename });
      track("pdf_download_success", { lang, mode: "viewer", file: pdfHref });
      incrementDownloadCount({ lang, file: pdfHref });
    } catch {
      track("pdf_download_failed", { lang, mode: "viewer", file: pdfHref });
      alert(lang === "ur" ? "ڈاؤن لوڈ ناکام ہوگیا" : "Download failed");
    }
  };

  return (
    <section id="get-your-copy" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#005c31] to-[#005c31]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: existing UI */}
          <div className="text-center lg:text-left">
            <h2 className="text-white text-4xl md:text-4xl font-semibold font-en">
              Download Your Copy
            </h2>
            <p className="mt-8 text-white text-3xl md:text-4xl font-urdu">
              کتاب ڈاؤن لوڈ کریں
            </p>

            <div className="mt-10 flex justify-center lg:justify-start">
              <DownloadButton />
            </div>

            <p className="mt-6 text-white/75 text-sm font-en">
              {lang === "ur"
                ? "پی ڈی ایف فائل آپ کے ڈیوائس میں ڈاؤن لوڈ ہو جائے گی۔"
                : "The PDF will be downloaded to your device."}
            </p>
          </div>

          {/* Right: PDF viewer */}
          <div className="w-full">
            <ReactPdfViewer
              fileUrl={pdfHref}
              height={560}
              onDownload={onViewerDownload}
              downloadAriaLabel={lang === "ur" ? "پی ڈی ایف ڈاؤن لوڈ کریں" : "Download PDF"}
            />
            <p className="mt-4 text-center text-white/70 text-xs font-en">
              {lang === "ur"
                ? "آپ یہاں کتاب دیکھ سکتے ہیں اور اوپر والے بٹن سے ڈاؤن لوڈ بھی کر سکتے ہیں۔"
                : "Preview the book here, or download using the button above."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
