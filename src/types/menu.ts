export type SubmenuItem = {
  label: string;
  href: string;
};

export type HeaderItem = {
  label: string;
  href: string;
  submenu?: SubmenuItem[];
};

// Types pour les modèles de base de données

export interface Niveau {
  id: string;
  name: string;
  grades: Grade[];
}

export interface Grade {
  id: string;
  name: string;
  price: number;
  niveauId: string;
  niveau: Niveau;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  handler: string;
  gradeId: string;
  description: string;
  grade: Grade;
}
export interface Course {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  coverImage?: string;
  handler: string;
  index: number;
  subjectId: string;
  subject: Subject;
  documents: Document[];
  quizzes: Quiz[];
}

export interface Document {
  id: string;
  name: string;
  url: string;
  courseId: string;
  course: Course;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  course: Course;
  questions: Question[];
}

export interface Question {
  id: string;
  content: string;
  answer: string;
  quizId: string;
  quiz: Quiz;
}
// Types pour les formulaires
export interface CreateNiveauData {
  name: string;
}

export interface UpdateNiveauData {
  id: string;
  name: string;
}

export interface CreateGradeData {
  name: string;
  niveauId: string;
}

export interface UpdateGradeData {
  id: string;
  name: string;
  niveauId: string;
}

export interface CreateSubjectData {
  name: string;
  color: string;
  handler: string;
  gradeId: string;
}

export interface UpdateSubjectData {
  id: string;
  name: string;
  color: string;
  gradeId: string;
}
export interface CreateCourseData {
  title: string;
  content?: string;
  videoUrl?: string;
  coverImage?: string;
  handler: string;
  index: number;
  subjectId: string;
}

export interface UpdateCourseData {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  coverImage?: string;
  handler: string;
  index: number;
  subjectId: string;
}

export interface CreateDocumentData {
  name: string;
  url: string;
  courseId: string;
}

export interface UpdateDocumentData {
  id: string;
  name: string;
  url: string;
  courseId: string;
}

export interface CreateQuizData {
  title: string;
  courseId: string;
}

export interface UpdateQuizData {
  id: string;
  title: string;
  courseId: string;
}

export interface CreateQuestionData {
  content: string;
  answer: string;
  quizId: string;
}

export interface UpdateQuestionData {
  id: string;
  content: string;
  answer: string;
  quizId: string;
}
// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
