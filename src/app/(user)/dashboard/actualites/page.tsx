import { NewsView } from "@/components/NewsView";
import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";

export default async function NewsPage() {
  // Get the current session
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch user data with registerCode
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      registerCode: true,
    },
  });

  // Check if user doesn't exist or doesn't have a registerCode
  if (!user || !user.registerCode) {
    return (
      <div className="container mx-auto py-8 px-4 h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8 md:p-12 shadow-xl border border-purple-200 dark:border-purple-800">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Lock Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full"></div>
                <div className="relative bg-white dark:bg-gray-900 p-6 rounded-full shadow-lg">
                  <Lock className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                  Contenu Premium
                  <Sparkles className="w-8 h-8 text-yellow-500" />
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Accédez aux actualités exclusives
                </p>
              </div>

              {/* Message */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Pour accéder aux actualités et événements, vous devez être{" "}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    inscrit avec un pack premium
                  </span>
                  . Débloquez tout le contenu et restez informé des dernières
                  nouvelles de votre classe.
                </p>
              </div>

              {/* Benefits List */}
              <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Avec le pack premium, profitez de :
                </h3>
                <ul className="space-y-3 text-left">
                  {[
                    "📰 Actualités en temps réel",
                    "📅 Événements exclusifs de la classe",
                    "🔔 Notifications prioritaires",
                    "📚 Accès complet aux cours et ressources",
                    "🎯 Support personnalisé",
                  ].map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <span className="text-2xl">{benefit.split(" ")[0]}</span>
                      <span>{benefit.substring(benefit.indexOf(" ") + 1)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Link
                href="/subscription"
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>S'abonner au pack premium</span>
                <Sparkles className="w-5 h-5 group-hover:-rotate-12 transition-transform" />
              </Link>

              {/* Help Text */}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Vous avez déjà un code d'inscription ?{" "}
                <Link
                  href="/contact"
                  className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                >
                  Contactez le support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has a registerCode, show the news view
  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-100px)] overflow-y-scroll">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Actualités & Événements</h1>
        <p className="text-muted-foreground">
          Restez informé des dernières actualités et événements de votre classe
        </p>
      </div>
      <NewsView />
    </div>
  );
}
