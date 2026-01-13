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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Video,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Loader2,
  Plus,
} from "lucide-react";
import { createLiveRoom } from "@/actions/live-room";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-toastify";
import { FileUpload } from "@/app/admin/_components/courAddForm";

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface CreateLiveDialogProps {
  teacherId: string;
  subjects: Subject[];
  trigger?: React.ReactNode;
}

export function CreateLiveDialog({
  teacherId,
  subjects,
  trigger,
}: CreateLiveDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [image, setImage] = useState<File | null>();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    subjectId: "",
    startsAt: "",
    duration: "60",
    maxParticipants: "100",
    recordingEnabled: true,
    chatEnabled: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le titre est requis";
    }
    if (!formData.subjectId) {
      newErrors.subjectId = "Veuillez sélectionner une matière";
    }
    if (formData.startsAt) {
      const selectedDate = new Date(formData.startsAt);
      if (selectedDate < new Date()) {
        newErrors.startsAt = "La date doit être dans le futur";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await createLiveRoom({
        name: formData.name,
        description: formData.description || undefined,
        subjectId: formData.subjectId,
        teacherId,
        startsAt: formData.startsAt ? new Date(formData.startsAt) : undefined,
        duration: parseInt(formData.duration),
        maxParticipants: parseInt(formData.maxParticipants),
        recordingEnabled: formData.recordingEnabled,
        chatEnabled: formData.chatEnabled,
        image: image,
      });

      if (result.success) {
        toast.success("Votre session live a été créée avec succès");
        setOpen(false);
        resetForm();
        router.refresh();
      } else {
        toast.error(result.error || "Impossible de créer le live");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      subjectId: "",
      startsAt: "",
      duration: "60",
      maxParticipants: "100",
      recordingEnabled: true,
      chatEnabled: true,
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Créer un Live
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Video className="h-5 w-5" />
            Créer une Session Live
          </DialogTitle>
          <DialogDescription>
            Configurez votre session live pour vos étudiants
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Titre du Live <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ex: Cours de Mathématiques - Les Fractions"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez brièvement le contenu de cette session..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
            />
          </div>

          {/* Matière */}
          <div className="space-y-2">
            <Label htmlFor="subjectId" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Matière <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.subjectId}
              onValueChange={(value) => handleChange("subjectId", value)}
            >
              <SelectTrigger
                className={errors.subjectId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Sélectionnez une matière" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
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
            {errors.subjectId && (
              <p className="text-sm text-red-500">{errors.subjectId}</p>
            )}
          </div>

          {/* Date et Heure */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startsAt" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date et Heure de début
              </Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={formData.startsAt}
                onChange={(e) => handleChange("startsAt", e.target.value)}
                className={errors.startsAt ? "border-red-500" : ""}
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
              {errors.startsAt && (
                <p className="text-sm text-red-500">{errors.startsAt}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Laissez vide pour démarrer manuellement
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Durée (minutes)
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleChange("duration", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="90">1h 30</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                  <SelectItem value="180">3 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Image de couverture
            </h2>
            <FileUpload
              onFileSelect={(files) => setImage(files[0] || null)}
              accept="image/*"
              label="Image de couverture"
              description="Glissez-déposez une image ou cliquez pour sélectionner (JPG, PNG)"
              currentFiles={image ? [image] : []}
            />
          </div>

          {/* Nombre de participants */}
          <div className="space-y-2">
            <Label
              htmlFor="maxParticipants"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Nombre maximum de participants
            </Label>
            <Select
              value={formData.maxParticipants}
              onValueChange={(value) => handleChange("maxParticipants", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 participants</SelectItem>
                <SelectItem value="25">25 participants</SelectItem>
                <SelectItem value="50">50 participants</SelectItem>
                <SelectItem value="100">100 participants</SelectItem>
                <SelectItem value="200">200 participants</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <h4 className="font-medium text-sm">Options</h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="recordingEnabled">Enregistrement</Label>
                <p className="text-xs text-muted-foreground">
                  Enregistrer automatiquement la session
                </p>
              </div>
              <Switch
                id="recordingEnabled"
                checked={formData.recordingEnabled}
                onCheckedChange={(checked) =>
                  handleChange("recordingEnabled", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="chatEnabled">Chat en direct</Label>
                <p className="text-xs text-muted-foreground">
                  Permettre aux participants de chatter
                </p>
              </div>
              <Switch
                id="chatEnabled"
                checked={formData.chatEnabled}
                onCheckedChange={(checked) =>
                  handleChange("chatEnabled", checked)
                }
              />
            </div>
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
                <Video className="h-4 w-4 mr-2" />
                Créer le Live
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
