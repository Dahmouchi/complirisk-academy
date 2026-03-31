"use server";

import prisma from "@/lib/prisma";

function getCorrectId(id: string) {
  return id
    .normalize("NFD")
    .replace(/œ/g, "oe") // Replace oe ligature
    .replace(/æ/g, "ae") // Replace ae ligature
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/\s+/g, "-") // Optional: spaces to dashes
    .replace(/[^a-zA-Z0-9-]/g, "") // Keep only allowed chars
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-|-$/g, "") // Trim leading/trailing dash
    .toLowerCase();
}

export async function createNiveau(name: string) {
  if (!name || name.trim() === "") {
    throw new Error("Le nom du niveau est requis.");
  }
  const handler = getCorrectId(name);
  const niveau = await prisma.niveau.create({
    data: {
      name: name.trim(),
      handler,
    },
  });
  return { success: true, data: niveau };
  // or return a success value instead
}
export async function updateNiveau(id: string, name: string) {
  if (!id || !name || name.trim() === "") {
    throw new Error("ID et nom du niveau sont requis.");
  }

  const updatedNiveau = await prisma.niveau.update({
    where: { id },
    data: { name: name.trim() },
  });

  return { success: true, data: updatedNiveau };
}
export async function deleteNiveau(id: string) {
  if (!id) {
    throw new Error("L'identifiant du niveau est requis.");
  }

  await prisma.niveau.delete({
    where: { id },
  });

  return { success: true };
}

export async function getNiveau() {
  const niveau = await prisma.niveau.findMany({
    include: {
      grades: true,
    },
  });

  return { success: true, data: niveau };
}

export async function syncTeacherSubjects(gradeId: string, formateurId: string | null) {
  try {
    if (!formateurId || formateurId === "none") {
      // If no formateur linked, remove all TeacherSubject records for this grade
      await prisma.teacherSubject.deleteMany({
        where: { gradeId },
      });
      return;
    }

    // Find the user ID associated with this formateur
    const formateur = await prisma.formateur.findUnique({
      where: { id: formateurId },
      select: { userId: true },
    });

    if (!formateur || !formateur.userId) {
      // If formateur doesn't have a linked user, we can't link subjects as a "teacher" (User)
      // but we should probably clear old links if the new formateur has no user
      await prisma.teacherSubject.deleteMany({
        where: { gradeId },
      });
      return;
    }

    const userId = formateur.userId;

    // Get all subjects for this grade
    const subjects = await prisma.subject.findMany({
      where: { gradeId },
      select: { id: true },
    });

    // Remove links that are not for this teacher for this grade
    await prisma.teacherSubject.deleteMany({
      where: {
        gradeId,
        teacherId: { not: userId },
      },
    });

    // Add missing links for this teacher
    if (subjects.length > 0) {
      await prisma.$transaction(
        subjects.map((sub) =>
          prisma.teacherSubject.upsert({
            where: {
              teacherId_subjectId_gradeId: {
                teacherId: userId,
                subjectId: sub.id,
                gradeId: gradeId,
              },
            },
            create: {
              teacherId: userId,
              subjectId: sub.id,
              gradeId: gradeId,
            },
            update: {},
          }),
        ),
      );
    }
  } catch (error) {
    console.error("Error syncing teacher subjects:", error);
  }
}

//---------------------------------------------- classes --------------------------------------------------

export async function createClasse(
  name: string,
  price: number,
  formateurId?: string,
  documents?: File,
) {
  if (!name || name.trim() === "") {
    throw new Error("Le nom du niveau est requis.");
  }
  const handler = getCorrectId(name);

  // Upload document if provided
  let documentUrl: string | null = null;
  if (documents) {
    const { uploadDocument } = await import("@/actions/cours");
    documentUrl = await uploadDocument(documents);
  }

  const niveau = await prisma.grade.create({
    data: {
      name: name.trim(),
      handler,
      price,
      documents: documentUrl,
      niveauId: "cmnejx9n400000sc0xim2f0ht",
      formateurId: formateurId === "none" ? null : formateurId,
    },
  });

  // Sync teacher subjects
  await syncTeacherSubjects(niveau.id, formateurId || null);

  return { success: true, data: niveau };
  // or return a success value instead
}
export async function updateClasse(
  id: string,
  price: number,
  name: string,
  niveauId: string,
  formateurId?: string,
  documents?: File,
) {
  if (!id || !name || !niveauId || name.trim() === "") {
    throw new Error("ID, nom et niveau sont requis.");
  }

  // Upload document if provided
  let documentUrl: string | null | undefined = undefined;
  if (documents) {
    const { uploadDocument } = await import("@/actions/cours");
    documentUrl = await uploadDocument(documents);
  }

  const updatedGrade = await prisma.grade.update({
    where: { id },
    data: {
      name: name.trim(),
      price,
      niveauId,
      formateurId: formateurId === "none" ? null : formateurId,
      ...(documentUrl !== undefined && { documents: documentUrl }),
    },
  });

  // Sync teacher subjects
  await syncTeacherSubjects(id, formateurId || null);

  return { success: true, data: updatedGrade };
}

export async function deleteClasse(id: string) {
  if (!id) {
    throw new Error("L'identifiant du niveau est requis.");
  }

  await prisma.grade.delete({
    where: { id },
  });

  return { success: true };
}

//---------------------------------------------- matiére --------------------------------------------------

export async function createSubject(
  name: string,
  color: string,
  handler: string,
  gradeId: string,
  description: string,
) {
  if (!name || !color || !gradeId) {
    throw new Error("Nom, couleur et classe (gradeId) sont requis.");
  }
  const hand = getCorrectId(handler);
  const subject = await prisma.subject.create({
    data: {
      name: name.trim(),
      handler: hand,
      color: color.trim(),
      gradeId,
      description,
    },
  });

  // Sync teacher subjects for the grade if it has a formateur
  const grade = await prisma.grade.findUnique({
    where: { id: gradeId },
    select: { formateurId: true },
  });
  if (grade?.formateurId) {
    await syncTeacherSubjects(gradeId, grade.formateurId);
  }

  return { success: true, data: subject };
}

export async function updateSubject(
  id: string,
  name: string,
  color: string,
  handler: string,
  gradeId: string,
  description: string,
) {
  if (!id || !name || !color || !gradeId) {
    throw new Error(
      "Tous les champs sont requis pour mettre à jour la matière.",
    );
  }

  const hand = getCorrectId(handler);

  const updatedSubject = await prisma.subject.update({
    where: { id },
    data: {
      handler: hand,
      name: name.trim(),
      color: color.trim(),
      gradeId,
      description,
    },
  });

  // Sync teacher subjects for the grade if it has a formateur
  const grade = await prisma.grade.findUnique({
    where: { id: gradeId },
    select: { formateurId: true },
  });
  if (grade?.formateurId) {
    await syncTeacherSubjects(gradeId, grade.formateurId);
  }

  return { success: true, data: updatedSubject };
}

export async function deleteSubject(id: string) {
  if (!id) {
    throw new Error("L'identifiant de la matière est requis.");
  }

  await prisma.subject.delete({
    where: { id },
  });

  return { success: true };
}

//---------------------------------------------- cours --------------------------------------------------

export async function createCourse({
  title,
  content,
  videoUrl,
  coverImage,
  handler,
  index,
  subjectId,
}: {
  title: string;
  content?: string;
  videoUrl?: string;
  coverImage?: string;
  handler: string;
  index: number;
  subjectId: string;
}) {
  if (!title || !handler || !subjectId) {
    throw new Error("Titre, identifiant (handler) et matière sont requis.");
  }

  const course = await prisma.course.create({
    data: {
      title: title.trim(),
      content: content?.trim(),
      videoUrl,
      coverImage,
      handler: handler.trim(),
      index,
      subjectId,
    },
  });

  return { success: true, data: course };
}
