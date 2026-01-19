"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Mail,
  Phone,
  Lock,
  User,
  BookOpen,
  GraduationCap,
  X,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { createTeacher } from "@/actions/teacher";
import { toast } from "react-toastify";

interface Subject {
  id: string;
  name: string;
  color: string;
  gradeId: string;
}

interface Grade {
  id: string;
  name: string;
  subjects: Subject[];
}

interface GradeSubjectPair {
  gradeId: string;
  subjectId: string;
  gradeName?: string;
  subjectName?: string;
  subjectColor?: string;
}

interface CreateTeacherDialogProps {
  grades: Grade[];
  trigger?: React.ReactNode;
}

export function CreateTeacherDialog({
  grades,
  trigger,
}: CreateTeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gradeSubjectPairs, setGradeSubjectPairs] = useState<
    GradeSubjectPair[]
  >([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddGradeSubject = () => {
    if (!selectedGrade || !selectedSubject) {
      toast.error("Veuillez sélectionner un niveau et une matière");
      return;
    }

    // Check if this combination already exists
    const exists = gradeSubjectPairs.some(
      (pair) =>
        pair.gradeId === selectedGrade && pair.subjectId === selectedSubject,
    );

    if (exists) {
      toast.error("Cette combinaison niveau-matière existe déjà");
      return;
    }

    const grade = grades.find((g) => g.id === selectedGrade);
    const subject = grade?.subjects.find((s) => s.id === selectedSubject);

    if (grade && subject) {
      setGradeSubjectPairs((prev) => [
        ...prev,
        {
          gradeId: selectedGrade,
          subjectId: selectedSubject,
          gradeName: grade.name,
          subjectName: subject.name,
          subjectColor: subject.color,
        },
      ]);
      setSelectedGrade("");
      setSelectedSubject("");
      // Clear any error for gradeSubjects
      if (errors.gradeSubjects) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.gradeSubjects;
          return newErrors;
        });
      }
    }
  };

  const handleRemoveGradeSubject = (index: number) => {
    setGradeSubjectPairs((prev) => prev.filter((_, i) => i !== index));
  };

  const getAvailableSubjects = () => {
    if (!selectedGrade) return [];
    const grade = grades.find((g) => g.id === selectedGrade);
    return grade?.subjects || [];
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Numéro de téléphone invalide (10 chiffres)";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    if (gradeSubjectPairs.length === 0) {
      newErrors.gradeSubjects =
        "Veuillez ajouter au moins une combinaison niveau-matière";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setLoading(true);

    try {
      const result = await createTeacher({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        gradeSubjects: gradeSubjectPairs.map((pair) => ({
          gradeId: pair.gradeId,
          subjectId: pair.subjectId,
        })),
      });

      if (result.success) {
        toast.success("L'enseignant a été créé avec succès");
        setOpen(false);
        resetForm();
        router.refresh();
      } else {
        toast.error(result.error || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Impossible de créer l'enseignant");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setGradeSubjectPairs([]);
    setSelectedGrade("");
    setSelectedSubject("");
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Ajouter un Enseignant
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="min-w-[60vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5" />
            Créer un Nouvel Enseignant
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations de l&apos;enseignant et sélectionnez les
            niveaux et matières qu&apos;il enseignera.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Nom et Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nom"
                placeholder="Nom de famille"
                value={formData.nom}
                onChange={(e) => handleChange("nom", e.target.value)}
                className={errors.nom ? "border-red-500" : ""}
              />
              {errors.nom && (
                <p className="text-sm text-red-500">{errors.nom}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prenom" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Prénom <span className="text-red-500">*</span>
              </Label>
              <Input
                id="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={(e) => handleChange("prenom", e.target.value)}
                className={errors.prenom ? "border-red-500" : ""}
              />
              {errors.prenom && (
                <p className="text-sm text-red-500">{errors.prenom}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Téléphone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0612345678"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Mots de passe */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Mot de passe <span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                Confirmer <span className="text-red-500">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Grade and Subject Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Niveaux et Matières <span className="text-red-500">*</span>
            </Label>

            {/* Add Grade-Subject Pair */}
            <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
              <p className="text-sm text-muted-foreground">
                Sélectionnez d&apos;abord le niveau, puis la matière
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="grade"
                    className="flex items-center gap-2 text-sm"
                  >
                    <GraduationCap className="h-3 w-3" />
                    Niveau
                  </Label>
                  <Select
                    value={selectedGrade}
                    onValueChange={(value) => {
                      setSelectedGrade(value);
                      setSelectedSubject(""); // Reset subject when grade changes
                    }}
                  >
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Choisir un niveau" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="subject"
                    className="flex items-center gap-2 text-sm"
                  >
                    <BookOpen className="h-3 w-3" />
                    Matière
                  </Label>
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                    disabled={!selectedGrade}
                  >
                    <SelectTrigger id="subject">
                      <SelectValue
                        placeholder={
                          selectedGrade
                            ? "Choisir une matière"
                            : "Sélectionnez d'abord un niveau"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableSubjects().map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: subject.color }}
                            />
                            {subject.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddGradeSubject}
                className="w-full"
                disabled={!selectedGrade || !selectedSubject}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter cette combinaison
              </Button>
            </div>

            {/* Display Added Pairs */}
            {gradeSubjectPairs.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Combinaisons ajoutées ({gradeSubjectPairs.length})
                </p>
                <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-background">
                  {gradeSubjectPairs.map((pair, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm flex items-center gap-2"
                      style={{
                        borderColor: pair.subjectColor,
                        borderWidth: "2px",
                      }}
                    >
                      <GraduationCap className="h-3 w-3" />
                      <span className="font-medium">{pair.gradeName}</span>
                      <span className="text-muted-foreground">•</span>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: pair.subjectColor }}
                      />
                      <span>{pair.subjectName}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGradeSubject(index)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {errors.gradeSubjects && (
              <p className="text-sm text-red-500">{errors.gradeSubjects}</p>
            )}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Créer l&apos;enseignant
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
