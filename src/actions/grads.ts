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

//---------------------------------------------- classes --------------------------------------------------

export async function createClasse(name: string, price: number) {
  if (!name || name.trim() === "") {
    throw new Error("Le nom du niveau est requis.");
  }
  const handler = getCorrectId(name);
  const niveau = await prisma.grade.create({
    data: {
      name: name.trim(),
      handler,
      price,
      niveauId: "cmk1e7ue6000h0sroci9i2ev2",
    },
  });
  return { success: true, data: niveau };
  // or return a success value instead
}
export async function updateClasse(
  id: string,
  price: number,
  name: string,
  niveauId: string,
) {
  if (!id || !name || !niveauId || name.trim() === "") {
    throw new Error("ID, nom et niveau sont requis.");
  }

  const updatedGrade = await prisma.grade.update({
    where: { id },
    data: {
      name: name.trim(),
      price,
      niveauId,
    },
  });

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
