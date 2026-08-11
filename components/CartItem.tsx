import type { CartItem as CartItemType } from "@/types/product";

interface CartItemProps {
  item?: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  // Individual cart line item controls will go here.
  return <div>CartItem {item?.name ?? "empty"}</div>;
}
