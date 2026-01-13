import {
  CreditCard,
  Send,
  MessageSquare,
  KeyRound,
  CheckCircle,
} from "lucide-react";

const steps = [
  {
    number: 1,
    icon: CreditCard,
    title: "Effectuer le paiement",
    description:
      "Choisissez votre méthode de paiement préférée (CashPlus, Virement, Banque ou Espace) et effectuez le paiement.",
  },
  {
    number: 2,
    icon: Send,
    title: "Récupérer le reçu",
    description:
      "Après le paiement, gardez le reçu de transaction ou prenez une photo claire du ticket de paiement.",
  },
  {
    number: 3,
    icon: MessageSquare,
    title: "Envoyer via WhatsApp",
    description:
      "Envoyez la photo du reçu à notre administrateur via le bouton WhatsApp ci-dessous.",
  },
  {
    number: 4,
    icon: KeyRound,
    title: "Recevoir le code",
    description:
      "L'administrateur vérifiera votre paiement et vous enverra un code d'accès unique par WhatsApp.",
  },
  {
    number: 5,
    icon: CheckCircle,
    title: "Accéder aux cours",
    description:
      "Entrez le code reçu dans le champ ci-dessous pour débloquer tous les cours live de la plateforme.",
  },
];

export function InscriptionSteps() {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden md:block" />

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="relative flex gap-4 md:gap-6"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Step number circle */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-primary/25">
                <step.icon className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>

            {/* Step content */}
            <div className="flex-1 bg-card border border-border/50 rounded-xl p-4 md:p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  Étape {step.number}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
