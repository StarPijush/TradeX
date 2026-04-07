"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function InfoModal({ isOpen, onClose, title, children }: InfoModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          style={{ 
            position: "fixed", 
            inset: 0, 
            zIndex: 1000, 
            display: "flex", 
            alignItems: isMobile ? "flex-end" : "center", 
            justifyContent: "center",
            padding: isMobile ? 0 : 20
          }}
        >
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)", // For Safari support
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 10 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, y: 10 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.2 
            }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: isMobile ? "none" : 600,
              height: isMobile ? "80vh" : "auto",
              maxHeight: isMobile ? "85vh" : "80vh",
              background: "linear-gradient(165deg, #161B22 0%, #0D1117 100%)",
              border: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderBottomLeftRadius: isMobile ? 0 : 24,
              borderBottomRightRadius: isMobile ? 0 : 24,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 24px 64px rgba(0, 0, 0, 0.8)",
            }}
          >
            {/* Header with Divider */}
            <div style={{ 
              padding: "24px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              position: "relative",
              zIndex: 1
            }}>
              <h2 style={{ 
                color: "var(--text)", 
                fontSize: 20, 
                fontWeight: 800, 
                letterSpacing: "-0.02em",
                margin: 0
              }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "var(--text-dim)",
                  borderRadius: 12,
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "var(--text-dim)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div style={{ 
              height: 1, 
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)" 
            }} />

            {/* Scrollable Content Area */}
            <div 
              className="info-modal-scroll"
              style={{ 
                padding: "24px 30px", 
                overflowY: "auto", 
                flex: 1,
                scrollbarWidth: "none", // For Firefox
              }}
            >
              <style>{`
                .info-modal-scroll::-webkit-scrollbar {
                  display: none; // For Chrome/Safari
                }
              `}</style>
              <div style={{ 
                color: "rgba(255, 255, 255, 0.7)", 
                fontSize: 15, 
                lineHeight: "1.7", 
                fontWeight: 500,
                letterSpacing: "0.01em"
              }}>
                {children}
              </div>
            </div>

            {/* Fade effect at bottom */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 40,
              background: "linear-gradient(to top, #0D1117 0%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 2
            }} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
