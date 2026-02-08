"use client";

import React from "react";
import { FileText, Eye } from "lucide-react";
import QuizDisplay from "./quizSection";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";

const SimplePDFViewer = dynamic(() => import("./cours-pdf"), {
  ssr: false,
});
const CourseContent = ({ course, userId }: any) => {
  const handleScoreUpdate = (score: any) => {
    console.log("Nouveau score:", score);
    // Ici vous pouvez envoyer le score à votre API ou mettre à jour votre état global
  };
  if (!course) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p className="text-gray-500 text-center">
          Sélectionnez un cours pour voir le contenu
        </p>
      </div>
    );
  }
  const documents = course.documents;
  const quizzes = course.quizzes;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Contenu des sections */}
        <div className="lg:p-6 p-2">
          <div className="space-y-6">
            {/* Section Documents */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Documents et ressources
                </h3>
              </div>

              {documents.length > 0 ? (
                <div className="grid gap-4">
                  {documents.map((document: any) => (
                    <div
                      key={document.id}
                      className="group relative bg-gradient-to-r from-white to-gray-50 border-2 border-gray-100 rounded-[8px] p-4 md:p-6 hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
                    >
                      {/* Hover indicator */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Document info (left side) */}
                        <div className="flex flex-col xs:flex-row gap-4 items-start xs:items-center">
                          {/* Icon */}
                          <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                            <FileText className="w-5 h-5 md:w-6 text-white" />
                          </div>

                          {/* Text content */}
                          <div className="flex-1 min-w-0">
                            {" "}
                            {/* min-w-0 prevents text overflow */}
                            <h4 className="text-base md:text-lg max-w-[200px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {document.name}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                              Document PDF • Cliquez pour visualiser
                            </p>
                            {/* Features - show on all screens */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Eye className="w-3 h-3 flex-shrink-0" />
                                <span>Aperçu disponible</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons (right side) */}
                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                          {/* View button - primary on mobile */}
                          <Dialog>
                            <DialogTrigger>
                              <div className="flex gap-2">
                                {/* Download button */}
                                <div className="flex-1 flex text-white items-center justify-center gap-2 rounded-sm px-2 py-1 sm:flex-none border-2 bg-blue-600 hover:bg-blue-800 border-gray-300 hover:border-blue-300 ">
                                  <Eye className="w-4 h-4 mr-1 md:mr-2" />
                                  <span>Visualiser</span>
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogOverlay>
                              <DialogContent className="h-[99vh] min-w-[90vw] overflow-auto">
                                <DialogTitle></DialogTitle>
                                <SimplePDFViewer pdfFilePath={document?.url} />
                              </DialogContent>
                            </DialogOverlay>
                          </Dialog>
                          {/* Secondary actions */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[6px] border-2 border-dashed border-gray-300">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    Aucun document disponible
                  </h4>
                  <p className="text-gray-500">
                    Les documents pour ce cours seront bientôt disponibles.
                  </p>
                </div>
              )}
            </div>

            {/* Section Quiz */}
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <QuizDisplay quizzes={quizzes} userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseContent;
