import { useTradingStore } from "@/store/useTradingStore";
import { createTradingEngine } from "@/lib/trading/engine";
import { formatCurrency } from "@/lib/utils/format";
import AnimateNumber from "@/components/ui/AnimateNumber";

export default function BalanceCard() {
  const { balance, positions, xp, level, streak, bestStreak, trades } = useTradingStore();

  const engine = createTradingEngine(
    () => ({ balance, positions, xp, level, streak, bestStreak, trades }),
    () => {}
  );

  const totalPnL = engine.calcTotalPnL(positions);
  const invested = positions.reduce((acc, p) => acc + p.avgPrice * p.quantity, 0);

  return (
    <div
      style={{
        background: "#0B0F14",
        border: "1px solid #1E2633",
        borderRadius: 8,
        padding: "16px 20px",
        marginBottom: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ color: "#8B949E", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
          Available Balance
        </div>
        <div style={{ color: "#E6EDF3", fontSize: 32, fontWeight: 800, letterSpacing: "-1px" }}>
          <AnimateNumber value={balance} format={(v) => formatCurrency(v, true)} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: 24 }}>
          <div>
            <div style={{ color: "#8B949E", fontSize: 9, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
              Invested
            </div>
            <div style={{ color: "#E6EDF3", fontSize: 15, fontWeight: 700 }}>
              <AnimateNumber value={invested} format={(v) => formatCurrency(v, true)} />
            </div>
          </div>
          
          <div>
            <div style={{ color: "#8B949E", fontSize: 9, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
              Total P&L
            </div>
            <div style={{ 
              color: totalPnL.pnl >= 0 ? "#22C55E" : "#EF4444", 
              fontSize: 15, 
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "2px"
            }}>
              {totalPnL.pnl >= 0 ? "+" : ""}
              <AnimateNumber value={totalPnL.pnl} format={(v) => formatCurrency(v, true)} />
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#8B949E", fontSize: 9, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
            Open Positions
          </div>
          <div style={{ color: "#E6EDF3", fontSize: 15, fontWeight: 700 }}>
            {positions.length}
          </div>
        </div>
      </div>
    </div>
  );
}
