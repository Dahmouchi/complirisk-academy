"use client";
import Link from "next/link";
import Dropdownone from "./Dropdownone";
import Dropdowntwo from "./Dropdowntwo";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Companies from "../Companies";
import { useRouter } from "next/navigation";

const Banner = () => {
  const router = useRouter();
  return (
    <>
      {" "}
      <section className="pt-32  pb-16 md:pt-40 md:pb-24" id="Home">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Maîtrisez les Normes ISO et la Conformité avec des Formations
              Expertes
            </h1>

            <p className="text-muted-foreground text-lg mb-8">
              Obtenez des certifications ISO, en conformité réglementaire et
              gestion des risques grâce à notre plateforme e-learning accréditée
              conçue pour les professionnels.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <Button
                onClick={() => router.push("/login")}
                size="lg"
                className="shadow-primary px-8 w-full lg:w-fit rounded-full"
              >
                Connectez-vous
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                size="lg"
                className="px-8 w-full lg:w-fit rounded-full"
              >
                S&apos;inscrire
              </Button>
            </div>
          </div>
        </div>
        <Companies />
      </section>
      {/*
      <section className="bg-banner-image pt-28 pb-20">
        <div className="relative px-6 lg:px-8">
          <div className="container">
            <div className="flex flex-col gap-4 text-center">
              <h1 className="leading-tight font-bold tracking-tight max-w-4xl mx-auto">
                Maîtrisez les Normes ISO et la Conformité avec des Formations
                Expertes
              </h1>
              <p className="text-lg leading-8 text-black max-w-3xl mx-auto">
                Obtenez des certifications ISO, en conformité réglementaire et
                gestion des risques grâce à notre plateforme e-learning
                accréditée conçue pour les professionnels.
              </p>
              <div className="backdrop-blur-md bg-white/30 border border-white/30 rounded-lg shadow-lg p-6 w-fit mx-auto">
                <div className="flex items-center justify-center gap-8">
                  <div className="hidden sm:block -space-x-2 overflow-hidden">
                    <Image
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover"
                      src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
                      alt="Responsable Qualité"
                      width={48}
                      height={48}
                    />
                    <Image
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover"
                      src="https://images.pexels.com/photos/3785843/pexels-photo-3785843.jpeg"
                      alt="Responsable Conformité"
                      width={48}
                      height={48}
                    />
                    <Image
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover"
                      src="https://images.pexels.com/photos/5787318/pexels-photo-5787318.jpeg"
                      alt="Auditeur"
                      width={48}
                      height={48}
                    />
                    <Image
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover"
                      src="https://images.pexels.com/photos/34983079/pexels-photo-34983079.jpeg"
                      alt="Entreprise Certifiée"
                      width={48}
                      height={48}
                    />
                    <Image
                      className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover"
                      src="https://images.pexels.com/photos/33801228/pexels-photo-33801228.jpeg"
                      alt="Client Entreprise"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <div className="flex justify-center sm:justify-start">
                      <h3 className="text-2xl font-semibold mr-2">4,8/5</h3>
                      <Image
                        src={"/images/banner/Stars.svg"}
                        alt="icône-étoiles"
                        width={32}
                        height={32}
                        className="w-[60%]"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm">
                        Noté par 2 500+ professionnels de la conformité
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <div className="mx-auto max-w-4xl mt-12 p-6 lg:max-w-4xl lg:px-8 bg-white rounded-lg boxshadow">
            <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-8 xl:gap-x-8">
              <div className="col-span-3">
                <select className="w-full border border-gray-300 rounded-sm py-4 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">Sélectionner une Catégorie</option>
                  <option value="iso9001">
                    ISO 9001 Management de la Qualité
                  </option>
                  <option value="iso14001">ISO 14001 Environnement</option>
                  <option value="iso45001">ISO 45001 Santé et Sécurité</option>
                  <option value="iso27001">
                    ISO 27001 Sécurité de l'Information
                  </option>
                  <option value="compliance">Conformité Réglementaire</option>
                  <option value="risk">Gestion des Risques</option>
                  <option value="auditor">Formations Auditeur</option>
                </select>
              </div>

              <div className="col-span-3">
                <select className="w-full border border-gray-300 rounded-sm py-4 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option value="">Niveau de Certification</option>
                  <option value="awareness">Formation Sensibilisation</option>
                  <option value="implementation">Implémentation</option>
                  <option value="internal-auditor">Auditeur Interne</option>
                  <option value="lead-auditor">Auditeur Chef</option>
                  <option value="transition">Formation Transition</option>
                </select>
              </div>

              <div className="col-span-3 sm:col-span-2 mt-2">
                <Link href={"/#courses-section"}>
                  <button className="bg-primary w-full hover:bg-transparent hover:text-primary duration-300 border border-primary text-white font-bold py-4 px-3 rounded-sm hover:cursor-pointer">
                    Trouver Votre Formation
                  </button>
                </Link>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-6 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-primary">40+</span>
                  <span className="text-sm text-gray-600">Normes ISO</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-primary">100%</span>
                  <span className="text-sm text-gray-600">
                    Taux de Réussite
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-primary">IAF</span>
                  <span className="text-sm text-gray-600">Accrédité</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-primary">
                    24h/24
                  </span>
                  <span className="text-sm text-gray-600">Accès</span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>
      */}
    </>
  );
};

export default Banner;
