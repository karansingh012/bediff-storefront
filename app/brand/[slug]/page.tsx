import { notFound } from "next/navigation";

const validSlugs = ["story", "design", "performance"];

export default async function BrandInfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  const title = slug.replace("-", " ").toUpperCase();

  return (
    <main className="min-h-[60vh] max-w-content mx-auto px-4 md:px-6 py-24">
      <div className="max-w-2xl mx-auto text-center border-b border-border pb-12 mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-[0.1em] text-black">
          {title}
        </h1>
      </div>
      <div className="max-w-2xl mx-auto">
        <p className="text-sm text-gray-500 uppercase tracking-[0.05em] leading-relaxed text-center">
          BEDIFF BRAND EDITORIAL CONTENT FOR {title} WILL BE PLACED HERE.
        </p>
      </div>
    </main>
  );
}
