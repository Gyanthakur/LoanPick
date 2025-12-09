"use client";

import React, {
  createContext,
  useContext,
  useState,
  MouseEventHandler,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function Dialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be inside <Dialog>");
  return ctx;
}

// export function DialogTrigger({
//   children,
//   asChild = false,
// }: {
//   children: React.ReactNode;
//   asChild?: boolean;
// }) {
//   const { setOpen } = useDialogContext();

//   if (React.isValidElement(children)) {
//     const originalClick = children.props.onClick as MouseEventHandler<any>;

//     const handleClick: MouseEventHandler<any> = (e) => {
//       if (originalClick) originalClick(e);
//       setOpen(true);
//     };

//     return React.cloneElement(children, { onClick: handleClick });
//   }

//   return (
//     <button onClick={() => setOpen(true)} className="px-3 py-1">
//       {children}
//     </button>
//   );
// }
export function DialogTrigger({
  children,
  asChild = false,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const { setOpen } = useDialogContext();

  if (React.isValidElement(children)) {
    type ChildProps = { onClick?: MouseEventHandler<any> };
    const child = children as React.ReactElement<ChildProps>;

    const originalClick = child.props.onClick;

    const handleClick: MouseEventHandler<any> = (e) => {
      if (originalClick) originalClick(e);
      setOpen(true);
    };

    return React.cloneElement(child, { onClick: handleClick });
  }

  return (
    <button onClick={() => setOpen(true)} className="px-3 py-1">
      {children}
    </button>
  );
}

export function DialogContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useDialogContext();

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        className
      )}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-gray-900/95 p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-lg font-semibold text-white">{children}</h2>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-sm text-gray-300">{children}</p>;
}
