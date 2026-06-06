"use client";

import { useLang } from "./LangProvider";
import { track } from "@/lib/firebase";

export default function DownloadYourCopySection() {
  const { lang } = useLang();

  const books = [
    {
      key: "urdu",
      title: "Urdu Edition",
      nativeTitle: "اردو ایڈیشن",
      description:
        "Read Salawat al-Arbain with Urdu translation and explanation.",
      nativeDescription:
        "صلوات الاربعین اردو ترجمہ اور وضاحت کے ساتھ پڑھیں۔",
      url: "https://archive.org/details/MiladNamaHazratSyedAbdullahShahNaqshbandiQuadriRh",
      color: "from-[#007a43] to-[#005c31]",
      border: "border-emerald-300/30",
    },
    {
      key: "english",
      title: "English Edition",
      nativeTitle: "English Edition",
      description:
        "Read Salawat al-Arbain with English translation and explanation.",
      nativeDescription:
        "Read Salawat al-Arbain with English translation and explanation.",
      url: "https://archive.org/details/KitabUlMuhabbatAAbdullahShahSahab",
      color: "from-[#0f766e] to-[#064e3b]",
      border: "border-teal-300/30",
    },
    {
      key: "hindi",
      title: "Hindi Edition",
      nativeTitle: "हिन्दी संस्करण",
      description:
        "Read Salawat al-Arbain with Hindi translation and explanation.",
      nativeDescription:
        "हिंदी अनुवाद और व्याख्या के साथ सलावत अल-अरबईन पढ़ें।",
      url: "https://archive.org/details/GulzarEAuliyaAbdullahShahSahab",
      color: "from-[#b7791f] to-[#005c31]",
      border: "border-yellow-300/30",
    },
  ];

  const onDownload = (book: (typeof books)[number]) => {
    track("archive_download_click", {
      lang,
      bookLang: book.key,
      url: book.url,
    });

    window.open(book.url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="get-your-copy" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#005c31] to-[#003f24]" />

      <div className="relative mx-auto max-w-6xl px-4 py-16 lg:py-20">
        <div className="text-center">
          <h2 className="text-white text-4xl md:text-5xl font-semibold font-en">
            Download Your Copy
          </h2>

          <p className="mt-6 text-white text-3xl md:text-4xl font-urdu">
            کتاب ڈاؤن لوڈ کریں
          </p>

        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.key}
              className={`rounded-3xl border ${book.border} bg-white/10 backdrop-blur-sm p-6 shadow-xl`}
            >
              <div
                className={`rounded-2xl bg-gradient-to-br ${book.color} p-6 h-full flex flex-col`}
              >
                <h3 className="text-white text-2xl font-semibold font-en">
                  {book.title}
                </h3>

                <p className="mt-3 text-white text-2xl font-urdu">
                  {book.nativeTitle}
                </p>

                <p className="mt-5 text-white/85 text-sm leading-6 font-en">
                  {lang === "ur" ? book.nativeDescription : book.description}
                </p>

                <button
                  type="button"
                  onClick={() => onDownload(book)}
                  className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[#005c31] font-semibold font-en transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/70"
                >
                  {book.key === "urdu"
                    ? "Download Urdu"
                    : book.key === "english"
                    ? "Download English"
                    : "Download Hindi"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}