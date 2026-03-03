import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getDemandesPackEntreprise } from "@/actions/demande-pack-entreprise";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  Clock,
  PhoneCall,
  Building2,
  Ban,
} from "lucide-react";

export default async function DemandesEntreprisePage() {
  const result = await getDemandesPackEntreprise();
  const demandes = result.success ? result.data : [];

  // ── Stats ──────────────────────────────────────────────────────────────────
  const counts = demandes.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] ?? 0) + 1;
      acc.total += 1;
      return acc;
    },
    {
      PENDING: 0,
      CONTACTED: 0,
      APPROVED: 0,
      REJECTED: 0,
      CANCELLED: 0,
      total: 0,
    } as Record<string, number>,
  );

  const statCards = [
    {
      label: "Total reçues",
      value: counts.total,
      sub: "demandes entreprise",
      icon: Building2,
      bar: "bg-primary",
      icon_bg: "bg-primary/10 text-primary",
    },
    {
      label: "En attente",
      value: counts.PENDING,
      sub: "à traiter",
      icon: Clock,
      bar: "bg-amber-500",
      icon_bg: "bg-amber-50 text-amber-600",
    },
    {
      label: "Contactées",
      value: counts.CONTACTED,
      sub: "en cours de traitement",
      icon: PhoneCall,
      bar: "bg-blue-500",
      icon_bg: "bg-blue-50 text-blue-600",
    },
    {
      label: "Devis envoyés",
      value: counts.APPROVED,
      sub: "approuvées",
      icon: CheckCircle,
      bar: "bg-emerald-500",
      icon_bg: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Rejetées",
      value: counts.REJECTED,
      sub: "non retenues",
      icon: XCircle,
      bar: "bg-red-500",
      icon_bg: "bg-red-50 text-red-600",
    },
    {
      label: "Annulées",
      value: counts.CANCELLED,
      sub: "sans suite",
      icon: Ban,
      bar: "bg-slate-400",
      icon_bg: "bg-slate-100 text-slate-500",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 bg-[#f8fafc] min-h-screen">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Demandes Pack Entreprise
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Gérez les demandes de formation intra-entreprise soumises depuis
              la landing page.
            </p>
          </div>
        </div>
      </header>

      {/* ── Stats grid ──────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card
            key={card.label}
            className="relative border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${card.bar}`} />
            <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 pl-5">
              <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">
                {card.label}
              </CardTitle>
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${card.icon_bg} group-hover:scale-110 transition-transform`}
              >
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="pl-5">
              <div className="text-2xl font-bold text-gray-900">
                {card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <main className="bg-white p-6 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-gray-900">
            Liste des Demandes
          </h2>
          {counts.PENDING > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
              {counts.PENDING}
            </span>
          )}
        </div>
        <DataTable columns={columns} data={demandes} />
      </main>
    </div>
  );
}
