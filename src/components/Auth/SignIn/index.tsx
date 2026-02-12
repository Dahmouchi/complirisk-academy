"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import SocialSignIn from "../SocialSignIn";
import Logo from "@/components/Layout/Header/Logo";
import Loader from "@/components/Common/Loader";
import { toast } from "react-toastify";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Signin = () => {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    checkboxToggle: false,
  });
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6">
          <img
            onClick={() => router.push("/")}
            src="/compli/logo.png"
            alt="Logo"
            className="w-48 h-auto cursor-pointer"
          />
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bon retour !
          </h2>
          <p className="text-gray-600 max-w-[280px] mx-auto">
            Connectez-vous pour continuer votre apprentissage
          </p>
        </div>

        {/* Google Button */}
        <div className="w-full mb-8">
          {loading ? (
            <div className="w-full bg-gray-50 rounded-xl px-6 py-4 flex items-center justify-center gap-3 text-gray-500 border border-gray-100">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium">Connexion...</span>
            </div>
          ) : (
            <GoogleLoginButton />
          )}
        </div>

        {/* Divider */}
        <div className="relative w-full mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="px-4 bg-white text-gray-400 font-medium">
              Connexion sécurisée
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 leading-relaxed px-4">
          En vous connectant, vous acceptez nos{" "}
          <a href="#" className="text-primary hover:underline font-medium">
            Conditions d&apos;utilisation
          </a>{" "}
          et notre{" "}
          <a href="#" className="text-primary hover:underline font-medium">
            Politique de confidentialité
          </a>
        </div>
      </div>
    </>
  );
};

export default Signin;
const GoogleLoginButton = () => {
  const login = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };
  return (
    <motion.button
      onClick={login}
      className="w-full bg-white border-2 cursor-pointer border-gray-200 rounded-[8px] px-6 py-4 flex items-center justify-center gap-3 text-gray-700 font-semibold lg:text-lg text-xs hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
      whileHover={{ scale: 1.02 }}
    >
      {/* Logo Google */}
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span>Continuer avec Google</span>
      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
    </motion.button>
  );
};
