import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Bebas_Neue, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gowreesh.me"),
  title: "Gowreesh VT — Full-Stack Engineer & DevOps",
  description:
    "Portfolio of Gowreesh VT, a Full-Stack Engineer, DevOps, and Cloud Enthusiast from IIT Madras × VIT Chennai. Building elegant, high-performance web applications.",
  openGraph: {
    title: "Gowreesh VT — Full-Stack Engineer & DevOps",
    description:
      "Portfolio of Gowreesh VT, a Full-Stack Engineer, DevOps, and Cloud Enthusiast from IIT Madras × VIT Chennai. Building elegant, high-performance web applications.",
    url: "https://gowreesh.me",
    siteName: "Gowreesh VT Portfolio",
    images: [
      {
        url: "/images/edited-photo.png",
        width: 1200,
        height: 630,
        alt: "Gowreesh VT Portrait",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gowreesh VT — Full-Stack Engineer & DevOps",
    description:
      "Portfolio of Gowreesh VT, a Full-Stack Engineer, DevOps, and Cloud Enthusiast from IIT Madras × VIT Chennai.",
    images: ["/images/edited-photo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${bebasNeue.variable} ${dmSerif.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#0d1117] text-white">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
