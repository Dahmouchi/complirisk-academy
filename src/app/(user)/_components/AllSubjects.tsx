"use client";
import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";
import { useState } from "react";
import { StudentHeader } from "@/components/student/StudentHeader";
import { Input } from "@/components/ui/input";
import { SubjectCardNew } from "@/components/student/SubjectCardNew";
import { signOut, useSession } from "next-auth/react";

export default function StudentSubjects({ subjects, userName }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const session = useSession();
  const filteredSubjects = subjects?.filter((subject: any) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    signOut();
    console.log("Logout");
  };
  if (!session.data?.user) {
    return <div>loading...</div>;
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-[8px] bg-primary/10">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground font-display">
              Mes Matières
            </h1>
          </div>
          <p className="text-muted-foreground">
            Explorez vos matières et suivez votre progression
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher une matière..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject: any, index: number) => (
            <SubjectCardNew
              key={subject.id}
              subject={subject}
              userId={session.data?.user?.id}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredSubjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucune matière trouvée
            </h3>
            <p className="text-muted-foreground">
              Essayez de modifier votre recherche
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
