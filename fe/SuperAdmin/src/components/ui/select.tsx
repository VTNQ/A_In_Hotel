"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Size = "sm" | "md" | "lg"

/* ========== Root primitives ========== */
function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />
}

/* ========== Trigger ========== */
function SelectTrigger({
  className,
  size = "md",
  fullWidth = true,
  error,
  rightAdornment,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: Size
  fullWidth?: boolean
  error?: boolean
  rightAdornment?: React.ReactNode
}) {
  return (
    <SelectPrimitive.Trigger
      aria-invalid={error ? true : undefined}
      className={cn(
        "flex items-center justify-between gap-2 rounded-md border bg-background shadow-xs outline-none transition",
        "hover:bg-accent/30",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-10 px-3.5 text-sm",
        size === "lg" && "h-11 px-4 text-base",
        fullWidth ? "w-full" : "w-fit",
        error &&
          "border-destructive/70 focus-visible:ring-destructive/25 focus-visible:border-destructive",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">{children}</div>
      {rightAdornment}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="opacity-60" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/* ========== Content ========== */
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
          "w-[var(--radix-select-trigger-width)]", // 👈 full width theo trigger
          className
        )}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="max-h-[320px] p-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/* ========== Item, Label, Separator ========== */
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
  )
}

function SelectLabel(props: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className="px-2 py-1.5 text-xs text-muted-foreground"
      {...props}
    />
  )
}

function SelectSeparator(props: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return <SelectPrimitive.Separator className="my-1 h-px bg-border" {...props} />
}

/* ========== Scroll buttons ========== */
function SelectScrollUpButton(props: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className="flex items-center justify-center py-1 text-muted-foreground"
      {...props}
    >
      <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton(props: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className="flex items-center justify-center py-1 text-muted-foreground"
      {...props}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

/* ========== Helper & Field wrapper ========== */
function SelectHelper({ description, error }: { description?: React.ReactNode; error?: string }) {
  if (error) return <p className="mt-1.5 text-xs text-destructive">{error}</p>
  if (description) return <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
  return null
}

type SelectFieldProps<T> = {
  items: T[]
  value?: string | null
  onChange?: (val: string | null, item?: T) => void
  placeholder?: string
  label?: React.ReactNode
  description?: React.ReactNode
  error?: string
  size?: Size
  fullWidth?: boolean
  disabled?: boolean
  clearable?: boolean
  getValue: (item: T) => string
  getLabel: (item: T) => React.ReactNode
  emptyText?: string
}

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
  )

  const rightAdornment = clearable && value ? (
    <button
      type="button"
      className="group -mr-1 rounded p-1 hover:bg-muted/60"
      onClick={(e) => {
        e.stopPropagation()
        onChange?.(null, undefined)
      }}
    >
      <X className="size-4 opacity-60 group-hover:opacity-100" />
    </button>
  ) : null

  return (
    <div className={cn(fullWidth && "w-full")}>
      {label && <label className="mb-1.5 block text-sm font-medium">{label}</label>}

      <Select value={value ?? ""} onValueChange={(v) => onChange?.(v || null)}>
        <SelectTrigger
          size={size}
          fullWidth={fullWidth}
          disabled={disabled}
          error={!!error}
          rightAdornment={rightAdornment}
        >
          <SelectValue placeholder={placeholder}>
            {selected ? getLabel(selected) : null}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {items.length === 0 ? (
            <SelectItem value="__empty" disabled>
              {emptyText}
            </SelectItem>
          ) : (
            items.map((item) => {
              const v = getValue(item)
              return (
                <SelectItem key={v} value={v}>
                  {getLabel(item)}
                </SelectItem>
              )
            })
          )}
        </SelectContent>
      </Select>

      <SelectHelper description={description} error={error} />
    </div>
  )
}

/* ========== Export ========== */
export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  SelectField,
}
