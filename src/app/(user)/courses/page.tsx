import Newsletter from "@/components/complirisk/Newsletter";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";

const CoursesPage = () => {
  const courses = [
    {
      images: [
        "courseWebDesign",
        "courseUiDesign",
        "courseJavascript",
        "courseMobile",
        "courseGraphic",
      ],
      duration: "4 Weeks",
      level: "Beginner",
      title: "Web Design Fundamentals",
      author: "By John Smith",
      description:
        "Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. Develop the skills to create visually appealing and user-friendly websites.",
      curriculum: [
        { num: "01", title: "Introduction to HTML" },
        { num: "02", title: "Styling with CSS" },
        { num: "03", title: "Introduction to Responsive Design" },
        { num: "04", title: "Design Principles for UX" },
        { num: "05", title: "Building a Basic Website" },
      ],
    },
    {
      images: [
        "courseUiDesign",
        "courseWebDesign",
        "courseGraphic",
        "courseAdvancedJs",
        "courseMobile",
      ],
      duration: "6 Weeks",
      level: "Intermediate",
      title: "UI/UX Design",
      author: "By Emily Johnson",
      description:
        "Master the art of creating intuitive user interfaces (UI) and enhancing user experiences (UX). Learn design principles, wireframing, prototyping, and usability testing techniques.",
      curriculum: [
        { num: "01", title: "Introduction to UI/UX Design" },
        { num: "02", title: "User Research and Personas" },
        { num: "03", title: "Wireframing and Prototyping" },
        { num: "04", title: "Visual Design and Branding" },
        { num: "05", title: "Usability Testing and Iteration" },
      ],
    },
    {
      images: [
        "courseMobile",
        "courseJavascript",
        "courseAdvancedJs",
        "courseWebDesign",
        "courseUiDesign",
      ],
      duration: "8 Weeks",
      level: "Intermediate",
      title: "Mobile App Development",
      author: "By David Brown",
      description:
        "Dive into the world of mobile app development. Learn to build native iOS and Android applications using industry-standard frameworks like the Swift and Kotlin.",
      curriculum: [
        { num: "01", title: "Introduction to Mobile Development" },
        { num: "02", title: "Fundamentals of Swift Programming (iOS)" },
        { num: "03", title: "Fundamentals of Kotlin Programming (Android)" },
        { num: "04", title: "Building User Interfaces" },
        { num: "05", title: "App Deployment and Testing" },
      ],
    },
    {
      images: [
        "courseGraphic",
        "courseUiDesign",
        "courseWebDesign",
        "courseMobile",
        "courseAdvancedJs",
      ],
      duration: "10 Weeks",
      level: "Beginner",
      title: "Graphic Design for Beginners",
      author: "By Sarah Thompson",
      description:
        "Discover the fundamentals of graphic design, including typography, color theory, layout design, and image manipulation using Adobe Creative Suite. Create stunning visual assets for print and digital media.",
      curriculum: [
        { num: "01", title: "Introduction to Graphic Design" },
        { num: "02", title: "Typography and Color Theory" },
        { num: "03", title: "Layout Design and Composition" },
        { num: "04", title: "Image Editing and Manipulation" },
        { num: "05", title: "Designing for Print and Digital Media" },
      ],
    },
    {
      images: [
        "courseJavascript",
        "courseAdvancedJs",
        "courseWebDesign",
        "courseUiDesign",
        "courseMobile",
      ],
      duration: "10 Weeks",
      level: "Intermediate",
      title: "Front-End Web Development",
      author: "By Michael Adams",
      description:
        "Become proficient in front-end web development. Learn HTML, CSS, JavaScript, and popular frameworks like React to build interactive and responsive websites. Build stunning and responsive websites.",
      curriculum: [
        { num: "01", title: "HTML Fundamentals" },
        { num: "02", title: "CSS Styling and Layouts" },
        { num: "03", title: "JavaScript Basics" },
        { num: "04", title: "Building Responsive Websites" },
        { num: "05", title: "Introduction to React" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <Header visible={false} />
      <main className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-12">
            <div className="lg:max-w-md">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Online Courses on Design and Development
              </h1>
            </div>
            <p className="text-muted-foreground lg:max-w-xl">
              Welcome to our online course page, where you can enhance your
              skills in design and development. Choose from our carefully
              curated selection of 10 courses designed to provide you with
              comprehensive knowledge and practical experience. Unlock the
              courses and take the first step towards mastery.
            </p>
          </div>

          {/* Courses List */}
          <div className="space-y-8">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-card rounded-xl border border-border p-6 md:p-8"
              >
                {/* Course Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold mb-2">
                      {course.title}
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base">
                      {course.description}
                    </p>
                  </div>
                  <Button className="shrink-0 self-start">View Course</Button>
                </div>

                {/* Course Images */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                  {course.images.map((img, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="aspect-[4/3] rounded-lg overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`${course.title} preview ${imgIndex + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>

                {/* Course Meta */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 text-xs font-medium bg-muted rounded-md border border-border">
                      {course.duration}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium bg-muted rounded-md border border-border">
                      {course.level}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{course.author}</span>
                </div>

                {/* Curriculum */}
                <div className="bg-muted/50 rounded-lg p-4 md:p-6">
                  <h3 className="text-lg font-semibold mb-4">Curriculum</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {course.curriculum.map((item) => (
                      <div
                        key={item.num}
                        className="bg-card rounded-lg p-4 border border-border"
                      >
                        <span className="text-2xl md:text-3xl font-bold text-primary">
                          {item.num}
                        </span>
                        <p className="text-xs md:text-sm text-muted-foreground mt-2">
                          {item.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default CoursesPage;
