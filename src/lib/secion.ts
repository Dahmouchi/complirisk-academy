export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
  sectionId: string;
}

export interface Level {
  id: string;
  name: string;
  grades: Grade[];
  order: number;
}
export interface Grade {
  id: string;
  name: string;
  subjects: Subject[];
  order: number;
}
export interface Subject {
  name: string;
  color: string;
}
export interface Section {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImageUrl?: string;
  designStyleKey: ThemeStyle;
  featureItems: FeatureItem[];
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const SUBJECT_COLORS = [
  "bg-purple-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-amber-400",
  "bg-indigo-400",
  "bg-teal-400",
  "bg-red-400",
  "bg-emerald-400",
  "bg-pink-400",
] as const;
export const AVAILABLE_ICONS = [
  "Award",
  "Briefcase",
  "Globe",
  "GraduationCap",
  "Users",
  "Star",
  "Heart",
  "Zap",
  "Shield",
  "Target",
  "TrendingUp",
  "CheckCircle",
  "Rocket",
  "Lightbulb",
  "BookOpen",
  "Coffee",
  "Code",
  "Camera",
] as const;

export type IconName = (typeof AVAILABLE_ICONS)[number];
export type ThemeStyle =
  | "modern-dark"
  | "light-minimal"
  | "gradient-bold"
  | "corporate";

// ============================================
// THEME CONFIGURATION
// ============================================

export const THEME_STYLES = {
  "modern-dark": {
    name: "Modern Dark",
    description: "Dark background with glowing accents",
    colors: {
      // Background Colors
      background: "bg-slate-900", // Main background
      cardBackground: "bg-slate-800/50", // Card background
      hoverBackground: "bg-slate-700/50", // Hover state

      // Text Colors
      primaryText: "text-white", // Main headings
      secondaryText: "text-slate-300", // Body text
      mutedText: "text-slate-400", // Subtle text

      // Accent Colors
      accent: "text-indigo-400", // Primary accent
      accentBg: "bg-indigo-400/10", // Accent background
      border: "border-slate-700", // Borders

      // Interactive Elements
      button: "bg-indigo-500 hover:bg-indigo-600",
      buttonText: "text-white",
      link: "text-indigo-400 hover:text-indigo-300",

      // Special Effects
      glow: "shadow-lg shadow-indigo-500/20",
      gradient: "from-slate-900 to-slate-800",
    },
    features: {
      glassmorphism: true,
      animations: "subtle",
      shadows: "elevated",
      borderRadius: "rounded-[8px]",
    },
  },

  "light-minimal": {
    name: "Light Minimal",
    description: "Clean white with subtle shadows",
    colors: {
      // Background Colors
      background: "bg-white", // Main background
      cardBackground: "bg-white", // Card background
      hoverBackground: "bg-gray-50", // Hover state

      // Text Colors
      primaryText: "text-gray-900", // Main headings
      secondaryText: "text-gray-700", // Body text
      mutedText: "text-gray-500", // Subtle text

      // Accent Colors
      accent: "text-gray-900", // Primary accent
      accentBg: "bg-gray-100", // Accent background
      border: "border-gray-200", // Borders

      // Interactive Elements
      button: "bg-gray-900 hover:bg-gray-800",
      buttonText: "text-white",
      link: "text-gray-900 hover:text-gray-700",

      // Special Effects
      glow: "shadow-md shadow-gray-200/50",
      gradient: "from-white to-gray-50",
    },
    features: {
      glassmorphism: false,
      animations: "minimal",
      shadows: "soft",
      borderRadius: "rounded-lg",
    },
  },

  "gradient-bold": {
    name: "Gradient Bold",
    description: "Vibrant gradient backgrounds",
    colors: {
      // Background Colors
      background:
        "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500",
      cardBackground: "bg-white/10 backdrop-blur-lg",
      hoverBackground: "bg-white/20",

      // Text Colors
      primaryText: "text-white", // Main headings
      secondaryText: "text-white/90", // Body text
      mutedText: "text-white/70", // Subtle text

      // Accent Colors
      accent: "text-yellow-300", // Primary accent
      accentBg: "bg-yellow-300/20", // Accent background
      border: "border-white/20", // Borders

      // Interactive Elements
      button: "bg-yellow-400 hover:bg-yellow-300",
      buttonText: "text-gray-900",
      link: "text-yellow-300 hover:text-yellow-200",

      // Special Effects
      glow: "shadow-2xl shadow-purple-500/30",
      gradient: "from-purple-600 via-pink-600 to-orange-500",
    },
    features: {
      glassmorphism: true,
      animations: "dynamic",
      shadows: "dramatic",
      borderRadius: "rounded-2xl",
    },
  },

  corporate: {
    name: "Corporate Classic",
    description: "Professional blues and grays",
    colors: {
      // Background Colors
      background: "bg-gray-50", // Main background
      cardBackground: "bg-white", // Card background
      hoverBackground: "bg-blue-50", // Hover state

      // Text Colors
      primaryText: "text-gray-900", // Main headings
      secondaryText: "text-gray-700", // Body text
      mutedText: "text-gray-600", // Subtle text

      // Accent Colors
      accent: "text-blue-600", // Primary accent
      accentBg: "bg-blue-50", // Accent background
      border: "border-gray-300", // Borders

      // Interactive Elements
      button: "bg-blue-600 hover:bg-blue-700",
      buttonText: "text-white",
      link: "text-blue-600 hover:text-blue-700",

      // Special Effects
      glow: "shadow-lg shadow-blue-100/50",
      gradient: "from-gray-50 to-blue-50",
    },
    features: {
      glassmorphism: false,
      animations: "professional",
      shadows: "standard",
      borderRadius: "rounded-lg",
    },
  },
} as const;

// ============================================
// THEME OPTIONS FOR UI
// ============================================

export const THEME_OPTIONS: {
  value: ThemeStyle;
  label: string;
  description: string;
}[] = [
  {
    value: "modern-dark",
    label: "Modern Dark",
    description: "Dark background with glowing accents",
  },
  {
    value: "light-minimal",
    label: "Light Minimal",
    description: "Clean white with subtle shadows",
  },
  {
    value: "gradient-bold",
    label: "Gradient Bold",
    description: "Vibrant gradient backgrounds",
  },
  {
    value: "corporate",
    label: "Corporate Classic",
    description: "Professional blues and grays",
  },
];

// ============================================
// USAGE HELPER FUNCTIONS
// ============================================

/**
 * Get theme configuration by theme name
 */
export const getThemeConfig = (theme: ThemeStyle) => {
  return THEME_STYLES[theme];
};

/**
 * Get specific color class from theme
 */
export const getThemeColor = (
  theme: ThemeStyle,
  colorKey: keyof (typeof THEME_STYLES)[ThemeStyle]["colors"]
) => {
  return THEME_STYLES[theme].colors[colorKey];
};

/**
 * Represents a single individual Feature Item/Card within a section.
 * Corresponds to the 'FeatureItem' Prisma model.
 */
export type FeatureItemType = {
  id: string;
  title: string;
  description: string;
  // This string will correspond to the icon component name on the frontend (e.g., 'Award', 'Briefcase').
  iconName: string;
  order: number;
  sectionId: string;
};

/**
 * Represents a major content block/section on the landing page.
 * Corresponds to the 'Section' Prisma model.
 */
export type SectionType = {
  id: string;
  // A unique identifier for the section (e.g., 'why_choose_enita', 'hero_banner').
  key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  // URL or path for the background image (e.g., '/Board.png').
  backgroundImageUrl: File | null;
  heroImageUrl: File | null;
  checklistItems: string;
  layoutType: SectionLayout;
  levels: Level[];
  // Key to dictate the frontend design/layout (e.g., 'cards_grid', 'carousel').
  designStyleKey: ThemeStyle;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type SectionType2 = {
  id: string;
  // A unique identifier for the section (e.g., 'why_choose_enita', 'hero_banner').
  key: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  // URL or path for the background image (e.g., '/Board.png').
  backgroundImageUrl: File | null;
  heroImageUrl: File | null;
  checklistItems: string;
  layoutType: SectionLayout;
  levels: Level[];
  // Key to dictate the frontend design/layout (e.g., 'cards_grid', 'carousel').
  designStyleKey: ThemeStyle;
  order: number;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Represents the Section data fetched from the API, including its nested FeatureItems.
 * This is the type you will typically use in your frontend components.
 */
export type SectionWithFeatures = SectionType & {
  // The array of feature items associated with this section.
  featureItems: FeatureItemType[];
  levels: Level[];
};

// --- Optional: Types for creating and updating data (DTS) ---
export type SectionWithFeatures2 = SectionType2 & {
  // The array of feature items associated with this section.
  featureItems: FeatureItemType[];
};
/**
 * Type for creating a new FeatureItem (ID, dates, and sectionId are omitted).
 */
export type CreateFeatureItemDTO = Omit<
  FeatureItemType,
  "id" | "sectionId" | "createdAt" | "updatedAt"
>;

/**
 * Type for creating a new Section (ID and dates are omitted).
 */
export type CreateSectionDTO = Omit<
  SectionType,
  "id" | "createdAt" | "updatedAt"
>;
export type SectionLayout = "feature-grid" | "carousel-cards" | "hero-banner";

export const LAYOUT_OPTIONS: {
  value: SectionLayout;
  label: string;
  description: string;
}[] = [
  {
    value: "feature-grid",
    label: "Grille de fonctionnalités",
    description: "Grille de cartes de fonctionnalités avec des icônes",
  },
  {
    value: "carousel-cards",
    label: "Cartes de carousel",
    description: "Horizontal carousel de cartes de programmes",
  },
  {
    value: "hero-banner",
    label: "Hero Banner",
    description: "Texte à gauche avec une image à droite",
  },
];
