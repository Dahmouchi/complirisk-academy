"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Head from "next/head";

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

const AccessDenied = (role: any) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    switch (role.role) {
      case Role.USER:
        setUrl("/dashboard");
        break;
      case Role.ADMIN:
        setUrl("/admin/dashboard");
        break;
      default:
        setUrl("/access-denied");
        break;
    }
  }, [role]);

  const router = useRouter();
  const red = () => {
    router.push(url);
  };
  return (
    <>
      <Head>
        <title>Accès Refusé | Votre Application</title>
      </Head>

      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-no-repeat bg-bottom p-4"
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg")',
        }}
      >
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-[8px] shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-red-50 dark:bg-red-900/20 p-6 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
              Accès Refusé
            </h1>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-center">
              Vous n&apos;avez pas les autorisations nécessaires pour accéder à
              cette page.
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-r">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Vous serez redirigé automatiquement vers votre tableau de bord
                  dans 5 secondes.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={red}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                Aller à mon tableau de bord
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>
            Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez
            contacter votre administrateur.
          </p>
        </div>
      </div>
    </>
  );
};
export default AccessDenied;
