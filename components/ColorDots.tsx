interface ColorDotsProps {
  colors?: string[];
  selectedColor?: string;
  onSelect?: (color: string) => void;
  className?: string;
}

export default function ColorDots({ colors = [], selectedColor, onSelect, className = "" }: ColorDotsProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className={`flex items-center gap-1.5 mt-2.5 ${className}`}>
      {colors.map((color) => {
        const bg = color.toLowerCase();
        const isSelected = color === selectedColor;
        
        return (
          <button
            key={color}
            type="button"
            onClick={(e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(color);
              }
            }}
            className={`rounded-full transition-all flex items-center justify-center ${
              isSelected ? "p-[2px] border border-black" : "p-0 border border-transparent hover:border-gray-300"
            }`}
            aria-label={`Select ${color}`}
            title={color}
          >
            <span
              className="block w-2.5 h-2.5 rounded-full border border-border"
              style={{ backgroundColor: bg === "white" ? "#ffffff" : bg }}
            />
          </button>
        );
      })}
    </div>
  );
}

