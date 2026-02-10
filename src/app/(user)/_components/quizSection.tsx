"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Award,
  Star,
  Trophy,
  Medal,
  ArrowLeft,
  ArrowRight,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Zap,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { saveQuizResult, getQuizScores } from "@/actions/quizResults";

// Types basés sur votre schéma Prisma
interface Quiz {
  id: string;
  title: string;
  courseId: string;
  questions: Question[];
}

interface Question {
  id: string;
  content: string;
  answer: string;
  quizId: string;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
}

interface QuizScore {
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
  attempts: number;
}

interface QuizDisplayProps {
  quizzes: Quiz[];
  userId: string;
}

// Composant Badge professionnel amélioré
const ScoreBadge: React.FC<{
  percentage: number;
  attempts: number;
  size?: "sm" | "md" | "lg";
}> = ({ percentage, attempts, size = "md" }) => {
  const getBadgeConfig = () => {
    if (percentage >= 90) {
      return {
        icon: Trophy,
        color: "text-amber-700 bg-amber-50 border-amber-200",
        label: "Excellent",
        ringColor: "ring-amber-100",
      };
    } else if (percentage >= 80) {
      return {
        icon: Medal,
        color: "text-blue-700 bg-blue-50 border-blue-200",
        label: "Très bien",
        ringColor: "ring-blue-100",
      };
    } else if (percentage >= 70) {
      return {
        icon: Star,
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        label: "Bien",
        ringColor: "ring-emerald-100",
      };
    } else if (percentage >= 50) {
      return {
        icon: Award,
        color: "text-orange-700 bg-orange-50 border-orange-200",
        label: "Passable",
        ringColor: "ring-orange-100",
      };
    } else {
      return {
        icon: XCircle,
        color: "text-red-700 bg-red-50 border-red-200",
        label: "À revoir",
        ringColor: "ring-red-100",
      };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={`
      inline-flex items-center gap-1.5 rounded-lg border font-medium
      ${config.color} ${sizeClasses[size]}
      ring-2 ${config.ringColor}
    `}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
      {attempts > 1 && size !== "sm" && (
        <span className="ml-1 text-xs opacity-70">×{attempts}</span>
      )}
    </div>
  );
};

// Composant de progression circulaire moderne
const CircularProgress: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
}> = ({ percentage, size = 140, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 90) return "text-amber-500";
    if (percentage >= 80) return "text-blue-500";
    if (percentage >= 70) return "text-emerald-500";
    if (percentage >= 50) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="relative inline-flex">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${getColor()} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{percentage}%</span>
        <span className="text-xs text-gray-500 mt-1">Score</span>
      </div>
    </div>
  );
};

// Composant principal QuizDisplay professionnel
const QuizDisplay: React.FC<QuizDisplayProps> = ({ quizzes, userId }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [quizScores, setQuizScores] = useState<Record<string, QuizScore>>({});
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentScore, setCurrentScore] = useState<QuizScore | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les scores depuis la base de données
  useEffect(() => {
    const loadScores = async () => {
      try {
        const scores = await getQuizScores(userId);

        const scoresByQuiz: Record<string, QuizScore[]> = {};
        scores.forEach((score) => {
          if (!scoresByQuiz[score.quizId]) {
            scoresByQuiz[score.quizId] = [];
          }
          scoresByQuiz[score.quizId].push(score);
        });

        const newQuizScores: Record<string, QuizScore> = {};
        Object.keys(scoresByQuiz).forEach((quizId) => {
          const quizScores = scoresByQuiz[quizId];
          const latestScore = quizScores[0];
          newQuizScores[quizId] = {
            ...latestScore,
            attempts: quizScores.length,
          };
        });

        setQuizScores(newQuizScores);
      } catch (error) {
        console.error("Error loading quiz scores:", error);
        const savedScores = localStorage.getItem(`quiz-scores-${userId}`);
        if (savedScores) {
          setQuizScores(JSON.parse(savedScores));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadScores();
  }, [userId]);

  const saveScore = async (score: QuizScore) => {
    setIsSubmitting(true);
    try {
      await saveQuizResult({
        quizId: score.quizId,
        userId,
        score: score.score,
        totalQuestions: score.totalQuestions,
        percentage: score.percentage,
      });

      setQuizScores((prev) => ({
        ...prev,
        [score.quizId]: score,
      }));

      setCurrentScore(score);
    } catch (error) {
      console.error("Error saving quiz result:", error);
      const updatedScores = { ...quizScores, [score.quizId]: score };
      setQuizScores(updatedScores);
      localStorage.setItem(
        `quiz-scores-${userId}`,
        JSON.stringify(updatedScores),
      );
      setCurrentScore(score);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setIsQuizActive(true);
    setCurrentScore(null);
  };

  const handleAnswerSelect = (optionId: string) => {
    if (!selectedQuiz) return;
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionId,
    });
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;

    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishQuiz = async () => {
    if (!selectedQuiz) return;

    let correctAnswers = 0;
    selectedQuiz.questions.forEach((question) => {
      const selectedOptionId = selectedAnswers[question.id];
      if (selectedOptionId) {
        const selectedOption = question.options.find(
          (option) => option.id === selectedOptionId,
        );
        if (selectedOption && selectedOption.isCorrect) {
          correctAnswers++;
        }
      }
    });

    const percentage = Math.round(
      (correctAnswers / selectedQuiz.questions.length) * 100,
    );
    const existingScore = quizScores[selectedQuiz.id];
    const attempts = existingScore ? existingScore.attempts + 1 : 1;

    const newScore: QuizScore = {
      quizId: selectedQuiz.id,
      score: correctAnswers,
      totalQuestions: selectedQuiz.questions.length,
      percentage,
      completedAt: new Date(),
      attempts,
    };

    await saveScore(newScore);
    setShowResults(true);
    setIsQuizActive(false);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setIsQuizActive(false);
    setCurrentScore(null);
  };

  const getCurrentQuestion = () => {
    if (!selectedQuiz) return null;
    return selectedQuiz.questions[currentQuestionIndex];
  };

  // Vue principale - Liste des quiz avec design professionnel
  if (!selectedQuiz) {
    return (
      <div className="space-y-8">
        {/* En-tête professionnel */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-blue-50 rounded-[6px] border border-blue-100">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Évaluations</h2>
            </div>
            <p className="text-sm text-gray-600 ">
              Testez vos connaissances et suivez votre progression
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-sm text-gray-600 font-medium">
              Chargement des évaluations...
            </p>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid gap-6">
            {quizzes.map((quiz) => {
              const score = quizScores[quiz.id];
              const hasCompleted = !!score;

              return (
                <div
                  key={quiz.id}
                  className="group relative bg-white border border-gray-200 rounded-[6px] p-4 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                >
                  {/* Indicateur de statut */}
                  <div className="absolute top-6 right-6">
                    {hasCompleted && (
                      <ScoreBadge
                        percentage={score.percentage}
                        attempts={score.attempts}
                        size="sm"
                      />
                    )}
                  </div>

                  {/* Contenu principal */}
                  <div className="pr-32">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {quiz.title}
                    </h3>

                    {/* Métadonnées */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-5">
                      <div className="flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span>
                          {quiz.questions.length} question
                          {quiz.questions.length > 1 ? "s" : ""}
                        </span>
                      </div>
                      {hasCompleted && (
                        <>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>
                              {new Date(score.completedAt).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Statistiques de performance */}
                    {hasCompleted && (
                      <div className="bg-gray-50 border border-gray-100 rounded-[6px] p-4 mb-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              Dernière performance
                            </span>
                          </div>
                          <span className="text-lg font-bold text-gray-900">
                            {score.score}/{score.totalQuestions}
                          </span>
                        </div>

                        {/* Barre de progression */}
                        <div className="relative">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                score.percentage >= 90
                                  ? "bg-gradient-to-r from-amber-400 to-amber-500"
                                  : score.percentage >= 80
                                    ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                    : score.percentage >= 70
                                      ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                      : score.percentage >= 50
                                        ? "bg-gradient-to-r from-orange-400 to-orange-500"
                                        : "bg-gradient-to-r from-red-400 to-red-500"
                              }`}
                              style={{ width: `${score.percentage}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-medium text-gray-600">
                              {score.percentage}% de réussite
                            </span>
                            {score.attempts > 1 && (
                              <span className="text-xs text-gray-500">
                                {score.attempts} tentative
                                {score.attempts > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => startQuiz(quiz)}
                      className={`
                        group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] font-medium transition-all duration-200
                        ${
                          hasCompleted
                            ? "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                        }
                      `}
                    >
                      {hasCompleted ? (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          <span>Recommencer</span>
                        </>
                      ) : (
                        <>
                          <span>Démarrer</span>
                          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>

                    {hasCompleted && score.percentage >= 70 && (
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-[6px] border border-emerald-200">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">Validé</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-[6px] flex items-center justify-center mb-4">
              <Award className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune évaluation disponible
            </h3>
            <p className="text-sm text-gray-600 text-center max-w-sm">
              Les quiz pour ce cours seront bientôt disponibles
            </p>
          </div>
        )}
      </div>
    );
  }

  // Vue des résultats - Design professionnel
  if (showResults && currentScore) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-[6px] p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-[6px] mb-4">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Quiz terminé
            </h2>
            <p className="text-gray-600">Voici vos résultats</p>
          </div>

          {/* Score circulaire */}
          <div className="flex justify-center mb-8">
            <CircularProgress
              percentage={currentScore.percentage}
              size={160}
              strokeWidth={12}
            />
          </div>

          {/* Badge de performance */}
          <div className="flex justify-center mb-8">
            <ScoreBadge
              percentage={currentScore.percentage}
              attempts={currentScore.attempts}
              size="lg"
            />
          </div>

          {/* Statistiques détaillées */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 border border-gray-100 rounded-[6px] p-5 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {currentScore.score}
              </div>
              <div className="text-sm text-gray-600">Bonnes réponses</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-[6px] p-5 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {currentScore.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
          </div>

          {/* Message de félicitations */}
          <div
            className={`
            text-center p-4 rounded-[6px] mb-8
            ${
              currentScore.percentage >= 70
                ? "bg-emerald-50 border border-emerald-200"
                : "bg-orange-50 border border-orange-200"
            }
          `}
          >
            <p
              className={`font-medium ${
                currentScore.percentage >= 70
                  ? "text-emerald-700"
                  : "text-orange-700"
              }`}
            >
              {currentScore.percentage >= 70
                ? "Félicitations ! Vous avez réussi ce quiz."
                : "Vous pouvez réessayer pour améliorer votre score."}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetQuiz}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-white text-gray-700 border border-gray-300 rounded-[6px] hover:bg-gray-50 hover:border-gray-400 font-medium transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>
            <button
              onClick={() => startQuiz(selectedQuiz)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-[6px] hover:bg-blue-700 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vue du quiz en cours - Design professionnel
  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) return null;

  const progress =
    ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;
  const isLastQuestion =
    currentQuestionIndex === selectedQuiz.questions.length - 1;
  const hasSelectedAnswer = !!selectedAnswers[currentQuestion.id];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* En-tête avec progression */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedQuiz.title}
          </h3>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
            {currentQuestionIndex + 1} / {selectedQuiz.questions.length}
          </span>
        </div>

        {/* Barre de progression */}
        <div className="relative">
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Progression</span>
            <span className="text-xs font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-4">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-600 rounded-lg font-semibold text-sm mb-4">
            {currentQuestionIndex + 1}
          </div>
          <h4 className="text-xl font-semibold text-gray-900 leading-relaxed">
            {currentQuestion.content}
          </h4>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected =
              selectedAnswers[currentQuestion.id] === option.id;
            const optionLetter = String.fromCharCode(65 + index);

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                className={`
                  group w-full text-left p-4 rounded-[6px] border-2 transition-all duration-200
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                    flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center font-semibold text-sm transition-all duration-200
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 text-gray-600 group-hover:border-gray-400"
                    }
                  `}
                  >
                    {isSelected ? "✓" : optionLetter}
                  </div>
                  <span className="text-gray-900 font-medium pt-0.5 flex-1">
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border border-gray-200 rounded-[6px] p-4">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-[6px] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white font-medium transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Précédent</span>
          </button>

          <button
            onClick={resetQuiz}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Abandonner
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={!hasSelectedAnswer || isSubmitting}
            className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] font-medium transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                isLastQuestion
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 disabled:hover:bg-emerald-600"
                  : "bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600"
              }
              shadow-sm hover:shadow-md
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Envoi...</span>
              </>
            ) : (
              <>
                <span>{isLastQuestion ? "Terminer" : "Suivant"}</span>
                {isLastQuestion ? (
                  <Trophy className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDisplay;
