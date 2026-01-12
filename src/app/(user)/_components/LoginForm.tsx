"use client";
import React, { useState } from "react";
import { Award, BookOpen, ChevronRight, Users } from "lucide-react";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";

const AuthForm = () => {
  const [loading, setLoading] = useState(false);

  const GoogleLoginButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <motion.button
        onClick={onClick}
        className="w-full bg-white border-2 cursor-pointer border-gray-200 rounded-xl px-6 py-4 flex items-center justify-center gap-3 text-gray-700 font-semibold text-lg hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
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

  // Composant pour les statistiques
  const StatCard = ({
    icon: Icon,
    number,
    label,
  }: {
    icon: any;
    number: string;
    label: string;
  }) => {
    return (
      <motion.div
        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="w-8 h-8 mx-auto mb-2 text-blue-300" />
        <div className="text-2xl font-bold text-white">{number}</div>
        <div className="text-sm text-blue-100">{label}</div>
      </motion.div>
    );
  };
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex"
      style={{
        backgroundImage: `url("/Board.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Section gauche - Informations */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center lg:p-12 p-4 text-white">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo et titre */}

          {/* Titre principal */}
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Votre parcours d&apos;apprentissage{" "}
            <span className="text-blue-500 uppercase">commence ici</span>
          </h2>

          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Rejoignez des milliers d&apos;étudiants qui transforment leur avenir
            grâce à notre plateforme d&apos;apprentissage innovante.
          </p>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard icon={Users} number="50K+" label="Étudiants" />
            <StatCard icon={BookOpen} number="1K+" label="Cours" />
            <StatCard icon={Award} number="95%" label="Réussite" />
          </div>
        </motion.div>
      </div>

      {/* Section droite - Formulaire de connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Carte de connexion */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
            {/* Header mobile */}
            <div className=" text-center mb-4 flex items-center justify-center ">
              <div className=" bg-gradient-to-r rounded-xl flex items-center justify-center mx-auto mb-4">
                <img
                  onClick={() => redirect("/")}
                  src="/cinq/logoH.png"
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
                <div className="w-full bg-gray-100 rounded-xl px-6 py-4 flex items-center justify-center gap-3 text-gray-500">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Connexion en cours...</span>
                </div>
              ) : (
                <GoogleLoginButton onClick={() => signIn("google")} />
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

            {/* Avantages */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Accès à tous vos cours</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Progression sauvegardée</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Certificats personnalisés</span>
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
        </motion.div>
      </div>
    </div>
  );
};

export default AuthForm;
