"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Check, X, Trash } from "lucide-react";
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
import { toast } from "react-toastify";
import {
  approveDemande,
  rejectDemande,
  deleteDemande,
} from "@/actions/demande";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "user",
    header: "Utilisateur",
    accessorFn: (row) =>
      `${row.user.name} ${row.user.prenom} ${row.user.email}`,
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {user.name} {user.prenom}
          </span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "grades",
    header: "Classes séléctionnées",
    cell: ({ row }) => {
      const grades = row.original.grades;
      return (
        <div className="flex flex-wrap gap-1">
          {grades.map((dg: any) => (
            <Badge key={dg.id} variant="secondary" className="text-[10px]">
              {dg.grade.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Prix Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPrice"));
      const formatted = new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency: "MAD",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      switch (status) {
        case "PENDING":
          return (
            <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none">
              En attente
            </Badge>
          );
        case "APPROVED":
          return (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
              Approuvée
            </Badge>
          );
        case "REJECTED":
          return (
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-none">
              Rejetée
            </Badge>
          );
        case "CANCELLED":
          return (
            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-none">
              Annulée
            </Badge>
          );
        default:
          return <Badge variant="outline">{status}</Badge>;
      }
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date de demande",
    cell: ({ row }) => {
      return (
        <div className="text-xs">
          {format(new Date(row.getValue("createdAt")), "dd MMM yyyy HH:mm", {
            locale: fr,
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const demande = row.original;

      const onApprove = async () => {
        const res = await approveDemande(demande.id);
        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error(res.error);
        }
      };

      const onReject = async () => {
        const res = await rejectDemande(demande.id);
        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error(res.error);
        }
      };

      const onDelete = async () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
          const res = await deleteDemande(demande.id);
          if (res.success) {
            toast.success(res.message);
          } else {
            toast.error(res.error);
          }
        }
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {demande.status === "PENDING" && (
              <>
                <DropdownMenuItem
                  onClick={onApprove}
                  className="text-green-600 cursor-pointer"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Approuver
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onReject}
                  className="text-yellow-600 cursor-pointer"
                >
                  <X className="mr-2 h-4 w-4" />
                  Rejeter
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600 cursor-pointer"
            >
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
