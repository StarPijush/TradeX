import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(
    (options: Omit<Toast, "id">) => {
      const id = String(toastId++);
      const newToast: Toast = { ...options, id };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove toast after 3 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);

      return id;
    },
    []
  );

  return { toast, toasts };
}
