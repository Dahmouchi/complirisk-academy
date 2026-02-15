import prisma from "@/lib/prisma";
import React from "react";
import ClassesPage from "../../_components/classes";
//import NiveauxPage from "../../_components/niveaux";

const Niveaux = async () => {
  let niveaux: Awaited<ReturnType<typeof prisma.niveau.findMany>> = []; // Infer type from Prisma

  niveaux = await prisma.niveau.findMany({
    include: {
      grades: true,
    },
  });
  let grades: Awaited<ReturnType<typeof prisma.grade.findMany>> = []; // Infer type from Prisma

  grades = await prisma.grade.findMany({
    include: {
      niveau: true,
      subjects: true,
      formateur: true,
    },
  });

  let formateurs: Awaited<ReturnType<typeof prisma.formateur.findMany>> = []; // Infer type from Prisma

  formateurs = await prisma.formateur.findMany();

  return (
    <div className="">
      <ClassesPage niveauxx={niveaux} classe={grades} formateurs={formateurs} />
    </div>
  );
};

export default Niveaux;
