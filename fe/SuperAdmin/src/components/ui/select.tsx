"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectTrigger({
  className,
  size = "md",
  fullWidth = true,
  error,
  children,
  rightAdornment,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: Size;
  fullWidth?: boolean;
  error?: boolean;
  rightAdornment?: React.ReactNode;
}) {
  return (
    <SelectPrimitive.Trigger
      aria-invalid={error ? true : undefined}
      className={cn(
        "flex items-center justify-between gap-2 rounded-md border bg-background shadow-xs outline-none transition",
        "hover:bg-accent/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
      
        size === "sm" && "h-9 px-3 text-sm min-w-[120px]",
        size === "md" && "h-10 px-3.5 text-sm min-w-[160px]",
        size === "lg" && "h-11 px-4 text-base min-w-[200px]",
    
        fullWidth ? "w-full" : "w-auto",
      
        error &&
          "border-destructive/70 focus-visible:ring-destructive/25 focus-visible:border-destructive",
      
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {/* nút clear / icon khác */}
      {rightAdornment}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="opacity-60" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        className={cn(
          "relative z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "w-[var(--radix-select-trigger-width)]",
          className
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1 text-muted-foreground">
          <ChevronUp className="size-4" />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="max-h-[320px] p-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1 text-muted-foreground">
          <ChevronDown className="size-4" />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none",
        "cursor-default data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

type SelectFieldProps<T> = {
  items: T[];
  value?: string | null;
  onChange?: (val: string | null, item?: T) => void;
  placeholder?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  getValue: (item: T) => string;
  getLabel: (item: T) => React.ReactNode;
  emptyText?: string;
};

function SelectField<T>({
  items,
  value,
  onChange,
  placeholder = "Chọn…",
  label,
  description,
  error,
  size = "md",
  fullWidth = true,
  disabled,
  clearable,
  getValue,
  getLabel,
  emptyText = "Không có dữ liệu",
}: SelectFieldProps<T>) {
  const selected = React.useMemo(
    () => items.find((i) => getValue(i) === (value ?? "")),
    [items, value, getValue]
  );

  // nút clear: span chứ không phải button
  const rightAdornment =
    clearable && value ? (
      <span
        role="button"
        tabIndex={0}
        className="group -mr-1 rounded p-1 hover:bg-muted/60 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onChange?.(null, undefined);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
            e.preventDefault();
            onChange?.(null, undefined);
          }
        }}
      >
        <X className="size-4 opacity-60 group-hover:opacity-100" />
      </span>
    ) : null;

  return (
    <div className={cn(fullWidth && "w-full")}>
      {label && <label className="mb-1.5 block text-sm font-medium">{label}</label>}

      <Select
        value={value ?? ""}
        onValueChange={(v) => {
          const item = items.find((i) => getValue(i) === v) as T | undefined;
          onChange?.(v || null, item);
        }}
      >
        <SelectTrigger
          size={size}
          fullWidth={fullWidth}
          disabled={disabled}
          error={!!error}
          rightAdornment={rightAdornment}
        >
          <SelectPrimitive.Value placeholder={placeholder}>
            {selected ? getLabel(selected) : null}
          </SelectPrimitive.Value>
        </SelectTrigger>

        <SelectContent>
          {items.length === 0 ? (
            <SelectItem value="__empty" disabled>
              {emptyText}
            </SelectItem>
          ) : (
            items.map((item) => (
              <SelectItem key={getValue(item)} value={getValue(item)}>
                {getLabel(item)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      {description && !error && (
        <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectField,
};
