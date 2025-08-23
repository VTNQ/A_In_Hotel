import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Item = { src: string; alt?: string };
type Props = { images: Item[]; className?: string };

export default function EventGalleryCarousel({ images, className = "" }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const items = useMemo(
    () => images.map((it, i) => ({ ...it, alt: it.alt ?? `Image ${i + 1}` })),
    [images]
  );

  // Ẩn scrollbar webkit
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML =
      `.hide-scrollbar::-webkit-scrollbar{display:none;}`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[i] as HTMLElement | undefined;
    if (!child) return;
    child.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  const next = () => {
    const i = Math.min(index + 1, items.length - 1);
    setIndex(i);
    scrollToIndex(i);
  };
  const prev = () => {
    const i = Math.max(index - 1, 0);
    setIndex(i);
    scrollToIndex(i);
  };

  // Cập nhật index khi người dùng tự cuộn/kéo
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const children = Array.from(track.children) as HTMLElement[];
    const tRect = track.getBoundingClientRect();
    let bestI = 0, min = Infinity;
    children.forEach((el, i) => {
      const left = Math.abs(el.getBoundingClientRect().left - tRect.left);
      if (left < min) { min = left; bestI = i; }
    });
    if (bestI !== index) setIndex(bestI);
  };

  // Hỗ trợ bàn phím
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
  };

  return (
    <section className={className} aria-label="Event gallery carousel">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          ref={trackRef}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          tabIndex={0}
          className="
            hide-scrollbar flex gap-6 overflow-x-auto scroll-smooth
            snap-x snap-mandatory pb-3 outline-none
            [-ms-overflow-style:none] [scrollbar-width:none]
          "
        >
          {items.map((img, i) => (
            <div
              key={i}
              className="snap-start shrink-0 w-[85%] sm:w-[48%] lg:w-[32%] rounded"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-[360px] w-full object-cover rounded"
              />
            </div>
          ))}
        </div>

        {/* thanh tiến trình + nút mũi tên */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div className="relative h-[2px] w-full bg-gray-200">
                <div
                  className="absolute inset-y-0 left-0 bg-purple-500"
                  style={{ width: `${((index + 1) / items.length) * 100}%` }}
                />
              </div>
              <span>{String(items.length).padStart(2, "0")}</span>
            </div>
          </div>

          <div className="ml-6 flex items-center gap-10 text-sm">
            <button
              onClick={prev}
              disabled={index === 0}
              className="group flex items-center gap-3 disabled:opacity-40"
              aria-label="Previous slide"
            >
              <span className="text-gray-700">Prev</span>
              <span className="h-px w-14 bg-gray-400 transition group-hover:w-16" />
              <ArrowLeft className="h-4 w-4" />
            </button>

            <button
              onClick={next}
              disabled={index === items.length - 1}
              className="group flex items-center gap-3 disabled:opacity-40"
              aria-label="Next slide"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="h-px w-14 bg-gray-400 transition group-hover:w-16" />
              <span className="text-gray-700">Next</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
