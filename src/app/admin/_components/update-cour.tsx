/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Upload,
  X,
  Plus,
  Trash2,
  FileText,
  Save,
  AlertCircle,
  Loader,
  HelpCircle,
  Check,
  Circle,
} from "lucide-react";
import { updateCourse } from "@/actions/cours";
import { toast } from "react-toastify";
import DocumentManagement from "./cour-document";
import QuizManager from "./quiz-management";

interface Subject {
  id: string;
  handler: string;
  name: string;
  description?: string;
  color: string;
  gradeId: string;
}

interface QuizQuestion {
  id: string;
  content: string;
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

interface CourseFormData {
  title: string;
  content: string;
  videoUrl: string;
  index: number;
  subjectId: string;
  coverImage: File | null;
  coverImageUrl: string | null;
}
type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

// Composant pour l'upload de fichiers avec drag & drop
const FileUpload = ({
  onFileSelect,
  accept,
  multiple = false,
  label,
  description,
  currentFiles = [],
}: {
  onFileSelect: (files: File[]) => void;
  accept: string;
  multiple?: boolean;
  label: string;
  description: string;
  currentFiles?: File[];
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);

      if (files.length > 0) {
        const merged = multiple ? [...currentFiles, ...files] : files;
        onFileSelect(merged);
      }
    },
    [currentFiles, multiple, onFileSelect]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        const merged = multiple ? [...currentFiles, ...files] : files;
        onFileSelect(merged);
      }
    },
    [currentFiles, multiple, onFileSelect]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = currentFiles.filter((_, i) => i !== index);
      onFileSelect(newFiles);
    },
    [currentFiles, onFileSelect]
  );

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-[8px] p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload
          className={`w-12 h-12 mx-auto mb-4 ${
            isDragOver ? "text-blue-500" : "text-gray-400"
          }`}
        />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{label}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <button
          type="button"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Sélectionner {multiple ? "des fichiers" : "un fichier"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Liste des fichiers sélectionnés */}
      {currentFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Fichiers sélectionnés :</h4>
          {currentFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant principal du formulaire
const CourseUpdateForm = ({ grades, coure }: any) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    content: "",
    videoUrl: "",
    index: 1,
    subjectId: "",
    coverImage: null,
    coverImageUrl: "",
  });

  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (coure) {
      const initialGradeId = coure.subject.gradeId;

      setSelectedGrade(initialGradeId);

      const grade = grades.find((g: any) => g.id === initialGradeId);
      setAvailableSubjects(grade?.subjects || []);

      setFormData({
        title: coure.title || "",
        content: coure.content || "",
        videoUrl: coure.videoUrl || "",
        index: coure.index || 1,
        subjectId: coure.subjectId || "",
        coverImage: coure.coverImage || null,
        coverImageUrl: coure.coverImage || null,
      });
    }
  }, [coure, grades]);
  useEffect(() => {
    return () => {
      if (formData.coverImageUrl) {
        URL.revokeObjectURL(formData.coverImageUrl);
      }
    };
  }, [formData.coverImageUrl]);
  // Gestion de la sélection de classe
  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId);
    const grade = grades.find((g: any) => g.id === gradeId);
    setAvailableSubjects(grade?.subjects || []);
    setFormData((prev) => ({ ...prev, subjectId: "" }));
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }

    if (!formData.subjectId) {
      newErrors.subjectId = "La matière est requise";
    }

    if (formData.index < 1) {
      newErrors.index = "L'index doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulation d'envoi au backend
      const res = await updateCourse(coure.id, formData);
      if (res.success) {
        toast.success(res.message || "Cours mis à jour avec succès");
      } else {
        toast.error("err");
        console.log(res.error);
      }
    } catch (error) {
      console.error("Erreur lors de la création du cours:", error);
      toast.error("Erreur lors de la création du cours");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto ">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[8px] flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Créer un nouveau cours
              </h1>
              <p className="text-gray-600 mt-1">
                Ajoutez un cours avec ses documents et quiz associés
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Informations de base
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du cours *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: Introduction aux fractions"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classe *
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => handleGradeChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une classe</option>
                  {grades.map((grade: any) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matière *
                </label>
                <select
                  value={formData.subjectId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subjectId: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.subjectId ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={!selectedGrade}
                >
                  <option value="">Sélectionner une matière</option>
                  {availableSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {errors.subjectId && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.subjectId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la vidéo (optionnel)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      videoUrl: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mt-4 mb-2">
                Description (optionnel)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Description du cours"
              />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 my-6">
              Image de couverture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                onFileSelect={(files) => {
                  // Create URL for the first selected file
                  const imageUrl = files[0]
                    ? URL.createObjectURL(files[0])
                    : null;
                  setFormData((prev) => ({
                    ...prev,
                    coverImage: files[0] || null,
                    coverImageUrl: imageUrl || "", // Store the URL in state
                  }));
                }}
                accept="image/*"
                label="Image de couverture"
                description="Glissez-déposez une image ou cliquez pour sélectionner (JPG, PNG)"
                currentFiles={formData.coverImage ? [formData.coverImage] : []}
              />
              {formData.coverImageUrl ? (
                <img
                  src={formData.coverImageUrl}
                  alt="Preview de l'image de couverture"
                  className="w-full h-full object-contain border border-gray-200 rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
                  <span className="text-gray-400">
                    Aucune image sélectionnée
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between my-3">
              <div></div>
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Modification en cours...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>modifier le cours</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Upload de documents PDF */}

          {/* Boutons d'action */}
        </form>
        {/* Gestion des documents PDF */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mt-6">
          <DocumentManagement initialDocuments={coure.documents} />
        </div>
        {/* Gestion des quiz */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mt-6">
          <QuizManager
            courseId={coure.id}
            onQuizzesUpdate={() => console.log("Quizzes updated")}
            quizzes={coure.quizzes}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseUpdateForm;
