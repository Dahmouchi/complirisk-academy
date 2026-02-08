/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  documentName: string;
}

const PDFModal: React.FC<PDFModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  documentName,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Réinitialiser l'état quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(1);
      setZoom(100);
      setRotation(0);
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen]);

  // Gestion du mode plein écran
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Gestion du zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  // Gestion de la rotation
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Navigation entre les pages
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Gestion des touches du clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          handlePreviousPage();
          break;
        case "ArrowRight":
          handleNextPage();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "r":
        case "R":
          handleRotate();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentPage, totalPages]);

  // Empêcher le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalClasses = isFullscreen
    ? "fixed inset-0 z-50 bg-black/50"
    : "fixed inset-0 z-50 bg-black/50 bg-opacity-75 flex items-center justify-center p-4";

  const contentClasses = isFullscreen
    ? "w-full h-full bg-white flex flex-col"
    : "bg-white rounded-[6px] shadow-2xl max-w-6xl h-[90vh] w-full flex flex-col";

  return (
    <div
      className={modalClasses}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={contentClasses} onClick={(e) => e.stopPropagation()}>
        {/* En-tête du modal */}
        <div className="flex flex-col xs:flex-row lg:flex-row items-center justify-between gap-3 p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
          {/* Document info - left side */}
          <div className="flex items-center gap-3 w-full xs:w-auto min-w-0">
            <div className="min-w-0">
              {" "}
              {/* Prevents text overflow */}
              <h3
                className="text-sm sm:text-lg font-semibold text-gray-900 truncate max-w-[200px] xs:max-w-md"
                title={documentName} // Show full name on hover
              >
                {documentName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">Document PDF</p>
            </div>
          </div>

          {/* Controls - right side */}
          <div className="flex items-center gap-2 w-full xs:w-auto justify-end">
            {/* Fullscreen toggle - always visible */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
              aria-label={
                isFullscreen
                  ? "Quitter le mode plein écran"
                  : "Mode plein écran"
              }
              title={
                isFullscreen ? "Quitter plein écran (F)" : "Plein écran (F)"
              }
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>

            {/* Close button - always visible */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
              aria-label="Fermer le document"
              title="Fermer (Esc)"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Contenu PDF */}
        <div className="flex-1 overflow-hidden bg-gray-100 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">
                  Chargement du document...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Erreur de chargement
                </h4>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button
                  onClick={() => window.open(pdfUrl, "_blank")}
                  variant="outline"
                >
                  Ouvrir dans un nouvel onglet
                </Button>
              </div>
            </div>
          )}

          {/* Iframe pour afficher le PDF */}
          <div className="w-full h-full overflow-auto ">
            <iframe
              src={`${pdfUrl}#page=${currentPage}&zoom=${zoom}&rotate=${rotation}`}
              className="w-full h-full border-0"
              title={documentName}
              onLoad={() => {
                setIsLoading(false);
                // Essayer de détecter le nombre de pages (limité avec iframe)
                setTotalPages(1); // Par défaut, sera mis à jour si possible
              }}
              onError={() => {
                setIsLoading(false);
                setError(
                  "Impossible de charger le document PDF. Le fichier pourrait être corrompu ou inaccessible.",
                );
              }}
            />
          </div>
        </div>

        {/* Barre d'état en bas */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Zoom: {zoom}%</span>
            <span>Rotation: {rotation}°</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs">
              Raccourcis: ← → (navigation), +/- (zoom), R (rotation), F (plein
              écran), Esc (fermer)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFModal;
