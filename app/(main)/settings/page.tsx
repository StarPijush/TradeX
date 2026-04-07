"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { useTradingStore } from "@/store/useTradingStore";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const Toggle = ({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div
    onClick={() => onChange(!value)}
    style={{
      width: 40,
      height: 22,
      borderRadius: 11,
      background: value ? "var(--accent)" : "var(--border)",
      position: "relative",
      cursor: "pointer",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: "#fff",
        position: "absolute",
        top: 2,
        left: value ? 20 : 2,
        transition: "left 0.15s ease",
      }}
    />
  </div>
);

const SettingRow = ({
  label,
  sub,
  control,
  last = false,
}: {
  label: string;
  sub?: string;
  control: React.ReactNode;
  last?: boolean;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 14px",
      borderBottom: last ? "none" : "1px solid var(--border)",
    }}
  >
    <div>
      <div style={{ color: "var(--text)", fontWeight: 500, fontSize: 13, marginBottom: 1 }}>{label}</div>
      {sub && <div style={{ color: "var(--text-muted)", fontSize: 11 }}>{sub}</div>}
    </div>
    {control}
  </div>
);

export default function SettingsPage() {
  const { toast } = useToast();
  const { resetAccount } = useTradingStore();
  const [notifications, setNotifications] = useState(true);
  const [haptic, setHaptic] = useState(true);

  return (
    <div 
      className="page-wrapper min-h-screen"
      style={{ 
        paddingTop: 24,
        background: "radial-gradient(circle at 50% -20%, #111722 0%, #06090F 100%)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background Glow Accents */}
      <div 
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          height: "40%",
          background: "radial-gradient(circle, rgba(88,166,255,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <PageContainer>
        <div style={{ marginBottom: 32, position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 4 }}>
            System Preferences
          </div>
          <h1 style={{ color: "var(--text)", fontWeight: 900, fontSize: 32, letterSpacing: "-0.04em" }}>
            Settings
          </h1>
        </div>

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Notifications */}
          <div
            style={{
              background: "linear-gradient(135deg, #111722 0%, #0d1117 100%)",
              border: "1px solid var(--border)",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", background: "rgba(255,255,255,0.01)" }}>
              <span style={{ color: "var(--text-dim)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Interaction
              </span>
            </div>
            <SettingRow
              label="Push Notifications"
              sub="Trade alerts and market updates"
              control={<Toggle value={notifications} onChange={setNotifications} />}
            />
            <SettingRow
              label="Haptic Feedback"
              sub="Tactile response on execution"
              last
              control={<Toggle value={haptic} onChange={setHaptic} />}
            />
          </div>

          {/* Account Management */}
          <div
            style={{
              background: "linear-gradient(135deg, #111722 0%, #0d1117 100%)",
              border: "1px solid var(--border)",
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)",
            }}
          >
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", background: "rgba(255,255,255,0.01)" }}>
              <span style={{ color: "var(--text-dim)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Maintenance
              </span>
            </div>
            <SettingRow
              label="Reset Demo Account"
              sub="Restore your starting balance to $100,000"
              control={
                <button
                  onClick={() => {
                    resetAccount();
                    toast({ title: "Account Reset", description: "Balance restored to $100,000" });
                  }}
                  style={{
                    background: "rgba(239, 68, 68, 0.03)",
                    color: "rgba(239, 68, 68, 0.8)",
                    border: "1px solid rgba(239, 68, 68, 0.15)",
                    borderRadius: 12,
                    padding: "8px 16px",
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
                    e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                    e.currentTarget.style.color = "rgba(239, 68, 68, 1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.03)";
                    e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.15)";
                    e.currentTarget.style.color = "rgba(239, 68, 68, 0.8)";
                  }}
                >
                  Reset
                </button>
              }
            />
            <SettingRow
              label="Clear Storage"
              sub="Wipe all locally cached chart data"
              last
              control={
                <button
                  onClick={() => toast({ title: "Storage Cleared", description: "Local cache wiped successfully" })}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    color: "var(--text-dim)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: "8px 16px",
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                    e.currentTarget.style.color = "var(--text)";
                    e.currentTarget.style.borderColor = "var(--border-strong)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.color = "var(--text-dim)";
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  Wipe
                </button>
              }
            />
          </div>

          {/* About */}
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              background: "rgba(255,255,255,0.01)",
              borderRadius: 24,
              border: "1px dashed var(--border)",
            }}
          >
            <div style={{ color: "var(--text)", fontSize: 13, fontWeight: 800, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>
              TradeX Terminal
            </div>
            <div style={{ color: "var(--text-dim)", fontSize: 11, fontWeight: 500 }}>
              Version 1.0.4 • Professional Release
            </div>
          </div>
        </div>
      </PageContainer>
      <Toaster />
    </div>
  );
}
