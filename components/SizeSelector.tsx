interface SizeSelectorProps {
  sizes?: string[];
  selectedSize?: string;
}

export default function SizeSelector({ sizes = [], selectedSize }: SizeSelectorProps) {
  // Product size selection and availability states will go here.
  return <div>SizeSelector {selectedSize ?? sizes.length}</div>;
}
