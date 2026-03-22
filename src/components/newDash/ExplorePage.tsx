"use client";
import { useMemo, useState, useTransition } from "react";
import LeftSidebar from "./LeftSidebar";
import {
  BookOpen,
  Compass,
  ShoppingCart,
  Plus,
  Trash2,
  CreditCard,
  GraduationCap,
  ChevronRight,
  Loader2,
  X,
  CheckCircle,
  Search,
  FileText,
  User,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { toast } from "react-toastify";
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  createDemandeFromCart,
} from "@/app/(user)/_actions/cartActions";
import { useRouter } from "next/navigation";
import { cancelDemande } from "@/app/(user)/_actions/createNewDemande";
import { ModifyDemandeDialog } from "@/app/(user)/_components/compli/ModifyDemandeDialog";
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
} from "../ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Mail, Phone, Edit, Package } from "lucide-react";
import Image from "next/image";

export default function ExplorePage({
  matieres,
  user,
  pendingDemande,
  initialCart,
}: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"courses" | "explore" | "lives">(
    "explore",
  );
  const [exploreCategory, setExploreCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);
  const [selectedGradeName, setSelectedGradeName] = useState<string>("");

  const allCourses = useMemo(() => [...matieres], [matieres]);

  const exploreCategoryList = useMemo(() => {
    const cats = Array.from(
      new Set(allCourses.map((c: any) => c.niveau?.name || "Général")),
    );
    return ["Tous", ...cats];
  }, [allCourses]);

  const filteredExploreCourses = useMemo(() => {
    return allCourses.filter((course: any) => {
      const matchesCategory =
        exploreCategory === "Tous" ||
        (course.niveau?.name || "Général") === exploreCategory;
      const matchesSearch =
        !searchQuery ||
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description &&
          course.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allCourses, exploreCategory, searchQuery]);

  // Map user's existing grades for easy lookup
  const userGradeIds = useMemo(() => {
    return new Set(user?.grades?.map((g: any) => g.id) || []);
  }, [user]);

  // Get cart items from initialCart
  const cart = useMemo(() => {
    return (
      initialCart?.items?.map((item: any) => ({
        id: item.grade.id,
        name: item.grade.name,
        price: item.priceAtAdd,
        ...item.grade,
      })) || []
    );
  }, [initialCart]);

  const addToCart = async (grade: any) => {
    startTransition(async () => {
      const result = await addToCartAction(grade.id);

      if (result.success) {
        toast.success(`${grade.name} ajouté à votre sélection.`);
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors de l'ajout");
      }
    });
  };

  const removeFromCart = async (gradeId: string) => {
    startTransition(async () => {
      const result = await removeFromCartAction(gradeId);

      if (result.success) {
        toast.success("Retiré de votre sélection");
        router.refresh();
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    });
  };

  const totalCartPrice = useMemo(() => {
    return cart.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
  }, [cart]);

  const handleSubmitDemande = () => {
    if (cart.length === 0) return;

    startTransition(async () => {
      try {
        const result = await createDemandeFromCart();

        if (result.success) {
          toast.success("Votre demande a été créée avec succès!");
          setIsSheetOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Une erreur s'est produite");
        }
      } catch (error) {
        toast.error(
          "Une erreur s'est produite lors de la création de la demande",
        );
      }
    });
  };

  const handleOpenModifyDialog = () => {
    if (pendingDemande?.id) {
      setIsModifyDialogOpen(true);
    }
  };

  const handleCancelDemande = async (demandeId: string) => {
    try {
      const res = await cancelDemande(demandeId);
      if (res.success) {
        toast.success("Demande annulée avec succès");
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error(
        "Une erreur s'est produite lors de l'annulation de la demande",
      );
    }
  };

  const handleModifySuccess = () => {
    router.refresh();
  };

  const handleOpenPdfDialog = (pdfUrl: string, gradeName: string) => {
    setSelectedPdfUrl(pdfUrl);
    setSelectedGradeName(gradeName);
    setPdfDialogOpen(true);
  };

  return (
    <div className="min-h-screen overflow-hidden pb-[50px]">
      {/* Left Sidebar */}
      <div className="flex h-[calc(100vh-80px)] lg:pb-0 pb-16 pt-[14px] md:pt-0 ">
        {/* Left Sidebar - Desktop only */}
        <aside className="w-20 border-r border-border hidden md:block">
          <div className="h-full">
            <LeftSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </aside>

        <div className=" space-y-8 p-4 md:p-8 overflow-y-scroll w-full ">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="w-full  pb-4">
              <h2 className="font-display text-2xl font-bold text-foreground flex items-center gap-3">
                <Compass className="h-6 w-6 text-primary" />
                Explorer le Catalogue
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Découvrez nos programmes de certification et formations
                spécialisées.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-background text-sm px-4 py-1.5 border-primary/20"
              >
                {allCourses.length} Packs disponibles
              </Badge>

              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild className="">
                  <Button
                    variant="default"
                    className="relative  gap-2 bg-primary hover:bg-primary/90 shadow-lg"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Ma Sélection
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-background animate-pulse">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md flex flex-col">
                  <SheetHeader className="border-b-2 border-gray-200">
                    <SheetTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-lg text-primary" />
                      <span className="text-lg">
                        Ma Sélection de Formations
                      </span>
                    </SheetTitle>
                    <SheetDescription>
                      Consultez les grades sélectionnés avant de soumettre votre
                      demande.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto py-4 px-4 space-y-4">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground opacity-60">
                        <ShoppingCart className="h-12 w-12 mb-2" />
                        <p>Votre sélection est vide</p>
                      </div>
                    ) : (
                      cart.map((item: any) => (
                        <div
                          key={item.id}
                          className="group p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors flex items-center justify-between gap-4"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-primary font-semibold">
                              {item.price} MAD
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="space-y-4 pt-4 px-4 pb-6 border-t border-border">
                      <div className="flex items-center justify-between font-bold text-lg">
                        <span>Total estimé</span>
                        <span className="text-primary">
                          {totalCartPrice.toFixed(2)} MAD
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground italic px-2">
                        * Le prix total sera confirmé après validation par
                        l&apos;administration.
                      </p>
                      <Button
                        className="w-full h-12 gap-2 text-base font-semibold shadow-md"
                        onClick={handleSubmitDemande}
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Traitement...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5" />
                            Soumettre ma Demande
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Search and Category chips */}
          <div className="flex flex-col md:flex-row gap-4 ">
            <div className="flex-1">
              <div className="relative group bg-white max-w-xl rounded-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher par grade ou mot-clé..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {pendingDemande && (
              <Card className="border-warning/30 bg-white lg:hidden block">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-warning animate-spin" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">
                        Demande en cours de traitement
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Votre demande est en cours d&apos;examen
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Steps */}
                  <div className="lg:flex hidden items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-muted-foreground">
                        Demande reçue
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 text-warning animate-spin" />
                      <span className="text-muted-foreground">
                        Vérification en cours
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      <span className="text-muted-foreground">
                        Accès accordé
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Selected Grades Summary */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <ShoppingCart className="h-4 w-4" />
                      <span>
                        Grades demandés ({pendingDemande.grades?.length || 0})
                      </span>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {pendingDemande.grades?.map((dg: any) => (
                        <div
                          key={dg.grade.id}
                          className="flex items-center justify-between text-sm bg-background/50 rounded-lg p-2"
                        >
                          <span className="truncate flex-1 mr-2">
                            {dg.grade.name}
                          </span>
                          <span className="font-semibold text-primary">
                            {dg.gradePrice} MAD
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Package className="h-4 w-4" />
                      <span>Récapitulatif</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Sous-total
                        </span>
                        <span>{pendingDemande.totalPrice.toFixed(2)} MAD</span>
                      </div>
                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          {pendingDemande.totalPrice.toFixed(2)} MAD
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>Pour procéder au paiement</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <a
                            href="mailto:formation@compliance-academy.ma"
                            className="text-sm font-medium hover:text-primary transition-colors"
                          >
                            formation@compliance-academy.ma
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Téléphone
                          </p>
                          <a
                            href="tel:+212661234567"
                            className="text-sm font-medium hover:text-primary transition-colors"
                          >
                            +212 6 61 23 45 67
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      className="w-full gap-2"
                      size="lg"
                      onClick={handleOpenModifyDialog}
                    >
                      <Edit className="h-4 w-4" />
                      Modifier ma Demande
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="w-full gap-2"
                          size="lg"
                          variant="destructive"
                        >
                          <X className="h-4 w-4" />
                          Annuler ma Demande
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Annuler ma Demande
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir annuler votre demande ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleCancelDemande(pendingDemande.id)
                            }
                            className="bg-red-500 text-white hover:bg-red-700"
                          >
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Vous pouvez ajouter ou retirer des grades de votre demande
                    avant l&apos;approbation.
                  </p>
                </CardContent>
              </Card>
            )}
            {/*<div className="flex flex-wrap gap-2">
               
              {exploreCategoryList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setExploreCategory(cat)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 border",
                    exploreCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground shadow-sm",
                  )}
                >
                  {cat}
                </button>
              ))}
            </div> */}
          </div>

          {/* Grades Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-3">
            {/* Pending Demande Progress Card */}
            <div
              className={cn(
                "",
                pendingDemande ? "col-span-2" : "lg:col-span-3",
              )}
            >
              <div
                className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 ${pendingDemande ? "xl:grid-cols-2" : "xl:grid-cols-3"}`}
              >
                {filteredExploreCourses.map((grade: any, index: any) => {
                  const alreadyOwned = userGradeIds.has(grade.id);
                  const alreadyInCart = cart.some(
                    (c: any) => c.id === grade.id,
                  );

                  return (
                    <div
                      key={grade.id}
                      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col border border-gray-100 hover:border-blue-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Top accent bar with gradient */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600" />

                      <div className="p-6 flex-1 flex flex-col">
                        {/* Header section with instructor info and price badge */}
                        <div className="flex justify-between items-start mb-5">
                          <div className="flex items-center gap-3">
                            {grade.formateur?.image ? (
                              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all">
                                <Image
                                  src={grade.formateur?.image}
                                  alt={grade.formateur?.fullName}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ring-2 ring-gray-100">
                                <User className="w-7 h-7 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-base font-semibold text-gray-900">
                                {grade.formateur?.fullName}
                              </CardTitle>
                              <CardDescription className="text-sm text-gray-500 mt-0.5">
                                {grade.formateur?.specialite}
                              </CardDescription>
                            </div>
                          </div>

                          <Badge
                            variant={alreadyOwned ? "outline" : "default"}
                            className={cn(
                              "text-xs font-semibold px-3 py-1 rounded-full",
                              alreadyOwned
                                ? "border-emerald-500 text-emerald-700 bg-emerald-50 shadow-sm"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-sm",
                            )}
                          >
                            {alreadyOwned ? "✓ Acquis" : `${grade.price} MAD`}
                          </Badge>
                        </div>

                        {/* Course title */}
                        <h3 className="font-display text-xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                          {grade.name}
                        </h3>

                        {/* Subjects section */}
                        <div className="space-y-3 mb-6">
                          <p className="text-xs font-semibold text-gray-600 flex items-center gap-2 uppercase tracking-wide">
                            <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                            Sections incluses
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {grade.subjects?.slice(0, 3).map((sub: any) => (
                              <span
                                key={sub.id}
                                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                              >
                                {sub.name}
                              </span>
                            ))}
                            {grade.subjects?.length > 3 && (
                              <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500">
                                +{grade.subjects.length - 3} autres
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-gray-100">
                          {grade.documents && (
                            <Button
                              variant="ghost"
                              className="w-full justify-center gap-2 rounded-lg bg-red-700 text-white hover:bg-red-800 hover:text-white transition-all shadow-sm hover:shadow-md font-medium"
                              onClick={() =>
                                handleOpenPdfDialog(grade.documents, grade.name)
                              }
                            >
                              <FileText className="h-4 w-4" />
                              Voir la description
                            </Button>
                          )}

                          {alreadyOwned ? (
                            <Button
                              variant="ghost"
                              className="w-full justify-center rounded-lg gap-2 bg-emerald-50 border-2 border-emerald-500 text-emerald-700 cursor-default hover:bg-emerald-50 font-semibold"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Déjà acquis
                            </Button>
                          ) : (
                            <Button
                              onClick={() => addToCart(grade)}
                              variant={alreadyInCart ? "outline" : "default"}
                              size="sm"
                              className={cn(
                                "w-full justify-center gap-2 rounded-lg transition-all font-semibold shadow-sm hover:shadow-md",
                                alreadyInCart
                                  ? "border-2 border-blue-600 text-blue-600 bg-blue-50 hover:bg-blue-100"
                                  : "bg-primary text-white hover:from-blue-700 hover:to-indigo-700",
                              )}
                              disabled={!!pendingDemande}
                            >
                              {alreadyInCart ? (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  Dans la sélection
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4" />
                                  Ajouter à la sélection
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredExploreCourses.length === 0 && (
                <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
                  <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Aucun pack trouvé
                  </h3>
                  <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                    Nous n&apos;avons pas trouvé de formation correspondant à
                    vos critères de recherche.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6 rounded-xl"
                    onClick={() => {
                      setSearchQuery("");
                      setExploreCategory("Tous");
                    }}
                  >
                    Tout voir
                  </Button>
                </div>
              )}
            </div>

            {/* Pending Demande Progress Card */}
            {pendingDemande && (
              <Card className="border-warning/30 bg-white hidden lg:block">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 text-warning animate-spin" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">
                        Demande en cours de traitement
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Votre demande est en cours d&apos;examen
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Steps */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-muted-foreground">
                        Demande reçue
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 text-warning animate-spin" />
                      <span className="text-muted-foreground">
                        Vérification en cours
                      </span>
                    </div>
                    <div className="flex items-center gap-2 opacity-50">
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      <span className="text-muted-foreground">
                        Accès accordé
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Selected Grades Summary */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <ShoppingCart className="h-4 w-4" />
                      <span>
                        Grades demandés ({pendingDemande.grades?.length || 0})
                      </span>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {pendingDemande.grades?.map((dg: any) => (
                        <div
                          key={dg.grade.id}
                          className="flex items-center justify-between text-sm bg-background/50 rounded-lg p-2"
                        >
                          <span className="truncate flex-1 mr-2">
                            {dg.grade.name}
                          </span>
                          <span className="font-semibold text-primary">
                            {dg.gradePrice} MAD
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Package className="h-4 w-4" />
                      <span>Récapitulatif</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Sous-total
                        </span>
                        <span>{pendingDemande.totalPrice.toFixed(2)} MAD</span>
                      </div>
                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          {pendingDemande.totalPrice.toFixed(2)} MAD
                        </span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>Pour procéder au paiement</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <a
                            href="mailto:formation@compliance-academy.ma"
                            className="text-sm font-medium hover:text-primary transition-colors"
                          >
                            formation@compliance-academy.ma
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Téléphone
                          </p>
                          <a
                            href="tel:+212661234567"
                            className="text-sm font-medium hover:text-primary transition-colors"
                          >
                            +212 6 61 23 45 67
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      className="w-full gap-2"
                      size="lg"
                      onClick={handleOpenModifyDialog}
                    >
                      <Edit className="h-4 w-4" />
                      Modifier ma Demande
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="w-full gap-2"
                          size="lg"
                          variant="destructive"
                        >
                          <X className="h-4 w-4" />
                          Annuler ma Demande
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Annuler ma Demande
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir annuler votre demande ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleCancelDemande(pendingDemande.id)
                            }
                            className="bg-red-500 text-white hover:bg-red-700"
                          >
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Vous pouvez ajouter ou retirer des grades de votre demande
                    avant l&apos;approbation.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Mini Cart Notification on Mobile/Bottom */}
      {cart.length > 0 && !isSheetOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
          <Button
            onClick={() => setIsSheetOpen(true)}
            className="h-14 lg:hidden rounded-full px-6 shadow-2xl bg-primary gap-3 text-lg"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="bg-white text-primary rounded-full h-7 w-7 flex items-center justify-center font-bold">
              {cart.length}
            </span>
          </Button>
        </div>
      )}

      {/* Modify Demande Dialog */}
      {pendingDemande?.id && (
        <ModifyDemandeDialog
          open={isModifyDialogOpen}
          onOpenChange={setIsModifyDialogOpen}
          demandeId={pendingDemande.id}
          currentGrades={
            pendingDemande.grades?.map((dg: any) => ({
              id: dg.grade.id,
              name: dg.grade.name,
              price: dg.gradePrice,
            })) || []
          }
          availableGrades={matieres}
          userGrades={user?.grades || []}
          onSuccess={handleModifySuccess}
        />
      )}

      {/* PDF Document Dialog */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent className="max-w-4xl lg:min-w-[70vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-primary" />
              {selectedGradeName} - Document
            </DialogTitle>
            <DialogDescription>
              Informations détaillées sur le grade {selectedGradeName}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden lg:px-6 px-2 pb-6">
            {selectedPdfUrl ? (
              <iframe
                src={selectedPdfUrl}
                className="w-full h-full rounded-lg border border-border"
                title={`${selectedGradeName} Document`}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  Aucun document disponible
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
