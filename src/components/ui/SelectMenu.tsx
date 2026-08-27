"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectMenuOption {
  value: string;
  label: string;
}

interface SelectMenuProps {
  value: string;
  options: SelectMenuOption[];
  onChange: (value: string) => void;
  /** Static text shown before the selected label, e.g. "Sort:". */
  prefix?: string;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  ariaLabel?: string;
}

/**
 * Storefront dropdown. Deliberately separate from the admin's CustomSelect:
 * that one is styled for the dark dashboard, this one for the light shop.
 * Supports keyboard navigation (arrows / Home / End / Enter / Escape).
 */
export default function SelectMenu({
  value,
  options,
  onChange,
  prefix,
  placeholder = "Select…",
  className = "",
  buttonClassName = "",
  ariaLabel,
}: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (open) setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  // Keep the highlighted row in view when arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  const commit = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (!open) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter") {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((current) => (current - 1 + options.length) % options.length);
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`flex w-full items-center justify-between gap-2 rounded-full border bg-am-card px-4 py-2.5 text-left text-sm transition-colors ${
          open ? "border-am-gold" : "border-am-line hover:border-am-line-strong"
        } ${buttonClassName}`}
      >
        <span className="truncate">
          {prefix && <span className="text-am-muted">{prefix} </span>}
          <span className={selected ? "font-medium text-am-ink" : "text-am-muted"}>
            {selected?.label || placeholder}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-am-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* The panel grows leftward from the trigger and is capped to the
          viewport, so a long option label can never widen the page. */}
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-max min-w-full max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-am-line bg-am-card shadow-[0_20px_50px_-20px_rgba(23,20,15,0.45)]">
          <ul ref={listRef} role="listbox" className="max-h-64 overflow-y-auto py-1">
            {options.map((option, index) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commit(index)}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                      isSelected ? "font-medium text-am-gold" : "text-am-ink-soft"
                    } ${index === activeIndex ? "bg-am-bg-alt" : ""}`}
                  >
                    {option.label}
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
