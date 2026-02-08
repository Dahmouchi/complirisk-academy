"use client";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { SendSynthese } from "@/actions/sendEmail";
import { toast } from "react-toastify";
import { Check, FileText, NotebookText, Upload } from "lucide-react";

const ButtonSynthese = ({ course, userId }: any) => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile)
      return toast.error("Veuillez sélectionner un fichier PDF.");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);
    formData.append("courseId", course?.id);

    try {
      setLoading(true);
      await SendSynthese(formData);
      toast.success("Synthèse envoyée avec succès !");
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l’envoi du fichier.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-gradient-to-br from-purple-600/5 to-blue-500/5 border border-purple-600/20 rounded-[6px] p-6">
      <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-purple-600" />
        Déposer la Synthèse
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        Téléchargez votre synthèse au format PDF pour validation par
        l&apos;instructeur.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <input
          type="file"
          accept=".pdf,application/pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="gap-2 border-dashed border-2 hover:border-perfrom-purple-600 hover:bg-perfrom-purple-600/5"
        >
          <Upload className="w-4 h-4" />
          Choisir un PDF
        </Button>

        {selectedFile && (
          <div className="flex items-center gap-2 px-3 py-2 bg-background rounded-lg border">
            <FileText className="w-4 h-4 text-perfrom-purple-600" />
            <span className="text-sm text-foreground truncate max-w-[200px]">
              {selectedFile.name}
            </span>
            {isUploaded && <Check className="w-4 h-4 text-green-500" />}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
          className="gap-2"
        >
          {loading ? (
            <>
              <Check className="w-4 h-4" />
              Envoyé
            </>
          ) : (
            "Envoyer"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ButtonSynthese;
