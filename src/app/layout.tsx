import type { Metadata } from "next";
import "./globals.css";

import { Poppins } from "next/font/google";
import "@livekit/components-styles";

import ScrollToTop from "@/components/ScrollToTop";
import NextAuthProvider from "../../providers/NextAuthProvider";
import { AOSInit } from "@/components/aos";
import { ToastContainer } from "react-toastify";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--poppins-font",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
});
export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
  },
  title: "Cinq-Cinq",
  description: "Welcome to Cinq-Cinq website",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.className} relative`}>
        <NextAuthProvider>
          <div className="overflow-x-hidden">{children}</div>
        </NextAuthProvider>
        {/* <ScrollToTop /> */}
        <AOSInit />
        <ToastContainer
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
        />
      </body>
    </html>
  );
}
