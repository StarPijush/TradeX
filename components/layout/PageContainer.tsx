export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 16px",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
