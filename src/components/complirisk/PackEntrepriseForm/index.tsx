"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  submitDemandePackEntreprise,
  type DemandePackEntrepriseFormData,
} from "@/actions/demande-pack-entreprise";

// ─── Constants ──────────────────────────────────────────────────────────────

const THEMATIQUES = [
  "Conformité & Réglementation",
  "Management des Risques",
  "Normes ISO (9001, 14001, 45001…)",
  "Gouvernance d'entreprise",
  "Audit interne",
  "Lutte contre le blanchiment (LCB-FT)",
  "Cybersécurité & protection des données",
  "RSE & Développement Durable",
  "Autre",
];

const MODES = [
  {
    value: "PRESENTIEL",
    label: "Présentiel",
    description: "Formation intra-entreprise sur site",
    icon: "mdi:office-building",
  },
  {
    value: "CLASSE_VIRTUELLE",
    label: "Classe virtuelle",
    description: "À distance via plateforme en ligne",
    icon: "mdi:monitor-account",
  },
  {
    value: "HYBRIDE",
    label: "Hybride",
    description: "Mixte présentiel + distanciel",
    icon: "mdi:shuffle-variant",
  },
] as const;

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

type FormState = DemandePackEntrepriseFormData;

const INITIAL_STATE: FormState = {
  raisonSociale: "",
  secteurActivite: "",
  villePayse: "",
  nomPrenom: "",
  fonction: "",
  emailProfessionnel: "",
  telephone: "",
  thematiques: "",
  populationCiblee: "",
  nombreParticipants: undefined,
  modeFormation: "PRESENTIEL",
  consentementContact: false,
  consentementNewsletter: false,
};

// ─── Step indicator ──────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { num: 1, label: "Entreprise" },
    { num: 2, label: "Besoins" },
    { num: 3, label: "Confirmation" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, idx) => (
        <div key={s.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step >= s.num
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-gray-100 text-gray-400 border-2 border-gray-200"
              }`}
            >
              {step > s.num ? (
                <Icon icon="mdi:check" className="text-white text-lg" />
              ) : (
                s.num
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium whitespace-nowrap ${
                step >= s.num ? "text-primary" : "text-gray-400"
              }`}
            >
              {s.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`w-16 md:w-24 h-0.5 mb-5 mx-1 transition-all duration-500 ${
                step > s.num ? "bg-primary" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Field wrappers ──────────────────────────────────────────────────────────

function FieldGroup({
  label,
  icon,
  children,
  required,
}: {
  label: string;
  icon: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        <Icon icon={icon} className="text-primary text-base" />
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/80 text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200";

// ─── Main component ───────────────────────────────────────────────────────────

export default function PackEntrepriseForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateStep1() {
    return (
      form.raisonSociale.trim() &&
      form.secteurActivite.trim() &&
      form.villePayse.trim() &&
      form.nomPrenom.trim() &&
      form.fonction.trim() &&
      form.emailProfessionnel.trim() &&
      form.telephone.trim()
    );
  }

  function validateStep2() {
    return form.thematiques.trim() && form.modeFormation;
  }

  function validateStep3() {
    return form.consentementContact;
  }

  async function handleSubmit() {
    if (!validateStep3()) {
      setError(
        "Vous devez accepter d'être contacté pour soumettre la demande.",
      );
      return;
    }
    setLoading(true);
    setError(null);

    const result = await submitDemandePackEntreprise(form);

    setLoading(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error ?? "Une erreur est survenue. Veuillez réessayer.");
    }
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section
        id="pack-entreprise"
        className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      >
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center space-y-6 animate-fade-in">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Icon
                icon="mdi:check-circle"
                className="text-green-500 text-5xl"
              />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
              Demande envoyée avec succès !
            </h3>
            <p className="text-gray-500 leading-relaxed">
              Merci pour votre intérêt. Notre équipe vous recontacte{" "}
              <strong>sous 24–48h</strong> avec une proposition personnalisée et
              une estimation tarifaire adaptée à vos besoins.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              {[
                { icon: "mdi:clock-fast", text: "Réponse sous 24–48h" },
                { icon: "mdi:shield-check", text: "Données confidentielles" },
                {
                  icon: "mdi:file-document-edit",
                  text: "Devis personnalisé",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 bg-primary/5 rounded-full px-4 py-2 text-sm text-primary font-medium"
                >
                  <Icon icon={item.icon} />
                  {item.text}
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm(INITIAL_STATE);
                setStep(1);
              }}
              className="mt-4 text-sm text-gray-400 hover:text-primary underline underline-offset-4 transition-colors"
            >
              Soumettre une nouvelle demande
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ── Section layout ─────────────────────────────────────────────────────────
  return (
    <section
      id="pack-entreprise"
      className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-300/10 blur-3xl" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="text-center mb-14 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Demandez votre <span className="text-primary">Pack Entreprise</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Formations intra-entreprise adaptées à vos enjeux de conformité, de
            gestion des risques et de management ISO. Obtenez une proposition et
            un devis sous 48h.
          </p>

          {/* Value pills */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {[
              { icon: "mdi:tune", text: "100% sur-mesure" },
              { icon: "mdi:certificate-outline", text: "Experts certifiés" },
              { icon: "mdi:timer-sand", text: "Réponse sous 48h" },
              { icon: "mdi:shield-lock-outline", text: "Données sécurisées" },
            ].map((pill) => (
              <span
                key={pill.text}
                className="flex items-center gap-1.5 text-sm text-gray-600 bg-white border border-gray-100 shadow-sm px-3 py-1.5 rounded-full"
              >
                <Icon icon={pill.icon} className="text-primary" />
                {pill.text}
              </span>
            ))}
          </div>
        </div>

        {/* ── Form card ──────────────────────────────────────────────────── */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 md:p-12">
          <StepIndicator step={step} />

          {/* ── Step 1: Entreprise & Contact ───────────────────────────── */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              {/* Infos entreprise */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <Icon
                    icon="mdi:office-building-outline"
                    className="text-primary text-xl"
                  />
                  Informations entreprise
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <FieldGroup
                      label="Raison sociale"
                      icon="mdi:domain"
                      required
                    >
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Nom de votre entreprise"
                        value={form.raisonSociale}
                        onChange={(e) =>
                          update("raisonSociale", e.target.value)
                        }
                      />
                    </FieldGroup>
                  </div>
                  <FieldGroup
                    label="Secteur d'activité"
                    icon="mdi:briefcase-outline"
                    required
                  >
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="ex. Finance, Industrie, Santé…"
                      value={form.secteurActivite}
                      onChange={(e) =>
                        update("secteurActivite", e.target.value)
                      }
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Ville / Pays"
                    icon="mdi:map-marker-outline"
                    required
                  >
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="ex. Casablanca, Maroc"
                      value={form.villePayse}
                      onChange={(e) => update("villePayse", e.target.value)}
                    />
                  </FieldGroup>
                </div>
              </div>

              {/* Contact principal */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <Icon
                    icon="mdi:account-tie-outline"
                    className="text-primary text-xl"
                  />
                  Contact principal
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FieldGroup label="Nom & Prénom" icon="mdi:account" required>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Votre nom complet"
                      value={form.nomPrenom}
                      onChange={(e) => update("nomPrenom", e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Fonction / Poste"
                    icon="mdi:badge-account-outline"
                    required
                  >
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="ex. Responsable RH, DG…"
                      value={form.fonction}
                      onChange={(e) => update("fonction", e.target.value)}
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Email professionnel"
                    icon="mdi:email-outline"
                    required
                  >
                    <input
                      type="email"
                      className={inputClass}
                      placeholder="vous@entreprise.com"
                      value={form.emailProfessionnel}
                      onChange={(e) =>
                        update("emailProfessionnel", e.target.value)
                      }
                    />
                  </FieldGroup>
                  <FieldGroup
                    label="Téléphone"
                    icon="mdi:phone-outline"
                    required
                  >
                    <input
                      type="tel"
                      className={inputClass}
                      placeholder="+212 6XX XXX XXX"
                      value={form.telephone}
                      onChange={(e) => update("telephone", e.target.value)}
                    />
                  </FieldGroup>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => validateStep1() && setStep(2)}
                  disabled={!validateStep1()}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 hover:scale-105"
                >
                  Suivant — Besoins de formation
                  <Icon icon="mdi:arrow-right" className="text-lg" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Besoins de formation ──────────────────────────── */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <Icon
                    icon="mdi:school-outline"
                    className="text-primary text-xl"
                  />
                  Vos besoins en formation
                </h4>

                {/* Thématiques */}
                <div className="space-y-5">
                  <FieldGroup
                    label="Thématique(s) souhaitée(s)"
                    icon="mdi:tag-multiple-outline"
                    required
                  >
                    <select
                      className={inputClass}
                      value={form.thematiques}
                      onChange={(e) => update("thematiques", e.target.value)}
                    >
                      <option value="">Sélectionnez une thématique…</option>
                      {THEMATIQUES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <textarea
                      className={`${inputClass} mt-2 resize-none`}
                      rows={3}
                      placeholder="Précisez ou ajoutez d'autres thématiques…"
                      value={
                        THEMATIQUES.includes(form.thematiques)
                          ? ""
                          : form.thematiques
                      }
                      onChange={(e) => {
                        if (e.target.value)
                          update("thematiques", e.target.value);
                      }}
                    />
                  </FieldGroup>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FieldGroup
                      label="Population ciblée"
                      icon="mdi:account-group-outline"
                    >
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="ex. Cadres, managers, auditeurs…"
                        value={form.populationCiblee ?? ""}
                        onChange={(e) =>
                          update("populationCiblee", e.target.value)
                        }
                      />
                    </FieldGroup>
                    <FieldGroup
                      label="Nombre de participants"
                      icon="mdi:account-multiple-outline"
                    >
                      <input
                        type="number"
                        min={1}
                        className={inputClass}
                        placeholder="ex. 15"
                        value={form.nombreParticipants ?? ""}
                        onChange={(e) =>
                          update(
                            "nombreParticipants",
                            e.target.value ? Number(e.target.value) : undefined,
                          )
                        }
                      />
                    </FieldGroup>
                  </div>

                  {/* Mode de formation */}
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-3">
                      <Icon
                        icon="mdi:map-legend"
                        className="text-primary text-base"
                      />
                      Mode de formation{" "}
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {MODES.map((mode) => (
                        <button
                          key={mode.value}
                          type="button"
                          onClick={() => update("modeFormation", mode.value)}
                          className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200 text-center ${
                            form.modeFormation === mode.value
                              ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                              : "border-gray-200 bg-white hover:border-primary/40 hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              form.modeFormation === mode.value
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <Icon icon={mode.icon} className="text-2xl" />
                          </div>
                          <div>
                            <p
                              className={`font-semibold text-sm ${
                                form.modeFormation === mode.value
                                  ? "text-primary"
                                  : "text-gray-700"
                              }`}
                            >
                              {mode.label}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {mode.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 text-gray-600 font-medium px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  <Icon icon="mdi:arrow-left" />
                  Retour
                </button>
                <button
                  onClick={() => validateStep2() && setStep(3)}
                  disabled={!validateStep2()}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 hover:scale-105"
                >
                  Suivant — Confirmation
                  <Icon icon="mdi:arrow-right" className="text-lg" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Récapitulatif & Consentement ──────────────────── */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-in">
              {/* Récapitulatif */}
              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                  <Icon
                    icon="mdi:clipboard-list-outline"
                    className="text-primary text-xl"
                  />
                  Récapitulatif de votre demande
                </h4>
                <div className="bg-gray-50 rounded-2xl p-6 space-y-4 text-sm">
                  {[
                    { label: "Entreprise", value: form.raisonSociale },
                    { label: "Secteur", value: form.secteurActivite },
                    { label: "Ville / Pays", value: form.villePayse },
                    {
                      label: "Contact",
                      value: `${form.nomPrenom} — ${form.fonction}`,
                    },
                    { label: "Email", value: form.emailProfessionnel },
                    { label: "Téléphone", value: form.telephone },
                    { label: "Thématique", value: form.thematiques },
                    {
                      label: "Population ciblée",
                      value: form.populationCiblee || "Non précisé",
                    },
                    {
                      label: "Participants",
                      value: form.nombreParticipants
                        ? `${form.nombreParticipants} personnes`
                        : "Non précisé",
                    },
                    {
                      label: "Mode",
                      value:
                        MODES.find((m) => m.value === form.modeFormation)
                          ?.label ?? form.modeFormation,
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="text-gray-500 shrink-0">{label}</span>
                      <span className="text-gray-800 font-medium text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consentements */}
              <div className="space-y-4">
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    form.consentementContact
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.consentementContact}
                    onChange={(e) =>
                      update("consentementContact", e.target.checked)
                    }
                    className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-gray-900">
                      J&apos;accepte d&apos;être contacté(e)
                    </strong>{" "}
                    par CompliRisk Academy à l&apos;adresse et au numéro
                    renseignés afin de traiter ma demande de formation. *
                  </span>
                </label>

                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    form.consentementNewsletter
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-primary/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.consentementNewsletter}
                    onChange={(e) =>
                      update("consentementNewsletter", e.target.checked)
                    }
                    className="mt-0.5 w-4 h-4 accent-primary shrink-0"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    Je souhaite recevoir les{" "}
                    <strong className="text-gray-900">
                      actualités et offres
                    </strong>{" "}
                    de CompliRisk Academy (newsletters, webinaires, nouvelles
                    formations). Optionnel.
                  </span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <Icon
                    icon="mdi:alert-circle-outline"
                    className="text-lg shrink-0"
                  />
                  {error}
                </div>
              )}

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setStep(2)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 text-gray-600 font-medium px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  <Icon icon="mdi:arrow-left" />
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !form.consentementContact}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-xl shadow-md shadow-primary/20 transition-all duration-200 hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Icon
                        icon="mdi:loading"
                        className="text-lg animate-spin"
                      />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:send-outline" className="text-lg" />
                      Envoyer ma demande
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
