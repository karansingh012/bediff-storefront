import type { ReactNode } from "react";

interface AccordionItemProps {
  title?: string;
  children?: ReactNode;
}

export default function AccordionItem({ title = "AccordionItem", children }: AccordionItemProps) {
  // Product information accordion content will go here.
  return (
    <div>
      <div>{title}</div>
      {children}
    </div>
  );
}
