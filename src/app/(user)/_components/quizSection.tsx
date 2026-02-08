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

// Composant Badge amélioré pour les scores
const ScoreBadge: React.FC<{
  percentage: number;
  attempts: number;
  size?: "sm" | "md" | "lg";
}> = ({ percentage, attempts, size = "md" }) => {
  const getBadgeConfig = () => {
    if (percentage >= 90) {
      return {
        icon: Trophy,
        color:
          "text-yellow-700 bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300",
        label: "Excellent",
        description: "Score parfait !",
        glow: "shadow-yellow-200",
      };
    } else if (percentage >= 80) {
      return {
        icon: Medal,
        color:
          "text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300",
        label: "Très bien",
        description: "Très bon résultat",
        glow: "shadow-blue-200",
      };
    } else if (percentage >= 70) {
      return {
        icon: Star,
        color:
          "text-green-700 bg-gradient-to-r from-green-100 to-green-200 border-green-300",
        label: "Bien",
        description: "Bon travail",
        glow: "shadow-green-200",
      };
    } else if (percentage >= 50) {
      return {
        icon: Award,
        color:
          "text-orange-700 bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300",
        label: "Passable",
        description: "Peut mieux faire",
        glow: "shadow-orange-200",
      };
    } else {
      return {
        icon: XCircle,
        color:
          "text-red-700 bg-gradient-to-r from-red-100 to-red-200 border-red-300",
        label: "À revoir",
        description: "Recommencez le quiz",
        glow: "shadow-red-200",
      };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={`
      inline-flex items-center rounded-full border-2 font-medium shadow-lg
      ${config.color} ${config.glow} ${sizeClasses[size]}
      transform transition-all duration-200 hover:scale-105
    `}
    >
      <Icon className={`${iconSizes[size]} mr-2`} />
      <span>{config.label}</span>
      {attempts > 1 && (
        <span className="ml-2 opacity-75 text-xs">(#{attempts})</span>
      )}
    </div>
  );
};

// Composant de progression circulaire
const CircularProgress: React.FC<{
  percentage: number;
  size?: number;
  strokeWidth?: number;
}> = ({ percentage, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="text-blue-500 transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-700">{percentage}%</span>
      </div>
    </div>
  );
};

// Composant principal QuizDisplay amélioré
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

        // Calculate attempts for each quiz
        const scoresByQuiz: Record<string, QuizScore[]> = {};
        scores.forEach((score) => {
          if (!scoresByQuiz[score.quizId]) {
            scoresByQuiz[score.quizId] = [];
          }
          scoresByQuiz[score.quizId].push(score);
        });

        // Create the quizScores object with attempts count
        const newQuizScores: Record<string, QuizScore> = {};
        Object.keys(scoresByQuiz).forEach((quizId) => {
          const quizScores = scoresByQuiz[quizId];
          const latestScore = quizScores[0]; // Most recent score
          newQuizScores[quizId] = {
            ...latestScore,
            attempts: quizScores.length,
          };
        });

        setQuizScores(newQuizScores);
      } catch (error) {
        console.error("Error loading quiz scores:", error);
        // Fallback to localStorage if database fails
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

  // Sauvegarder les scores
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

      // Mettre à jour l'état local
      setQuizScores((prev) => ({
        ...prev,
        [score.quizId]: score,
      }));

      setCurrentScore(score);
    } catch (error) {
      console.error("Error saving quiz result:", error);
      // Fallback to localStorage
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

  // Vue principale - Liste des quiz avec design amélioré
  if (!selectedQuiz) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Quiz d&apos;évaluation
          </h3>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 font-medium">Chargement des quiz...</p>
          </div>
        ) : quizzes.length > 0 ? (
          <div className="grid gap-6">
            {quizzes.map((quiz) => {
              const score = quizScores[quiz.id];
              const hasCompleted = !!score;

              return (
                <div
                  key={quiz.id}
                  className="group relative bg-white border-2 border-gray-100 rounded-[6px] p-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Badge de statut */}
                  {hasCompleted && (
                    <div className="absolute top-4 right-4">
                      <ScoreBadge
                        percentage={score.percentage}
                        attempts={score.attempts}
                        size="sm"
                      />
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1 pr-4">
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {quiz.title}
                      </h4>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>
                            {quiz.questions.length} question
                            {quiz.questions.length > 1 ? "s" : ""}
                          </span>
                        </div>
                        {hasCompleted && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              Dernière tentative:{" "}
                              {new Date(score.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {hasCompleted && (
                        <div className="bg-gray-50 rounded-[8px] p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Meilleur score
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              {score.score}/{score.totalQuestions}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${score.percentage}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                            <span>{score.percentage}% de réussite</span>
                            <span>
                              {score.attempts} tentative
                              {score.attempts > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => startQuiz(quiz)}
                      className={`
                        group/btn relative px-6 py-3 rounded-[8px] font-semibold transition-all duration-200 transform hover:scale-105
                        ${
                          hasCompleted
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-2 border-blue-200 hover:from-blue-100 hover:to-blue-200"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl"
                        }
                      `}
                    >
                      <span className="flex items-center space-x-2">
                        {hasCompleted ? (
                          <RotateCcw className="w-4 h-4" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        <span>
                          {hasCompleted ? "Recommencer" : "Commencer le quiz"}
                        </span>
                      </span>
                    </button>

                    {hasCompleted && score.percentage >= 70 && (
                      <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-semibold">
                          Quiz réussi
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-gray-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun quiz disponible
            </h4>
            <p className="text-gray-500">
              Les quiz pour ce cours seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Vue des résultats avec design amélioré
  if (showResults && currentScore) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl border-2 border-blue-200">
          {/* Animation de célébration */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 animate-ping"></div>
            </div>
            <CircularProgress
              percentage={currentScore.percentage}
              size={140}
              strokeWidth={10}
            />
          </div>

          <div className="mb-6">
            <ScoreBadge
              percentage={currentScore.percentage}
              attempts={currentScore.attempts}
              size="lg"
            />
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            🎉 Quiz terminé !
          </h3>

          <div className="bg-white rounded-[6px] p-6 mx-auto max-w-md mb-6 shadow-lg">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {currentScore.score}
                </div>
                <div className="text-sm text-gray-600">Bonnes réponses</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-700">
                  {currentScore.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Questions totales</div>
              </div>
            </div>
          </div>

          <p
            className={`
            text-lg font-semibold mb-8 px-4 py-2 rounded-lg inline-block
            ${
              currentScore.percentage >= 70
                ? "text-green-700 bg-green-100"
                : "text-orange-700 bg-orange-100"
            }
          `}
          >
            {currentScore.percentage >= 70
              ? "🎊 Félicitations ! Vous avez réussi le quiz avec brio !"
              : "💪 Bon effort ! Vous pouvez recommencer pour améliorer votre score."}
          </p>

          <div className="flex items-center justify-center space-x-4 gap-2">
            <button
              onClick={resetQuiz}
              className="px-8 py-3 bg-white text-gray-700 rounded-[8px] hover:bg-gray-50 transition-all duration-200 font-semibold border-2 border-gray-200 hover:border-gray-300 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour aux quiz</span>
            </button>
            <button
              onClick={() => startQuiz(selectedQuiz)}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-[8px] hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vue du quiz en cours avec design amélioré
  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) return null;

  const progress =
    ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;
  const isLastQuestion =
    currentQuestionIndex === selectedQuiz.questions.length - 1;
  const hasSelectedAnswer = !!selectedAnswers[currentQuestion.id];

  return (
    <div className="space-y-8">
      {/* En-tête du quiz amélioré */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-[6px] p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold">{selectedQuiz.title}</h4>
          <div className="bg-white/20 px-3 py-1 rounded-lg">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} /{" "}
              {selectedQuiz.questions.length}
            </span>
          </div>
        </div>

        {/* Barre de progression améliorée */}
        <div className="relative">
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="absolute right-0 top-0 mt-4 text-sm font-medium">
            {Math.round(progress)}% complété
          </div>
        </div>
      </div>

      {/* Question actuelle avec design amélioré */}
      <div className="bg-white rounded-[6px] border-2 border-gray-100 p-8 shadow-lg">
        <h5 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
          {currentQuestion.content}
        </h5>

        {/* Options de réponse améliorées */}
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected =
              selectedAnswers[currentQuestion.id] === option.id;
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.id)}
                className={`
                  group w-full text-left p-6 rounded-[8px] border-2 transition-all duration-300 transform hover:scale-[1.02]
                  ${
                    isSelected
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg"
                      : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md"
                  }
                `}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all duration-200
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 text-gray-500 group-hover:border-blue-400 group-hover:text-blue-600"
                    }
                  `}
                  >
                    {isSelected ? "✓" : optionLetter}
                  </div>
                  <span className="text-gray-900 font-medium text-lg leading-relaxed">
                    {option.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation améliorée */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50 rounded-[6px] lg:p-6 p-4">
        {/* Previous Button - Full width on mobile, auto on larger screens */}
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 text-gray-600 border-2 border-gray-300 rounded-[8px] hover:bg-white hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium sm:font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Précédent</span>
        </button>

        {/* Abandon Button - Center on mobile, between prev/next on larger screens */}
        <button
          onClick={resetQuiz}
          className="order-last sm:order-none w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base text-gray-600 hover:text-red-600 transition-colors font-medium whitespace-nowrap"
        >
          Abandonner
          <span className="hidden sm:inline"> le quiz</span>
        </button>

        {/* Next/Submit Button - Full width on mobile, auto on larger screens */}
        <button
          onClick={handleNextQuestion}
          disabled={!hasSelectedAnswer || isSubmitting}
          className={`
      w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 rounded-[8px] font-medium sm:font-semibold transition-all duration-200 
      disabled:opacity-50 disabled:cursor-not-allowed
      ${
        isLastQuestion
          ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800"
          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
      }
    `}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Envoi...</span>
            </>
          ) : (
            <>
              <span>
                {isLastQuestion ? (
                  <>
                    <span className="hidden xs:inline">Terminer</span>
                    <span className="xs:hidden">Fin</span>
                  </>
                ) : (
                  <>
                    <span className="hidden xs:inline">Question</span> suivante
                  </>
                )}
              </span>
              {isLastQuestion ? (
                <Trophy className="w-4 h-4 hidden sm:block" />
              ) : (
                <ArrowRight className="w-4 h-4 hidden sm:block" />
              )}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizDisplay;
