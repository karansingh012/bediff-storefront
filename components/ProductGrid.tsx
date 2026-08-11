import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

interface ProductGridProps {
  className?: string;
}

export default function ProductGrid({ className }: ProductGridProps) {
  // Product listing, filters, sorting, and responsive grid behavior will go here.
  return (
    <div className={className}>
      <div>ProductGrid</div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
