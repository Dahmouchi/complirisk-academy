"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Course,
  Subject,
  CreateCourseData,
  UpdateCourseData,
} from "@/types/menu";

const courseSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .max(200, "Le titre est trop long"),
  content: z.string().optional(),
  videoUrl: z.string().url("URL invalide").optional().or(z.literal("")),
  coverImage: z.string().url("URL invalide").optional().or(z.literal("")),
  handler: z
    .string()
    .min(1, "Le handler est requis")
    .max(100, "Le handler est trop long")
    .regex(
      /^[a-z0-9-]+$/,
      "Le handler ne peut contenir que des lettres minuscules, chiffres et tirets",
    ),
  index: z.number().min(1, "L'ordre doit être supérieur à 0"),
  subjectId: z.string().min(1, "La matière est requise"),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCourseData | UpdateCourseData) => void;
  course?: Course | null;
  subjects: Subject[];
}

export function CourseDialog({
  isOpen,
  onClose,
  onSubmit,
  course,
  subjects,
}: CourseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = course !== null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      content: "",
      videoUrl: "",
      coverImage: "",
      handler: "",
      index: 1,
      subjectId: "",
    },
  });

  const watchedTitle = watch("title");
  const watchedHandler = watch("handler");

  // Générer automatiquement le handler basé sur le titre
  useEffect(() => {
    if (watchedTitle && !isEditing && !watchedHandler) {
      const generatedHandler = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      setValue("handler", generatedHandler);
    }
  }, [watchedTitle, isEditing, watchedHandler, setValue]);

  // Réinitialiser le formulaire quand le dialog s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      if (isEditing && course) {
        reset({
          title: course.title,
          content: course.content || "",
          videoUrl: course.videoUrl || "",
          coverImage: course.coverImage || "",
          handler: course.handler,
          index: course.index,
          subjectId: course.subjectId,
        });
      } else {
        reset({
          title: "",
          content: "",
          videoUrl: "",
          coverImage: "",
          handler: "",
          index: 1,
          subjectId: "",
        });
      }
    }
  }, [isOpen, isEditing, course, reset]);

  const handleFormSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    try {
      // Nettoyer les champs optionnels vides
      const cleanData = {
        ...data,
        content: data.content || undefined,
        videoUrl: data.videoUrl || undefined,
        coverImage: data.coverImage || undefined,
      };

      await onSubmit(cleanData);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier le cours" : "Créer un nouveau cours"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations du cours ci-dessous."
              : "Créez un nouveau cours pour votre matière."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Titre */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Ex: Introduction aux fractions"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Matière */}
            <div>
              <Label htmlFor="subjectId">Matière *</Label>
              <Select
                value={watch("subjectId")}
                onValueChange={(value) => setValue("subjectId", value)}
              >
                <SelectTrigger
                  className={errors.subjectId ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span>{subject.name}</span>
                        <span className="text-gray-500 text-sm">
                          ({subject?.grade?.name} -{" "}
                          {subject?.grade?.niveau?.name})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subjectId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subjectId.message}
                </p>
              )}
            </div>

            {/* Ordre */}
            <div>
              <Label htmlFor="index">Ordre *</Label>
              <Input
                id="index"
                type="number"
                min="1"
                {...register("index", { valueAsNumber: true })}
                placeholder="1"
                className={errors.index ? "border-red-500" : ""}
              />
              {errors.index && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.index.message}
                </p>
              )}
            </div>

            {/* Handler */}
            <div className="md:col-span-2">
              <Label htmlFor="handler">
                Handler *
                <span className="text-gray-500 text-sm ml-2">
                  (identifiant court pour l&apos;URL)
                </span>
              </Label>
              <Input
                id="handler"
                {...register("handler")}
                placeholder="introduction-fractions"
                className={errors.handler ? "border-red-500" : ""}
              />
              {errors.handler && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.handler.message}
                </p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Utilisé pour créer l&apos;URL du cours. Seuls les lettres
                minuscules, chiffres et tirets sont autorisés.
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="content">Description</Label>
            <Textarea
              id="content"
              {...register("content")}
              placeholder="Description ou résumé du cours..."
              rows={3}
              className={errors.content ? "border-red-500" : ""}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* URL Vidéo */}
            <div>
              <Label htmlFor="videoUrl">URL Vidéo</Label>
              <Input
                id="videoUrl"
                {...register("videoUrl")}
                placeholder="https://youtube.com/watch?v=..."
                className={errors.videoUrl ? "border-red-500" : ""}
              />
              {errors.videoUrl && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.videoUrl.message}
                </p>
              )}
            </div>

            {/* Image de couverture */}
            <div>
              <Label htmlFor="coverImage">Image de couverture</Label>
              <Input
                id="coverImage"
                {...register("coverImage")}
                placeholder="https://example.com/image.jpg"
                className={errors.coverImage ? "border-red-500" : ""}
              />
              {errors.coverImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.coverImage.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting
                ? "Enregistrement..."
                : isEditing
                  ? "Modifier"
                  : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
