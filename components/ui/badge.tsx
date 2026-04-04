import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "profit" | "loss" | "accent";
}

export const Badge = ({ variant = "default", children, style, ...props }: BadgeProps) => {
  const variants: Record<string, React.CSSProperties> = {
    default: { background: "var(--border)", color: "var(--text-muted)" },
    profit: { background: "var(--profit-bg)", color: "var(--profit)" },
    loss: { background: "var(--loss-bg)", color: "var(--loss)" },
    accent: { background: "var(--accent-glow)", color: "var(--accent)" },
  };

  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "2px 8px", borderRadius: 6,
        fontSize: 10, fontWeight: 700,
        ...variants[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
};
