"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { TrendingUp, PieChart, History, BarChart2 } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Simulator", icon: <TrendingUp size={20} />, path: "/simulator" },
    { label: "Portfolio", icon: <PieChart size={20} />, path: "/portfolio" },
    { label: "Analytics", icon: <BarChart2 size={20} />, path: "/analytics" },
    { label: "History", icon: <History size={20} />, path: "/history" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        background: "rgba(11, 15, 20, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(30, 38, 51, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px",
        zIndex: 50,
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <motion.div
            key={item.path}
            onClick={() => router.push(item.path)}
            whileTap={{ scale: 0.9 }}
            style={{
              flex: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              cursor: "pointer",
              position: "relative"
            }}
          >
            <div style={{ 
              color: isActive ? "#58A6FF" : "#8B949E", 
              transition: "color 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 2
            }}>
              {item.icon}
              <span style={{ fontSize: 10, fontWeight: 700, marginTop: 2 }}>
                {item.label}
              </span>
            </div>

            <AnimatePresence>
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
                    position: "absolute",
                    top: "15%",
                    width: 40,
                    height: 40,
                    background: "rgba(88, 166, 255, 0.1)",
                    filter: "blur(15px)",
                    borderRadius: "50%",
                    zIndex: 1
                  }}
                />
              )}
            </AnimatePresence>
            
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: 24,
                  height: 3,
                  background: "#58A6FF",
                  borderRadius: "2px 2px 0 0",
                  boxShadow: "0 0 10px rgba(88, 166, 255, 0.5)"
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
