"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Check,
  X,
  Trash,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import {
  updateDemandePackEntrepriseStatus,
  deleteDemandePackEntreprise,
} from "@/actions/demande-pack-entreprise";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  DemandePackEntreprise,
  DemandePackEntrepriseStatus,
} from "@prisma/client";
import { useState } from "react";

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: DemandePackEntrepriseStatus }) {
  const map: Record<
    DemandePackEntrepriseStatus,
    { label: string; className: string }
  > = {
    PENDING: {
      label: "En attente",
      className: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-none",
    },
    CONTACTED: {
      label: "Contacté",
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-none",
    },
    APPROVED: {
      label: "Devis envoyé",
      className:
        "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none",
    },
    REJECTED: {
      label: "Rejetée",
      className: "bg-red-100 text-red-800 hover:bg-red-100 border-none",
    },
    CANCELLED: {
      label: "Annulée",
      className: "bg-slate-100 text-slate-700 hover:bg-slate-100 border-none",
    },
  };

  const cfg = map[status] ?? { label: status, className: "" };
  return <Badge className={cfg.className}>{cfg.label}</Badge>;
}

// ─── Mode badge ───────────────────────────────────────────────────────────────

function ModeBadge({ mode }: { mode: string }) {
  const map: Record<string, string> = {
    PRESENTIEL: "Présentiel",
    CLASSE_VIRTUELLE: "Classe virtuelle",
    HYBRIDE: "Hybride",
  };
  return (
    <Badge variant="outline" className="text-xs">
      {map[mode] ?? mode}
    </Badge>
  );
}

// ─── Detail dialog ────────────────────────────────────────────────────────────

function DetailDialog({
  demande,
  open,
  onOpenChange,
}: {
  demande: DemandePackEntreprise;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function changeStatus(status: DemandePackEntrepriseStatus) {
    setLoading(true);
    const res = await updateDemandePackEntrepriseStatus(demande.id, status);
    setLoading(false);
    if (res.success) {
      toast.success(res.message);
      onOpenChange(false);
    } else {
      toast.error(res.error);
    }
  }

  const rows: [string, React.ReactNode][] = [
    ["Raison sociale", demande.raisonSociale],
    ["Secteur d'activité", demande.secteurActivite],
    ["Ville / Pays", demande.villePayse],
    ["Contact", demande.nomPrenom],
    ["Fonction", demande.fonction],
    [
      "Email",
      <a
        key="email"
        href={`mailto:${demande.emailProfessionnel}`}
        className="text-blue-600 underline"
      >
        {demande.emailProfessionnel}
      </a>,
    ],
    [
      "Téléphone",
      <a
        key="tel"
        href={`tel:${demande.telephone}`}
        className="text-blue-600 underline"
      >
        {demande.telephone}
      </a>,
    ],
    ["Thématique(s)", demande.thematiques],
    ["Population ciblée", demande.populationCiblee ?? "—"],
    [
      "Participants",
      demande.nombreParticipants
        ? `${demande.nombreParticipants} personnes`
        : "—",
    ],
    ["Mode", <ModeBadge key="mode" mode={demande.modeFormation} />],
    ["Newsletter", demande.consentementNewsletter ? "Oui" : "Non"],
    [
      "Date de demande",
      format(new Date(demande.createdAt), "dd MMM yyyy HH:mm", { locale: fr }),
    ],
    ["Statut", <StatusBadge key="status" status={demande.status} />],
    ...(demande.treatedAt
      ? [
          [
            "Traitée le",
            format(new Date(demande.treatedAt), "dd MMM yyyy HH:mm", {
              locale: fr,
            }),
          ] as [string, React.ReactNode],
        ]
      : []),
    ...(demande.rejectionReason
      ? [
          ["Motif de rejet", demande.rejectionReason] as [
            string,
            React.ReactNode,
          ],
        ]
      : []),
    ...(demande.notes
      ? [["Notes internes", demande.notes] as [string, React.ReactNode]]
      : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" lg:min-w-[70vw] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {demande.raisonSociale}
            <span className="ml-3">
              <StatusBadge status={demande.status} />
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {rows.map(([label, value]) => (
            <div
              key={label as string}
              className="flex gap-3 border-b pb-2 last:border-0"
            >
              <span className="w-40 shrink-0 text-muted-foreground font-medium">
                {label}
              </span>
              <span className="text-gray-800 flex-1">{value}</span>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-wrap gap-2 mt-4">
          {demande.status === "PENDING" && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="text-blue-600 border-blue-300"
                disabled={loading}
                onClick={() => changeStatus("CONTACTED")}
              >
                <PhoneCall className="mr-2 h-4 w-4" />
                Marquer Contacté
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={loading}
                onClick={() => changeStatus("APPROVED")}
              >
                <Check className="mr-2 h-4 w-4" />
                Devis envoyé
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-300"
                disabled={loading}
                onClick={() => changeStatus("REJECTED")}
              >
                <X className="mr-2 h-4 w-4" />
                Rejeter
              </Button>
            </>
          )}
          {demande.status === "CONTACTED" && (
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={loading}
              onClick={() => changeStatus("APPROVED")}
            >
              <Check className="mr-2 h-4 w-4" />
              Devis envoyé
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Actions cell ─────────────────────────────────────────────────────────────

function ActionsCell({ demande }: { demande: DemandePackEntreprise }) {
  const [detailOpen, setDetailOpen] = useState(false);

  async function changeStatus(status: DemandePackEntrepriseStatus) {
    const res = await updateDemandePackEntrepriseStatus(demande.id, status);
    if (res.success) toast.success(res.message);
    else toast.error(res.error);
  }

  async function handleDelete() {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer définitivement cette demande ?",
      )
    ) {
      const res = await deleteDemandePackEntreprise(demande.id);
      if (res.success) toast.success(res.message);
      else toast.error(res.error);
    }
  }

  return (
    <>
      <DetailDialog
        demande={demande}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => setDetailOpen(true)}
            className="cursor-pointer"
          >
            Voir les détails
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {demande.status === "PENDING" && (
            <>
              <DropdownMenuItem
                onClick={() => changeStatus("CONTACTED")}
                className="text-blue-600 cursor-pointer"
              >
                <PhoneCall className="mr-2 h-4 w-4" />
                Marquer Contacté
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => changeStatus("APPROVED")}
                className="text-emerald-600 cursor-pointer"
              >
                <Check className="mr-2 h-4 w-4" />
                Devis envoyé
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => changeStatus("REJECTED")}
                className="text-yellow-600 cursor-pointer"
              >
                <X className="mr-2 h-4 w-4" />
                Rejeter
              </DropdownMenuItem>
            </>
          )}
          {demande.status === "CONTACTED" && (
            <DropdownMenuItem
              onClick={() => changeStatus("APPROVED")}
              className="text-emerald-600 cursor-pointer"
            >
              <Check className="mr-2 h-4 w-4" />
              Devis envoyé
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 cursor-pointer"
          >
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

// ─── Column definitions ───────────────────────────────────────────────────────

export const columns: ColumnDef<DemandePackEntreprise>[] = [
  {
    accessorKey: "raisonSociale",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Entreprise
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-semibold text-gray-900">
          {row.original.raisonSociale}
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {row.original.secteurActivite} — {row.original.villePayse}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "nomPrenom",
    header: "Contact",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-gray-800">
          {row.original.nomPrenom}
        </div>
        <div className="text-xs text-muted-foreground">
          {row.original.fonction}
        </div>
        <div className="flex flex-col gap-0.5 mt-1">
          <a
            href={`mailto:${row.original.emailProfessionnel}`}
            className="text-xs text-blue-500 flex items-center gap-1 hover:underline"
          >
            <Mail className="h-3 w-3" />
            {row.original.emailProfessionnel}
          </a>
          <a
            href={`tel:${row.original.telephone}`}
            className="text-xs text-gray-500 flex items-center gap-1 hover:underline"
          >
            <Phone className="h-3 w-3" />
            {row.original.telephone}
          </a>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "thematiques",
    header: "Thématique",
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <div className="text-sm text-gray-700 line-clamp-2">
          {row.original.thematiques}
        </div>
        {row.original.nombreParticipants && (
          <div className="text-xs text-muted-foreground mt-1">
            {row.original.nombreParticipants} participants
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "modeFormation",
    header: "Mode",
    cell: ({ row }) => <ModeBadge mode={row.original.modeFormation} />,
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      return row.getValue(columnId) === filterValue;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-xs text-muted-foreground">
        {format(new Date(row.original.createdAt), "dd MMM yyyy", {
          locale: fr,
        })}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell demande={row.original} />,
  },
];
