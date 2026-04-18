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
    default: "Salatal Arbain – 40 Durood on Prophet Muhammad (ﷺ)",
    template: "%s | Salatal Arbain",
  },
  description:
    "Explore Salatal Arbain, a collection of 40 beautiful durood (salutations) upon Prophet Muhammad (ﷺ). A spiritual guide for daily recitation and blessings.",
  keywords: [
    "Salatal Arbain",
    "40 Durood",
    "Durood Sharif",
    "Salawat on Prophet Muhammad",
    "Islamic supplications",
    "Darood collection",
  ],
  authors: [{ name: "Salatal Arbain" }],
  creator: "Salatal Arbain",
  metadataBase: new URL("https://salatal-arbain.netlify.app"),
  openGraph: {
    title: "Salatal Arbain",
    description:
      "A collection of 40 durood (salawat) upon Prophet Muhammad (ﷺ) for spiritual growth and blessings.",
    url: "https://salatal-arbain.netlify.app",
    siteName: "Salatal Arbain",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "Salatal Arbain" },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
  twitter: {
    card: "summary_large_image",
    title: "Salatal Arbain",
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