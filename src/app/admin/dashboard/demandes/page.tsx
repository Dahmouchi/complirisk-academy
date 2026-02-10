import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getDemandes } from "@/actions/demande";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  DollarSign,
  TrendingUp,
  CreditCard,
} from "lucide-react";

export default async function DemandesPage() {
  const result = await getDemandes();
  const demandes = result.success ? result.data : [];

  // Calculate stats
  const stats = demandes.reduce(
    (acc, demande) => {
      const amount = demande.totalPrice || 0;
      const status = demande.status;

      acc[status] = (acc[status] || 0) + amount;
      acc[`${status}_count`] = (acc[`${status}_count`] || 0) + 1;
      acc.total_amount += amount;
      acc.total_count += 1;

      return acc;
    },
    {
      APPROVED: 0,
      PENDING: 0,
      REJECTED: 0,
      CANCELLED: 0,
      APPROVED_count: 0,
      PENDING_count: 0,
      REJECTED_count: 0,
      CANCELLED_count: 0,
      total_amount: 0,
      total_count: 0,
    },
  );

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MAD",
  });

  return (
    <div className="flex flex-col gap-8 p-6 bg-[#f8fafc] min-h-screen">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-gray-900">
            Gestion des Demandes d&apos;Inscription
          </h1>
        </div>
        <p className="text-muted-foreground ml-11">
          Consultez et gérez les demandes d&apos;inscription des étudiants.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approuvées
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatter.format(stats.APPROVED)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {stats.APPROVED_count} demandes traitées
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En Attente
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatter.format(stats.PENDING)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {stats.PENDING_count} demandes à vérifier
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejetées
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <XCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatter.format(stats.REJECTED)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {stats.REJECTED_count} demandes refusées
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 w-1 h-full bg-slate-400" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Annulées
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
              <Ban className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatter.format(stats.CANCELLED)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              {stats.CANCELLED_count} demandes annulées
            </p>
          </CardContent>
        </Card>
      </div>

      <main className="bg-white p-6 rounded-2xl shadow-sm border-none overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-gray-900">
            Liste des Demandes
          </h2>
        </div>
        <DataTable columns={columns} data={demandes} />
      </main>
    </div>
  );
}
