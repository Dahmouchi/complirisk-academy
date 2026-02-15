import Image from "next/image";
import { Icon } from "@iconify/react";

const Mentor = () => {
  return (
    <section id="mentors-section" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Notre collège d&apos;experts
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl">
              CompliRisk Academy fédère un réseau d&apos;experts certifiés
              intervenant selon les thématiques et les programmes. Les profils
              présentés ci-dessous représentent une partie des expertises
              mobilisées au sein de l&apos;Academy.
            </p>
          </div>
        </div>

        {/* Expert Card - Centered */}
        <div className="flex justify-center">
          <div className="max-w-md w-full">
            <div className="group relative shadow-xl rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-2xl transition-all duration-300">
              {/* Image */}
              <div className="h-96 w-full overflow-hidden bg-gray-200">
                <Image
                  src="/compli/login6.jpg"
                  alt="Zakaria BALHAOUI"
                  width={700}
                  height={700}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-8 space-y-4">
                {/* Name */}
                <h3 className="text-2xl font-bold text-gray-900 text-center">
                  Zakaria BALHAOUI
                </h3>

                {/* Title */}
                <p className="text-lg text-primary font-semibold text-center">
                  Expert en Gouvernance, Compliance & Management des Risques
                </p>

                {/* Role */}
                <p className="text-gray-600 text-center">
                  Fondateur de CompliRisk Consulting – Formateur certifié
                  international
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mentor;
