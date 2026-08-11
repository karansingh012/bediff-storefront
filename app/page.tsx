import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import ProductGrid from "@/components/ProductGrid";

interface HomePageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default function HomePage({ searchParams }: HomePageProps) {
  // Homepage composition for hero merchandising, product discovery, and email capture.
  void searchParams;

  return (
    <main>
      <Hero />
      <ProductGrid />
      <Newsletter />
    </main>
  );
}

