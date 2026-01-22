"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useState } from "react";
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  Save,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";
import ResetPassword from "@/components/ResetPassword";
import { updateTeacherInfo } from "@/actions/teacher";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Form schema
const settingsFormSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  prenom: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  phone: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

interface TeacherSettingsProps {
  user: any;
}

export default function TeacherSettings({ user }: TeacherSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      name: user.name || "",
      prenom: user.prenom || "",
      email: user.email || "",
      phone: user.phone || "",
    },
  });

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);
    try {
      const result = await updateTeacherInfo(
        user.id,
        data.name,
        data.prenom,
        data.email,
        data.phone || "",
      );

      if (result.success) {
        toast.success(
          result.message || "Informations mises à jour avec succès",
        );
        router.refresh();
      } else {
        toast.error(result.message || "Une erreur est survenue");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la mise à jour");
    } finally {
      setIsLoading(false);
    }
  }

  const initials =
    `${user.name?.[0] || ""}${user.prenom?.[0] || ""}`.toUpperCase();

  // Get unique subjects and grades
  const subjects = user.teacherSubjects?.map((ts: any) => ts.subject) || [];
  const uniqueSubjects = Array.from(
    new Map(subjects.map((s: any) => [s.id, s])).values(),
  );

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="rounded-full hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Paramètres du Compte
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Profile Overview Card */}
      <Card className="border border-border/50 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profil Enseignant
          </CardTitle>
          <CardDescription>
            Aperçu de votre profil et de vos informations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6 flex-wrap">
            <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-xl ring-2 ring-primary/10">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-2xl font-semibold">
                  {user.name} {user.prenom}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                    <Shield className="h-3 w-3 mr-1" />
                    Enseignant
                  </Badge>
                  {user.statut && (
                    <Badge
                      variant="outline"
                      className="border-green-500/50 text-green-600 dark:text-green-400"
                    >
                      Actif
                    </Badge>
                  )}
                </div>
              </div>

              {uniqueSubjects.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Matières enseignées:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSubjects.map((subject: any) => (
                      <Badge
                        key={subject.id}
                        variant="secondary"
                        style={{
                          backgroundColor: `${subject.color}20`,
                          color: subject.color,
                        }}
                        className="font-medium"
                      >
                        {subject.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border border-border/50 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Informations Personnelles
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations de base
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Nom
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Votre nom"
                          {...field}
                          className="border-border/50 focus:border-primary transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Prénom
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Votre prénom"
                          {...field}
                          className="border-border/50 focus:border-primary transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="email"
                        placeholder="votre.email@exemple.com"
                        {...field}
                        className="border-border/50 focus:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormDescription>
                      Cet email sera utilisé pour vous connecter
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      Téléphone
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+212 6XX XXX XXX"
                        {...field}
                        className="border-border/50 focus:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormDescription>
                      Numéro de téléphone (optionnel)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Password Reset Section */}
      <Card className="border border-border/50 shadow-lg bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Sécurité
          </CardTitle>
          <CardDescription>
            Gérez votre mot de passe et vos paramètres de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPassword id={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
