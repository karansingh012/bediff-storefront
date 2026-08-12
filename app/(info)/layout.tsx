export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[70vh] bg-white">
      <div className="mx-auto max-w-content px-4 md:px-6 py-12 md:py-24">
        {children}
      </div>
    </div>
  );
}
