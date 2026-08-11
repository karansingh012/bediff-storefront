interface CartDrawerProps {
  isOpen?: boolean;
}

export default function CartDrawer({ isOpen = false }: CartDrawerProps) {
  // Cart drawer, subtotal, and checkout entry point will go here.
  return <div>CartDrawer {isOpen ? "open" : "closed"}</div>;
}
