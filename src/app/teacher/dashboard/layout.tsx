import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import AccessDenied from "@/components/access";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session?.user) {
    redirect("/teacher/login");
  }
  if (session.user.role !== "TEACHER") {
    return <AccessDenied role={session.user.role} />;
  }
  return (
    <div className="">
      <div className="flex flex-1 flex-col gap-4 lg:p-4 pt-0 bg-[#fbfbf8] dark:bg-slate-900 rounded-lg border-x border-b shadow-[-4px_5px_10px_0px_rgba(0,_0,_0,_0.1)]">
        <div className="overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}
