// // components/ui/select.tsx
// "use client";

// import React, { createContext, useContext, useState } from "react";
// import { cn } from "@/lib/utils";

// type SelectContextValue = {
//   value: string | null;
//   setValue: (v: string) => void;
//   open: boolean;
//   setOpen: (v: boolean) => void;
// };

// const SelectContext = createContext<SelectContextValue | undefined>(undefined);

// export function Select({ children, defaultValue }: { children: React.ReactNode; defaultValue?: string }) {
//   const [value, setValue] = useState<string | null>(defaultValue ?? null);
//   const [open, setOpen] = useState(false);

//   return (
//     <SelectContext.Provider value={{ value, setValue, open, setOpen }}>
//       <div className="relative inline-block text-left w-full">{children}</div>
//     </SelectContext.Provider>
//   );
// }

// function useSelectContext() {
//   const ctx = useContext(SelectContext);
//   if (!ctx) throw new Error("Select components must be inside <Select>");
//   return ctx;
// }

// export function SelectTrigger({ children, className }: { children?: React.ReactNode; className?: string }) {
//   const { value, setOpen, open } = useSelectContext();
//   return (
//     <button
//       type="button"
//       onClick={() => setOpen(!open)}
//       className={cn(
//         "w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-black text-left",
//         "flex items-center justify-between gap-2",
//         className ?? ""
//       )}
//     >
//       <span>{value ?? children}</span>
//       <svg className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="none" aria-hidden>
//         <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//       </svg>
//     </button>
//   );
// }

// export function SelectValue({ placeholder }: { placeholder?: string }) {
//   const { value } = useSelectContext();
//   return <span>{value ?? placeholder}</span>;
// }

// export function SelectContent({ children, className }: { children: React.ReactNode; className?: string }) {
//   const { open } = useSelectContext();
//   if (!open) return null;

//   return (
//     <div className={cn("absolute mt-2 w-full rounded-md bg-gray-900/95 shadow-lg z-20", className ?? "")}>
//       <div className="max-h-56 overflow-auto py-1">{children}</div>
//     </div>
//   );
// }

// export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
//   const { setValue, setOpen } = useSelectContext();
//   return (
//     <div
//       role="option"
//       onClick={() => {
//         setValue(value);
//         setOpen(false);
//       }}
//       className="cursor-pointer px-3 py-2 text-sm text-white hover:bg-gray-800"
//     >
//       {children}
//     </div>
//   );
// }

"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

type SelectContextValue = {
  value: string | null;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

// ---------------------
// UPDATED SELECT (supports value & onValueChange)
// ---------------------
export function Select({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
}: {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
}) {
  const isControlled = controlledValue !== undefined;

  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(
    defaultValue ?? null
  );

  const [open, setOpen] = useState(false);

  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = (v: string) => {
    if (isControlled && onValueChange) {
      onValueChange(v);
    } else {
      setUncontrolledValue(v);
    }
  };

  return (
    <SelectContext.Provider value={{ value, setValue, open, setOpen }}>
      <div className="relative inline-block text-left w-full">{children}</div>
    </SelectContext.Provider>
  );
}

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select components must be inside <Select>");
  return ctx;
}

// ---------------------
// Trigger
// ---------------------
export function SelectTrigger({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { value, setOpen, open } = useSelectContext();

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      className={cn(
        "w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-black text-left",
        "flex items-center justify-between gap-2",
        className ?? ""
      )}
    >
      <span>{value ?? children}</span>

      <svg
        className="h-4 w-4 text-gray-300"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden
      >
        <path
          d="M6 8l4 4 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// ---------------------
// Value
// ---------------------
export function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = useSelectContext();
  return <span>{value ?? placeholder}</span>;
}

// ---------------------
// Content Dropdown
// ---------------------
export function SelectContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useSelectContext();

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute mt-2 w-full rounded-md bg-gray-900/95 shadow-lg z-20",
        className ?? ""
      )}
    >
      <div className="max-h-56 overflow-auto py-1">{children}</div>
    </div>
  );
}

// ---------------------
// Item
// ---------------------
export function SelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  const { setValue, setOpen } = useSelectContext();

  return (
    <div
      role="option"
      onClick={() => {
        setValue(value);
        setOpen(false);
      }}
      className="cursor-pointer px-3 py-2 text-sm text-white hover:bg-gray-800"
    >
      {children}
    </div>
  );
}
