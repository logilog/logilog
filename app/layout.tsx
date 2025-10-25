import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolicyCompare AI",
  description: "Upload, extract and compare insurance policies with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
