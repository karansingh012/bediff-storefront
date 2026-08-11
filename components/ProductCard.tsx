import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Product imagery, swatches, price, and quick actions will go here.
  return <div>ProductCard {product.name}</div>;
}
