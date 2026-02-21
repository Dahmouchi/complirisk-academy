"use client";
import StickyMobileCTA from "@/components/complirisk/Hero/StickyMobileCTA";
import "../../../public/recordings/style.css";
import Header from "@/components/Layout/Header";
export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StickyMobileCTA />
      {children}
    </>
  );
}
