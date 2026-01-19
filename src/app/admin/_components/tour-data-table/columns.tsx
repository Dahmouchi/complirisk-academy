/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Ban,
  CheckCircle,
  HelpCircle,
  MoreHorizontal,
  UserCheck,
} from "lucide-react";
import { toast } from "react-toastify";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => row.getValue("code") ?? "—",
  },

  {
    accessorKey: "user.name", // Not used for value but helps identify
    header: "Nom",
    cell: ({ row }) => {
      const user = row.original.user; // ✅ Access nested user object
      const nom = user?.name ?? "—";
      return <div>{nom}</div>;
    },
  },

  {
    accessorKey: "user.prenom",
    header: "Prénom",
    cell: ({ row }) => {
      const user = row.original.user;
      const prenom = user?.prenom ?? "—";
      return <div>{prenom}</div>;
    },
  },
  {
    accessorKey: "user.email", // Not used for value but helps identify
    header: "Email",
    cell: ({ row }) => {
      const user = row.original.user; // ✅ Access nested user object
      const nom = user?.email ?? "—";
      return <div>{nom}</div>;
    },
  },
  {
    accessorKey: "user.phone",
    header: "Télé",
    cell: ({ row }) => {
      const user = row.original.user;
      const prenom = user?.phone ?? "—";
      return <div>{prenom}</div>;
    },
  },
  {
    accessorKey: "usedAt",
    header: "Date de réservation",
    cell: ({ row }) => {
      if (row.getValue("usedAt")) {
        return (
          <div>
            {new Date(row.getValue("usedAt")).toLocaleString("fr-FR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        );
      } else {
        return "—";
      }
    },
  },
  {
    accessorKey: "isUsed",
    accessorFn: (row) => (row.isUsed ? "true" : "false"),

    header: "Utilisé",
    cell: ({ row }) => {
      const status = row.getValue("isUsed");

      return (
        <div>
          {status === "true" ? (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 border-2 border-green-600 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="mr-1.5 h-3 w-3" />
              Oui
            </div>
          ) : (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 border-2 border-red-600 text-red-800 dark:bg-red-900 dark:text-red-200">
              <Ban className="mr-1.5 h-3 w-3" />
              Non
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "user.archive", // Using accessorFn
    header: "Statut",
    cell: ({ row }) => {
      const user = row.original.user; // Access nested user object
      if (!user) return "—"; // default if no user

      const status = row.original.user.archive || false; // Default to 'awaiting' if not set

      if (status === false) {
        return (
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 border-2 border-blue-600 text-blue-800 dark:bg-blue-900 dark:text-blue-200`}
          >
            <UserCheck className="mr-1.5 h-3 w-3" />
            actif
          </div>
        );
      } else {
        return (
          <div>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 border-2 border-red-600 text-red-800 dark:bg-red-900 dark:text-red-200`}
            >
              <HelpCircle className="mr-1.5 h-3 w-3" />
              Suspendu
            </div>
          </div>
        );
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const code = row.original.code; // Assumes the row has a `code` field

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4 cursor-pointer z-50" />
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

            {/* Copier le code */}
            <DropdownMenuItem
              className="p-2 font-medium rounded text-blue-600 hover:bg-gray-100 hover:cursor-pointer focus-visible:outline-0"
              onSelect={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(code);
                toast.success("Code copié dans le presse-papiers");
              }}
            >
              Copier le code
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
