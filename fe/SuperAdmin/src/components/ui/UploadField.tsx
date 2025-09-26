import { cn } from "@/lib/utils";
import { Camera, FileIcon, FileSpreadsheet, FileText, X, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./input";

type UploadVariant = "image" | "file";

type UploadFieldProps = {
  variant?: UploadVariant;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
  maxFiles?: number;
  defaultPreviewUrl?: string;
  value?: File | null;
  onChange?: (files: File[] | null) => void;
  zoomScale?: number;   // mức phóng to lens
  lensSize?: number;    // đường kính lens px
  enableModalZoom?: boolean;
};

const ACCEPT_DOCS = ".doc,.docx,.xls,.xlsx,.pdf";
const BYTES = (mb: number) => mb * 1024 * 1024;

const UploadField: React.FC<UploadFieldProps> = ({
  variant = "image",
  className,
  accept,
  maxSizeMB = 2,
  maxFiles = 5,
  defaultPreviewUrl = "/default.webp",
  value,
  onChange,
  zoomScale = 2,
  lensSize = 140,
  enableModalZoom = true,
}: UploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const imgBoxRef = useRef<HTMLDivElement | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  // lens state
  const [lensVisible, setLensVisible] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  const [bgSize, setBgSize] = useState({ w: 0, h: 0 });

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [mScale, setMScale] = useState(1);
  const [mOffset, setMOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  const acceptAttr = accept ?? (variant === "image" ? "image/*" : ACCEPT_DOCS);
  const multiple = variant === "file";

  const openPicker = () => inputRef.current?.click();

  const fmtSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024, sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const fileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (!ext) return <FileIcon className="h-4 w-4" />;
    if (["doc", "docx", "pdf"].includes(ext)) return <FileText className="h-4 w-4" />;
    if (["xls", "xlsx", "csv"].includes(ext)) return <FileSpreadsheet className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files ? Array.from(e.target.files) : [];
    applyFiles(picked);
  };

  const applyFiles = (incoming: File[]) => {
    setError(null);
    if (variant === "image") {
      const file = incoming[0] ?? null;
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn tệp hình ảnh (jpg, png, webp…).");
        onChange?.(null);
        return;
      }
      if (file.size > BYTES(maxSizeMB)) {
        setError(`Kích thước tối đa ${maxSizeMB}MB.`);
        onChange?.(null);
        return;
      }
      onChange?.([file]);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    // file docs
    const combined = [...files, ...incoming];
    const dedup = Array.from(new Map(combined.map((f) => [`${f.name}-${f.size}`, f])).values());
    if (dedup.length > maxFiles) {
      setError(`Chỉ cho phép tối đa ${maxFiles} tệp.`);
      return;
    }
    for (const f of dedup) {
      if (f.size > BYTES(maxSizeMB)) {
        setError(`"${f.name}" vượt quá ${maxSizeMB}MB.`);
        return;
      }
    }
    setFiles(dedup);
    onChange?.(dedup);
    if (inputRef.current) inputRef.current.value = "";
  };

  // cập nhật preview
  useEffect(() => {
    if (variant === "image") {
      if (value) {
        const nextUrl = URL.createObjectURL(value);
        setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return nextUrl; });
      } else {
        setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
      }
    }
    return () => {
      setPreviewUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
    };
  }, [value, variant]);

  // lens handlers
  const onMouseEnter = () => {
    if (!previewUrl || !imgBoxRef.current) return;
    const rect = imgBoxRef.current.getBoundingClientRect();
    setBgSize({ w: rect.width * zoomScale, h: rect.height * zoomScale });
    setLensVisible(true);
  };
  const onMouseLeave = () => setLensVisible(false);
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!lensVisible || !imgBoxRef.current) return;
    const rect = imgBoxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const half = lensSize / 2;
    const clampedX = Math.max(half, Math.min(x, rect.width - half));
    const clampedY = Math.max(half, Math.min(y, rect.height - half));
    setLensPos({ x: clampedX - half, y: clampedY - half });
    const bgX = clampedX * zoomScale - half;
    const bgY = clampedY * zoomScale - half;
    setBgPos({ x: -bgX, y: -bgY });
    setBgSize({ w: rect.width * zoomScale, h: rect.height * zoomScale });
  };

  // modal zoom handlers
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(v, max));
  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const next = clamp(mScale * factor, 1, 6);
    setMScale(next);
  };
  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault(); setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...mOffset };
  };
  const onMouseMoveModal: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x, dy = e.clientY - dragStart.current.y;
    setMOffset({ x: offsetStart.current.x + dx, y: offsetStart.current.y + dy });
  };
  const onMouseUp = () => setDragging(false);
  const resetZoom = () => { setMScale(1); setMOffset({ x: 0, y: 0 }); };

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setModalOpen(false); };
    if (modalOpen) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [modalOpen]);

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={acceptAttr}
        multiple={multiple}
        onChange={handleInputChange}
      />

      {variant === "image" ? (
        <div
          ref={imgBoxRef}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onMouseMove={onMouseMove}
          className="relative flex h-60 w-60 items-center justify-center overflow-hidden rounded-md border border-slate-300 bg-slate-50 select-none"
        >
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Xem trước" className="h-full w-full object-cover" />

              {/* nút kính lúp mở modal */}
              {enableModalZoom && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
                  title="Phóng to ảnh"
                  className="absolute left-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 shadow"
                >
                  <Search className="h-4 w-4" />
                </button>
              )}

              {/* nút mở picker */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); openPicker(); }}
                className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-white shadow ring-1 ring-slate-300"
              >
                <Camera className="h-4 w-4 text-slate-700" />
              </button>

              {/* lens */}
              {lensVisible && (
                <div
                  className="pointer-events-none absolute rounded-full ring-2 ring-white/70 shadow-lg"
                  style={{
                    width: lensSize, height: lensSize,
                    left: lensPos.x, top: lensPos.y,
                    backgroundImage: `url(${previewUrl})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: `${bgSize.w}px ${bgSize.h}px`,
                    backgroundPosition: `${bgPos.x}px ${bgPos.y}px`
                  }}
                />
              )}
            </>
          ) : (
            <>
              <img src={defaultPreviewUrl} alt="Mặc định"  className="h-full w-full object-cover" />
              <button type="button" onClick={openPicker}
                className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-white shadow ring-1 ring-slate-300">
                <Camera className="h-4 w-4 text-slate-700" />
              </button>
            </>
          )}
        </div>
      ) : (
        // variant = file
        <>
          <div onClick={openPicker}
            className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 p-4 text-center hover:border-slate-400 hover:bg-slate-50">
            <p className="text-sm text-slate-600">
              Kéo & thả tệp vào đây, hoặc <span className="font-medium underline">chọn tệp</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Hỗ trợ: {ACCEPT_DOCS} (tối đa {maxFiles} tệp, {maxSizeMB}MB/tệp)
            </p>
          </div>
          {files.length > 0 && (
            <ul className="divide-y divide-slate-200 overflow-hidden rounded-md border">
              {files.map((f, i) => (
                <li key={`${f.name}-${f.size}-${i}`} className="flex items-center gap-3 bg-white px-3 py-2">
                  {fileIcon(f.name)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-slate-500">{fmtSize(f.size)}</p>
                  </div>
                  <button type="button" onClick={() => {
                    const next = files.filter((_, idx) => idx !== i);
                    setFiles(next);
                    onChange?.(next.length ? next : null);
                  }} className="text-slate-500 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      {/* Modal */}
      {modalOpen && previewUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
          onClick={() => setModalOpen(false)}>
          <div className="relative max-h-[90%] max-w-[90%] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMoveModal}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onDoubleClick={resetZoom}>
            <img src={previewUrl} alt="Full" draggable={false}
              style={{
                transform: `translate(${mOffset.x}px,${mOffset.y}px) scale(${mScale})`,
                transition: dragging ? "none" : "transform 0.1s ease-out"
              }}
              className="select-none max-h-full max-w-full object-contain" />
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-black hover:bg-white shadow"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadField;
