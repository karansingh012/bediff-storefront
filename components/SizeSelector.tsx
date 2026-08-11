interface SizeSelectorProps {
  sizes?: string[];
  selectedSize?: string;
  onSelect?: (size: string) => void;
}

export default function SizeSelector({ sizes = [], selectedSize, onSelect }: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {sizes.map((size) => {
        const isSelected = size === selectedSize;
        return (
          <button
            key={size}
            type="button"
            onClick={() => onSelect?.(size)}
            className={`flex items-center justify-center min-w-12 h-10 px-3 text-xs uppercase tracking-[0.05em] border transition-colors ${
              isSelected
                ? "border-black bg-black text-white"
                : "border-border bg-white text-black hover:border-black"
            }`}
            aria-pressed={isSelected}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}

