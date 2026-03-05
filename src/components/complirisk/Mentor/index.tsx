import Image from "next/image";

type Formateur = {
  id: string;
  fullName: string;
  bio?: string | null;
  specialite: string;
  image?: string | null;
};

type MentorProps = {
  formateurs: Formateur[];
};

const Mentor = ({ formateurs }: MentorProps) => {
  if (formateurs.length === 0) return null;

  return (
    <section id="mentors-section" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-center">
              Notre collège d&apos;experts
            </h2>
            <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
              CompliRisk Academy fédère un réseau d&apos;experts certifiés
              intervenant selon les thématiques et les programmes. Les profils
              présentés ci-dessous représentent une partie des expertises
              mobilisées au sein de l&apos;Academy.
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div
          className={`grid gap-8 ${
            formateurs.length === 1
              ? "flex justify-center"
              : formateurs.length === 2
                ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
                : formateurs.length === 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {formateurs.map((formateur) => (
            <div
              key={formateur.id}
              className={`group relative shadow-xl rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-2xl transition-all duration-300 ${
                formateurs.length === 1 ? "max-w-md w-full" : ""
              }`}
            >
              {/* Image */}
              <div className="h-72 w-full overflow-hidden bg-gray-100">
                {formateur.image ? (
                  <Image
                    src={formateur.image}
                    alt={formateur.fullName}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                    <span className="text-5xl font-bold text-primary/50">
                      {formateur.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                {/* Name */}
                <h3 className="text-xl font-bold text-gray-900 text-center">
                  {formateur.fullName}
                </h3>

                {/* Specialite */}
                <p className="text-sm text-primary font-semibold text-center">
                  {formateur.specialite}
                </p>

                {/* Bio */}
                {formateur.bio && (
                  <p className="text-gray-500 text-sm text-center line-clamp-3">
                    {formateur.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mentor;
