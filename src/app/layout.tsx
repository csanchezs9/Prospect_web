import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Loader from "@/components/Loader";

const display = Inter({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

// Goga (Juan Mora) no es publica — sustituto: Bricolage Grotesque
const goga = Bricolage_Grotesque({
  variable: "--font-goga",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RonLach — Director Creativo",
  description: "Portfolio inspirado, construido con Next.js + GSAP + Lenis.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${goga.variable}`}>
      <body suppressHydrationWarning>
        <Loader />
        <SmoothScroll />
        <Nav />
        <div id="scroll-wrapper">{children}</div>
        <div className="edge-glow" aria-hidden />

      </body>
    </html>
  );
}
