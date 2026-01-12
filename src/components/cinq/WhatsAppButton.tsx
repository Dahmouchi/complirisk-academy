import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export function WhatsAppButton({
  phoneNumber = "212600000000",
  message = "Bonjour, je souhaite envoyer mon reçu de paiement pour accéder aux cours live.",
  className = "",
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      onClick={handleClick}
      className={`bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2 ${className}`}
      size="lg"
    >
      <MessageCircle className="h-5 w-5" />
      Envoyer via WhatsApp
    </Button>
  );
}
