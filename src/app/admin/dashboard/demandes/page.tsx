import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getDemandes } from "@/actions/demande";

export default async function DemandesPage() {
  const result = await getDemandes();
  const demandes = result.success ? result.data : [];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 italic">
          Gestion des Demandes d&apos;Inscription
        </h1>
        <p className="text-muted-foreground">
          Consultez et gérez les demandes d&apos;inscription des étudiants.
        </p>
      </header>

      <main className="bg-white p-6 rounded-xl shadow-sm border">
        <DataTable columns={columns} data={demandes} />
      </main>
    </div>
  );
}
