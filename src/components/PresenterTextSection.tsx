"use client";

import { useMemo } from "react";
import { useLang } from "./LangProvider";

export default function PresenterTextSection() {
  const { lang } = useLang();

  // Optional: if you want to link to the exact page inside the PDF
  const pdfSrc = "/pdf/Maarif-Al-Tajweed.pdf";
  const aboutPage = 20;

  const pdfUrl = useMemo(
    () => `${pdfSrc}#page=${aboutPage}&zoom=page-width`,
    [pdfSrc, aboutPage],
  );

  return (
    <section id="book-presenter" className="py-14 bg-[#F8F8F8]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-white shadow-sm border border-black/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* English (left) */}
            <div className="order-2 lg:order-1 p-8 lg:p-10">
              <p className="mt-4 text-4xl md:text-4xl font-en tracking-tight text-black/85">
                BOOK PRESENTER
              </p>
              <p className="mt-5 text-base leading-relaxed text-black/70 font-en">
                This blessed work is presented by Syeda Muhammadi Begum (LatafAllahu Biha wa Hafizaha), the granddaughter of the eminent Muhaddith of the Deccan, Hazrat Syed Abdullah Shah Naqshbandi Qadri (may Allah have mercy upon him).
              </p>
              <p className="mt-5 text-base leading-relaxed text-black/70 font-en">
                She is a lady of profound piety, dignity, and insight, whose life is illuminated by God-consciousness, humility, and devout restraint.
              </p>
              <p className="mt-5 text-base leading-relaxed text-black/70 font-en">
                Belonging to a noble and distinguished lineage, she continues to serve the faith with sincerity and quiet dedication.
              </p>

              <p className="mt-5 text-base leading-relaxed text-black/70 font-en">
                The compilation of this esteemed work has been brought to completion under her careful supervision, with the noble aim of preserving and transmitting a sacred intellectual and spiritual heritage.
              </p>

              <p className="mt-5 text-base leading-relaxed text-black/70 font-en">
                May Almighty Allah graciously accept her efforts and bestow abundant blessings therein. Ameen.
              </p>
            </div>

            {/* Urdu (right) */}
            <div className="order-1 lg:order-2 p-8 lg:p-10 bg-[#faf7ef]">
              <p
                dir="rtl"
                className="mt-5 text-3xl md:text-5xl text-black/70 font-urdu font-normal"
              >
                کتاب پیش کار
              </p>
              <p
                dir="rtl"
                className="mt-5 text-base leading-relaxed text-black/70 text-right font-urdu-p font-normal"
              >
                یہ بابرکت کتاب سیدہ محمدی بیگم کی پیشکش ہے، جو محدثِ دکن ابوالحسنات حضرت سید عبداللہ شاہ نقشبندی قادری رحمۃ اللہ علیہ کی نواسی ہیں۔
              </p>

              <p
                dir="rtl"
                className="mt-5 text-base leading-relaxed text-black/70 text-right font-urdu-p font-normal"
              >
                وہ ایک نہایت متقی، باوقار،  بصیرت مند خاتون ہیں، جن کی زندگی تقویٰ، عاجزی اور پرہیزگاری سے  منور ہے۔
              </p>

              <p
                dir="rtl"
                className="mt-5 text-base leading-[2.2] text-black/70 text-right font-urdu-p font-normal"
              >
                ایک معزز اور عالی نسب خاندان سے وابستگی رکھتے ہوئے وہ اخلاص کے ساتھ خدمتِ دین میں کوشاں ہیں۔ 
              </p>

              <p
                dir="rtl"
                className="mt-5 text-base leading-[2.2] text-black/70 text-right font-urdu-p font-normal"
              >
                 اس بلند پایہ تصنیف کی تدوین کا فریضہ ان کے زیرِ نگرانی پایۂ تکمیل کو پہنچا ہے، جس میں ان کا مقصد ایک مقدس علمی و روحانی ورثے کو آگے بڑھانا ہے۔
              </p>

              <p
                dir="rtl"
                className="mt-5 text-base leading-[2.2] text-black/70 text-right font-urdu-p font-normal"
              >
                اللہ تعالیٰ ان کی اس کاوش کو شرفِ قبولیت عطا فرمائے اور اس میں بے شمار برکتیں نازل فرمائے۔ آمین۔
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
