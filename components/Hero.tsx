interface HeroProps {
  className?: string;
}

export default function Hero({ className }: HeroProps) {
  // Homepage campaign hero content will go here.
  return <div className={className}>Hero</div>;
}
