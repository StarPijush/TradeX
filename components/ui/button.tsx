import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", style, children, ...props }, ref) => {
    const base: React.CSSProperties = {
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      borderRadius: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
      border: "none", fontSize: 14,
    };

    const variants: Record<string, React.CSSProperties> = {
      default: { background: "var(--accent)", color: "#fff" },
      destructive: { background: "var(--loss)", color: "#fff" },
      outline: { background: "transparent", border: "1px solid var(--border)", color: "var(--text)" },
      ghost: { background: "transparent", color: "var(--text)" },
    };

    const sizes: Record<string, React.CSSProperties> = {
      default: { padding: "10px 20px" },
      sm: { padding: "6px 14px", fontSize: 12 },
      lg: { padding: "14px 28px", fontSize: 16 },
      icon: { width: 36, height: 36, padding: 0 },
    };

    return (
      <button ref={ref} style={{ ...base, ...variants[variant], ...sizes[size], ...style }} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
