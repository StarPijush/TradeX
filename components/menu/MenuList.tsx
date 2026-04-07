import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info, HelpCircle, Settings, FileText, Smartphone, ChevronRight } from "lucide-react";
import InfoModal from "@/components/ui/InfoModal";

const ITEMS = [
  { id: "about", icon: Info, label: "About TradeX", sub: "Platform mission and mechanics", path: null, color: "#58A6FF" },
  { id: "help", icon: HelpCircle, label: "Help & Support", sub: "Platform guides and resources", path: null, color: "#22C55E" },
  { id: "settings", icon: Settings, label: "Settings", sub: "Manage preferences and appearance", path: "/settings", color: "#F59E0B" },
  { id: "terms", icon: FileText, label: "Terms & Privacy", sub: "Legal and simulation disclaimer", path: null, color: "#8B949E" },
  { id: "version", icon: Smartphone, label: "App Version", sub: "v1.0.0", path: null, color: "#AB47BC" },
];

export default function MenuList() {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const renderContent = () => {
    switch (activeModal) {
      case "about":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <p>TradeX is a modern trading simulation platform designed to help users understand financial markets through real-time, interactive experiences.</p>
            <p>Our goal is to provide a realistic environment where users can explore market behavior, test strategies, and build confidence without financial risk.</p>
            <p>The platform combines live price simulations, advanced charting tools, and portfolio tracking to deliver a professional trading experience.</p>
            <p>TradeX is built for learners, developers, and aspiring traders who want to experience market dynamics in a controlled environment.</p>
            <p>We focus on clarity, performance, and simplicity — removing unnecessary complexity while preserving the core mechanics of real-world trading systems.</p>
          </div>
        );
      case "help":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <p>Get help with using the platform, understanding features, and resolving common issues.</p>
            <p>For technical questions or feedback, refer to documentation or contact support through the platform.</p>
          </div>
        );
      case "terms":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <p>TradeX is a simulation platform and does not provide real financial trading or investment services. All market data, pricing, and execution environments are simulated for educational purposes only.</p>
            <p>No real money transactions occur within the platform.</p>
            <p>User data is handled with basic privacy practices and is not shared with third parties. The platform may store session and activity data to improve user experience and system performance.</p>
            <p>By using TradeX, users acknowledge that all results, profits, and losses are simulated and should not be interpreted as financial advice or real market outcomes.</p>
          </div>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    if (activeModal === "about") return "About TradeX";
    if (activeModal === "help") return "Help & Support";
    if (activeModal === "terms") return "Terms & Privacy";
    return "";
  };

  return (
    <>
      <div
        style={{
          background: "linear-gradient(135deg, #111722 0%, #0d1117 100%)",
          border: "1px solid var(--border)",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      >
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isLink = item.path !== null;
          const isAction = ["about", "help", "terms"].includes(item.id);

          return (
            <button
              key={item.label}
              onClick={() => {
                if (isLink) router.push(item.path!);
                else if (isAction) setActiveModal(item.id);
              }}
              className="group"
              style={{
                width: "100%",
                padding: "20px 24px",
                background: "none",
                border: "none",
                cursor: (isLink || isAction) ? "pointer" : "default",
                borderBottom: i < ITEMS.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                display: "flex",
                alignItems: "center",
                gap: 16,
                textAlign: "left",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseOver={(e) => {
                if (isLink || isAction) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                background: `${item.color}10`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: item.color,
                border: `1px solid ${item.color}25`,
                transition: "all 0.3s",
              }}>
                <Icon size={20} strokeWidth={2.5} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: "var(--text)", 
                  fontWeight: 700, 
                  fontSize: 15, 
                  marginBottom: 2,
                  transition: "color 0.2s"
                }}>
                  {item.label}
                </div>
                <div style={{ color: "var(--text-dim)", fontSize: 12, fontWeight: 500 }}>{item.sub}</div>
              </div>

              {(isLink || isAction) && (
                <div
                  className="group-hover:translate-x-1"
                  style={{ 
                    color: "var(--text-dim)", 
                    transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    opacity: 0.3
                  }}
                >
                  <ChevronRight size={18} strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <InfoModal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        title={getModalTitle()}
      >
        {renderContent()}
      </InfoModal>
    </>
  );
}
