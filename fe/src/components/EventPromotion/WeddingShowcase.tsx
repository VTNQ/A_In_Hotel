import { useMemo, useState } from "react";

type Slide = { src: string; alt?: string };
type Props = {
  eyebrow?: string;
  title?: string;
  description?: React.ReactNode;
  slides?: Slide[]; // có thể truyền nhiều ảnh, mặc định 1 ảnh bạn đưa
  className?: string;
};

export default function WeddingShowcase({
  eyebrow = "WEDDING CEREMONIES",
  title = "Iconic Five-Star Wedding Venue",
  description = (
    <>
      Tie the knot at our downtown Saigon hotel, let our treasured wedding venues elevate your
      special day. Sheraton Saigon Grand Opera Hotel boasts prime location, elegant settings,
      refined dining options and professional wedding specialists tailoring everything to your
      needs. From large celebrations up to 650 guests at our pillarless Grand Ballroom to exotic
      ceremonies with 360-degree views in Night Spot at level 23 and plenty of additional spaces
      for ceremonies or intimate gatherings, everything you've imagined is curated to perfection.
    </>
  ),
  slides = [
    {
      src: "https://cache.marriott.com/content/dam/marriott-renditions/SGNSI/sgnsi-grand-ballroom-wedding-0893-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1920px:*",
      alt: "Grand Ballroom wedding setup",
    },
  ],
  className = "",
}: Props) {
  // đảm bảo có ít nhất 1 slide
  const items = useMemo(
    () => (slides.length ? slides : [{ src: "", alt: "wedding" }]),
    [slides]
  );
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  const progress = ((index + 1) / items.length) * 100;

  return (
    <section className={`relative ${className}`}>
      {/* Layout: trái panel chữ (nền tối), phải ảnh */}
      <div className="grid min-h-[70vh] grid-cols-1 md:grid-cols-12">
        {/* Left panel */}
        <div className="bg-[#3a3a3a] text-white md:col-span-5 flex">
          <div className="mx-auto max-w-xl px-8 py-10 lg:px-12 lg:py-14 self-center">
            <div className="text-[12px] tracking-[0.22em] text-gray-300">
              {eyebrow}
            </div>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{title}</h2>
            <p className="mt-6 text-[17px] leading-8 text-gray-200">{description}</p>
          </div>
        </div>

        {/* Right image */}
        <div className="relative md:col-span-7">
          <img
            key={items[index].src}
            src={items[index].src}
            alt={items[index].alt ?? `Slide ${index + 1}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />

          {/* Controls overlay dưới (chỉ hiện ở md↑ cho đúng bố cục) */}
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 hidden select-none md:flex items-center justify-between text-white">
            {/* Prev */}
            <div className="pointer-events-auto">
              <button
                onClick={prev}
                className="group flex items-center gap-3"
                aria-label="Previous slide"
              >
                <span>Prev</span>
                <span className="h-px w-16 bg-white/80 transition group-hover:w-20" />
              </button>
            </div>

            {/* Progress 01 —— 02 */}
            <div className="flex items-center gap-3 text-sm">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="relative h-[3px] w-24 bg-white/40 rounded">
                <div
                  className="absolute inset-y-0 left-0 rounded bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{String(items.length).padStart(2, "0")}</span>
            </div>

            {/* Next */}
            <div className="pointer-events-auto">
              <button
                onClick={next}
                className="group flex items-center gap-3"
                aria-label="Next slide"
              >
                <span className="h-px w-16 bg-white/80 transition group-hover:w-20" />
                <span>Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls cho mobile (stack dưới ảnh) */}
      <div className="md:hidden bg-[#3a3a3a] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button onClick={prev} className="flex items-center gap-3">
            <span>Prev</span>
            <span className="h-px w-12 bg-white/80" />
          </button>
          <div className="flex items-center gap-3 text-sm">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div className="relative h-[3px] w-24 bg-white/40 rounded">
              <div
                className="absolute inset-y-0 left-0 rounded bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{String(items.length).padStart(2, "0")}</span>
          </div>
          <button onClick={next} className="flex items-center gap-3">
            <span className="h-px w-12 bg-white/80" />
            <span>Next</span>
          </button>
        </div>
      </div>
    </section>
  );
}
