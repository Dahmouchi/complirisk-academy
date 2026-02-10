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
import { Separator } from "../ui/separator";
import { toast } from "react-toastify";
import { createNewDemande } from "@/app/(user)/_actions/createNewDemande";
import { useRouter } from "next/navigation";

export default function ExplorePage({ matieres, user, pendingDemande }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"courses" | "explore">("explore");
  const [exploreCategory, setExploreCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [cart, setCart] = useState<any[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const addToCart = (grade: any) => {
    if (userGradeIds.has(grade.id)) {
      toast.info("Vous possédez déjà ce grade.");
      return;
    }
    if (pendingDemande) {
      toast.warning("Vous avez déjà une demande en attente.");
      return;
    }
    if (cart.find((item) => item.id === grade.id)) {
      toast.info("Déjà dans votre sélection.");
      return;
    }
    setCart([...cart, grade]);
    toast.success(`${grade.name} ajouté à votre sélection.`);
  };

  const removeFromCart = (gradeId: string) => {
    setCart(cart.filter((item) => item.id !== gradeId));
  };

  const totalCartPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price || 0), 0);
  }, [cart]);

  const handleSubmitDemande = () => {
    if (cart.length === 0) return;

    startTransition(async () => {
      try {
        const result = await createNewDemande(
          user.id,
          cart.map((item) => item.id),
        );

        if (result.success) {
          toast.success("Votre demande a été créée avec succès!");
          setCart([]);
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
            <div>
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
                <SheetTrigger asChild>
                  <Button
                    variant="default"
                    className="relative gap-2 bg-primary hover:bg-primary/90 shadow-lg"
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
                  <SheetHeader>
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

                  <div className="flex-1 overflow-y-auto py-6 px-4 space-y-4">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground opacity-60">
                        <ShoppingCart className="h-12 w-12 mb-2" />
                        <p>Votre sélection est vide</p>
                      </div>
                    ) : (
                      cart.map((item) => (
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredExploreCourses.map((grade: any, index: any) => {
              const alreadyOwned = userGradeIds.has(grade.id);
              const alreadyInCart = cart.some((c) => c.id === grade.id);

              return (
                <div
                  key={grade.id}
                  className="group relative bg-white border border-border rounded-[6px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="h-2 w-full bg-blue-600" />

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 rounded-lg bg-primary/5">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <Badge
                        variant={alreadyOwned ? "outline" : "default"}
                        className={cn(
                          "text-[10px] font-bold uppercase",
                          alreadyOwned
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "bg-primary/10 text-primary border-primary/20",
                        )}
                      >
                        {alreadyOwned ? "Acquis" : `${grade.price} MAD`}
                      </Badge>
                    </div>

                    <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {grade.name}
                    </h3>

                    <div className="space-y-3 pt-2 mb-6">
                      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                        <BookOpen className="h-3 w-3" />
                        Matières incluses :
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {grade.subjects?.slice(0, 3).map((sub: any) => (
                          <span
                            key={sub.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-secondary-foreground"
                          >
                            {sub.name}
                          </span>
                        ))}
                        {grade.subjects?.length > 4 && (
                          <span className="text-[10px] text-muted-foreground ml-1">
                            +{grade.subjects.length - 4} plus
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 flex gap-2">
                      {alreadyOwned ? (
                        <Button
                          variant="ghost"
                          className="w-full gap-2 text-green-600 cursor-default hover:bg-transparent"
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
                            "w-full gap-2 rounded-xl transition-all",
                            alreadyInCart && "border-primary text-primary",
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
                              Ajouter
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
                Nous n&apos;avons pas trouvé de formation correspondant à vos
                critères de recherche.
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
    </div>
  );
}
