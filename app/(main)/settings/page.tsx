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
    <div style={{ paddingTop: 12 }}>
      <PageContainer>
        <h1 style={{ color: "var(--text)", fontWeight: 600, fontSize: 16, marginBottom: 12 }}>
          Settings
        </h1>

        {/* Notifications */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Notifications
            </span>
          </div>
          <SettingRow
            label="Push Notifications"
            sub="Trade alerts and updates"
            control={<Toggle value={notifications} onChange={setNotifications} />}
          />
          <SettingRow
            label="Haptic Feedback"
            sub="Vibrate on trade execution"
            last
            control={<Toggle value={haptic} onChange={setHaptic} />}
          />
        </div>

        {/* Account */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "8px 14px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Account
            </span>
          </div>
          <SettingRow
            label="Reset Account"
            sub="Restore balance to $100,000"
            control={
              <button
                onClick={() => {
                  resetAccount();
                  toast({ title: "Account Reset", description: "Balance restored to $100,000" });
                }}
                style={{
                  background: "transparent",
                  color: "var(--red)",
                  border: "1px solid var(--red)",
                  borderRadius: 4,
                  padding: "4px 12px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Reset
              </button>
            }
          />
          <SettingRow
            label="Clear Cache"
            sub="Free up local storage"
            last
            control={
              <button
                onClick={() => toast({ title: "Cache Cleared", description: "Local storage cleared" })}
                style={{
                  background: "transparent",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "4px 12px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Clear
              </button>
            }
          />
        </div>

        {/* About */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: 16,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          <div style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 2 }}>
            TradeX Virtual Simulator
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: 11 }}>
            Version 1.0.0
          </div>
        </div>
      </PageContainer>
      <Toaster />
    </div>
  );
}
