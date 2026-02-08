import { NextResponse } from "next/server";

import { HeaderItem } from "@/types/menu";
import { CourseType } from "@/types/course";
import { Hourtype } from "@/types/hour";
import { CourseDetailType } from "@/types/coursedetail";
import { MentorType } from "@/types/mentor";
import { TestimonialType } from "@/types/testimonial";
import { FooterLinkType } from "@/types/footerlinks";

const HeaderData: HeaderItem[] = [
  { label: "Home", href: "/#Home" },
  { label: "Courses", href: "/#Courses" },
  { label: "Mentors", href: "/#mentors-section" },
  { label: "Testimonial", href: "/#testimonial-section" },
  { label: "Contact Us", href: "/#join-section" },
];

const CourseData: CourseType[] = [
  { name: "iso-management" },
  { name: "securite-information" },
  { name: "conformite-reglementaire" },
  { name: "gestion-risques" },
];

const HourData: Hourtype[] = [
  { name: "20hrs in a Month" },
  { name: "30hrs in a Month" },
  { name: "40hrs in a Month" },
  { name: "50hrs in a Month" },
];

const Companiesdata: { imgSrc: string }[] = [
  {
    imgSrc: "/compli/datadock.png",
  },
  {
    imgSrc: "/compli/afnor.webp",
  },
  {
    imgSrc: "/compli/iso.png",
  },
  {
    imgSrc: "/compli/france-competences.png",
  },
  {
    imgSrc: "/compli/opqf.png",
  },
  {
    imgSrc: "/compli/cofrac.png",
  },
];

const CourseDetailData: CourseDetailType[] = [
  {
    course: "ISO 9001:2015",
    imageSrc:
      "https://m2b-academy.com/web/image/150717-68cd01b8/What-is-ISO-9001.jpg",
    profession: "Système de Management de la Qualité",
    price: "490",
    category: "iso-management",
  },
  {
    course: "ISO 14001:2015",
    imageSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHJh5QV2NjEv_TTACbEuToE9h6_R_7quINlw&s",
    profession: "Management Environnemental",
    price: "520",
    category: "iso-management",
  },
  {
    course: "ISO 45001:2018",
    imageSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZJ7SUQ4WchPPt3WIRN-zhzP4w612CEnJAPA&s",
    profession: "Santé et Sécurité au Travail",
    price: "550",
    category: "iso-management",
  },
  {
    course: "Auditeur Interne",
    imageSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkce0D-Jn8ujvv8PmFTebceW0nLBIJG5zWUw&s",
    profession: "Formation Auditeur ISO 9001",
    price: "690",
    category: "iso-management",
  },
  {
    course: "ISO 27001:2022",
    imageSrc: "/images/courses/iso27001.svg",
    profession: "Système de Management de la Sécurité de l'Information",
    price: "590",
    category: "securite-information",
  },
  {
    course: "RGPD",
    imageSrc: "/images/courses/rgpd.svg",
    profession: "Protection des Données Personnelles",
    price: "450",
    category: "securite-information",
  },
  {
    course: "ISO 22301",
    imageSrc: "/images/courses/iso22301.svg",
    profession: "Management de la Continuité d'Activité",
    price: "520",
    category: "securite-information",
  },
  {
    course: "Cybersécurité",
    imageSrc: "/images/courses/cybersecurite.svg",
    profession: "Fondamentaux de la Cybersécurité",
    price: "480",
    category: "securite-information",
  },
  {
    course: "REACH",
    imageSrc: "/images/courses/reach.svg",
    profession: "Conformité Chimique REACH",
    price: "420",
    category: "conformite-reglementaire",
  },
  {
    course: "RoHS",
    imageSrc: "/images/courses/rohs.svg",
    profession: "Conformité des Équipements Électriques",
    price: "390",
    category: "conformite-reglementaire",
  },
  {
    course: "MDR/IVDR",
    imageSrc: "/images/courses/mdr.svg",
    profession: "Réglementation des Dispositifs Médicaux",
    price: "650",
    category: "conformite-reglementaire",
  },
  {
    course: "Loi Sapin II",
    imageSrc: "/images/courses/sapin2.svg",
    profession: "Conformité Anti-Corruption",
    price: "380",
    category: "conformite-reglementaire",
  },
  {
    course: "ISO 31000",
    imageSrc: "/images/courses/iso31000.svg",
    profession: "Management du Risque",
    price: "520",
    category: "gestion-risques",
  },
  {
    course: "Risk Manager",
    imageSrc: "/images/courses/risk-manager.svg",
    profession: "Certification Risk Manager",
    price: "780",
    category: "gestion-risques",
  },
  {
    course: "Analyse de Risques",
    imageSrc: "/images/courses/analyse-risques.svg",
    profession: "Méthodes d'Analyse des Risques",
    price: "450",
    category: "gestion-risques",
  },
  {
    course: "Risk Assessment",
    imageSrc: "/images/courses/risk-assessment.svg",
    profession: "Évaluation des Risques Opérationnels",
    price: "490",
    category: "gestion-risques",
  },
];

const MentorData: MentorType[] = [
  {
    name: "Consultant en Management des Risques",
    href: "#",
    imageSrc: "/compli/login6.jpg",
    imageAlt: "Front of men's Basic Tee in black.",
    color: "M. Zakaria",
  },
  {
    name: "Photoshop Instructor",
    href: "#",
    imageSrc: "/images/mentor/boy2.svg",
    imageAlt: "Front of men's Basic Tee in black.",
    color: "Cristian Doru Barin",
  },
  {
    name: "SEO Expert",
    href: "#",
    imageSrc: "/images/mentor/boy3.svg",
    imageAlt: "Front of men's Basic Tee in black.",
    color: "Tanzeel Ur Rehman",
  },
];

const TestimonialData: TestimonialType[] = [
  {
    profession: "Responsable Qualité",
    name: "Marie Dubois",
    company: "Groupe Industriel Français",
    companyLogo: "/images/testimonial/company1.svg",
    imgSrc: "/images/testimonial/marie-dubois.jpg",
    rating: 5,
    certification: "ISO 9001:2015 Lead Auditor",
    detail:
      "La formation ISO 9001 Lead Auditor a complètement transformé ma pratique d'audit. Les études de cas réels et les échanges avec l'expert-formateur ont été particulièrement enrichissants. J'ai pu immédiatement appliquer les méthodes apprises dans mon entreprise.",
  },
  {
    profession: "Responsable Conformité",
    name: "Thomas Leroy",
    company: "Laboratoire Pharmaceutique",
    companyLogo: "/images/testimonial/company2.svg",
    imgSrc: "/images/testimonial/thomas-leroy.jpg",
    rating: 5,
    certification: "MDR/IVDR - Dispositifs Médicaux",
    detail:
      "Formation exceptionnelle sur la réglementation MDR/IVDR. L'expertise du formateur et la qualité des supports pédagogiques ont dépassé mes attentes. Une référence absolue pour les professionnels du secteur médical.",
  },
  {
    profession: "Directeur HSE",
    name: "Sophie Martin",
    company: "Multinationale Énergétique",
    companyLogo: "/images/testimonial/company3.svg",
    imgSrc: "/images/testimonial/sophie-martin.jpg",
    rating: 5,
    certification: "ISO 45001:2018",
    detail:
      "Le parcours de formation ISO 45001 a été parfaitement adapté à nos besoins. L'accompagnement personnalisé et les outils pratiques fournis nous ont permis d'obtenir la certification en seulement 6 mois. Un investissement très rentable.",
  },
  {
    profession: "DPO",
    name: "Ahmed Benali",
    company: "Groupe Bancaire",
    companyLogo: "/images/testimonial/company4.svg",
    imgSrc: "/images/testimonial/ahmed-benali.jpg",
    rating: 4,
    certification: "RGPD Expert",
    detail:
      "La formation RGPD de CompliRisk Academy se distingue par son approche pragmatique. Les templates de documents et les procédures opérationnelles sont directement exploitables. Un excellent rapport qualité-prix.",
  },
  {
    profession: "Risk Manager",
    name: "Isabelle Lambert",
    company: "Assureur International",
    companyLogo: "/images/testimonial/company5.svg",
    imgSrc: "/images/testimonial/isabelle-lambert.jpg",
    rating: 5,
    certification: "ISO 31000 Risk Manager",
    detail:
      "Après 15 ans dans le métier, je pensais tout connaître de la gestion des risques. Cette formation m'a apporté des méthodologies innovantes et une vision stratégique que j'applique quotidiennement. Bravo à toute l'équipe !",
  },
  {
    profession: "Responsable SI",
    name: "David Moreau",
    company: "ESN",
    companyLogo: "/images/testimonial/company6.svg",
    imgSrc: "/images/testimonial/david-moreau.jpg",
    rating: 5,
    certification: "ISO 27001:2022",
    detail:
      "La formation en ligne sur ISO 27001 est d'une qualité remarquable. La plateforme est intuitive, les vidéos sont professionnelles et les quiz permettent de valider ses acquis. J'ai obtenu ma certification du premier coup.",
  },
];

const FooterLinkData: FooterLinkType[] = [
  {
    section: "Company",
    links: [
      { label: "Home", href: "/#Home" },
      { label: "Courses", href: "/#Courses" },
      { label: "Mentors", href: "/#mentors-section" },
      { label: "Testimonial", href: "/#testimonial-section" },
      { label: "Join", href: "/#join-section" },
      { label: "Contact Us", href: "/#contact" },
    ],
  },
  {
    section: "Support",
    links: [
      { label: "Help center", href: "/" },
      { label: "Terms of service", href: "/" },
      { label: "Legal", href: "/" },
      { label: "Privacy Policy", href: "/" },
      { label: "Status", href: "/" },
    ],
  },
];

export const GET = () => {
  return NextResponse.json({
    HeaderData,
    CourseData,
    HourData,
    Companiesdata,
    CourseDetailData,
    MentorData,
    TestimonialData,
    FooterLinkData,
  });
};
