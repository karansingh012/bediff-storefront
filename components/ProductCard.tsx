import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import ColorDots from "./ColorDots";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Format price with Indian Rupee formatting
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const primaryImage = product.images[0];

  return (
    <Link href={`/product/${product.slug}`} className="group block w-full focus:outline-none">
      {/* Image Container — aspect ratio matches editorial product photography */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F9F9F9]">
        {primaryImage && (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group-hover:scale-[1.03]"
          />
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4 flex flex-col">
        <h3 className="text-xs uppercase tracking-[0.05em] font-medium text-black">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{formatPrice(product.price)}</p>
        <ColorDots colors={product.colors} />
      </div>
    </Link>
  );
}
