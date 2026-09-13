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
    default: "Salawat Al Muhibbeen – Duroods on Prophet Muhammad (ﷺ)",
    template: "%s | Salawat Al Muhibbeen",
  },
  description:
    "Explore Salawat Al Muhibbeen, a collection of beautiful durood (salutations) upon Prophet Muhammad (ﷺ). A spiritual guide for daily recitation and blessings.",
  keywords: [
    "Salawat Al Muhibbeen",
    "40 Durood",
    "Durood Sharif",
    "Salawat on Prophet Muhammad",
    "Islamic supplications",
    "Darood collection",
  ],
  authors: [{ name: "Salawat Al Muhibbeen" }],
  creator: "Salawat Al Muhibbeen",
  metadataBase: new URL("https://salawat-al-muhibbeen.com"),
  openGraph: {
    title: "Salawat Al Muhibbeen",
    description:
      "A collection of 40 durood (salawat) upon Prophet Muhammad (ﷺ) for spiritual growth and blessings.",
    url: "https://salawat-al-muhibbeen.com",
    siteName: "Salawat Al Muhibbeen",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Salawat Al Muhibbeen" },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
  twitter: {
    card: "summary_large_image",
    title: "Salawat Al Muhibbeen",
    description:
      "Read and reflect on 40 durood (salawat) upon Prophet Muhammad (ﷺ).",
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