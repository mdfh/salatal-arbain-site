"use client";

import { useEffect } from "react";
import { useLang } from "@/components/LangProvider";
import { track } from "@/lib/firebase";
import Header from "@/components/Header";
import BookCover from "@/components/BookCover";
import Footer from "@/components/Footer";
import DownloadYourCopySection from "@/components/DownloadYourCopySection";
import ContactUsSection from "@/components/ContactUsSection";
import ScrollToTopButton from "@/components/ScrollToTopButton";


export default function Page() {
  const { lang } = useLang();

  useEffect(() => {
    track("page_view", { page: "single_page", lang });
  }, [lang]);

  return (
    <div>
      <Header />
      <ScrollToTopButton />
      <BookCover />
      <DownloadYourCopySection />
      <ContactUsSection />
      <Footer />
    </div>
  );
}
