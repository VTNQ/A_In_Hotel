import React, { useEffect, useState } from "react";

export interface RoomSection {
  title: string;
  rows: { label: string; value: string }[];
}
export interface RoomDetailsData {
  name: string;
  headline: string;
  description: string;
  images: string[];
  ctaLabel?: string;
  sections?: RoomSection[];
}
interface RoomDetailsModalProps {
  open: boolean;
  onClose: () => void;
  data: RoomDetailsData;
}

/* ===== Inline icons ===== */
const CloseIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Chevron = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
    <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Dot = ({ active }: { active: boolean }) => (
  <span className={`mx-1 inline-block h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-white/60"}`} />
);

/* ===== Helpers ===== */
const pairSections = (sections: RoomSection[] = []) => {
  const out: RoomSection[][] = [];
  sections.forEach((s, i) => {
    if (i % 2 === 0) out.push([s]);
    else out[out.length - 1].push(s);
  });
  return out;
};

const RoomDetailsModal: React.FC<RoomDetailsModalProps> = ({ open, onClose, data }) => {
  const [idx, setIdx] = useState(0);
  const imgCount = data.images?.length ?? 0;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % imgCount);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + imgCount) % imgCount);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, imgCount]);

  useEffect(() => {
    if (open) setIdx(0);
  }, [open]);

  if (!open) return null;

  const prev = () => setIdx((i) => (i - 1 + imgCount) % imgCount);
  const next = () => setIdx((i) => (i + 1) % imgCount);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-hidden={!open}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="pointer-events-auto relative mx-auto mt-6 flex max-h-[92vh] w-[clamp(320px,92vw,940px)] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-neutral-900 px-4 py-3 text-white">
          <h2 className="text-base font-medium">{data.name}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-md bg-white/10 hover:bg-white/20"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Carousel */}
        <div className="relative aspect-[16/10] w-full bg-black">
          {data.images?.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${data.name} ${i + 1}`}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {imgCount > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/55"
              >
                <Chevron className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/55"
              >
                <Chevron className="h-5 w-5 rotate-180" />
              </button>
              <div className="absolute left-1/2 bottom-3 -translate-x-1/2 rounded-full bg-black/40 px-3 py-2">
                {data.images.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} aria-label={`Go to image ${i + 1}`}>
                    <Dot active={i === idx} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Body (new layout) */}
        <div className="overflow-y-auto p-6 text-neutral-800">
          {/* Headline + CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-semibold">{data.headline}</h3>
            {data.ctaLabel && (
              <button className="rounded-full bg-neutral-800 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700">
                {data.ctaLabel}
              </button>
            )}
          </div>

          {/* Description */}
          <p className="mt-3 text-sm leading-6 text-neutral-700">{data.description}</p>

          {/* Sections as 2‑col rows with separators */}
          {!!data.sections?.length && (
            <div className="mt-4">
              {pairSections(data.sections).map((row, rIdx) => (
                <div
                  key={rIdx}
                  className="grid gap-x-10 gap-y-6 border-t border-neutral-200 py-6 md:grid-cols-2"
                >
                  {row.map((s, cIdx) => (
                    <div key={cIdx}>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center rounded-full border border-neutral-300 text-[10px] text-neutral-600">
                          ☰
                        </span>
                        <span className="text-sm font-semibold text-neutral-900">{s.title}</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        {s.rows.map((r, i) =>
                          r.label?.trim() ? (
                            <div key={i} className="flex items-start justify-between gap-4">
                              <span className="text-neutral-600">{r.label}</span>
                              <span className="text-neutral-900">{r.value}</span>
                            </div>
                          ) : (
                            <div key={i} className="text-neutral-900">
                              {r.value}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                  {row.length === 1 && <div className="hidden md:block" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsModal;
