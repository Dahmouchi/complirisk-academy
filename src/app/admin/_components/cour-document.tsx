import React, { useState, useCallback, useRef, useEffect } from "react";
import { Upload, X, FileText, Loader, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateCourseDocuments, uploadDocument } from "@/actions/cours";
import { toast } from "react-toastify";

// Interface pour un document tel qu\\'il est stocké en base de données
export interface CourseDocument {
  id: string; // Identifiant unique du document
  name: string; // Nom du fichier du document
  url: string; // URL d\\'accès au document (après upload)
  courseId: string; // ID du cours auquel le document est associé
}

// Props pour le composant DocumentManager
interface DocumentManagerProps {
  initialDocuments: CourseDocument[]; // Documents déjà associés au cours
}

const DocumentManager: React.FC<DocumentManagerProps> = ({
  initialDocuments,
}) => {
  const [documents, setDocuments] =
    useState<(File | CourseDocument)[]>(initialDocuments);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchroniser l\\'état interne avec les props initialDocuments si elles changent
  useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        const newDocs = [...documents, ...files];
        setDocuments(newDocs);
      }
    },
    [documents]
  );

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
        const newDocs = [...documents, ...files];
        setDocuments(newDocs);
      }
    },
    [documents]
  );

  const removeDocument = useCallback(
    (indexToRemove: number) => {
      const updatedDocs = documents.filter(
        (_, index) => index !== indexToRemove
      );
      setDocuments(updatedDocs);
    },
    [documents]
  );
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Separate existing documents (already in DB) from new files
      const existingDocs = documents.filter(
        (doc): doc is CourseDocument => !(doc instanceof File)
      );
      const newFiles = documents.filter(
        (doc): doc is File => doc instanceof File
      );

      // 1️⃣ Upload all new files to Cloudflare
      const uploadedUrls = await Promise.all(
        newFiles.map((file) => uploadDocument(file))
      );

      // 2️⃣ Prepare new document objects for DB
      const newDocumentEntries: Omit<CourseDocument, "id">[] = newFiles.map(
        (file, index) => ({
          name: file.name,
          url: uploadedUrls[index],
          courseId: initialDocuments[0]?.courseId || "",
        })
      );

      // 3️⃣ Call backend to update DB
      const updateResult = await updateCourseDocuments(
        initialDocuments[0]?.courseId || "",
        [...existingDocs, ...newDocumentEntries] // Send final desired list
      );

      if (updateResult.success) {
        toast.success("Documents mis à jour avec succès !");
      } else {
        throw new Error(updateResult.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating documents:", error);
      toast.error(
        `Erreur lors de la mise à jour : ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [documents, initialDocuments]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Documents du cours
      </h3>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Glissez & déposez ou cliquez pour ajouter des documents
        </h3>
        <p className="text-gray-600 mb-4">Fichiers PDF, Word, images, etc.</p>
        <button
          type="button"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Sélectionner des documents
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <AnimatePresence>
        {documents.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">
              Documents sélectionnés :
            </h4>
            {documents.map((doc, index) => (
              <motion.div
                key={typeof doc === "string" ? doc : doc.name + index} // Utiliser une clé unique
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {typeof doc === "string" ? doc : doc.name}
                    </p>
                    {typeof doc !== "string" && doc instanceof File && (
                      <p className="text-sm text-gray-500">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
      <div className="flex items-center justify-between my-3">
        <div></div>
        <div className="flex items-center space-x-4">
          <button
            type="button" // Changed from "submit" since we're handling manually
            onClick={handleSubmit}
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
                <span>modifier les documents</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;
