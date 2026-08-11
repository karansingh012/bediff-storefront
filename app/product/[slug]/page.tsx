interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Product detail route will load product data, gallery, size selection, and cart actions.
  return <div>ProductDetail {slug}</div>;
}
