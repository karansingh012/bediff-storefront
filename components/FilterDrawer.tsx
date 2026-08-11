interface FilterDrawerProps {
  isOpen?: boolean;
}

export default function FilterDrawer({ isOpen = false }: FilterDrawerProps) {
  // Mobile and desktop product filters will go here.
  return <div>FilterDrawer {isOpen ? "open" : "closed"}</div>;
}
