export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  colors: string[];
  sizes: string[];
  images: string[];
  category: string;
}

export interface CartItem extends Product {
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}
