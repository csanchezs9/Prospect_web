import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Loader from "@/components/Loader";

const display = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Camilo Sanchez — Brand & Web Design",
  description: "Portfolio inspirado, construido con Next.js + GSAP + Lenis.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={display.variable}>
      <body>
        <Loader />
        <SmoothScroll />
        <Nav />
        {children}
      </body>
    </html>
  );
}
