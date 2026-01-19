import { NewsView } from "@/components/NewsView";

export default function NewsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Actualités & Événements</h1>
        <p className="text-muted-foreground">
          Restez informé des dernières actualités et événements de votre classe
        </p>
      </div>
      <NewsView />
    </div>
  );
}
