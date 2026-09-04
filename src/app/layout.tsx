import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ToastBridge } from "@/components/layout/ToastBridge";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NEXPLOY — Intelligence Before Opportunity",
  description:
    "NEXPLOY is an AI-powered placement intelligence platform prototype — an interactive demo of student readiness intelligence, explainable candidate matching, and campus placement orchestration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased`}>
        <TooltipProvider delayDuration={200}>
          {children}
          <ToastBridge />
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
