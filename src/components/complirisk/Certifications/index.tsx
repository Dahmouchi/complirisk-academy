import { Icon } from "@iconify/react";

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* En-tête */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Parcours & <span className="text-primary">Certifications</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl leading-relaxed">
            CompliRisk Academy propose deux catégories de formations, adaptées
            aux objectifs des professionnels et des organisations : des parcours
            professionnalisants avec attestation Academy et des formations
            certifiantes internationales.
          </p>
        </div>

        {/* Deux colonnes de formations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formations avec attestation CompliRisk Academy */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col lg:flex-row items-start space-x-4 mb-6">
              <div className="flex-shrink-0  bg-primary/20 rounded-xl flex items-center justify-center">
                <img src="/complirisk.png" className="w-auto h-16" alt="" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Formations avec attestation CompliRisk Academy
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="font-semibold text-primary">
                Des parcours conçus pour passer de la maîtrise des concepts à
                leur mise en œuvre concrète.
              </p>

              <p>
                Développées par des experts certifiés et praticiens terrain, nos
                formations sont résolument orientées vers l&apos;applicabilité
                immédiate en entreprise. Chaque programme associe expertise
                technique, outils opérationnels structurés et modèles de
                documents prêts à être adaptés et utilisés dans vos dispositifs
                internes.
              </p>

              <p>
                L&apos;objectif est clair : transformer les connaissances en
                actions mesurables et en dispositifs performants.
              </p>

              <p>
                À l&apos;issue du parcours, une{" "}
                <strong>attestation officielle CompliRisk Academy</strong> est
                délivrée, valorisant les compétences acquises et la capacité à
                structurer, formaliser et piloter efficacement les exigences
                traitées.
              </p>

              <p className="text-primary font-semibold">
                Ces formations constituent un levier rapide et stratégique pour
                renforcer une fonction, professionnaliser une équipe ou
                structurer un dispositif spécifique.
              </p>
            </div>
          </div>

          {/* Formations certifiantes internationales */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 border border-primary/20 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col lg:flex-row items-start space-x-4 mb-6">
              <div className="flex-shrink-0   rounded-xl flex items-center justify-center">
                <img src="/pecb.png" className="w-auto h-16" alt="" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  Formations certifiantes internationales
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Grâce à notre <strong>partenariat stratégique avec PECB</strong>
                , organisme international de certification reconnu, nous
                proposons des parcours officiels de formation et de préparation
                aux examens couvrant les principaux référentiels ISO ainsi que
                les standards internationaux en gouvernance, conformité,
                management des risques et lutte contre la corruption.
              </p>

              <p>
                Nos programmes intègrent notamment les thématiques suivantes :{" "}
                <strong>
                  management de la qualité, management environnemental, sécurité
                  de l&apos;information, santé et sécurité au travail,
                  continuité d&apos;activité, conformité réglementaire, risk
                  management et systèmes de management anticorruption.
                </strong>
              </p>

              <p>
                Nos experts certifiés vous accompagnent dans une démarche
                complète et structurée, allant de la montée en compétences à la
                mise en œuvre opérationnelle des exigences normatives, en
                passant par la préparation aux audits internes et le
                renforcement durable de vos dispositifs de maîtrise des risques.
              </p>
            </div>

            {/* Badge PECB */}
            <div className="mt-6 pt-6 border-t border-blue-300">
              <div className="flex items-center space-x-3">
                <Icon
                  icon="mdi:shield-check"
                  className="text-2xl text-blue-600"
                />
                <span className="text-sm font-semibold text-blue-700">
                  Partenaire officiel PECB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
