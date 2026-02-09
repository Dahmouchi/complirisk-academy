import { Course } from "@/app/(user)/_components/compli/CourseCard";

export const courses: Course[] = [
  {
    id: "1",
    title: "ISO 37001 Foundation - Anti-Bribery Management Systems",
    description:
      "Learn the fundamentals of anti-bribery management systems and how to implement ISO 37001 in your organization.",
    category: "ISO 37001",
    duration: "8 hours",
    lessons: 12,
    enrolled: 1247,
    progress: 65,
    price: 1500,
    subjectId: "1",
    level: "Foundation",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
    instructor: "Marie Laurent",
  },
  {
    id: "2",
    title: "ISO 37001 Lead Auditor Training",
    description:
      "Become a certified lead auditor for anti-bribery management systems with comprehensive practical training.",
    category: "ISO 37001",
    duration: "40 hours",
    lessons: 24,
    enrolled: 892,
    price: 1500,
    subjectId: "1",
    progress: 0,
    level: "Lead Auditor",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
    instructor: "Philippe Martin",
  },
  {
    id: "3",
    title: "ISO 19600 Compliance Management Systems",
    description:
      "Master compliance management frameworks and learn to build robust compliance programs.",
    category: "ISO 19600",
    duration: "12 hours",
    lessons: 16,
    enrolled: 756,
    subjectId: "1",
    progress: 30,
    price: 1500,
    level: "Practitioner",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=60",
    instructor: "Sophie Dubois",
  },
  {
    id: "4",
    subjectId: "1",
    title: "Anti-Corruption Risk Assessment",
    description:
      "Identify, assess, and mitigate corruption risks within your organization using proven methodologies.",
    category: "Risk Management",
    duration: "6 hours",
    lessons: 8,
    enrolled: 1089,
    progress: 0,
    price: 1500,
    level: "Foundation",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    instructor: "Jean-Pierre Bernard",
  },
  {
    id: "5",
    title: "Ethics and Compliance Culture Building",
    description:
      "Create a strong ethical culture that supports compliance and integrity throughout your organization.",
    category: "Ethics",
    duration: "4 hours",
    lessons: 6,
    price: 1500,
    enrolled: 1456,
    subjectId: "1",
    progress: 100,
    level: "Foundation",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop&q=60",
    instructor: "Claire Moreau",
  },
  {
    id: "6",
    title: "ISO 37002 Whistleblowing Management",
    description:
      "Implement effective whistleblowing systems aligned with ISO 37002 standards and best practices.",
    category: "ISO 37002",
    duration: "10 hours",
    lessons: 14,
    subjectId: "1",
    price: 1500,
    enrolled: 634,
    progress: 45,
    level: "Practitioner",
    image:
      "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&auto=format&fit=crop&q=60",
    instructor: "Antoine Lefevre",
  },
  {
    id: "7",
    title: "Third-Party Due Diligence",
    description:
      "Conduct comprehensive due diligence on third parties to prevent corruption and compliance risks.",
    category: "Due Diligence",
    duration: "8 hours",
    subjectId: "1",
    lessons: 10,
    enrolled: 978,
    progress: 0,
    price: 1500,
    level: "Practitioner",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60",
    instructor: "Isabelle Petit",
  },
  {
    id: "8",
    subjectId: "1",
    title: "GDPR and Data Compliance",
    description:
      "Understand GDPR requirements and implement compliant data protection practices in your organization.",
    category: "Data Privacy",
    duration: "16 hours",
    lessons: 20,
    enrolled: 2341,
    price: 1500,
    progress: 80,
    level: "Foundation",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
    instructor: "Nicolas Roux",
  },
];

export const freeCourses: Course[] = [
  {
    id: "free-1",
    subjectId: "1",
    title: "Introduction à la Conformité - Les Fondamentaux",
    description:
      "Découvrez les bases de la conformité et pourquoi elle est essentielle dans le monde des affaires moderne.",
    category: "Introduction",
    duration: "2 hours",
    lessons: 4,
    price: 0,
    enrolled: 3456,
    progress: 0,
    level: "Foundation",
    image:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60",
    instructor: "Marie Laurent",
  },
  {
    id: "free-2",
    title: "Comprendre l'ISO 37001 - Aperçu Gratuit",
    description:
      "Un aperçu gratuit de la norme ISO 37001 pour la gestion anti-corruption.",
    category: "ISO 37001",
    duration: "1.5 hours",
    lessons: 3,
    enrolled: 2189,
    subjectId: "1",
    progress: 0,
    level: "Foundation",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=60",
    instructor: "Philippe Martin",
  },
  {
    id: "free-3",
    title: "Éthique en Entreprise - Module Découverte",
    description:
      "Explorez l'importance de l'éthique dans la culture d'entreprise avec ce module gratuit.",
    category: "Ethics",
    duration: "1 hour",
    price: 0,
    subjectId: "1",
    lessons: 2,
    enrolled: 4521,
    progress: 0,
    level: "Foundation",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=60",
    instructor: "Sophie Dubois",
  },
];

export const categories = [
  "All Courses",
  "ISO 37001",
  "ISO 19600",
  "ISO 37002",
  "Risk Management",
  "Ethics",
  "Due Diligence",
  "Data Privacy",
];
