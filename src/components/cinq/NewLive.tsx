"use client";
import { useState } from "react";
import { ArrowLeft, Play, Users, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentMethods } from "@/components/cinq/PaymentMethods";
import { InscriptionSteps } from "@/components/cinq/InscriptionSteps";
import { WhatsAppButton } from "@/components/cinq/WhatsAppButton";
import { UnlockCodeInput } from "@/components/cinq/UnlockCodeInput";
import { liveCourses } from "@/data/cours";
import Link from "next/link";
import { CourseCard } from "@/components/cinq/CourseCard";
import { UnlockedLive } from "@/actions/client";
import { toast } from "react-toastify";

export default function Lives() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleUnlock = async (code: string) => {
    try {
      const result = await UnlockedLive(code);
      if (result?.success) {
        toast.success("Cours débloqués avec succès");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error("Error unlocking live:", error);
    }
    console.log("Unlocked with code:", code);
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Button>
        </Link>
        {!isUnlocked ? (
          <>
            {/* Payment div */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Méthodes de paiement
              </h2>
              <p className="text-muted-foreground mb-6">
                Choisissez la méthode de paiement qui vous convient le mieux
              </p>
              <PaymentMethods />
            </div>

            {/* Inscription steps */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Comment s&apos;inscrire?
              </h2>
              <p className="text-muted-foreground mb-6">
                Suivez ces étapes simples pour accéder aux cours live
              </p>
              <InscriptionSteps />
            </div>

            {/* WhatsApp contact */}
            <div className="mb-12">
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-center">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Prêt à envoyer votre reçu?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Cliquez sur le bouton ci-dessous pour ouvrir WhatsApp et
                  envoyer votre reçu de paiement à notre administrateur.
                </p>
                <WhatsAppButton />
              </div>
            </div>

            {/* Unlock div */}
            <div className="mb-12 max-w-xl mx-auto">
              <UnlockCodeInput onUnlock={handleUnlock} />
            </div>
          </>
        ) : (
          /* Unlocked courses */
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <h2 className="text-2xl font-bold text-foreground">
                Vos cours live débloqués
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {liveCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          </div>
        )}

        {/* Preview of courses (locked state) */}
        {!isUnlocked && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Aperçu des cours disponibles
            </h2>
            <p className="text-muted-foreground mb-6">
              Déverrouillez pour accéder à tous ces cours et bien plus encore
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-60">
              {liveCourses.slice(0, 4).map((course) => (
                <div key={course.id} className="relative">
                  <CourseCard {...course} />
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] rounded-[8px] flex items-center justify-center">
                    <Badge variant="secondary" className="text-sm">
                      🔒 Verrouillé
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
