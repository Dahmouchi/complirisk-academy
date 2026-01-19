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
import { getBadgeConfig } from "@/types/product";

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
  answer: string; // Ce champ est présent dans votre schéma mais n'est pas utilisé pour la validation des QCM avec options
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
  all: boolean;
  onScoreUpdate?: (score: QuizScore) => void;
}

const ScoreBadge: React.FC<{
  percentage: number;
  attempts: number;
  size?: "sm" | "md" | "lg";
}> = ({ percentage, attempts, size = "md" }) => {
  const config = getBadgeConfig(percentage);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };
  const iconSizes = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };

  return (
    <div
      className={`inline-flex items-center rounded-full border-2 font-medium shadow-lg ${config.color} ${config.glow} ${sizeClasses[size]} transform transition-all duration-200 hover:scale-105`}
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
const QuizDisplay: React.FC<QuizDisplayProps> = ({
  quizzes,
  userId,
  all,
  onScoreUpdate,
}) => {
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
          // Sort by completedAt to get the latest score first for display
          quizScores.sort(
            (a, b) =>
              new Date(b.completedAt).getTime() -
              new Date(a.completedAt).getTime()
          );
          const latestScore = quizScores[0];
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

      if (onScoreUpdate) {
        onScoreUpdate(score);
      }
    } catch (error) {
      console.error("Error saving quiz result:", error);
      // Fallback to localStorage
      const updatedScores = { ...quizScores, [score.quizId]: score };
      setQuizScores(updatedScores);
      localStorage.setItem(
        `quiz-scores-${userId}`,
        JSON.stringify(updatedScores)
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
          (option) => option.id === selectedOptionId
        );
        if (selectedOption && selectedOption.isCorrect) {
          correctAnswers++;
        }
      }
    });

    const percentage = Math.round(
      (correctAnswers / selectedQuiz.questions.length) * 100
    );
    const existingScore = quizScores[selectedQuiz.id];
    // The attempts should be incremented based on the number of existing results for this quiz
    // The `loadScores` already calculates `attempts` for the latest score.
    // When saving a new score, we just need to add 1 to the previous attempts count if it exists.
    const attempts = (existingScore ? existingScore.attempts : 0) + 1;

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
          <>
            {all ? (
              <div className="space-y-8">
                {quizzes.map((matiere: any) => (
                  <div key={matiere.matiereId}>
                    {/* Matière title */}
                    {all && (
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        {matiere.matiereName}
                      </h3>
                    )}

                    {/* Quizzes grid */}
                    <div className="grid gap-6">
                      {matiere.quizzes.map((quiz: any) => {
                        const score = quizScores[quiz.id];
                        const hasCompleted = !!score;

                        return (
                          <div
                            key={quiz.id}
                            className="group relative bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
                                        {new Date(
                                          score.completedAt
                                        ).toLocaleDateString()}
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
                                        style={{
                                          width: `${score.percentage}%`,
                                        }}
                                      />
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                                      <span>
                                        {score.percentage}% de réussite
                                      </span>
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
                                    {hasCompleted
                                      ? "Recommencer"
                                      : "Commencer le quiz"}
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {quizzes.slice(0, 1).map((matiere: any) => (
                  <div key={matiere.matiereId}>
                    {/* Matière title */}
                    {all && (
                      <h3 className="text-2xl font-bold text-gray-100 mb-4">
                        {matiere.matiereName}
                      </h3>
                    )}

                    {/* Quizzes grid */}
                    <div className="grid gap-6">
                      {matiere.quizzes.map((quiz: any) => {
                        const score = quizScores[quiz.id];
                        const hasCompleted = !!score;

                        return (
                          <div
                            key={quiz.id}
                            className="group relative bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
                                        {new Date(
                                          score.completedAt
                                        ).toLocaleDateString()}
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
                                        style={{
                                          width: `${score.percentage}%`,
                                        }}
                                      />
                                    </div>
                                    <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                                      <span>
                                        {score.percentage}% de réussite
                                      </span>
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
                                    {hasCompleted
                                      ? "Recommencer"
                                      : "Commencer le quiz"}
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
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-gray-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun quiz disponible
            </h4>
            <p className="text-gray-5000">
              Les quiz pour ce cours seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Vue des résultats avec design amélioré
  if (showResults && currentScore) {
    const { icon: ResultIcon } = getBadgeConfig(currentScore.percentage);

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-xl text-center">
        <div className={`p-5 rounded-full  bg-opacity-20 mb-6`}>
          <ResultIcon className={`w-16 h-16  transform scale-105`} />
        </div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
          Quiz Terminé !
        </h2>
        <p className="text-xl text-gray-700 mb-6">
          Vous avez obtenu un score de{" "}
          <span className="font-bold text-blue-600">{currentScore.score}</span>{" "}
          sur{" "}
          <span className="font-bold text-blue-600">
            {currentScore.totalQuestions}
          </span>
          .
        </p>

        <div className="mb-8">
          <CircularProgress
            percentage={currentScore.percentage}
            size={150}
            strokeWidth={10}
          />
        </div>

        <div className="space-y-3 mb-8">
          <p className="text-lg font-semibold text-gray-800 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" /> Taux de
            réussite:{" "}
            <span className="text-green-600 ml-2">
              {currentScore.percentage}%
            </span>
          </p>
          <p className="text-lg font-semibold text-gray-800 flex items-center justify-center">
            <Clock className="w-5 h-5 mr-2 text-purple-500" /> Tentatives:{" "}
            <span className="text-purple-600 ml-2">
              {currentScore.attempts}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetQuiz}
            className="lg:px-8 px-4 py-4 bg-blue-600 text-white lg:text-lg font-semibold rounded-[8px] shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
          <button
            onClick={() => startQuiz(selectedQuiz)}
            className="lg:px-8 px-4 py-4 bg-blue-600 text-white lg:text-lg font-semibold rounded-[8px] shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Recommencer</span>
          </button>
        </div>
      </div>
    );
  }

  // Vue du quiz actif
  const currentQuestion = getCurrentQuestion();
  if (!selectedQuiz || !currentQuestion) {
    return (
      <div className="text-center py-12 text-gray-600">
        Chargement du quiz...
      </div>
    );
  }

  const isLastQuestion =
    currentQuestionIndex === selectedQuiz.questions.length - 1;
  const isAnswerSelected = selectedAnswers[currentQuestion.id] !== undefined;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedQuiz.title}
        </h2>
        <span className="text-lg font-semibold text-blue-600">
          Question {currentQuestionIndex + 1} / {selectedQuiz.questions.length}
        </span>
      </div>

      <div className="mb-8 p-6 bg-blue-50 rounded-[8px] border border-blue-200">
        <p className="text-xl font-medium text-gray-800">
          {currentQuestion.content}
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswerSelect(option.id)}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-all duration-200
              ${
                selectedAnswers[currentQuestion.id] === option.id
                  ? "border-blue-500 bg-blue-100 text-blue-800 shadow-md"
                  : "border-gray-200 bg-gray-500 hover:border-blue-300 hover:bg-blue-50"
              }
              flex items-center space-x-3
            `}
          >
            <div
              className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${
                selectedAnswers[currentQuestion.id] === option.id
                  ? "border-blue-500 bg-blue-500"
                  : "border-gray-400"
              }
            `}
            >
              {selectedAnswers[currentQuestion.id] === option.id && (
                <CheckCircle className="w-3 h-3 text-white" />
              )}
            </div>
            <span className="text-base font-medium">{option.text}</span>
          </button>
        ))}
      </div>

      <div className="flex justify-between gap-2">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-[8px] hover:bg-gray-300 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Précédent</span>
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={!isAnswerSelected && !isLastQuestion} // Disable if no answer selected and not last question
          className="px-4 py-1 bg-blue-600 text-white font-semibold rounded-[8px] hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
        >
          <span>{isLastQuestion ? "Terminer" : "Suivant"}</span>
          {isLastQuestion ? (
            <Award className="w-5 h-5" />
          ) : (
            <ArrowRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizDisplay;
