import { Banknote, Building2, CreditCard, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const paymentMethods = [
  {
    name: "CashPlus",
    icon: Wallet,
    description: "Paiement via CashPlus dans n'importe quel point de vente",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    name: "Virement Bancaire",
    icon: Building2,
    description: "Transfert direct vers notre compte bancaire",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "Banques",
    icon: CreditCard,
    description: "Dépôt dans l'agence bancaire la plus proche",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    name: "Espace",
    icon: Banknote,
    description: "Paiement via Espace dans les points partenaires",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export function PaymentMethods() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {paymentMethods.map((method) => (
        <Card
          key={method.name}
          className="border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
        >
          <CardHeader className="pb-2">
            <div
              className={`w-12 h-12 rounded-[8px] ${method.bgColor} flex items-center justify-center mb-2`}
            >
              <method.icon className={`h-6 w-6 ${method.color}`} />
            </div>
            <CardTitle className="text-lg">{method.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {method.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
