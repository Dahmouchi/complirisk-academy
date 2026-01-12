/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { getSession, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters.",
  }),
});
const LoginForm = () => {
  const [isView, setIsView] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      username: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await signIn("username-only", {
      username: values.username.toLowerCase(),
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error);
      setLoading(false);
    } else {
      await update();
      setLoading(false);
      redirect("/teacher/dashboard");
    }
  }

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="min-w-xs">
      {/* Sign Up Form */}
      <div className="">
        <div className="pb-8">
          <div className="mt-5 w-full flex items-center justify-center ">
            <Link href="/" className="lg:flex">
              <img src="/cinq/logoH.png" alt="" className="w-26 h-auto" />
            </Link>
          </div>
          <div className="w-full flex items-center justify-center mt-4">
            <div className="border-b-[1px] border border-gray-100 w-full"></div>
            <div className="text-xs text-gray-100 text-center w-full">
              Espace Enseignant{" "}
            </div>

            <div className="border-b-[1px] border border-gray-100 w-full"></div>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8  w-full "
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identifiant</FormLabel>
                  <FormControl>
                    <Input
                      className="dark:bg-slate-900 text-white placeholder-slate-300"
                      placeholder="Entrez votre identifiant"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="dark:bg-slate-900 text-white placeholder-slate-300"
                        type={isView ? "text" : "password"}
                        id="password"
                        placeholder="Entrez votre mot de passe"
                        {...field}
                      />
                      {isView ? (
                        <Eye
                          className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-100"
                          onClick={() => {
                            setIsView(!isView);
                          }}
                        />
                      ) : (
                        <EyeOff
                          className="absolute right-4 top-3 w-4 h-4 z-10 cursor-pointer text-gray-100"
                          onClick={() => setIsView(!isView)}
                        />
                      )}
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-start">
              <Button
                type="submit"
                className="w-full rounded-full py-3 bg-blue-500 border-2 text-white hover:bg-blue-700 cursor-pointer"
              >
                Soumettre
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
