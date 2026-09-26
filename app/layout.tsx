import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import "./landing.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: { default: "StudyStackLM", template: "%s · StudyStackLM" },
  description: "Turn shared class lessons into cited reviewers, flashcards, slides, and practice tests.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${fraunces.variable} ${manrope.variable}`}>{children}<Toaster richColors position="bottom-right" /></body></html>;
}
