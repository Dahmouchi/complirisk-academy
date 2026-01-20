"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Phone,
  BookOpen,
  IdCard,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  School,
  Sparkles,
  GraduationCap,
  Award,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import { redirect, useRouter } from "next/navigation";
import {
  getClientById,
  updateClientProfile1,
  updateClientProfile2,
} from "@/actions/client";
import { toast } from "react-toastify";
import Header from "@/components/Layout/Header";
import { getNiveau } from "@/actions/grads";

// Types
interface PersonalInfo {
  nom: string;
  prenom: string;
  phone: string;
}

interface StudyInfo {
  gradeId: string;
  universiteId: string;
  universiteCity: string;
  niveau: string;
}

interface FormData {
  personal: PersonalInfo;
  study: StudyInfo;
}

// Input Field avec design amélioré
const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: any;
  error?: string;
  required?: boolean;
}) => {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-500" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-3.5 bg-white border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 outline-none ${
            error
              ? "border-red-400 bg-red-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        />
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// Select Field amélioré
const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  icon: Icon,
  error,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  icon: any;
  error?: string;
  required?: boolean;
}) => {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-500" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3.5 bg-white border-2 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 appearance-none outline-none ${
            error
              ? "border-red-400 bg-red-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  );
};

// Progress Indicator moderne
const ProgressIndicator = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const steps = [
    { icon: User, label: "Profil" },
    { icon: GraduationCap, label: "Études" },
  ];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between max-w-md mx-auto relative">
        {/* Ligne de progression */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full -z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold relative ${
                index < currentStep
                  ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/50"
                  : index === currentStep
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                    : "bg-white border-2 border-gray-300 text-gray-400"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
              {index === currentStep && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-500"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ opacity: 0.3 }}
                />
              )}
            </motion.div>
            <span
              className={`text-xs font-medium ${
                index <= currentStep ? "text-gray-700" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Étape 1: Informations personnelles
const PersonalInfoStep = ({
  data,
  onChange,
  errors,
}: {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
  errors: Partial<PersonalInfo>;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* En-tête avec illustration */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent mb-2">
          Bienvenue !
        </h2>
        <p className="text-gray-600">Commençons par vos informations de base</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Nom"
          value={data.nom}
          onChange={(value) => onChange({ ...data, nom: value })}
          placeholder="Entrez votre nom"
          icon={User}
          error={errors.nom}
          required
        />
        <InputField
          label="Prénom"
          value={data.prenom}
          onChange={(value) => onChange({ ...data, prenom: value })}
          placeholder="Entrez votre prénom"
          icon={User}
          error={errors.prenom}
          required
        />
      </div>

      <InputField
        label="Téléphone"
        type="tel"
        value={data.phone}
        onChange={(value) => onChange({ ...data, phone: value })}
        placeholder="+212 6 12 34 56 78"
        icon={Phone}
        error={errors.phone}
        required
      />
    </motion.div>
  );
};

// Étape 2: Informations d'étude
const StudyInfoStep = ({
  data,
  onChange,
  errors,
}: {
  data: StudyInfo & { gradeId?: string };
  onChange: (data: StudyInfo) => void;
  errors: Partial<StudyInfo>;
}) => {
  const [niveauOptions, setNiveauOptions] = useState<
    {
      value: string;
      label: string;
      grades?: { value: string; label: string }[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Mapping of cities to universities based on the provided image
  const villesUniversites: {
    [key: string]: { value: string; label: string }[];
  } = {
    Rabat: [{ value: "um5", label: "Université Mohammed V" }],
    Salé: [{ value: "um5-sale", label: "Université Mohammed V" }],
    Casablanca: [{ value: "uh2c", label: "Université Hassan II" }],
    Fès: [
      { value: "usmba", label: "Université Sidi Mohamed Ben Abdellah" },
      { value: "uaq", label: "Université Al Quaraouiyine" },
    ],
    Marrakech: [{ value: "uca", label: "Université Cadi Ayyad" }],
    Meknès: [{ value: "ump", label: "Université Moulay Ismail" }],
    Oujda: [{ value: "uma", label: "Université Mohammed Premier" }],
    Tanger: [{ value: "uae", label: "Université Abdelmalek Essaâdi" }],
    Tétouan: [{ value: "uae-tetouan", label: "Université Abdelmalek Essaâdi" }],
    "El Jadida": [{ value: "ucam", label: "Université Chouaib Doukkali" }],
    Kénitra: [{ value: "uit", label: "Université Ibn Tofail" }],
    Agadir: [{ value: "uiz", label: "Université Ibn Zohr" }],
    Settat: [{ value: "uh1", label: "Université Hassan Ier" }],
    "Beni Mellal": [
      { value: "usms", label: "Université Sultan Moulay Slimane" },
    ],
  };

  // List of cities for the dropdown
  const villes = Object.keys(villesUniversites)
    .sort()
    .map((ville) => ({
      value: ville,
      label: ville,
    }));

  useEffect(() => {
    const fetchNiveaux = async () => {
      try {
        const response = await getNiveau();
        if (response.success) {
          const options = response.data.map((niveau: any) => ({
            value: niveau.id,
            label: niveau.name,
            grades: niveau.grades.map((grade: any) => ({
              value: grade.id,
              label: grade.name,
            })),
          }));
          setNiveauOptions(options);
        }
      } catch (error) {
        console.error("Error fetching niveaux:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNiveaux();
  }, []);

  const handleNiveauChange = (value: string) => {
    onChange({ ...data, niveau: value, gradeId: "" });
  };

  const handleCityChange = (value: string) => {
    // Reset university when city changes
    onChange({ ...data, universiteCity: value, universiteId: "" });
  };

  // Get universities for the selected city
  const getUniversitiesForCity = () => {
    if (!data.universiteCity) return [];
    return villesUniversites[data.universiteCity] || [];
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent mb-2">
          Votre Parcours
        </h2>
        <p className="text-gray-600">
          Dites-nous en plus sur vos études actuelles
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-200 border-t-primary rounded-full"
          />
        </div>
      ) : (
        <>
          {/* Step 1: Select City */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <SelectField
              label="Ville de l'université"
              value={data.universiteCity}
              onChange={handleCityChange}
              options={villes}
              placeholder="Sélectionnez votre ville"
              icon={School}
              error={errors.universiteCity}
              required
            />
          </motion.div>

          {/* Step 2: Select University (appears after city selection) */}
          <AnimatePresence>
            {data.universiteCity && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SelectField
                  label="Université"
                  value={data.universiteId}
                  onChange={(value) =>
                    onChange({ ...data, universiteId: value })
                  }
                  options={getUniversitiesForCity()}
                  placeholder="Sélectionnez votre université"
                  icon={GraduationCap}
                  error={errors.universiteId}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 3: Select Niveau */}
          <SelectField
            label="Niveau d'étude"
            value={data.niveau}
            onChange={handleNiveauChange}
            options={niveauOptions}
            placeholder="Choisissez votre niveau"
            icon={BookOpen}
            error={errors.niveau}
            required
          />

          {/* Step 4: Select Grade (appears after niveau selection) */}
          <AnimatePresence>
            {data.niveau && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SelectField
                  label="Classe"
                  value={data.gradeId}
                  onChange={(value) => onChange({ ...data, gradeId: value })}
                  options={
                    niveauOptions.find((n) => n.value === data.niveau)
                      ?.grades || []
                  }
                  placeholder="Sélectionnez votre classe"
                  icon={Award}
                  error={errors.gradeId}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
};

// Étape de confirmation
const ConfirmationStep = ({ data }: { data: FormData }) => {
  const niveauLabels: { [key: string]: string } = {
    college: "Collège",
    lycee: "Lycée",
    universite: "Université",
    master: "Master",
    doctorat: "Doctorat",
    formation: "Formation Professionnelle",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50 relative"
      >
        <Check className="w-12 h-12 text-white" />
        <motion.div
          className="absolute inset-0 rounded-full bg-green-400"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3"
      >
        Félicitations ! 🎉
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 mb-8 text-lg"
      >
        Votre profil a été créé avec succès
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 max-w-md mx-auto border-2 border-gray-200 shadow-xl"
      >
        <h3 className="font-bold text-gray-800 mb-6 text-lg flex items-center justify-center gap-2">
          <User className="w-5 h-5 text-blue-500" />
          Récapitulatif
        </h3>

        <div className="space-y-4">
          {[
            {
              label: "Nom complet",
              value: `${data.personal.prenom} ${data.personal.nom}`,
              icon: User,
            },
            { label: "Téléphone", value: data.personal.phone, icon: Phone },
            {
              label: "Niveau",
              value: niveauLabels[data.study.niveau] || data.study.niveau,
              icon: GraduationCap,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center justify-between bg-white rounded-[8px] p-4 shadow-sm"
            >
              <span className="text-gray-600 text-sm flex items-center gap-2">
                <item.icon className="w-4 h-4 text-gray-400" />
                {item.label}
              </span>
              <span className="font-semibold text-gray-800">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => redirect("/dashboard")}
      >
        Commencer l&apos;apprentissage
      </motion.button>
    </motion.div>
  );
};

// Composant principal
const MultiStepForm = () => {
  const { data: session, status, update } = useSession();
  const [currentStep, setCurrentStep] = useState(session?.user.step || 0);
  const [formData, setFormData] = useState<FormData>({
    personal: { nom: "", prenom: "", phone: "" },
    study: { niveau: "", gradeId: "", universiteId: "", universiteCity: "" },
  });
  const [errors, setErrors] = useState<{
    personal: Partial<PersonalInfo>;
    study: Partial<StudyInfo>;
  }>({
    personal: {},
    study: {},
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (session) {
          const res = await getClientById(session.user.id);
          if (res) {
            setFormData({
              personal: {
                nom: res.name || "",
                prenom: res.prenom || "",
                phone: res.phone?.toString() || "",
              },
              study: {
                gradeId: "",
                niveau: "",
                universiteId: "",
                universiteCity: "",
              },
            });
          }
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    };
    if (session?.user?.id) fetchUserData();
  }, []);

  const validatePersonalInfo = (data: PersonalInfo): Partial<PersonalInfo> => {
    const errors: Partial<PersonalInfo> = {};
    if (!data.nom.trim()) errors.nom = "Le nom est requis";
    if (!data.prenom.trim()) errors.prenom = "Le prénom est requis";
    if (!data.phone.trim()) errors.phone = "Le téléphone est requis";
    else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(data.phone))
      errors.phone = "Format de téléphone invalide";
    return errors;
  };

  const validateStudyInfo = (data: StudyInfo): Partial<StudyInfo> => {
    const errors: Partial<StudyInfo> = {};
    if (!data.universiteCity) errors.universiteCity = "La ville est requise";
    if (!data.universiteId) errors.universiteId = "L'université est requise";
    if (!data.niveau) errors.niveau = "Le niveau d'étude est requis";
    if (!data.gradeId) errors.gradeId = "La classe est requise";
    return errors;
  };

  const nextStep = async () => {
    if (currentStep === 0) {
      const personalErrors = validatePersonalInfo(formData.personal);
      if (Object.keys(personalErrors).length > 0) {
        setErrors((prev) => ({ ...prev, personal: personalErrors }));
        return;
      }
      setErrors((prev) => ({ ...prev, personal: {} }));
      try {
        if (session) {
          const res = await updateClientProfile1(session?.user.id, formData);
          if (res) setCurrentStep(1);
          else toast.error("Échec de la mise à jour du profil");
        }
      } catch (error) {
        console.error("Update failed", error);
        toast.error("Une erreur s'est produite");
      }
    } else if (currentStep === 1) {
      const studyErrors = validateStudyInfo(formData.study);
      if (Object.keys(studyErrors).length > 0) {
        setErrors((prev) => ({ ...prev, study: studyErrors }));
        return;
      }
      try {
        if (session) {
          const res = await updateClientProfile2(session?.user.id, formData);
          if (res) {
            await update({ step: 2 });
            router.push("/dashboard");
          } else toast.error("Échec de la mise à jour du profil");
        }
      } catch (error) {
        console.error("Update failed", error);
        toast.error("Une erreur s'est produite");
      }
      setErrors((prev) => ({ ...prev, study: {} }));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  if (status === "loading") return <Loading />;
  if (!session) redirect("/login");

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url("/cinq/bgnew.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay gradient */}
      <div className="absolute inset-0" />

      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ repeat: Infinity, duration: 20 }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ repeat: Infinity, duration: 15 }}
        />
      </div>

      <Header visible={false} />

      <div className="relative max-w-3xl mx-auto pt-32 p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12"
        >
          {currentStep < 2 && (
            <ProgressIndicator currentStep={currentStep} totalSteps={2} />
          )}

          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <PersonalInfoStep
                key="personal"
                data={formData.personal}
                onChange={(data) => {
                  setFormData((prev) => ({ ...prev, personal: data }));
                  setErrors((prev) => ({ ...prev, personal: {} }));
                }}
                errors={errors.personal}
              />
            )}
            {currentStep === 1 && (
              <StudyInfoStep
                key="study"
                data={formData.study}
                onChange={(data) => {
                  setFormData((prev) => ({ ...prev, study: data }));
                  setErrors((prev) => ({ ...prev, study: {} }));
                }}
                errors={errors.study}
              />
            )}
            {currentStep === 2 && (
              <ConfirmationStep key="confirmation" data={formData} />
            )}
          </AnimatePresence>

          {currentStep < 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-between mt-10 gap-4"
            >
              <motion.button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${
                  currentStep === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:shadow-lg hover:scale-105 active:scale-95"
                }`}
                whileHover={currentStep > 0 ? { x: -5 } : {}}
                whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Précédent</span>
              </motion.button>

              <motion.button
                onClick={nextStep}
                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  {currentStep === 1 ? "Terminer" : "Suivant"}
                  <ChevronRight className="w-5 h-5" />
                </span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Indicateur d'étape textuel */}
        {currentStep < 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center mt-6 text-white/80 text-sm"
          >
            Étape {currentStep + 1} sur 2
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
