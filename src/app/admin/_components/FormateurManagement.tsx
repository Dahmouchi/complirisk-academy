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
import { Plus, Edit, Trash2, User, KeyRound, CheckCircle2 } from "lucide-react";
import {
  createFormateur,
  updateFormateur,
  deleteFormateur,
  createFormateurAccount,
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
  userId?: string | null; // linked User account
  createdAt: Date;
  updatedAt: Date;
  grades?: any[];
  user?: any;
}

interface FormateurManagementProps {
  formateurs: Formateur[];
}

export function FormateurManagement({ formateurs }: FormateurManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
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
            <CardHeader className="pb-4 text-center">
              <div className="w-full flex items-center justify-center">
                {formateur.user?.image ? (
                  <div className="relative w-18 h-18 rounded-full overflow-hidden">
                    <Image
                      src={formateur.user.image}
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
              </div>
              <div className="flex items-start justify-between w-full ">
                <div className="flex items-center gap-3 w-full">
                  <div className="w-full">
                    <CardTitle className="text-lg w-full">
                      {formateur.user.name} {formateur.user.prenom}
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
            <CardFooter className="flex flex-col gap-2 pt-4 border-t">
              <div className="flex gap-2 w-full">
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
              </div>
              {/* Account creation button */}
              {formateur.userId ? (
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium w-full justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Compte activé
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedFormateur(formateur);
                    setIsAccountDialogOpen(true);
                  }}
                >
                  <KeyRound className="w-4 h-4 mr-1" />
                  Créer un compte
                </Button>
              )}
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
      {selectedFormateur && (
        <CreateAccountDialog
          open={isAccountDialogOpen}
          onOpenChange={setIsAccountDialogOpen}
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
  const [prenom, setPrenom] = useState("");
  const [bio, setBio] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  // Account fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [fonction, setFonction] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // If account section is partially filled, require both username + password
    const hasAccountInfo = username || email || password || phone || fonction;
    if (hasAccountInfo && (!username || !password)) {
      toast.error(
        "Veuillez renseigner l'identifiant et le mot de passe pour créer un compte.",
      );
      setIsLoading(false);
      return;
    }

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadDocument(imageFile);
      }

      const result = await createFormateur({
        fullName,
        prenom: prenom || undefined,
        bio: bio || undefined,
        specialite,
        image: imageUrl || undefined,
        // account fields (only sent when filled)
        username: username || undefined,
        email: email || undefined,
        password: password || undefined,
        phone: phone || undefined,
        fonction: fonction || undefined,
      });

      if (result.success) {
        toast.success(
          username
            ? "Formateur et compte créés avec succès"
            : "Formateur créé avec succès",
        );
        onOpenChange(false);
        // Reset all fields
        setFullName("");
        setPrenom("");
        setBio("");
        setSpecialite("");
        setImageFile(null);
        setUsername("");
        setEmail("");
        setPassword("");
        setPhone("");
        setFonction("");
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Formateur</DialogTitle>
          <DialogDescription>
            Remplissez les informations du formateur. Vous pouvez aussi créer
            son compte de connexion en même temps.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* ── Section 1 : Profil ──────────────────────────── */}
          <div className="space-y-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Profil du formateur
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Ex: Ahmed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom *</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Benali"
                  required
                />
              </div>
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
                rows={3}
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

          {/* ── Separator ───────────────────────────────────── */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400 flex items-center gap-1">
                <KeyRound className="w-3 h-3" />
                Compte de connexion (optionnel)
              </span>
            </div>
          </div>

          {/* ── Section 2 : Compte ──────────────────────────── */}
          <div className="space-y-4 py-4">
            <p className="text-xs text-gray-500">
              Remplissez ces champs pour créer directement un compte formateur.
              Laissez vide si vous souhaitez le faire plus tard.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">
                  Identifiant{" "}
                  {(username || email || password) && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: ahmed.benali"
                  minLength={2}
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmed@example.com"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-password">
                Mot de passe{" "}
                {(username || email || password) && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Input
                id="create-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+213 6XX XXX XXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fonction">Fonction</Label>
                <Input
                  id="fonction"
                  value={fonction}
                  onChange={(e) => setFonction(e.target.value)}
                  placeholder="Ex: Consultant Senior"
                />
              </div>
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
              {isLoading
                ? "Création..."
                : username
                  ? "Créer formateur + compte"
                  : "Créer formateur"}
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
  // Profile fields
  const [nom, setNom] = useState(
    formateur.user?.name || formateur.fullName || "",
  );
  const [prenom, setPrenom] = useState(formateur.user?.prenom || "");
  const [bio, setBio] = useState(formateur.bio || "");
  const [specialite, setSpecialite] = useState(formateur.specialite);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Account fields (only relevant when a user is linked)
  const [email, setEmail] = useState(formateur.user?.email || "");
  const [phone, setPhone] = useState(formateur.user?.phone || "");
  const [fonction, setFonction] = useState(formateur.user?.fonction || "");
  const [newPassword, setNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const hasAccount = !!formateur.userId;

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
        nom: nom || undefined,
        prenom: prenom || undefined,
        bio: bio || undefined,
        specialite,
        image: imageUrl || undefined,
        // Account fields (only sent when the formateur has a linked user)
        ...(hasAccount && {
          email: email || undefined,
          phone: phone || undefined,
          fonction: fonction || undefined,
          password: newPassword || undefined,
        }),
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le Formateur</DialogTitle>
          <DialogDescription>
            Modifiez les informations du profil
            {hasAccount ? " et du compte de connexion" : ""}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* ── Section 1 : Profil ──────────────────────────── */}
          <div className="space-y-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Profil du formateur
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-prenom">Prénom</Label>
                <Input
                  id="edit-prenom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Ex: Ahmed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-nom">Nom *</Label>
                <Input
                  id="edit-nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: Benali"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-specialite">Spécialité *</Label>
              <Input
                id="edit-specialite"
                value={specialite}
                onChange={(e) => setSpecialite(e.target.value)}
                placeholder="Ex: Expert en Conformité ISO"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-bio">Biographie</Label>
              <Textarea
                id="edit-bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Décrivez l'expérience et les qualifications du formateur..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Photo de profil</Label>
              {(formateur.image || formateur.user?.image) && !imageFile && (
                <div className="mb-2">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden">
                    <Image
                      src={formateur.user?.image || formateur.image!}
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

          {/* ── Account Section (only when user is linked) ── */}
          {hasAccount && (
            <>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-400 flex items-center gap-1">
                    <KeyRound className="w-3 h-3" />
                    Compte de connexion
                  </span>
                </div>
              </div>

              <div className="space-y-4 py-4">
                <p className="text-xs text-gray-500">
                  Modifiez les informations du compte formateur. Laissez le mot
                  de passe vide pour le conserver.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ahmed@example.com"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Téléphone</Label>
                    <Input
                      id="edit-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+213 6XX XXX XXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-fonction">Fonction</Label>
                  <Input
                    id="edit-fonction"
                    value={fonction}
                    onChange={(e) => setFonction(e.target.value)}
                    placeholder="Ex: Consultant Senior"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-password">
                    Nouveau mot de passe{" "}
                    <span className="text-gray-400 font-normal">
                      (optionnel)
                    </span>
                  </Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 caractères — laisser vide pour ne pas changer"
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </>
          )}

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

// ── Dialog: create a login account for a Formateur ───────────────────────────
function CreateAccountDialog({
  open,
  onOpenChange,
  formateur,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formateur: Formateur;
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await createFormateurAccount({
        formateurId: formateur.id,
        username,
        password,
        email: email || undefined,
      });
      if (result.success) {
        toast.success("Compte formateur créé avec succès !");
        onOpenChange(false);
        setUsername("");
        setEmail("");
        setPassword("");
        window.location.reload();
      } else {
        toast.error(result.error || "Erreur lors de la création du compte");
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Créer un compte pour {formateur.fullName}</DialogTitle>
          <DialogDescription>
            Ce compte permettra au formateur de se connecter à{" "}
            <strong>/formateur/login</strong>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="acc-username">Identifiant *</Label>
              <Input
                id="acc-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ex: ahmed.benali"
                required
                minLength={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acc-email">Email (optionnel)</Label>
              <Input
                id="acc-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmed@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acc-password">Mot de passe *</Label>
              <Input
                id="acc-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                required
                minLength={6}
              />
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
              {isLoading ? "Création..." : "Créer le compte"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
