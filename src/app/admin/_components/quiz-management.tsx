"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  BarChart3,
  Eye,
  EyeOff,
} from "lucide-react";

// Types TypeScript
interface Option {
  id?: string;
  text: string;
  isCorrect: boolean;
  questionId?: string;
}

interface Question {
  id?: string;
  content: string;
  answer: string;
  quizId?: string;
  options: Option[];
}

interface Quiz {
  id?: string;
  title: string;
  courseId: string;
  questions: Question[];
  _count?: {
    questions: number;
  };
}

interface QuizManagementProps {
  courseId: string;
  quizzes: Quiz[];
  onQuizzesUpdate?: (quizzes: Quiz[]) => void;
  isEditable?: boolean;
}

interface QuizFormProps {
  quiz?: Quiz;
  courseId: string;
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
}

// Composant pour le formulaire de quiz
const QuizForm: React.FC<QuizFormProps> = ({
  quiz,
  courseId,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Quiz>({
    title: quiz?.title || "",
    courseId: courseId,
    questions: quiz?.questions || [
      {
        content: "",
        answer: "",
        options: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
        ],
      },
    ],
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.title.trim()) {
      newErrors.push("Le titre du quiz est requis");
    }

    if (formData.questions.length === 0) {
      newErrors.push("Au moins une question est requise");
    }

    formData.questions.forEach((question, qIndex) => {
      if (!question.content.trim()) {
        newErrors.push(`La question ${qIndex + 1} doit avoir un contenu`);
      }

      if (!question.answer.trim()) {
        newErrors.push(
          `La question ${qIndex + 1} doit avoir une réponse/explication`,
        );
      }

      if (question.options.length < 2) {
        newErrors.push(
          `La question ${qIndex + 1} doit avoir au moins 2 options`,
        );
      }

      const correctOptions = question.options.filter((opt) => opt.isCorrect);
      if (correctOptions.length === 0) {
        newErrors.push(
          `La question ${qIndex + 1} doit avoir au moins une option correcte`,
        );
      }

      question.options.forEach((option, oIndex) => {
        if (!option.text.trim()) {
          newErrors.push(
            `L'option ${oIndex + 1} de la question ${
              qIndex + 1
            } doit avoir un texte`,
          );
        }
      });
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Ajouter une nouvelle question
  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          content: "",
          answer: "",
          options: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false },
          ],
        },
      ],
    }));
  };

  // Supprimer une question
  const removeQuestion = (questionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex),
    }));
  };

  // Ajouter une option à une question
  const addOption = (questionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              options: [...question.options, { text: "", isCorrect: false }],
            }
          : question,
      ),
    }));
  };

  // Supprimer une option
  const removeOption = (questionIndex: number, optionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              options: question.options.filter(
                (_, oIndex) => oIndex !== optionIndex,
              ),
            }
          : question,
      ),
    }));
  };

  // Mettre à jour une question
  const updateQuestion = (
    questionIndex: number,
    field: keyof Question,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex ? { ...question, [field]: value } : question,
      ),
    }));
  };

  // Mettre à jour une option
  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    field: keyof Option,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              options: question.options.map((option, oIndex) =>
                oIndex === optionIndex ? { ...option, [field]: value } : option,
              ),
            }
          : question,
      ),
    }));
  };

  // Sauvegarder le quiz
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[6px] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {quiz ? "Modifier le quiz" : "Créer un nouveau quiz"}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white hover:text-black hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Erreurs */}
          <AnimatePresence>
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
              >
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800 mb-2">
                      Erreurs de validation :
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="text-red-700 text-sm">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Titre du quiz */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du quiz *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Entrez le titre du quiz"
            />
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Questions ({formData.questions.length})
              </h3>
              <button
                onClick={addQuestion}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter une question</span>
              </button>
            </div>

            {formData.questions.map((question, questionIndex) => (
              <motion.div
                key={questionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-[8px] p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-gray-800">
                    Question {questionIndex + 1}
                  </h4>
                  {formData.questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Supprimer cette question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Contenu de la question */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Énoncé de la question *
                  </label>
                  <textarea
                    value={question.content}
                    onChange={(e) =>
                      updateQuestion(questionIndex, "content", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Entrez l'énoncé de la question"
                  />
                </div>

                {/* Explication/Réponse */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explication/Réponse *
                  </label>
                  <textarea
                    value={question.answer}
                    onChange={(e) =>
                      updateQuestion(questionIndex, "answer", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Explication de la réponse correcte"
                  />
                </div>

                {/* Options */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Options de réponse ({question.options.length})
                    </label>
                    <button
                      onClick={() => addOption(questionIndex)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Ajouter</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center space-x-3 bg-white p-3 rounded-lg border"
                      >
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) =>
                            updateOption(
                              questionIndex,
                              optionIndex,
                              "isCorrect",
                              e.target.checked,
                            )
                          }
                          className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            updateOption(
                              questionIndex,
                              optionIndex,
                              "text",
                              e.target.value,
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        {question.options.length > 2 && (
                          <button
                            onClick={() =>
                              removeOption(questionIndex, optionIndex)
                            }
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Supprimer cette option"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Cochez les cases pour marquer les bonnes réponses
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sauvegarde...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Composant principal de gestion des quiz
const QuizManagement: React.FC<QuizManagementProps> = ({
  courseId,
  quizzes: initialQuizzes,
  onQuizzesUpdate,
  isEditable = true,
}) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

  // Mettre à jour les quiz quand les props changent
  useEffect(() => {
    setQuizzes(initialQuizzes);
  }, [initialQuizzes]);

  // Fonction pour créer ou mettre à jour un quiz
  const handleSaveQuiz = async (quizData: Quiz) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = editingQuiz
        ? `/api/quizzes/${editingQuiz.id}`
        : `/api/courses/${courseId}/quizzes`;

      const method = editingQuiz ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });

      const result = await response.json();

      if (result.success) {
        if (editingQuiz) {
          // Mise à jour
          const updatedQuizzes = quizzes.map((quiz) =>
            quiz.id === editingQuiz.id ? result.data : quiz,
          );
          setQuizzes(updatedQuizzes);
          onQuizzesUpdate?.(updatedQuizzes);
          setSuccess("Quiz mis à jour avec succès");
        } else {
          // Création
          const updatedQuizzes = [...quizzes, result.data];
          setQuizzes(updatedQuizzes);
          onQuizzesUpdate?.(updatedQuizzes);
          setSuccess("Quiz créé avec succès");
        }

        setShowForm(false);
        setEditingQuiz(undefined);

        // Effacer le message de succès après 3 secondes
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.error || "Erreur inconnue");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour supprimer un quiz
  const handleDeleteQuiz = async (quizId: string) => {
    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        const updatedQuizzes = quizzes.filter((quiz) => quiz.id !== quizId);
        setQuizzes(updatedQuizzes);
        onQuizzesUpdate?.(updatedQuizzes);
        setSuccess("Quiz supprimé avec succès");

        // Effacer le message de succès après 3 secondes
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour dupliquer un quiz
  const handleDuplicateQuiz = async (quizId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/quizzes/${quizId}/duplicate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (result.success) {
        const updatedQuizzes = [...quizzes, result.data];
        setQuizzes(updatedQuizzes);
        onQuizzesUpdate?.(updatedQuizzes);
        setSuccess("Quiz dupliqué avec succès");

        // Effacer le message de succès après 3 secondes
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error(result.error || "Erreur lors de la duplication");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ouvrir le formulaire d'édition
  const handleEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setShowForm(true);
  };

  // Fonction pour ouvrir le formulaire de création
  const handleCreateQuiz = () => {
    setEditingQuiz(undefined);
    setShowForm(true);
  };

  // Fonction pour fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingQuiz(undefined);
  };

  // Fonction pour basculer l'expansion d'un quiz
  const toggleQuizExpansion = (quizId: string) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  return (
    <div className="space-y-6">
      {/* Messages d'état */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
            <button
              onClick={() => setSuccess(null)}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white rounded-[6px] shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Quiz du cours ({quizzes.length})
            </h2>
            <p className="text-gray-600 mt-1">
              Gérez les quiz et questions de ce cours
            </p>
          </div>
          {isEditable && (
            <button
              onClick={handleCreateQuiz}
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Créer un quiz</span>
            </button>
          )}
        </div>
      </div>

      {/* Liste des quiz */}
      <div className="space-y-4">
        {quizzes.length === 0 ? (
          <div className="bg-white rounded-[6px] shadow-lg border border-gray-200 p-12 text-center">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun quiz
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par créer votre premier quiz pour ce cours
            </p>
            {isEditable && (
              <button
                onClick={handleCreateQuiz}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Créer un quiz</span>
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[6px] shadow-lg border border-gray-200 overflow-hidden"
              >
                {/* Header du quiz */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {quiz.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <HelpCircle className="w-4 h-4" />
                          <span>{quiz.questions.length} question(s)</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>
                            {quiz.questions.reduce(
                              (sum, q) => sum + q.options.length,
                              0,
                            )}{" "}
                            option(s)
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleQuizExpansion(quiz.id!)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title={
                          expandedQuiz === quiz.id
                            ? "Masquer les détails"
                            : "Voir les détails"
                        }
                      >
                        {expandedQuiz === quiz.id ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>

                      {isEditable && (
                        <>
                          <button
                            onClick={() => handleDuplicateQuiz(quiz.id!)}
                            disabled={isLoading}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Dupliquer ce quiz"
                          >
                            <Copy className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEditQuiz(quiz)}
                            disabled={isLoading}
                            className="p-2 text-green-500 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Modifier ce quiz"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz.id!)}
                            disabled={isLoading}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Supprimer ce quiz"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Détails du quiz (expandable) */}
                <AnimatePresence>
                  {expandedQuiz === quiz.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-gray-200"
                    >
                      <div className="p-6 space-y-4">
                        {quiz.questions.map((question, qIndex) => (
                          <div
                            key={qIndex}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <h4 className="font-medium text-gray-900 mb-2">
                              Question {qIndex + 1}: {question.content}
                            </h4>
                            <div className="space-y-2 mb-3">
                              {question.options.map((option, oIndex) => (
                                <div
                                  key={oIndex}
                                  className={`flex items-center space-x-2 p-2 rounded ${
                                    option.isCorrect
                                      ? "bg-green-100 border border-green-200"
                                      : "bg-white border border-gray-200"
                                  }`}
                                >
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      option.isCorrect
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  />
                                  <span
                                    className={
                                      option.isCorrect
                                        ? "text-green-800 font-medium"
                                        : "text-gray-700"
                                    }
                                  >
                                    {option.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {question.answer && (
                              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <p className="text-sm text-blue-800">
                                  <strong>Explication :</strong>{" "}
                                  {question.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Formulaire de quiz */}
      <AnimatePresence>
        {showForm && (
          <QuizForm
            quiz={editingQuiz}
            courseId={courseId}
            onSave={handleSaveQuiz}
            onCancel={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizManagement;
