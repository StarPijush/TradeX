export default function PageContainer({
  children,
  className = "",
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div
      style={{
        maxWidth: "var(--max-page-w)",
        margin: "0 auto",
        padding: "0 20px",
        width: "100%",
      }}
      className={className}
    >
      {children}
    </div>
  );
}
