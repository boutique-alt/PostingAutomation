import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialPost Automation - Unified Composer",
  description: "Post to Facebook and Instagram from one simple dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">{children}</body>
    </html>
  );
}
