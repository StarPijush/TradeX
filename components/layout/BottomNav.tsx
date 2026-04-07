"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { TrendingUp, PieChart, History, BarChart2 } from "lucide-react";
import { useTransition } from "react";

const navItems = [
  { label: "Markets", icon: TrendingUp, path: "/simulator" },
  { label: "Portfolio", icon: PieChart, path: "/portfolio" },
  { label: "Analytics", icon: BarChart2, path: "/analytics" },
  { label: "History", icon: History, path: "/history" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className="md:hidden"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "calc(var(--bottomnav-h) + env(safe-area-inset-bottom))",
        background: "rgba(11, 15, 20, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 100,
      }}
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.path ||
          (item.path === "/simulator" && pathname.startsWith("/chart"));
        const Icon = item.icon;

        return (
          <motion.button
            key={item.path}
            onClick={() => {
              startTransition(() => {
                router.push(item.path);
              });
            }}
            whileTap={{ scale: 0.88 }}
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              cursor: "pointer",
              border: "none",
              background: "transparent",
              position: "relative",
              color: isActive ? "var(--accent)" : "var(--text-muted)",
              transition: "color 0.2s",
            }}
          >
            {/* Glow blob */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="bn-glow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    top: "18%",
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "rgba(88,166,255,0.12)",
                    filter: "blur(12px)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </AnimatePresence>

            <Icon
              size={21}
              strokeWidth={isActive ? 2.5 : 1.7}
              style={{ position: "relative", zIndex: 1 }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                position: "relative",
                zIndex: 1,
              }}
            >
              {item.label}
            </span>

            {/* Bottom indicator */}
            {isActive && (
              <motion.div
                layoutId="bn-bar"
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: 28,
                  height: 2.5,
                  borderRadius: "2px 2px 0 0",
                  background: "var(--accent)",
                  boxShadow: "0 0 8px rgba(88,166,255,0.6)",
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
