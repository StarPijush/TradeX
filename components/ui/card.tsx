import * as React from "react";

export const Card = ({ children, style, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 6,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, style, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div style={{ padding: "12px 14px 0", ...style }} {...props}>{children}</div>
);

export const CardContent = ({ children, style, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div style={{ padding: 14, ...style }} {...props}>{children}</div>
);

export const CardTitle = ({ children, style, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 style={{ color: "var(--text)", fontWeight: 600, fontSize: 14, ...style }} {...props}>{children}</h3>
);
