"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  FileText,
  BookOpen,
  Eye,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";
import Progress from "@/components/ui/progress";
import VimeoTest from "@/app/(user)/_components/vimeoPlayer";
import { getCourseCompletionStatus } from "@/actions/progress";
import { getNotes } from "@/actions/noteOpenAI";
import ButtonComplete from "./buttonComplete";
import ButtonSynthese from "./ButtonSynthese";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SimplePDFViewer from "./cours-pdf";
import QuizDisplay from "./quizSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CourseChat } from "./course-chat";

const CoursDetails = ({ subject, user, progressCount }: any) => {
  const { id } = useParams();
  const navigate = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [results, setResults] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [completedStatus, setCompletedStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  // Initialize with the first course or find by id
  useEffect(() => {
    const fetchNotes = async () => {
      if (subject?.courses && subject.courses.length > 0) {
        if (id) {
          const course = subject.courses.find((c: any) => c.id === id);

          setSelectedCourse(course || subject.courses[0]);

          if (course) {
            const res = await getNotes(user?.id, course.id);
            setResults(res);
            console.log(res, "res");
          }
        } else {
          setSelectedCourse(subject.courses[0]);
        }
      }
    };

    fetchNotes();
  }, [subject, id]);

  useEffect(() => {
    const fetchCompletionStatus = async () => {
      const results = await Promise.all(
        subject.courses.map(async (course: any) => {
          const res = await getCourseCompletionStatus(user.id, course.id);
          return { courseId: course.id, completed: res.completed };
        }),
      );

      const statusMap: { [key: string]: boolean } = {};
      results.forEach(({ courseId, completed }) => {
        statusMap[courseId] = completed;
      });
      setCompletedStatus(statusMap);
    };

    fetchCompletionStatus();
  }, [subject, id]);

  const handleCourseSelect = async (course: any) => {
    setSelectedCourse(course);
    const res = await getNotes(user?.id, course?.id);
    console.log(res, "res");
    setResults(res);
    setVideoProgress(0);
    setIsPlaying(false);

    // Optionally update URL
    // navigate.push(`/student/course/${course.id}`);
  };

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="pb-24 md:pb-8">
        <div className="space-y-6 mx-auto px-4 sm:px-6 lg:px-8 my-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
            onClick={() => navigate.back()}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to courses
          </Button>

          {/* Title Section */}

          <div className="bg-card rounded-[8px] p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Votre Progrès
              </span>
              <span className="text-sm text-muted-foreground">
                {subject.courses.length} Lectures
              </span>
            </div>
            <Progress value={progressCount.percentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {progressCount.percentage.toFixed(0)}% terminé • Continuez, vous
              êtes formidable!
            </p>
          </div>
        </div>
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <motion.div
                key={selectedCourse.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group rounded-[6px] overflow-hidden bg-foreground/95 shadow-xl"
              >
                {selectedCourse?.videoUrl && selectedCourse?.coverImage ? (
                  <div>
                    <VimeoTest
                      videoUrl={selectedCourse?.videoUrl}
                      imageUrl={selectedCourse?.coverImage}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <div className="text-center text-white">
                      <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Vidéo non disponible</p>
                    </div>
                  </div>
                )}
              </motion.div>
              {/* Tabs for Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-[8px] h-auto flex-wrap">
                    <TabsTrigger
                      value="overview"
                      className="gap-2 data-[state=active]:bg-background rounded-lg"
                    >
                      <BookOpen className="w-4 h-4" />
                      Vue d&apos;ensemble
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="flex-1 rounded-lg">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Quiz ({selectedCourse.quizzes?.length || 0})
                    </TabsTrigger>
                    {/*<TabsTrigger
                      value="discussions"
                      className="gap-2 data-[state=active]:bg-background rounded-lg"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Discussions
                    </TabsTrigger>*/}
                  </TabsList>
                  <TabsContent value="overview" className="mt-6">
                    <div className="space-y-6">
                      <Badge
                        variant="secondary"
                        className="bg-blue-600/10 text-blue-600 hover:bg-blue-600/20"
                      >
                        {subject?.name}
                      </Badge>
                      <div className="flex space-y-2 flex-col lg:flex-row lg:items-center lg:justify-between">
                        <h1 className="text-xl md:text-3xl text-left font-bold text-foreground leading-tight max-w-3xl">
                          {selectedCourse?.title}
                        </h1>
                        <ButtonComplete
                          userId={user?.id}
                          course={selectedCourse}
                        />
                      </div>
                      <ButtonSynthese
                        course={selectedCourse}
                        userId={user?.id}
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          Description
                        </h3>
                        <div className="prose prose-sm text-muted-foreground max-w-none">
                          <p>{selectedCourse?.content}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/*<TabsContent value="discussions" className="mt-6">
                    <div className="bg-card rounded-[6px] border border-border p-6 text-center">
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">coming soon</p>
                    </div>
                    <CourseChat
                      courseId={selectedCourse.id}
                      currentUserId={user.id}
                      currentUserRole={user.role}
                    />
                  </TabsContent>*/}
                  <TabsContent value="notes" className="mt-4">
                    {selectedCourse?.quizzes.length > 0 ? (
                      <div>
                        {" "}
                        <QuizDisplay
                          quizzes={selectedCourse?.quizzes as any}
                          userId={user.id}
                        />
                      </div>
                    ) : (
                      <div className="bg-card rounded-[6px] border border-border p-6 text-center">
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">
                          Quiz
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Prenez des quiz pour tester vos connaissances.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 ">
              {/* All Courses List */}
              <div className="bg-card rounded-[6px] border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h3 className="font-semibold text-foreground">
                    Contenu du cours
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {
                      subject.courses.filter(
                        (v: { isCompleted: any }) => v.isCompleted,
                      ).length
                    }{" "}
                    / {subject.courses.length} leçons terminées
                  </p>
                </div>

                <ScrollArea className="h-[400px]">
                  <div className="p-2">
                    {subject.courses.map((course: any, index: number) => {
                      const isCompleted = completedStatus[course.id] || false;
                      const isActive = course.id === selectedCourse.id;
                      return (
                        <button
                          key={course.id}
                          onClick={() => handleCourseSelect(course)}
                          className={`w-full flex items-start gap-3 p-3 rounded-[8px] transition-all duration-200 text-left group ${
                            isActive
                              ? "bg-blue-600/10 border border-blue-600/20"
                              : "hover:bg-muted/50"
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className="relative flex-shrink-0 w-24 h-14 rounded-lg overflow-hidden bg-muted">
                            <img
                              src={course?.coverImage}
                              alt={course?.title}
                              className="w-full h-full object-cover"
                            />
                            <div
                              className={`absolute inset-0 flex items-center justify-center ${
                                isActive
                                  ? "bg-blue-600/60"
                                  : "bg-foreground/40 opacity-0 group-hover:opacity-100"
                              } transition-opacity`}
                            >
                              <Play
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                              />
                            </div>
                            {course.isCompleted && (
                              <div className="absolute top-1 right-1">
                                <CheckCircle2 className="w-4 h-4 text-accent fill-accent" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs text-muted-foreground font-medium">
                                Leçon {index + 1}
                              </span>
                              {course.isCompleted && (
                                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                              )}
                            </div>
                            <h4
                              className={`text-sm font-medium line-clamp-2 mt-0.5 ${
                                isActive
                                  ? "text-bluebg-blue-600"
                                  : "text-foreground"
                              }`}
                            >
                              {course.title}
                            </h4>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              {isCompleted ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span>Terminé</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Play
                                    className="w-4 h-4 text-blue-600"
                                    fill="currentColor"
                                  />
                                  <span>Commencer</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
              <div className="bg-card rounded-[6px] border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h3 className="font-semibold text-foreground">
                    Matériel du cours
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedCourse?.documents?.length} ressources
                    téléchargeables
                  </p>
                </div>
                <div className="p-3 space-y-2">
                  {selectedCourse?.documents?.map((doc: any) => {
                    return (
                      <div
                        key={doc.id}
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 p-3 cursor-pointer rounded-[8px] bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div
                          className={`p-2.5 rounded-[8px] bg-red-100 text-red-500`}
                        >
                          <FileText className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {doc.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Document PDF • Cliquez pour visualiser
                          </p>
                        </div>
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                          <DialogTrigger>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-red-800 hover:text-red-800">
                              <Eye className="w-4 h-4" />
                            </div>
                          </DialogTrigger>
                          <DialogOverlay>
                            <DialogContent className="h-[99vh] min-w-[90vw]  flex flex-col gap-2 p-2 lg:p-4">
                              <DialogTitle className="h-fit">
                                {doc.name}
                              </DialogTitle>
                              <div className="bg-amber-300 w-full h-full">
                                {/*<SimplePDFViewer pdfFilePath={doc.url} />*/}
                                <iframe
                                  src={`${doc.url}#toolbar=1&navpanes=1&scrollbar=1`}
                                  className="w-full h-full border-0"
                                  title={doc.name}
                                />
                              </div>
                            </DialogContent>
                          </DialogOverlay>
                        </Dialog>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursDetails;
