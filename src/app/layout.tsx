import type { Metadata } from "next";
import "./globals.css";

import "@livekit/components-styles";
import "react-toastify/dist/ReactToastify.css";
import NextAuthProvider from "../../providers/NextAuthProvider";
import { AOSInit } from "@/components/aos";
import { Toaster } from "@/components/ui/sonner";
import AnimationProvider from "../../providers/AnimationProvider";

import { Poppins, Unbounded } from "next/font/google";

const geistSans = Poppins({
  variable: "--fontFamily",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["sans-serif"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: "normal",
});

const geistMono = Unbounded({
  variable: "--headingFontFamily",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["sans-serif"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: "normal",
});
export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
  },
  title: "CompliRisk Academy",
  description: "Welcome to CompliRisk Academy website",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} relative`}>
        <NextAuthProvider>
          <AnimationProvider>{children}</AnimationProvider>
        </NextAuthProvider>

        <AOSInit />
        {/* <ScrollToTop /> <Toaster /><ToastContainer
          className="absolute top-0 right-0"
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />*/}
      </body>
    </html>
  );
}
