"use client";

import { useState } from "react";
import {
  Lock,
  Mail,
  Phone,
  CreditCard,
  Package,
  ShoppingCart,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModifyDemandeDialog } from "./ModifyDemandeDialog";
import { useRouter } from "next/navigation";

interface PaymentContactSectionProps {
  selectedCourses: any[];
  totalPrice: number;
  demandeId?: string;
  availableGrades?: any[];
}

export function PaymentContactSection({
  selectedCourses,
  totalPrice,
  demandeId,
  availableGrades = [],
}: PaymentContactSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const finalPrice = totalPrice;

  const handleOpenDialog = () => {
    if (demandeId) {
      setIsDialogOpen(true);
    }
  };

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <Card className="border-primary/20 bg-white sticky top-6">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl text-foreground">
              Débloquez votre Formation
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Sélectionnez vos cours et contactez-nous
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Courses Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ShoppingCart className="h-4 w-4" />
            <span>Cours sélectionnés ({selectedCourses.length})</span>
          </div>

          {selectedCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-2">
              Cliquez sur les cours pour les ajouter à votre panier
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between text-sm bg-background/50 rounded-lg p-2"
                >
                  <span className="truncate flex-1 mr-2">{course.name}</span>
                  <span className="font-semibold text-primary">
                    {course.price}MAD
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Package className="h-4 w-4" />
            <span>Récapitulatif</span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{totalPrice.toFixed(2)}MAD</span>
            </div>
            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{finalPrice.toFixed(2)}MAD</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CreditCard className="h-4 w-4" />
            <span>Pour procéder au paiement</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <a
                  href="mailto:formation@compliance-academy.fr"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  formation@compliance-academy.ma
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Téléphone</p>
                <a
                  href="tel:+212661234567"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  +212 6 61 23 45 67
                </a>
              </div>
            </div>
          </div>
        </div>

        <Button
          className="w-full gap-2"
          size="lg"
          disabled={selectedCourses.length === 0}
          onClick={handleOpenDialog}
        >
          <Edit className="h-4 w-4" />
          Modifier ma Demande
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Vous pouvez ajouter ou retirer des grades de votre demande avant
          l&apos;approbation.
        </p>
      </CardContent>

      {/* Modify Demande Dialog */}
      {demandeId && (
        <ModifyDemandeDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          demandeId={demandeId}
          currentGrades={selectedCourses}
          availableGrades={availableGrades}
          onSuccess={handleSuccess}
        />
      )}
    </Card>
  );
}
