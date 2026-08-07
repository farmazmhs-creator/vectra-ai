import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vectra AI — Farmaz Somu | AI Trainer",
  description:
    "Free AI Readiness & Capability Assessment. Get your instant diagnostic, HRD Corp-structured TNA snapshot and recommended training pathway — no payment, no obligation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
