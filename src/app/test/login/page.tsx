"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signIn, useSession } from "next-auth/react";
import { ChevronRight } from "lucide-react";
const GoogleLoginButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="w-full bg-white border-2 cursor-pointer border-gray-200 rounded-[8px] px-6 py-4 flex items-center justify-center gap-3 text-gray-700 font-semibold lg:text-lg text-xs hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
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
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  if (session?.user) {
    redirect("/dashboard");
  }
  if (session && session.user.step <= 1) {
    redirect("/steps");
  }
  return (
    <div className="min-h-screen  flex items-center justify-center p-4 relative">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/enita/bg-login.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl max-h-[80vh] relative bg-card rounded-[8px] shadow-lg overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Left Side - Image Collage */}
        <div className="hidden lg:block lg:w-1/2 relative bg-muted p-6">
          <div className="grid grid-cols-3 grid-rows-4 gap-3 h-full">
            {/* Row 1 */}
            <div className="relative rounded-[8px] overflow-hidden">
              <img
                src={"/enita/hero-student.png"}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-[8px] overflow-hidden bg-orange-500 flex flex-col items-start justify-center p-4 text-white row-span-2"
            >
              <span className="text-4xl font-bold">95%</span>
              <p className="text-xs mt-2 leading-tight">
                de nos diplômés trouvent un emploi dans les 6 mois
              </p>
            </motion.div>
            <div className="relative rounded-[8px] overflow-hidden">
              <img
                src={"/enita/construction-1.jpg"}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Row 2 */}
            <div className="relative rounded-[8px] overflow-hidden">
              <img
                src={"/enita/blueprint.jpg"}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative rounded-[8px] overflow-hidden">
              <img
                src={"/enita/bridge.jpg"}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Row 3 */}
            <div className="relative rounded-[8px] overflow-hidden">
              <img
                src={"/enita/surveying.jpg"}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative rounded-[8px] overflow-hidden bg-primary flex flex-col items-start justify-center p-4 text-primary-foreground col-span-2 row-span-2"
            >
              <span className="text-4xl font-bold">+500</span>
              <p className="text-xs mt-2 leading-tight">
                étudiants formés aux métiers du génie civil depuis 2010
              </p>
            </motion.div>

            {/* Row 4 */}
            <div className="relative rounded-[8px] overflow-hidden">
              <img
                src={"/enita/tt.jpg"}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="text-right mb-8">
            <span className="text-sm text-muted-foreground">
              {isLogin ? "Pas encore de compte?" : "Déjà inscrit?"}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </Button>
          </div>
          <div className="">
            {/* Header mobile */}
            <div className=" text-center mb-4 flex items-center justify-center ">
              <div className=" bg-gradient-to-r rounded-[8px] flex items-center justify-center mx-auto mb-4">
                <img
                  onClick={() => redirect("/")}
                  src="/compli/complirisk-academy.png"
                  alt=""
                  className="w-52 h-auto cursor-pointer"
                />{" "}
              </div>
            </div>

            {/* Titre */}
            <div className="text-center mb-8">
              <p className="text-gray-600">
                Connectez-vous pour continuer votre apprentissage
              </p>
            </div>

            {/* Bouton Google */}
            <div className="mb-6">
              {loading ? (
                <div className="w-full bg-gray-100 rounded-[8px] px-6 py-4 flex items-center justify-center gap-3 text-gray-500">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                <GoogleLoginButton
                  onClick={() => {
                    signIn("google");
                    redirect("/dashboard");
                  }}
                />
              )}
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Connexion sécurisée
                </span>
              </div>
            </div>
            {/* Footer */}
            <div className="text-center text-sm text-gray-500">
              En vous connectant, vous acceptez nos{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Conditions d&apos;utilisation
              </a>{" "}
              et notre{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
