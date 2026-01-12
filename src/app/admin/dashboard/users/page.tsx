import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getDashboardUsers } from "@/actions/client";
import { CreateTeacherDialog } from "../../_components/AddTeacher";
import { getAvailableSubjects } from "@/actions/teacher";

async function getUsers(): Promise<any[]> {
  const data = await getDashboardUsers();
  return data.data;
}

const Users = async () => {
  const users: any[] = await getUsers();
  console.log(users);
  return (
    <>
      <header className="bg-white flex justify-between items-center">
        <div className="">
          <h1 className="lg:text-3xl font-bold tracking-tight text-gray-900">
            Utilisateurs
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/dashboard/users/archive"
            className="text-sm text-blue-600 hover:underline"
          >
            Voir les utilisateurs archivés
          </Link>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <DataTable columns={columns} data={users} />
        </div>
      </main>
    </>
  );
};

export default Users;
