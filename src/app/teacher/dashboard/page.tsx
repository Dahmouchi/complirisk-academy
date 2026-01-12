import { authOptions } from "@/lib/nextAuth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Loading from "@/components/Loading";
import SettingsPage from "@/components/Settings";
import Teacher from "@/components/teacher/Dashboard";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    return (
      <div className="">
        <Teacher user={user} />
      </div>
    );
  } else {
    return <Loading />;
  }
};

export default Dashboard;
