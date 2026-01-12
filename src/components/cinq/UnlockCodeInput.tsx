import { useState } from "react";
import { Lock, Unlock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "react-toastify";

interface UnlockCodeInputProps {
  onUnlock?: (code: string) => void;
}

export function UnlockCodeInput({ onUnlock }: UnlockCodeInputProps) {
  const [code, setCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      toast("Veuillez entrer le code d'accès reçu par WhatsApp.");
      return;
    }

    setIsLoading(true);

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo purposes, accept any code with 6+ characters
    if (code.length >= 6) {
      onUnlock?.(code);
    } else {
      toast("Code invalide");
    }

    setIsLoading(false);
  };

  if (isUnlocked) {
    return (
      <Card className="border-green-500/50 bg-green-500/5">
        <CardContent className="flex items-center justify-center gap-3 py-8">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
          <div>
            <p className="font-semibold text-green-600">Accès déverrouillé</p>
            <p className="text-sm text-muted-foreground">
              Vous avez maintenant accès à tous les cours live
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-xl">
          Entrez votre code d&apos;accès
        </CardTitle>
        <CardDescription>
          Après avoir effectué le paiement et envoyé le reçu via WhatsApp, vous
          recevrez un code d&apos;accès de l&apos;administrateur.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Input
            type="text"
            placeholder="Entrez le code d'accès..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 text-center text-lg tracking-widest uppercase"
            maxLength={12}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Unlock className="h-4 w-4" />
            )}
            Déverrouiller
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
