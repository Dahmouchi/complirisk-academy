"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

const footerLinks = {
  école: [
    { label: "À Propos", href: "#about" },
    { label: "Nos Cours", href: "#formations" },
    { label: "Équipe Pédagogique", href: "#" },
    { label: "Vie Étudiante", href: "#" },
  ],
  formations: [
    { label: "Faculté des Sciences", href: "#" },
    { label: "Faculté des Lettres", href: "#" },
    { label: "Faculté de Droit", href: "#" },
    { label: "Faculté d'Économie", href: "#" },
  ],
  liens: [
    { label: "Inscription", href: "#" },
    { label: "Ressources", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Youtube, href: "#" },
];

export const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-background/80">
      {/* Newsletter Section */}
      <div className="border-b border-black/20">
        <div className="container-custom py-8 px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-background">
                Abonnez-vous à notre newsletter
              </h3>
              <p className="text-background/60">
                Recevez les dernières actualités universitaires
              </p>
            </div>
            <div className="flex lg:flex-row flex-col gap-3 w-full md:w-auto">
              <Input
                type="email"
                onChange={(e) => console.log(e.target.value)}
                placeholder="Votre adresse email"
                className="bg-background/10 rounded-[8px] border-black/30 text-background placeholder:text-background/50 min-w-[250px]"
              />
              <Button variant="hero">S&apos;abonner</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16 px-4 md:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/cinq/logoH.png" alt="" className="w-36 h-auto" />
            </div>
            <p className="text-background/60 mb-6 max-w-sm">
              Plateforme éducative pour les universités marocaines -
              Accompagnant les étudiants dans leur réussite académique depuis
              des années.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-background/60">
                <MapPin className="w-5 h-5 text-primary" />
                <span>123 Avenue Mohammed V, Casablanca, Maroc</span>
              </div>
              <div className="flex items-center gap-3 text-background/60">
                <Phone className="w-5 h-5 text-primary" />
                <span>+212 5XX-XXXXXX</span>
              </div>
              <div className="flex items-center gap-3 text-background/60">
                <Mail className="w-5 h-5 text-primary" />
                <span>contact@plateforme-univ.ma</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-background mb-4">Plateforme</h4>
            <ul className="space-y-3">
              {footerLinks.école.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Facultés</h4>
            <ul className="space-y-3">
              {footerLinks.formations.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Liens Utiles</h4>
            <ul className="space-y-3">
              {footerLinks.liens.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-background/60 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-black/20">
        <div className="container-custom py-6 px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>
              © {new Date().getFullYear()} Plateforme Universitaire Maroc. Tous
              droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Conditions d&apos;utilisation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
