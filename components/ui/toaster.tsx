"use client";

import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: t.variant === "destructive" ? "var(--loss)" : "var(--profit)",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            animation: "slideIn 0.3s ease",
            maxWidth: 300,
            lineHeight: 1.4,
            pointerEvents: "auto",
          }}
        >
          {t.title && (
            <div style={{ fontWeight: 700, marginBottom: t.description ? 2 : 0 }}>
              {t.title}
            </div>
          )}
          {t.description && (
            <div style={{ opacity: 0.9, fontSize: 12 }}>{t.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}
