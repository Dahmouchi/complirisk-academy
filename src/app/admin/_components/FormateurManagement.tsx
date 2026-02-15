"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, User } from "lucide-react";
import {
  createFormateur,
  updateFormateur,
  deleteFormateur,
} from "@/actions/formateur";
import { uploadDocument } from "@/actions/cours";
import { toast } from "sonner";
import Image from "next/image";

interface Formateur {
  id: string;
  fullName: string;
  bio?: string | null;
  specialite: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  grades?: any[];
}

interface FormateurManagementProps {
  formateurs: Formateur[];
}

export function FormateurManagement({ formateurs }: FormateurManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFormateur, setSelectedFormateur] = useState<Formateur | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Liste des Formateurs</h2>
        <CreateFormateurDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formateurs.map((formateur) => (
          <Card key={formateur.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {formateur.image ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={formateur.image}
                        alt={formateur.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">
                      {formateur.fullName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {formateur.specialite}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {formateur.bio && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {formateur.bio}
                </p>
              )}
              {formateur.grades && formateur.grades.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Normes assignées:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {formateur.grades.map((grade) => (
                      <span
                        key={grade.id}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {grade.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  setSelectedFormateur(formateur);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit className="w-4 h-4 mr-1" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  if (
                    confirm(
                      `Êtes-vous sûr de vouloir supprimer ${formateur.fullName}?`,
                    )
                  ) {
                    const result = await deleteFormateur(formateur.id);
                    if (result.success) {
                      toast.success("Formateur supprimé avec succès");
                      window.location.reload();
                    } else {
                      toast.error(
                        result.error || "Erreur lors de la suppression",
                      );
                    }
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedFormateur && (
        <EditFormateurDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          formateur={selectedFormateur}
        />
      )}
    </div>
  );
}

function CreateFormateurDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadDocument(imageFile);
      }

      const result = await createFormateur({
        fullName,
        bio: bio || undefined,
        specialite,
        image: imageUrl || undefined,
      });

      if (result.success) {
        toast.success("Formateur créé avec succès");
        onOpenChange(false);
        setFullName("");
        setBio("");
        setSpecialite("");
        setImageFile(null);
        window.location.reload();
      } else {
        toast.error(result.error || "Erreur lors de la création");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un Formateur
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ajouter un Formateur</DialogTitle>
          <DialogDescription>
            Remplissez les informations du formateur
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom Complet *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Dr. Ahmed Benali"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialite">Spécialité *</Label>
              <Input
                id="specialite"
                value={specialite}
                onChange={(e) => setSpecialite(e.target.value)}
                placeholder="Ex: Expert en Conformité ISO"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Décrivez l'expérience et les qualifications du formateur..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Photo de profil</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImageFile(file);
                }}
              />
              {imageFile && (
                <p className="text-sm text-gray-500">
                  Fichier sélectionné: {imageFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditFormateurDialog({
  open,
  onOpenChange,
  formateur,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formateur: Formateur;
}) {
  const [fullName, setFullName] = useState(formateur.fullName);
  const [bio, setBio] = useState(formateur.bio || "");
  const [specialite, setSpecialite] = useState(formateur.specialite);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formateur.image || "";
      if (imageFile) {
        imageUrl = await uploadDocument(imageFile);
      }

      const result = await updateFormateur({
        id: formateur.id,
        fullName,
        bio: bio || undefined,
        specialite,
        image: imageUrl || undefined,
      });

      if (result.success) {
        toast.success("Formateur mis à jour avec succès");
        onOpenChange(false);
        window.location.reload();
      } else {
        toast.error(result.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le Formateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations du formateur
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">Nom Complet *</Label>
              <Input
                id="edit-fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-specialite">Spécialité *</Label>
              <Input
                id="edit-specialite"
                value={specialite}
                onChange={(e) => setSpecialite(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-bio">Biographie</Label>
              <Textarea
                id="edit-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Photo de profil</Label>
              {formateur.image && !imageFile && (
                <div className="mb-2">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden">
                    <Image
                      src={formateur.image}
                      alt={formateur.fullName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setImageFile(file);
                }}
              />
              {imageFile && (
                <p className="text-sm text-gray-500">
                  Nouveau fichier: {imageFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
