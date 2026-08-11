interface GalleryProps {
  images?: string[];
}

export default function Gallery({ images = [] }: GalleryProps) {
  // Product image gallery and media controls will go here.
  return <div>Gallery {images.length}</div>;
}
