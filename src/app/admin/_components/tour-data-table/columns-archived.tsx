/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertTriangle,
  Archive,
  ArchiveRestore,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "react-toastify";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React from "react";
import { Button } from "@/components/ui/button";
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "active",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("active");
      const isActive = status === true;
      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm
          ${
            isActive
              ? "border border-green-500 bg-green-100 text-green-700"
              : "border border-red-500 bg-red-100 text-red-700"
          }`}
        >
          {isActive ? "Actif" : "Inactif"}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Titre",
    cell: ({ row }) => row.getValue("title") ?? "—",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const isNational = type === "NATIONAL";
      return (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm
            ${
              isNational
                ? "border border-blue-500 bg-blue-100 text-blue-700"
                : "border border-green-500 bg-green-100 text-green-700"
            }`}
        >
          {type === "NATIONAL" ? "National" : "International"}
        </span>
      );
    },
  },
  {
    accessorKey: "priceOriginal",
    header: "Prix d'origine",
    cell: ({ row }) => (
      <span style={{ whiteSpace: "nowrap" }}>
        {row.getValue("priceOriginal") ?? "—"} DH
      </span>
    ),
  },

  {
    accessorKey: "dateCard",
    header: "Date (carte)",
    cell: ({ row }) => row.getValue("dateCard") ?? "—",
  },
  {
    accessorKey: "durationDays",
    header: "Jours",
    cell: ({ row }) => {
      const days = row.getValue("durationDays");
      if (!days) return "—";
      return (
        <span className="inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-xs shadow">
          {typeof days === "number" ? `${days}` : "—"}
        </span>
      );
    },
  },
  {
    accessorKey: "accommodationType",
    header: "Hébergement",
    cell: ({ row }) => row.getValue("accommodationType") ?? "—",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="bg-white p-2 rounded-[8px] border-2 border-gray-300 z-50 shadow-lg"
          >
            <DropdownMenuLabel className="p-2 text-gray-500 font-bold">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="p-2 font-medium rounded hover:bg-gray-100 hover:cursor-pointer focus-visible:outline-0"
              onSelect={() => {
                window.location.href = `/admin/dashboard/tours/update/${row.original.id}`;
              }}
            >
              Voir détails / Modifier
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
