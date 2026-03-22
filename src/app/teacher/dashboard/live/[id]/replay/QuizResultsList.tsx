"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Users,
  Award,
  Clock,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { getQuizResponse } from "@/actions/quizResults";

interface QuizResultsListProps {
  quiz: any;
  index: number;
}

export function QuizResultsList({ quiz, index }: QuizResultsListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [studentResponses, setStudentResponses] = useState<any>(null);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);

  const results = quiz.quizResult || [];
  const totalAttempts = results.length;

  const averageScore =
    totalAttempts > 0
      ? (
          results.reduce((acc: number, curr: any) => acc + curr.percentage, 0) /
          totalAttempts
        ).toFixed(1)
      : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const handleViewDetails = async (result: any) => {
    setSelectedResult(result);
    setIsLoadingResponses(true);
    setStudentResponses(null); // Reset previous data
    try {
      const resp = await getQuizResponse(quiz.id, result.userId);
      setStudentResponses(resp);
    } catch (error) {
      console.error("Error fetching responses:", error);
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const handleBackToList = () => {
    setSelectedResult(null);
    setStudentResponses(null);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
          {index + 1}
        </div>
        <div>
          <p className="font-medium text-gray-900">{quiz.title}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Users className="h-3 w-3" />
            {totalAttempts} participation{totalAttempts > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) handleBackToList();
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white hover:bg-white/80 border-blue-200 text-blue-700"
          >
            Voir les résultats
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0 border-none shadow-2xl">
          {!selectedResult ? (
            <>
              <div className="p-6 pb-2">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    {quiz.title}
                  </DialogTitle>
                  <DialogDescription>
                    Résultats détaillés des élèves pour ce quiz.
                  </DialogDescription>
                </DialogHeader>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4 my-6">
                  <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-center backdrop-blur-sm">
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">
                      Participations
                    </p>
                    <p className="text-2xl font-black text-blue-900">
                      {totalAttempts}
                    </p>
                  </div>
                  <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 text-center backdrop-blur-sm">
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider mb-1">
                      Score Moyen
                    </p>
                    <p className="text-2xl font-black text-green-900">
                      {averageScore}%
                    </p>
                  </div>
                  <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 text-center backdrop-blur-sm">
                    <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider mb-1">
                      Questions
                    </p>
                    <p className="text-2xl font-black text-purple-900">
                      {quiz.questions?.length || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-6">
                {results.length > 0 ? (
                  <div className="border rounded-xl overflow-hidden bg-white shadow-sm border-slate-100">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-bold text-slate-600 uppercase text-[10px] tracking-widest pl-6">
                            Élève
                          </TableHead>
                          <TableHead className="font-bold text-slate-600 uppercase text-[10px] tracking-widest">
                            Score
                          </TableHead>
                          <TableHead className="font-bold text-slate-600 uppercase text-[10px] tracking-widest">
                            Précision
                          </TableHead>
                          <TableHead className="font-bold text-slate-600 uppercase text-[10px] tracking-widest text-right pr-6">
                            Détails
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result: any) => (
                          <TableRow
                            key={result.id}
                            className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                            onClick={() => handleViewDetails(result)}
                          >
                            <TableCell className="py-4 pl-6">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                                  <AvatarImage src={result.user?.image} />
                                  <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">
                                    {result.user?.prenom?.[0]}
                                    {result.user?.name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-bold text-slate-700">
                                    {result.user?.prenom} {result.user?.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    {format(
                                      new Date(result.completedAt),
                                      "dd MMM yyyy 'à' HH:mm",
                                      { locale: fr },
                                    )}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-bold text-slate-900">
                                {result.score} / {result.totalQuestions}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`${getScoreColor(result.percentage)} font-bold border-none shadow-none`}
                              >
                                {result.percentage}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 opacity-20" />
                    </div>
                    <p className="font-medium">
                      Aucune participation enregistrée
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Detailed View Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="mb-4 -ml-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 gap-2 font-bold"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour à la liste
                </Button>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 ring-4 ring-white shadow-xl">
                      <AvatarImage src={selectedResult.user?.image} />
                      <AvatarFallback className="bg-blue-600 text-white font-black text-xl">
                        {selectedResult.user?.prenom?.[0]}
                        {selectedResult.user?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">
                        {selectedResult.user?.prenom}{" "}
                        {selectedResult.user?.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge
                          className={`${getScoreColor(selectedResult.percentage)} border-none`}
                        >
                          {selectedResult.percentage}% de réussite
                        </Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="h-3 w-3" />
                          Terminé le{" "}
                          {format(
                            new Date(selectedResult.completedAt),
                            "dd/MM/yyyy HH:mm",
                            { locale: fr },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Score Final
                    </p>
                    <p className="text-3xl font-black text-slate-900">
                      {selectedResult.score}{" "}
                      <span className="text-lg text-slate-400">
                        / {selectedResult.totalQuestions}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed Responses Scroll Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isLoadingResponses ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm font-bold text-slate-500 tracking-wide uppercase">
                      Chargement des réponses...
                    </p>
                  </div>
                ) : studentResponses ? (
                  quiz.questions.map((question: any, qIdx: number) => {
                    const selectedOptionId = studentResponses[question.id];

                    return (
                      <div
                        key={question.id}
                        className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                            {qIdx + 1}
                          </div>
                          <h4 className="font-bold text-slate-800 text-lg leading-snug">
                            {question.content}
                          </h4>
                        </div>

                        <div className="grid gap-3 pl-12">
                          {question.options.map((option: any) => {
                            const isSelected = selectedOptionId === option.id;
                            const isCorrect = option.isCorrect;

                            let statusClasses =
                              "border-slate-100 bg-slate-50 text-slate-600";
                            if (isSelected && isCorrect)
                              statusClasses =
                                "border-green-200 bg-green-50 text-green-700 ring-2 ring-green-100";
                            else if (isSelected && !isCorrect)
                              statusClasses =
                                "border-red-200 bg-red-50 text-red-700 ring-2 ring-red-100";
                            else if (isCorrect)
                              statusClasses =
                                "border-green-100 bg-green-50/50 text-green-600 border-dashed";

                            return (
                              <div
                                key={option.id}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${statusClasses}`}
                              >
                                <span className="font-medium text-sm">
                                  {option.text}
                                </span>
                                <div className="flex items-center gap-2">
                                  {isSelected && (
                                    <Badge
                                      variant="outline"
                                      className="text-[9px] uppercase font-black tracking-tighter bg-white border-none shadow-none"
                                    >
                                      Choix de l&apos;élève
                                    </Badge>
                                  )}
                                  {isCorrect ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                  ) : isSelected && !isCorrect ? (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {question.answer && (
                          <div className="mt-4 pt-4 border-t border-slate-50 pl-12">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">
                              Explication / Correction
                            </p>
                            <p className="text-sm text-slate-600 italic">
                              &quot;{question.answer}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <XCircle className="h-12 w-12 mb-4 opacity-10" />
                    <p>
                      Aucun détail de réponse disponible pour cette tentative.
                    </p>
                    <p className="text-xs mt-1">
                      (Les réponses sont enregistrées pour les nouveaux quiz
                      uniquement)
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
