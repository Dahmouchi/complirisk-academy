"use client";
import "../../../public/recordings/style.css";
import Header from "@/components/Layout/Header";
export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
