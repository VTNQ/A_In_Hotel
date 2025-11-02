import React, { useEffect, useId, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertAction {
  label: string;
  onClick?: () => void;
  autoFocus?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

export interface AlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string | React.ReactNode;
  type?: AlertType;
  closable?: boolean;
  /** Auto-close after N ms (e.g., 4000). Disabled if undefined. */
  autoClose?: number;
  primaryAction?: AlertAction;
  secondaryAction?: AlertAction;
  /** Panel size */
  size?: "sm" | "md" | "lg";
}

const tone = {
  success: {
    badge: "bg-green-500/10 text-green-700 ring-1 ring-green-500/30",
    accent: "from-green-500/80 to-emerald-500/80",
    icon: "text-green-600",
  },
  error: {
    badge: "bg-red-500/10 text-red-700 ring-1 ring-red-500/30",
    accent: "from-rose-500/85 to-red-500/80",
    icon: "text-red-600",
  },
  warning: {
    badge: "bg-yellow-400/10 text-yellow-800 ring-1 ring-yellow-500/30",
    accent: "from-amber-500/85 to-yellow-500/80",
    icon: "text-yellow-600",
  },
  info: {
    badge: "bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/30",
    accent: "from-sky-500/85 to-blue-500/80",
    icon: "text-blue-600",
  },
} as const;

const iconMap: Record<AlertType, React.ReactNode> = {
  success: <CheckCircle className="h-6 w-6" aria-hidden />,
  error: <AlertCircle className="h-6 w-6" aria-hidden />,
  warning: <AlertTriangle className="h-6 w-6" aria-hidden />,
  info: <Info className="h-6 w-6" aria-hidden />,
};

function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

export function AlertModal({
  open,
  onOpenChange,
  title,
  description,
  type = "info",
  closable = true,
  autoClose,
  primaryAction,
  secondaryAction,
  size = "md",
}: AlertModalProps) {
  const titleId = useId();
  const descId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // Sizes
  const maxWidth = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-lg" : "max-w-md";

  // Auto close
  useEffect(() => {
    if (!open || !autoClose) return;
    const t = setTimeout(() => onOpenChange(false), autoClose);
    return () => clearTimeout(t);
  }, [open, autoClose, onOpenChange]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // Simple focus trap
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const el = panelRef.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (focusable.length === 0) return;
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        (last || first).focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        (first || last).focus();
      }
    };

    el.addEventListener("keydown", onKeyDown as any);
    return () => el.removeEventListener("keydown", onKeyDown as any);
  }, [open]);

  if (typeof window === "undefined") return null;

  const t = tone[type];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Dim/overlay with subtle blur */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
          />

          {/* Panel */}
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descId : undefined}
            tabIndex={-1}
            ref={panelRef}
            className={`absolute left-1/2 top-1/2 w-[92vw] ${maxWidth} -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-white/60 bg-white/85 shadow-[0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl ring-1 ring-black/5`}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: reduced ? "tween" : "spring", duration: reduced ? 0.18 : 0.28, stiffness: 420, damping: 30 }}
          >
            {/* Accent bar */}
            <div className={`h-1.5 bg-gradient-to-r ${t.accent}`} />

            {/* Header */}
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl ${t.badge}`}>
                  <span className={`${t.icon}`}>{iconMap[type]}</span>
                </div>
                <div className="flex-1">
                  <h2 id={titleId} className="text-base font-semibold tracking-tight text-neutral-900">
                    {title}
                  </h2>
                  {description && (
                    <div id={descId} className="mt-1 text-sm leading-6 text-neutral-600">
                      {description}
                    </div>
                  )}
                </div>

                {closable && (
                  <button
                    aria-label="Close"
                    onClick={() => onOpenChange(false)}
                    className="rounded-lg p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-black/30"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Footer */}
              {(primaryAction || secondaryAction) && (
                <div className="mt-5 flex justify-end gap-2">
                  {secondaryAction && (
                    <ActionButton {...secondaryAction} onClose={() => onOpenChange(false)} />
                  )}
                  {primaryAction && (
                    <ActionButton {...primaryAction} onClose={() => onOpenChange(false)} />
                  )}
                </div>
              )}
            </div>

            {/* Auto-close progress */}
            {autoClose && (
              <motion.div
                className={`h-1 w-full bg-gradient-to-r ${t.accent}`}
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                style={{ transformOrigin: "left" }}
                transition={{ duration: reduced ? 0 : (autoClose / 1000), ease: "linear" }}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function ActionButton({ label, onClick, autoFocus, variant = "primary", onClose }:
  { label: string; onClick?: () => void; autoFocus?: boolean; variant?: "primary" | "secondary" | "ghost"; onClose: () => void }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/30 transition";
  const styles: Record<string, string> = {
    primary: "bg-neutral-900 text-white hover:bg-neutral-800",
    secondary: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
    ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100",
  };
  return (
    <button
      autoFocus={autoFocus}
      className={`${base} ${styles[variant]}`}
      onClick={() => {
        onClick?.();
        onClose();
      }}
    >
      {label}
    </button>
  );
}
