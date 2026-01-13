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
    <Card className="border-primary/20 bg-card rounded-2xl">
      <CardContent>
        <form onSubmit={handleSubmit} className=" space-y-3 w-full">
          <label className="text-sm font-medium text-center w-full  text-foreground">
            Entrez votre code d&apos;accès
          </label>
          <div className="flex flex-col justify-center items-center gap-3 mt-3">
            <Input
              type="text"
              placeholder="-XXXX-"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-card py-4  border-primary border-2 text-center rounded-full font-mono text-lg tracking-widest"
              maxLength={12}
            />
            <button
              disabled={isLoading}
              className="relative w-full bg-blue-600 text-white font-medium text-[17px] px-4 py-[0.35em] pl-5 h-[2.8em] rounded-full flex items-center overflow-hidden cursor-pointer shadow-[inset_0_0_1.6em_-0.6em_#714da6] group"
            >
              <span className="mr-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}{" "}
                Déverrouiller
              </span>
              <div className="absolute right-[0.3em] bg-primary h-[2.2em] w-[2.2em] rounded-full flex items-center justify-center transition-all duration-300 group-hover:w-[calc(100%-0.6em)] shadow-[0.1em_0.1em_0.6em_0.2em_#7b52b9] active:scale-95">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  className="w-[1.1em] transition-transform duration-300 text-[#7b52b9] group-hover:translate-x-[0.1em]"
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    fill="currentColor"
                    d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                  />
                </svg>
              </div>
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
