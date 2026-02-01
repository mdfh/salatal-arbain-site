import "./globals.css";
import type { Metadata } from "next";
import LangProvider from "@/components/LangProvider";
import { Inter, Noto_Nastaliq_Urdu } from "next/font/google";
import { Baskervville } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-noto-nastaliq-urdu",
  weight: ["400", "700"],
  display: "swap",
});

const baskervville = Baskervville({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-baskervville",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ma`arif-ul-Tajweed – Learn Tajweed Easily",
    template: "%s | Maarif-ul-Tajweed",
  },
  description:
    "Learn Tajweed with Ma`arif-ul-Tajweed. A clear, structured and easy-to-understand guide for proper Quran recitation.",
  keywords: [
    "Tajweed",
    "Learn Tajweed",
    "Quran Tajweed",
    "Ma`arif ul Tajweed",
    "Quran recitation rules",
  ],
  authors: [{ name: "Ma`arif-ul-Tajweed" }],
  creator: "Maarif-ul-Tajweed",
  metadataBase: new URL("https://marif-ut-tajweed.netlify.app"),
  openGraph: {
    title: "Ma`arif-ul-Tajweed",
    description: "A complete guide to learning Tajweed with clarity and correctness.",
    url: "https://marif-ut-tajweed.netlify.app",
    siteName: "Ma`arif-ul-Tajweed",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Ma`arif-ul-Tajweed" },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
  twitter: {
    card: "summary_large_image",
    title: "Maarif-ul-Tajweed",
    description: "Learn Tajweed the right way with Maarif-ul-Tajweed.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={baskervville.variable}
    >
      <body className={inter.className}>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}