import { authOptions } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "../_components/LoginForm";

export default async function AuthButton() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/admin/dashboard");
  }
  return (
    <div
      className="flex h-screen w-full items-center relative justify-center bg-gray-900 bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url("/compli/bg-login.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute top-0 w-full h-[16vh] flex items-center justify-center z-20">
        <div className="bg-gray-100/20 backdrop-blur-xs border-x-2 border-b-2 border-gray-200 h-full p-4 rounded-b-[8px] lg:w-1/3 w-full flex items-center justify-center text-center shadow-2xl">
          <h1 className="text-4xl font-bold text-white  uppercase">
            Espace Administrateur
          </h1>
        </div>
      </div>
      <div className="w-full h-full bg-black/20 absolute top-0"></div>
      <div className="rounded-[8px] bg-white/30 border-2 bg-opacity-50 px-16 py-10 shadow-lg backdrop-blur-xs max-sm:px-8">
        <div className="">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
