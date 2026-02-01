"use client";

import DownloadButton from "@/components/DownloadButton";
import { useLang } from "./LangProvider";

export default function DownloadYourCopySection() {
  const { lang } = useLang();

  return (
    <section id="get-your-copy" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2C5F34] to-[#1B3B20]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
        <h2 className="text-white text-4xl md:text-6xl font-semibold font-en">
          Download Your Copy
        </h2>
        <p className="mt-8 text-white text-3xl md:text-6xl font-urdu">
          کتاب ڈاؤن لوڈ کریں
        </p>

        <div className="mt-10 flex justify-center">
          <DownloadButton />
        </div>

        <p className="mt-6 text-white/75 text-sm font-en">
          {lang === "ur"
            ? "پی ڈی ایف فائل آپ کے ڈیوائس میں ڈاؤن لوڈ ہو جائے گی۔"
            : "The PDF will be downloaded to your device."}
        </p>
      </div>
    </section>
  );
}
