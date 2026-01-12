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
  UserPlus,
  Mail,
  Phone,
  Lock,
  User,
  BookOpen,
  X,
  Loader2,
} from "lucide-react";
import { createTeacher } from "@/actions/teacher";
import { toast } from "react-toastify";

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface CreateTeacherDialogProps {
  subjects: Subject[];
  trigger?: React.ReactNode;
}

export function CreateTeacherDialog({
  subjects,
  trigger,
}: CreateTeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
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

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
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
    if (selectedSubjects.length === 0) {
      newErrors.subjects = "Veuillez sélectionner au moins une matière";
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
        subjectIds: selectedSubjects,
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
    setSelectedSubjects([]);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5" />
            Créer un Nouvel Enseignant
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations de l'enseignant et sélectionnez les
            matières qu'il enseignera.
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

          {/* Matières */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Matières enseignées <span className="text-red-500">*</span>
            </Label>
            <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/30">
              {subjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune matière disponible
                </p>
              ) : (
                subjects.map((subject) => (
                  <Badge
                    key={subject.id}
                    variant={
                      selectedSubjects.includes(subject.id)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer px-3 py-1.5 transition-all hover:scale-105"
                    style={{
                      backgroundColor: selectedSubjects.includes(subject.id)
                        ? subject.color
                        : "transparent",
                      borderColor: subject.color,
                      color: selectedSubjects.includes(subject.id)
                        ? "white"
                        : subject.color,
                    }}
                    onClick={() => toggleSubject(subject.id)}
                  >
                    {subject.name}
                    {selectedSubjects.includes(subject.id) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))
              )}
            </div>
            {errors.subjects && (
              <p className="text-sm text-red-500">{errors.subjects}</p>
            )}
            {selectedSubjects.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedSubjects.length} matière(s) sélectionnée(s)
              </p>
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
                Créer l'Enseignant
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
