"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  FileText,
  Brain,
  Map,
  Wand2,
  Plus,
  Save,
  Download,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createNote,
  deleteNoteById,
  generateMagicNoteServer,
  getNotes,
} from "@/actions/noteOpenAI";
import { Note } from "@prisma/client";
import ModernStudyDiagram from "./TreeView";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
const sampleResumeData = {
  personalInfo: {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johndoe",
  },
  summary:
    "Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.",
  experience: [
    {
      company: "Tech Corp",
      position: "Senior Software Engineer",
      duration: "2021 - Present",
      responsibilities: [
        "Led development of microservices architecture",
        "Mentored junior developers",
        "Improved system performance by 40%",
      ],
    },
    {
      company: "StartupXYZ",
      position: "Full Stack Developer",
      duration: "2019 - 2021",
      responsibilities: [
        "Built responsive web applications",
        "Implemented CI/CD pipelines",
        "Collaborated with design team",
      ],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      school: "University of California",
      year: "2019",
      gpa: "3.8/4.0",
    },
  ],
  skills: {
    programming: ["JavaScript", "TypeScript", "Python", "Java"],
    frameworks: ["React", "Node.js", "Express", "Next.js"],
    databases: ["PostgreSQL", "MongoDB", "Redis"],
    tools: ["Docker", "AWS", "Git", "Jenkins"],
  },
  projects: [
    {
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      link: "github.com/johndoe/ecommerce",
    },
  ],
};
interface MagicNotesButtonProps {
  courseTitle: string;
  userId: string;
  coursId?: string;
  results: any[];
}
type MagicNoteResultProps = {
  summary: string;
  schema: any;
};

const MagicNotesButton = ({
  courseTitle,
  userId,
  coursId,
  results,
}: MagicNotesButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>(results);
  const [currentNote, setCurrentNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"📝 Résumé" | "🗂️ Schéma">(
    "📝 Résumé",
  );
  const router = useRouter();
  const [result, setResult] = useState<MagicNoteResultProps>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    type: "summary" | "schema" | "map" | null;
    content: string;
  }>({ type: null, content: "" });

  const addNote = async () => {
    setLoading(true);
    if (currentNote.trim() && coursId) {
      // Call Prisma via server action
      const newNote = await createNote(userId, coursId, currentNote);

      // Optimistically update UI
      setNotes((prev) => [
        ...prev,
        {
          ...newNote,
          timestamp: new Date().toLocaleTimeString(), // UI-only field
          courseTitle,
        } as Note & { timestamp: string; courseTitle: string },
      ]);
      setLoading(false);
      setCurrentNote("");
    }
  };
  const handleGenerate = async (type: "summary" | "schema") => {
    setIsGenerating(true);
    try {
      const output = await generateMagicNoteServer(
        type,
        notes.map((n) => n.id),
        courseTitle,
      );
      setGeneratedContent({ type, content: output.summary || "No result" });
      setResult(output);
    } catch (err) {
      console.error(err);
      setGeneratedContent({ type, content: "⚠️ Error generating content" });
    }
    setIsGenerating(false);
  };
  const deleteNote = async (id: string) => {
    setLoading(true);
    try {
      const output = await deleteNoteById(id);
      setLoading(false);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!result) {
      alert("No data available to export");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content =
      activeTab === "📝 Résumé"
        ? generateSummaryHTML(result.summary)
        : generateSchemaAnalysisHTML(result.schema);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>AI Resume Course Export - ${
            activeTab === "📝 Résumé" ? "Summary Content" : "Schema Analysis"
          }</title>
          <style>
          
            body { font-family: system-ui, -apple-system, sans-serif; margin: 20px; line-height: 1.6; color: #374151; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #06b6d4; padding-bottom: 20px; }
            .course-badge { display: inline-flex; align-items: center; gap: 8px; background: #cffafe; color: #0891b2; padding: 8px 16px; border-radius: 20px; margin-bottom: 20px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 20px; font-weight: bold; color: #0f172a; margin-bottom: 15px; border-left: 4px solid #06b6d4; padding-left: 12px; }
            .content-block { margin-bottom: 15px; padding: 15px; border-left: 3px solid #06b6d4; background: #f0fdff; border-radius: 4px; }
            .schema-item { margin-bottom: 12px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
            .schema-key { font-weight: 600; color: #0891b2; }
            .schema-type { color: #059669; font-size: 12px; background: #d1fae5; padding: 2px 6px; border-radius: 3px; margin-left: 8px; }
            .nested { margin-left: 20px; margin-top: 8px; }
            .imgg {width :100px }
            @media print { body { margin: 0; } .course-badge { background: #f0f9ff !important; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="course-badge">
              🎓 AI Resume Course
            </div>
            <h1>AI Resume Course - ${
              activeTab === "📝 Résumé" ? "Summary Content" : "Schema Analysis"
            }</h1>
             <img
             
              src="/compli/complirisk-academy.png"
              class="imgg"
              alt=""
            />
          </div>
          ${content}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const generateSummaryHTML = (summaryData: any) => {
    const renderObject = (obj: any, level = 0): string => {
      return Object.entries(obj)
        .map(([key, value]) => {
          const indent = level * 20;
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            return `
              <div style="margin-left: ${indent}px; margin-bottom: 15px;">
                <h${Math.min(
                  level + 3,
                  6,
                )} style="color: #0891b2; margin-bottom: 8px;">${key}</h${Math.min(
                  level + 3,
                  6,
                )}>
                <div class="nested">${renderObject(value, level + 1)}</div>
              </div>
            `;
          } else {
            return `
              <div class="content-block" style="margin-left: ${indent}px;">
                <strong>${key}:</strong> ${String(value)}
              </div>
            `;
          }
        })
        .join("");
    };

    return `
      <div class="section">
        <div class="section-title">📝 Summary Content</div>
        ${renderObject(summaryData)}
      </div>
    `;
  };

  const generateSchemaAnalysisHTML = (schemaData: any) => {
    const analyzeDataStructure = (obj: any, path = "", level = 0): string => {
      return Object.entries(obj)
        .map(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          const indent = level * 20;

          if (Array.isArray(value)) {
            const itemType = value.length > 0 ? typeof value[0] : "empty";
            return `
              <div class="schema-item" style="margin-left: ${indent}px;">
                <span class="schema-key">${key}</span>
                <span class="schema-type">Array[${value.length}]</span>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                  Path: ${currentPath} | Items: ${
                    value.length
                  } | Item Type: ${itemType}
                </div>
                ${
                  value.length > 0 && typeof value[0] === "object"
                    ? `<div class="nested">${analyzeDataStructure(
                        value[0],
                        `${currentPath}[0]`,
                        level + 1,
                      )}</div>`
                    : ""
                }
              </div>
            `;
          } else if (typeof value === "object" && value !== null) {
            return `
              <div class="schema-item" style="margin-left: ${indent}px;">
                <span class="schema-key">${key}</span>
                <span class="schema-type">Object</span>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                  Path: ${currentPath} | Properties: ${
                    Object.keys(value).length
                  }
                </div>
                <div class="nested">${analyzeDataStructure(
                  value,
                  currentPath,
                  level + 1,
                )}</div>
              </div>
            `;
          } else {
            return `
              <div class="schema-item" style="margin-left: ${indent}px;">
                <span class="schema-key">${key}</span>
                <span class="schema-type">${typeof value}</span>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                  Path: ${currentPath} | Value: "${String(value).substring(
                    0,
                    50,
                  )}${String(value).length > 50 ? "..." : ""}"
                </div>
              </div>
            `;
          }
        })
        .join("");
    };

    return `
      <div class="section">
        <div class="section-title">📊 Schema Analysis Overview</div>
        <div class="content-block">
          <p><strong>Total Properties:</strong> ${
            Object.keys(schemaData).length
          } root-level properties</p>
          <p><strong>Data Complexity:</strong> Multi-level hierarchical structure with arrays and nested objects</p>
          <p><strong>Schema Type:</strong> Professional resume data structure following modern JSON standards</p>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">🗂️ Detailed Schema Structure</div>
        ${analyzeDataStructure(schemaData)}
      </div>
    `;
  };
  return (
    <>
      {/* Floating Action Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className={cn(
              "fixed right-0 top-2/3 -translate-y-1/2  z-50 h-16 rounded-l-2xl shadow-medium",
              "bg-blue-500 hover:bg-yellow-400 transition-all duration-300",
              "float-animation hover:scale-110 active:scale-95",
              "border-2 border-white/20",
              "transition-all duration-300 ease-out",
              "hover:pr-5 hover:shadow-lg",
              "group",
            )}
            aria-label="Ouvrir les notes magiques"
          >
            <div className="relative">
              <Wand2 className="h-6 w-3 text-primary-foreground" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 sparkle-animation" />
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl sm:max-w-2xl md:max-w-3xl lg:max-w-6xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Wand2 className="h-5 w-5 text-primary" />
              Notes Magiques
              <Badge variant="secondary" className="ml-2">
                {courseTitle}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 w-full">
            {/* Notes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Mes Notes ({notes.length})
                </h3>
              </div>

              {/* Add Note */}
              <div className="space-y-2">
                <Textarea
                  placeholder="Ajoutez une note sur ce cours..."
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <Button
                  onClick={addNote}
                  disabled={!currentNote.trim()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter la note
                </Button>
              </div>

              {/* Notes List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {loading ? (
                  <div
                    className="animate-spin inline-block size-6 border-3 border-current border-t-transparent text-blue-500 rounded-full dark:text-blue-400"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notes.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Aucune note pour le moment</p>
                        <p className="text-sm">
                          Commencez à prendre des notes!
                        </p>
                      </div>
                    ) : (
                      notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 bg-card rounded-lg border relative"
                        >
                          <div
                            onClick={() => deleteNote(note.id)}
                            className="absolute top-1 right-1 text-red-500 hover:bg-amber-100 p-1 rounded-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </div>
                          <p className="text-sm text-card-foreground mb-1">
                            {note.content}
                          </p>
                          <p className="text-xs text-muted-foreground"></p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* AI Generation Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Génération IA
              </h3>

              {/* Generation Buttons */}
              <div className="grid grid-cols-1 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleGenerate("summary")}
                  disabled={notes.length === 0 || isGenerating}
                  className="justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Générer un résumé
                </Button>
              </div>

              {/* Generated Content */}
              {isGenerating && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-primary">
                    <Sparkles className="h-5 w-5 animate-spin" />
                    <span>Génération en cours...</span>
                  </div>
                </div>
              )}

              {generatedContent.content && !isGenerating && (
                <div className="w-full max-w-3xl mx-auto mt-6">
                  {/* Tabs */}
                  <div className="flex border-b mb-4">
                    {["📝 Résumé", "🗂️ Schéma"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-2 capitalize ${
                          activeTab === tab
                            ? "border-b-2 border-blue-500 font-semibold"
                            : "text-gray-500"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                    <Button
                      onClick={exportToPDF}
                      className="mb-2 ml-4 bg-transparent"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="bg-white p-4 rounded shadow text-sm">
                    {activeTab === "📝 Résumé" && (
                      <div>
                        <p className="leading-relaxed whitespace-pre-line">
                          {result?.summary}
                        </p>
                      </div>
                    )}

                    {activeTab === "🗂️ Schéma" && (
                      <div>
                        <ModernStudyDiagram data={result?.schema} />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {notes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Ajoutez des notes pour</p>
                  <p>générer du contenu IA</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MagicNotesButton;
