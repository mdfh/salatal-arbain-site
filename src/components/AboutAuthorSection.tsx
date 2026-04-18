"use client";

import { useMemo } from "react";
import { useLang } from "./LangProvider";

export default function AboutAuthorSection() {
  const { lang } = useLang();

  // Optional: if you want to link to the exact page inside the PDF
  const pdfSrc = "/pdf/Maarif-Al-Tajweed.pdf";
  const aboutPage = 20;

  const pdfUrl = useMemo(
    () => `${pdfSrc}#page=${aboutPage}&zoom=page-width`,
    [pdfSrc, aboutPage],
  );

  return (
    <section id="about-author" className="py-14 bg-[#F8F8F8]">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-3xl bg-white shadow-sm border border-black/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* English (left) */}
            <div className="order-2 lg:order-1 p-8 lg:p-10">
              <p className="mt-4 text-4xl md:text-4xl font-en tracking-tight text-black/85">
                ABOUT THE AUTHOR
              </p>
              <p className="mt-5 text-base leading-relaxed text-black/70 font-en">
                Its author is Shaykh al Sayyid Muhammad bin ‘Alawi-al Maliki al-Hasani al-Makki.
              </p>
              <p className="mt-5 text-base leading-relaxed text-black/70 font-en">
                This humble servant has presented this compilation along with its translation as a modest effort, with the aim that readers may become fully acquainted with the meanings and messages of these priceless blessings, so that their hearts may be filled with the remembrance of the Messenger of Allah ﷺ and illuminated with love for him.
              </p>
              <p className="mt-5 text-base leading-relaxed text-black/70 font-en">
                Every blessed invocation (Durood) included in this book has been part of the daily spiritual practices of the servants of the noble saints and the great descendants of the Prophet ﷺ. By reciting them, one attains not only spiritual peace and closeness to Allah, but also ease and relief in worldly difficulties.
              </p>

              <p className="mt-5 text-base leading-relaxed text-black/70 font-en">
                This collection has been compiled with the fundamental aim of gathering these priceless invocations in one place, enabling every Muslim to benefit from them with ease. This collection has been compiled with firm conviction that every Durood it contains will become a means of forgiveness for the reciter and a source for attaining the mercy of Allah.
              </p>
            </div>

            {/* Urdu (right) */}
            <div className="order-1 lg:order-2 p-8 lg:p-10 bg-[#faf7ef]">
              <p
                dir="rtl"
                className="mt-5 text-3xl md:text-5xl text-black/70 font-urdu font-normal"
              >
                تعارفِ مصنف
              </p>
              <p
                dir="rtl"
                className="mt-5 text-base leading-relaxed text-black/70 text-right font-urdu-p font-normal"
              >
                اس کے مصنف شیخ السید محمد بن علوی المالکی الحسنی المکی ہیں۔
              </p>

              <p
                dir="rtl"
                className="mt-5 text-base leading-relaxed text-black/70 text-right font-urdu-p font-normal"
              >
                اس عاجز بندے نے اس مجموعے کو اس کے ترجمے کے ساتھ ایک ادنیٰ کوشش کے طور پر پیش کیا ہے، تاکہ قارئین ان قیمتی درود و برکات کے معانی اور پیغامات سے پوری طرح واقف ہو جائیں، اور ان کے دل اللہ کے رسول ﷺ کی یاد سے معمور ہوں اور آپ ﷺ کی محبت سے منور ہو جائیں۔
              </p>

              <p
                dir="rtl"
                className="mt-5 text-base leading-[2.2] text-black/70 text-right font-urdu-p font-normal"
              >
                اس کتاب میں شامل ہر بابرکت درود ان صالحین، اولیائے کرام اور نبی کریم ﷺ کی عظیم اولاد کے روزانہ کے روحانی معمولات کا حصہ رہا ہے۔ ان کی تلاوت سے انسان نہ صرف روحانی سکون اور اللہ تعالیٰ کا قرب حاصل کرتا ہے بلکہ دنیاوی مشکلات میں آسانی اور راحت بھی پاتا ہے۔
              </p>

              <p
                dir="rtl"
                className="mt-5 text-base leading-[2.2] text-black/70 text-right font-urdu-p font-normal"
              >
                یہ مجموعہ اس بنیادی مقصد کے ساتھ مرتب کیا گیا ہے کہ ان قیمتی درودوں کو ایک جگہ جمع کر دیا جائے تاکہ ہر مسلمان آسانی کے ساتھ ان سے فائدہ اٹھا سکے۔ یہ مجموعہ اس پختہ یقین کے ساتھ مرتب کیا گیا ہے کہ اس میں شامل ہر درود پڑھنے والے کے لیے بخشش کا ذریعہ اور اللہ تعالیٰ کی رحمت حاصل کرنے کا سبب بنے گا۔
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
