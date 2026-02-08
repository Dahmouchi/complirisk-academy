"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CourseDetailType } from "@/types/coursedetail";
import Link from "next/link";
import CourseDetailSkeleton from "../Skeleton/CourseDetail";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

interface Name {
  imageSrc: string;
  course: string;
  price: string;
  profession: string;
  category:
    | "iso-management"
    | "securite-information"
    | "conformite-reglementaire"
    | "gestion-risques";
}

const NamesList = () => {
  // -------------------------------------------------------------
  const [courseDetail, setCourseDetail] = useState<CourseDetailType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/data");
        if (!res.ok) throw new Error("Échec de la récupération des données.");
        const data = await res.json();
        setCourseDetail(data.CourseDetailData);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // -------------------------------------------------------------

  const [selectedButton, setSelectedButton] = useState<
    | "iso-management"
    | "securite-information"
    | "conformite-reglementaire"
    | "gestion-risques"
    | "all"
    | null
  >("iso-management");

  const isoManagement = courseDetail.filter(
    (name) => name.category === "iso-management",
  );
  const securiteInformation = courseDetail.filter(
    (name) => name.category === "securite-information",
  );
  const conformiteReglementaire = courseDetail.filter(
    (name) => name.category === "conformite-reglementaire",
  );
  const gestionRisques = courseDetail.filter(
    (name) => name.category === "gestion-risques",
  );

  let selectedNames: Name[] = [];
  if (selectedButton === "iso-management") {
    selectedNames = isoManagement;
  } else if (selectedButton === "securite-information") {
    selectedNames = securiteInformation;
  } else if (selectedButton === "conformite-reglementaire") {
    selectedNames = conformiteReglementaire;
  } else if (selectedButton === "gestion-risques") {
    selectedNames = gestionRisques;
  }

  const nameElements = selectedNames.map((name, index) => (
    <div
      id="Courses"
      key={index}
      className="shadow-lg rounded-xl group flex w-full"
    >
      <div className="py-5 lg:py-0 flex flex-col w-full">
        <div className="overflow-hidden rounded-lg bg-gray-100 h-[200px] w-full">
          <img
            src={name.imageSrc}
            alt={name.course}
            width={700}
            height={700}
            className="h-full w-full object-cover object-center group-hover:scale-125 transition duration-300 ease-in-out"
          />
        </div>
        <div className="p-4 flex flex-col justify-between gap-5 flex-1">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="block font-normal text-gray-900">{name.course}</p>
              <div className="block text-lg font-semibold text-success border-solid border-2 border-success rounded-md px-1">
                <p>{name.price}MAD</p>
              </div>
            </div>
            <Link href={"/"}>
              <p
                aria-hidden="true"
                className="text-xl font-semibold group-hover:text-primary group-hover:cursor-pointer"
              >
                {name.profession}
              </p>
            </Link>
          </div>
          <div className="flex justify-between border-solid border-2 rounded-md p-2">
            <p>
              {selectedButton === "gestion-risques"
                ? "8 Modules"
                : "12 Modules"}
            </p>
            <div className="flex flex-row space-x-4">
              <div className="flex">
                <Image
                  src={"/images/courses/account.svg"}
                  width={18}
                  height={20}
                  alt="participants"
                />
                <p className="text-lightgrey ml-1">85+</p>
              </div>
              <div className="flex">
                <Image
                  src={"/images/courses/Star.svg"}
                  width={18}
                  height={20}
                  alt="étoiles"
                />
                <p className="ml-1">4.7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <section id="courses-section">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-5 mb-4">
          <h2 className="font-bold tracking-tight">Formations Populaires</h2>
          <div>
            <button
              onClick={() => router.push("/courses")}
              className="bg-transparent cursor-pointer hover:bg-primary text-primary font-medium hover:text-white py-3 px-4 border border-primary hover:border-transparent rounded-sm duration-300"
            >
              Explorer Toutes les Formations
            </button>
          </div>
        </div>
        <div className="flex nowhitespace space-x-5 rounded-xl bg-white p-1 overflow-x-auto mb-4">
          {/* VUE DESKTOP */}
          <button
            onClick={() => setSelectedButton("iso-management")}
            className={
              "bg-white " +
              (selectedButton === "iso-management"
                ? "text-black border-b-2 border-primary"
                : "text-black/40") +
              " pb-2 text-lg hidden sm:block hover:cursor-pointer"
            }
          >
            Management ISO
          </button>
          <button
            onClick={() => setSelectedButton("securite-information")}
            className={
              "bg-white " +
              (selectedButton === "securite-information"
                ? "text-black border-b-2 border-primary"
                : "text-black/40") +
              " pb-2 text-lg hidden sm:block hover:cursor-pointer"
            }
          >
            Sécurité Information
          </button>
          <button
            onClick={() => setSelectedButton("conformite-reglementaire")}
            className={
              "bg-white " +
              (selectedButton === "conformite-reglementaire"
                ? "text-black border-b-2 border-primary"
                : "text-black/40") +
              " pb-2 text-lg hidden sm:block hover:cursor-pointer"
            }
          >
            Conformité
          </button>
          <button
            onClick={() => setSelectedButton("gestion-risques")}
            className={
              "bg-white " +
              (selectedButton === "gestion-risques"
                ? "text-black border-b-2 border-primary"
                : "text-black/40") +
              " pb-2 text-lg hidden sm:block hover:cursor-pointer"
            }
          >
            Gestion des Risques
          </button>

          {/* VUE MOBILE */}
          <Icon
            icon="mdi:certificate-outline"
            onClick={() => setSelectedButton("iso-management")}
            className={
              "text-5xl sm:hidden block " +
              (selectedButton === "iso-management"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-400")
            }
          />

          <Icon
            icon="mdi:shield-lock-outline"
            onClick={() => setSelectedButton("securite-information")}
            className={
              "text-5xl sm:hidden block " +
              (selectedButton === "securite-information"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-400")
            }
          />

          <Icon
            icon="mdi:file-document-check-outline"
            onClick={() => setSelectedButton("conformite-reglementaire")}
            className={
              "text-5xl sm:hidden block " +
              (selectedButton === "conformite-reglementaire"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-400")
            }
          />

          <Icon
            icon="mdi:chart-box-outline"
            onClick={() => setSelectedButton("gestion-risques")}
            className={
              "text-5xl sm:hidden block " +
              (selectedButton === "gestion-risques"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-400")
            }
          />
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <CourseDetailSkeleton key={i} />
              ))
            ) : nameElements.length > 0 ? (
              nameElements
            ) : (
              <p>Aucune donnée à afficher</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NamesList;
