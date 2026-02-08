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
  Briefcase,
  MapPin,
  X,
  Mail,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";
import { redirect, useRouter } from "next/navigation";
import {
  getClientById,
  updateClientProfile1,
  createDemandeInscription,
} from "@/actions/client";
import { toast } from "react-toastify";
import Header from "@/components/Layout/Header";
import { getNiveau } from "@/actions/grads";

// Types
interface PersonalInfo {
  nom: string;
  prenom: string;
  phone: string;
  fonction: string;
  email: string;
  lieuEtudeTravail: string;
}

interface StudyInfo {
  selectedGrades: string[]; // Array of grade IDs
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
  readOnly = false,
  required = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: any;
  error?: string;
  readOnly?: boolean;
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
          readOnly={readOnly}
          className={`w-full px-4 py-2 bg-white border-2 rounded-[6px] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 outline-none ${
            error
              ? "border-red-400 bg-red-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        />
        <div className="absolute inset-0 rounded-[6px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
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

// MultiSelect Field amélioré
const MultiSelectField = ({
  label,
  selectedValues,
  onChange,
  options,
  placeholder,
  icon: Icon,
  error,
  required = false,
}: {
  label: string;
  selectedValues: string[];
  onChange: (values: string[]) => void;
  options: { id: string; name: string }[];
  placeholder: string;
  icon: any;
  error?: string;
  required?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (id: string) => {
    const newValues = selectedValues.includes(id)
      ? selectedValues.filter((v) => v !== id)
      : [...selectedValues, id];
    onChange(newValues);
  };

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-500" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Selected Items as Tickets */}
      <AnimatePresence>
        {selectedValues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2 mb-2"
          >
            {options
              .filter((opt) => selectedValues.includes(opt.id))
              .map((option) => (
                <motion.div
                  key={option.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 text-sm font-medium"
                >
                  {option.name}
                  <button
                    type="button"
                    onClick={() => toggleOption(option.id)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-4 py-3.5 bg-white border-2 rounded-[6px] text-left focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 flex items-center justify-between outline-none ${
            error
              ? "border-red-400 bg-red-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
        >
          <span
            className={`block truncate ${selectedValues.length === 0 ? "text-gray-400" : "text-gray-800"}`}
          >
            {selectedValues.length > 0
              ? `Ajouter d'autres niveaux...`
              : placeholder}
          </span>
          <ChevronRight
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-20 w-full mt-2 bg-white border-2 border-gray-100 rounded-[6px] shadow-xl max-h-60 overflow-y-auto"
              >
                {options.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        selectedValues.includes(option.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedValues.includes(option.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${selectedValues.includes(option.id) ? "text-blue-600 font-medium" : "text-gray-700"}`}
                    >
                      {option.name}
                    </span>
                  </div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
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
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-500" />
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3.5 bg-white border-2 rounded-[6px] focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 appearance-none outline-none ${
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InputField
          label="Email"
          value={data.email}
          onChange={(value) => onChange({ ...data, email: value })}
          placeholder="[EMAIL_ADDRESS]"
          icon={Mail}
          error={errors.email}
          required
          readOnly={true}
        />
        <InputField
          label="Fonction"
          value={data.fonction}
          onChange={(value) => onChange({ ...data, fonction: value })}
          placeholder="Ex: Étudiant, Consultant..."
          icon={Briefcase}
          error={errors.fonction}
          required
        />
        <InputField
          label="Lieu d'études / Travail"
          value={data.lieuEtudeTravail}
          onChange={(value) => onChange({ ...data, lieuEtudeTravail: value })}
          placeholder="Ex: Université de Casablanca"
          icon={MapPin}
          error={errors.lieuEtudeTravail}
          required
        />
      </div>
    </motion.div>
  );
};

// Étape 2: Informations d'étude - Grade Selection
const StudyInfoStep = ({
  data,
  onChange,
  errors,
}: {
  data: StudyInfo;
  onChange: (data: StudyInfo) => void;
  errors: Partial<StudyInfo>;
}) => {
  // Fixed niveau ID - all students will be linked to this
  const FIXED_NIVEAU_ID = "cmk1e7ue6000h0sroci9i2ev2";

  const [gradeOptions, setGradeOptions] = useState<
    { id: string; name: string; price: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await getNiveau();
        if (response.success) {
          // Find the specific niveau and extract its grades
          const targetNiveau = response.data.find(
            (niveau: any) => niveau.id === FIXED_NIVEAU_ID,
          );

          if (targetNiveau && targetNiveau.grades) {
            const grades = targetNiveau.grades.map((grade: any) => ({
              id: grade.id,
              name: grade.name,
              price: grade.price || 0,
            }));
            setGradeOptions(grades);
            // Automatically set the niveau ID
            onChange({ ...data, niveau: FIXED_NIVEAU_ID });
          }
        }
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  const handleGradeToggle = (gradeId: string) => {
    const currentGrades = data.selectedGrades || [];
    const isSelected = currentGrades.includes(gradeId);

    const newGrades = isSelected
      ? currentGrades.filter((id) => id !== gradeId)
      : [...currentGrades, gradeId];

    onChange({ ...data, selectedGrades: newGrades });
  };

  const calculateTotalPrice = () => {
    const selectedGrades = data.selectedGrades || [];
    return gradeOptions
      .filter((grade) => selectedGrades.includes(grade.id))
      .reduce((total, grade) => total + grade.price, 0);
  };

  const isGradeSelected = (gradeId: string) => {
    return (data.selectedGrades || []).includes(gradeId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 w-full"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent mb-2">
          Sélectionnez vos Niveaux
        </h2>
        <p className="text-gray-600">
          Choisissez les niveaux pour lesquels vous souhaitez vous inscrire
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
        <div className="max-w-md mx-auto">
          <MultiSelectField
            label="Niveaux d'études"
            selectedValues={data.selectedGrades || []}
            onChange={(values) => onChange({ ...data, selectedGrades: values })}
            options={gradeOptions}
            placeholder="Sélectionnez vos niveaux..."
            icon={BookOpen}
            error={errors.selectedGrades as any}
            required
          />
        </div>
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
              label: "Fonction",
              value: data.personal.fonction,
              icon: Briefcase,
            },
            {
              label: "Lieu",
              value: data.personal.lieuEtudeTravail,
              icon: MapPin,
            },
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
        className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-[6px] font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
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
    personal: {
      nom: "",
      prenom: "",
      phone: "",
      email: "",
      fonction: "",
      lieuEtudeTravail: "",
    },
    study: { niveau: "", selectedGrades: [] },
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
                email: res.email || "",
                fonction: res.fonction || "",
                lieuEtudeTravail: res.lieuEtudeTravail || "",
              },
              study: {
                selectedGrades: [],
                niveau: "",
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
    if (!data.fonction.trim()) errors.fonction = "La fonction est requise";
    if (!data.email.trim()) errors.email = "L'email est requis";
    if (!data.lieuEtudeTravail.trim())
      errors.lieuEtudeTravail = "Le lieu est requis";
    else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(data.phone))
      errors.phone = "Format de téléphone invalide";
    return errors;
  };

  const validateStudyInfo = (data: StudyInfo): Partial<StudyInfo> => {
    const errors: Partial<StudyInfo> = {};
    if (!data.selectedGrades || data.selectedGrades.length === 0) {
      errors.selectedGrades = "Veuillez sélectionner au moins un niveau" as any;
    }
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
          const res = await createDemandeInscription(
            session?.user.id,
            formData,
          );
          if (res.success) {
            await update({ step: 2 });
            toast.success(
              "Votre demande d'inscription a été soumise avec succès!",
            );
            router.push("/dashboard");
          } else {
            toast.error("Échec de la soumission de la demande");
          }
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
  if (!session) redirect("/");

  return (
    <div
      className="min-h-screen relative overflow-hidden h-screen"
      style={{
        backgroundImage: `url("/compli/bg-login.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header visible={false} />

      <div className="flex items-center justify-center h-full lg:p-0 p-3">
        <div className="relative max-w-7xl grid grid-cols-1 lg:grid-cols-3  bg-white/95 backdrop-blur-xl rounded-[6px] shadow-lg ">
          <div className="lg:col-span-2 w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="p-8 md:p-12"
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
                    className={`flex items-center gap-2 px-6 py-2 rounded-[6px] font-semibold transition-all duration-300 ${
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
                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-2 rounded-[6px] font-semibold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 relative overflow-hidden group"
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

            {/* Indicateur d'étape textuel 
            {currentStep < 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center mt-6 text-white/80 text-sm"
              >
                Étape {currentStep + 1} sur 2
              </motion.div>
            )}*/}
          </div>
          <div
            className="w-full items-center justify-center hidden lg:flex flex-col h-full rounded-r-[6px] bg-blue-600"
            style={{
              backgroundImage: `url("/compli/test.jpg")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-white p-3 rounded-full px-8 w-1/2 flex items-center justify-center">
              <img src="/compli/logo.png" className="w-full h-auto" alt="" />
            </div>
            <p className="p-4 text-white text-sm">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Distinctio quidem rerum beatae debitis nisi dicta. Obcaecati
              assumenda expedita numquam doloribus, at laudantium ducimus
              consectetur animi, fugit quia adipisci accusamus deserunt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
