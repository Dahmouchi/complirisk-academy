"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Upload,
  X,
  Plus,
  Trash2,
  FileText,
  Save,
  Eye,
  AlertCircle,
  Loader,
  HelpCircle,
  Check,
  Circle,
} from "lucide-react";
import { createCourse } from "@/actions/cours";
import { toast } from "react-toastify";

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
  description: string;
  handler: string;
  index: number;
  isFree: boolean;
  subjectId: string;
  coverImage: File | null;
  documents: File[];
  quizzes: Quiz[];
}
type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

// Composant pour l'upload de fichiers avec drag & drop
export const FileUpload = ({
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
        onFileSelect(files);
      }
    },
    [onFileSelect],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFileSelect(files);
      }
    },
    [onFileSelect],
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = currentFiles.filter((_, i) => i !== index);
      onFileSelect(newFiles);
    },
    [currentFiles, onFileSelect],
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

export const QuizManager = ({
  quizzes,
  onQuizzesChange,
}: {
  quizzes: Quiz[];
  onQuizzesChange: (quizzes: Quiz[]) => void;
}) => {
  const addQuiz = () => {
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title: "",
      questions: [
        {
          id: Date.now().toString(),
          content: "",
          options: [
            { id: Date.now().toString(), text: "", isCorrect: false },
            { id: (Date.now() + 1).toString(), text: "", isCorrect: false },
          ],
        },
      ],
    };
    onQuizzesChange([...quizzes, newQuiz]);
  };

  const removeQuiz = (quizIndex: number) => {
    onQuizzesChange(quizzes.filter((_, index) => index !== quizIndex));
  };

  const updateQuiz = (quizIndex: number, field: keyof Quiz, value: any) => {
    const updatedQuizzes = quizzes.map((quiz, index) =>
      index === quizIndex ? { ...quiz, [field]: value } : quiz,
    );
    onQuizzesChange(updatedQuizzes);
  };

  const addQuestion = (quizIndex: number) => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      content: "",
      options: [
        { id: Date.now().toString(), text: "", isCorrect: false },
        { id: (Date.now() + 1).toString(), text: "", isCorrect: false },
      ],
    };
    const updatedQuizzes = quizzes.map((quiz, index) =>
      index === quizIndex
        ? { ...quiz, questions: [...quiz.questions, newQuestion] }
        : quiz,
    );
    onQuizzesChange(updatedQuizzes);
  };

  const removeQuestion = (quizIndex: number, questionIndex: number) => {
    const updatedQuizzes = quizzes.map((quiz, index) =>
      index === quizIndex
        ? {
            ...quiz,
            questions: quiz.questions.filter(
              (_, qIndex) => qIndex !== questionIndex,
            ),
          }
        : quiz,
    );
    onQuizzesChange(updatedQuizzes);
  };

  const updateQuestion = (
    quizIndex: number,
    questionIndex: number,
    field: keyof QuizQuestion,
    value: string,
  ) => {
    const updatedQuizzes = quizzes.map((quiz, index) =>
      index === quizIndex
        ? {
            ...quiz,
            questions: quiz.questions.map((question, qIndex) =>
              qIndex === questionIndex
                ? { ...question, [field]: value }
                : question,
            ),
          }
        : quiz,
    );
    onQuizzesChange(updatedQuizzes);
  };

  const addOption = (quizIndex: number, questionIndex: number) => {
    const newOption: Option = {
      id: Date.now().toString(),
      text: "",
      isCorrect: false,
    };
    const updatedQuizzes = quizzes.map((quiz, index) =>
      index === quizIndex
        ? {
            ...quiz,
            questions: quiz.questions.map((question, qIndex) =>
              qIndex === questionIndex
                ? { ...question, options: [...question.options, newOption] }
                : question,
            ),
          }
        : quiz,
    );
    onQuizzesChange(updatedQuizzes);
  };

  const removeOption = (
    quizIndex: number,
    questionIndex: number,
    optionIndex: number,
  ) => {
    const updatedQuizzes = quizzes.map((quiz, index) =>
      index === quizIndex
        ? {
            ...quiz,
            questions: quiz.questions.map((question, qIndex) =>
              qIndex === questionIndex
                ? {
                    ...question,
                    options: question.options.filter(
                      (_, oIndex) => oIndex !== optionIndex,
                    ),
                  }
                : question,
            ),
          }
        : quiz,
    );
    onQuizzesChange(updatedQuizzes);
  };

  const updateOption = (
    quizIndex: number,
    questionIndex: number,
    optionIndex: number,
    field: keyof Option,
    value: any,
  ) => {
    const updatedQuizzes = quizzes.map((quiz, index) =>
      index === quizIndex
        ? {
            ...quiz,
            questions: quiz.questions.map((question, qIndex) =>
              qIndex === questionIndex
                ? {
                    ...question,
                    options: question.options.map((option, oIndex) =>
                      oIndex === optionIndex
                        ? { ...option, [field]: value }
                        : option,
                    ),
                  }
                : question,
            ),
          }
        : quiz,
    );
    onQuizzesChange(updatedQuizzes);
  };

  const setCorrectOption = (
    quizIndex: number,
    questionIndex: number,
    optionId: string,
  ) => {
    const updatedQuizzes = quizzes.map((quiz, index) =>
      index === quizIndex
        ? {
            ...quiz,
            questions: quiz.questions.map((question, qIndex) =>
              qIndex === questionIndex
                ? {
                    ...question,
                    options: question.options.map((option) => ({
                      ...option,
                      isCorrect: option.id === optionId,
                    })),
                  }
                : question,
            ),
          }
        : quiz,
    );
    onQuizzesChange(updatedQuizzes);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Quiz associés</h3>
        <button
          type="button"
          onClick={addQuiz}
          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un quiz</span>
        </button>
      </div>

      <AnimatePresence>
        {quizzes.map((quiz, quizIndex) => (
          <motion.div
            key={quiz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-gray-200 rounded-[8px] p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900">
                  Quiz {quizIndex + 1}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => removeQuiz(quizIndex)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre du quiz
              </label>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => updateQuiz(quizIndex, "title", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entrez le titre du quiz"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-900">Questions</h5>
                <button
                  type="button"
                  onClick={() => addQuestion(quizIndex)}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une question</span>
                </button>
              </div>

              {quiz.questions.map((question, questionIndex) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-50 p-4 rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Question {questionIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(quizIndex, questionIndex)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <textarea
                      value={question.content}
                      onChange={(e) =>
                        updateQuestion(
                          quizIndex,
                          questionIndex,
                          "content",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Entrez la question"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Options de réponse
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setCorrectOption(
                              quizIndex,
                              questionIndex,
                              option.id,
                            )
                          }
                          className={`p-1 rounded-full ${
                            option.isCorrect
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {option.isCorrect ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            updateOption(
                              quizIndex,
                              questionIndex,
                              optionIndex,
                              "text",
                              e.target.value,
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Entrez une option de réponse"
                        />
                        {question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() =>
                              removeOption(
                                quizIndex,
                                questionIndex,
                                optionIndex,
                              )
                            }
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(quizIndex, questionIndex)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter une option</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {quizzes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>
            Aucun quiz ajouté. Cliquez sur &quot;Ajouter un quiz&quot; pour
            commencer.
          </p>
        </div>
      )}
    </div>
  );
};

// Composant principal du formulaire
const CourseCreationForm = ({ grades }: any) => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    content: "",
    videoUrl: "",
    description: "",
    handler: "",
    index: 1,
    subjectId: "",
    isFree: false,
    coverImage: null,
    documents: [],
    quizzes: [],
  });

  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      // Function to generate a random code
      const generateRandomCode = (length: number = 6) => {
        return Math.random()
          .toString(36)
          .substring(2, 2 + length);
      };

      // Function to generate a clean URL slug
      const generateHandler = (title: string) => {
        const randomCode = generateRandomCode();
        return `${title}-${randomCode}`
          .toLowerCase()
          .normalize("NFD") // split accents from letters
          .replace(/[\u0300-\u036f]/g, "") // ✅ remove accents
          .replace(/[^a-z0-9]+/g, "-") // ✅ replace non-alphanumerics with hyphen
          .replace(/^-+|-+$/g, ""); // ✅ trim leading/trailing hyphens // trim leading/trailing hyphens
      };

      const handler = generateHandler(formData.title);

      const courseData = { ...formData, handler };

      console.log("Données du formulaire:", courseData);

      const res = await createCourse(courseData);

      if (res.success) {
        setFormData({
          title: "",
          content: "",
          description: "",
          videoUrl: "",
          handler: "",
          index: 1,
          subjectId: "",
          coverImage: null,
          documents: [],
          quizzes: [],
          isFree: false,
        });
        setSelectedGrade("");
        setAvailableSubjects([]);

        toast.success("Cours créé avec succès !");
      } else {
        toast.error(res.error);
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
        <div className="bg-white rounded-[6px] shadow-lg border border-gray-200 p-8 mb-8">
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
          <div className="bg-white rounded-[6px] shadow-lg border border-gray-200 p-8">
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
                  Norme *
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => handleGradeChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une norme</option>
                  {grades.map((grade: any) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section *
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
                  <option value="">Sélectionner une section</option>
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
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Description du cours"
              />
            </div>
            <div className="w-full bg-green-100 rounded-[6px] p-4 mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={formData.isFree}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFree: e.target.checked,
                    }))
                  }
                  className="w-5 h-5"
                />
                <label
                  htmlFor="isFree"
                  className="text-sm font-medium text-gray-700"
                >
                  Ce cours est gratuit
                </label>
              </div>
            </div>
          </div>

          {/* Upload d'image de couverture */}
          <div className="bg-white rounded-[6px] shadow-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Image de couverture
            </h2>
            <FileUpload
              onFileSelect={(files) =>
                setFormData((prev) => ({
                  ...prev,
                  coverImage: files[0] || null,
                }))
              }
              accept="image/*"
              label="Image de couverture"
              description="Glissez-déposez une image ou cliquez pour sélectionner (JPG, PNG)"
              currentFiles={formData.coverImage ? [formData.coverImage] : []}
            />
          </div>

          {/* Upload de documents PDF */}
          <div className="bg-white rounded-[6px] shadow-lg border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Documents PDF
            </h2>
            <FileUpload
              onFileSelect={(files) =>
                setFormData((prev) => ({
                  ...prev,
                  documents: [...prev.documents, ...files],
                }))
              }
              accept=".pdf"
              multiple
              label="Documents PDF"
              description="Glissez-déposez des fichiers PDF ou cliquez pour sélectionner"
              currentFiles={formData.documents}
            />
          </div>

          {/* Gestion des quiz */}
          <div className="bg-white rounded-[6px] shadow-lg border border-gray-200 p-8">
            <QuizManager
              quizzes={formData.quizzes}
              onQuizzesChange={(quizzes) =>
                setFormData((prev) => ({ ...prev, quizzes }))
              }
            />
          </div>

          {/* Boutons d'action */}
          <div className="bg-white rounded-[6px] shadow-lg border border-gray-200 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  <span>Aperçu</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Création en cours...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Créer le cours</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseCreationForm;
