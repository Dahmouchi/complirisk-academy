import { all_courses } from "@/data/course-data";

type CorseCounts = { [key: string]: number };
const categoryCounts = all_courses.reduce<CorseCounts>((acc, course) => {
  acc[course.category] = (acc[course.category] || 0) + 1;
  return acc;
}, {});
const authorCounts = all_courses.reduce<CorseCounts>((acc, course) => {
  acc[course.author_name] = (acc[course.author_name] || 0) + 1;
  return acc;
}, {});
const languageCounts = all_courses.reduce<CorseCounts>((acc, course) => {
  acc[course.language] = (acc[course.language] || 0) + 1;
  return acc;
}, {});


export const courseCategories = Object.entries(categoryCounts).map(
  ([category, courseCount]) => {
    return {
      category,
      courseCount,
    };
  }
);
export const courseInstructors = Object.entries(authorCounts).map(
  ([instructor, authorCounts]) => {
    return {
      instructor,
      authorCounts,
    };
  }
);

export const courseLanguages = Object.entries(languageCounts).map(
  ([language, languageCounts]) => {
    return {
      language,
      languageCounts,
    };
  }
);
