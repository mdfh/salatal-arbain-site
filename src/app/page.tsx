"use client";

import { useEffect } from "react";
import { useLang } from "@/components/LangProvider";
import { track } from "@/lib/firebase";
import Header from "@/components/Header";
import BookCover from "@/components/BookCover";
import Footer from "@/components/Footer";
import ContactUsSection from "@/components/ContactUsSection";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import AboutAuthorSection from "@/components/AboutAuthorSection";
import DownloadYourCopySection from "@/components/DownloadYourCopySection";
import PresenterTextSection from "@/components/PresenterTextSection";


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
      <PresenterTextSection />
      <AboutAuthorSection />
      <ContactUsSection />
      <Footer />
    </div>
  );
}
