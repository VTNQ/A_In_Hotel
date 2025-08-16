// src/components/EventPromotion/FullWidthImage.tsx
type Props = {
  src: string;
  alt?: string;
};

export default function FullWidthImage({ src, alt = "" }: Props) {
  return (
    <section className="w-full">
      <img
        src={src}
        alt={alt}
        className="w-full h-auto object-cover"
        loading="lazy"
      />
    </section>
  );
}
