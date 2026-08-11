interface ColorDotsProps {
  colors?: string[];
}

export default function ColorDots({ colors = [] }: ColorDotsProps) {
  // Product color swatches will go here.
  return <div>ColorDots {colors.length}</div>;
}
