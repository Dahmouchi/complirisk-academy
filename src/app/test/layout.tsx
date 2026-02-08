"use client";
import "../../../public/recordings/style.css";
import Footer from "@/components/Layout/Footer";
export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
