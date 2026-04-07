import { Asset, Position, TradeResult, Trade, Order, OrderSide, OrderType } from "@/types/trading";

export interface TradingState {
  balance: number;
  positions: Position[];
  orders: Order[];
  trades: Trade[];
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  prices: Record<string, number>;
}

export interface PnL {
  pnl: number;
  pnlPct: number;
}

const FEE_RATE = 0.001; // 0.1%
const SLIPPAGE_RATE = 0.0005; // 0.05%

export class TradingEngine {
  private getState: () => TradingState;
  private setState: (partial: Partial<TradingState>) => void;

  constructor(
    getState: () => TradingState,
    setState: (partial: Partial<TradingState>) => void
  ) {
    this.getState = getState;
    this.setState = setState;
  }

  /**
   * Main entry point for market orders
   */
  async executeMarketOrder(
    symbol: string, 
    side: OrderSide, 
    quantity: number, 
    assets: Asset[],
    sl?: number,
    tp?: number
  ): Promise<TradeResult> {
    const state = this.getState();
    const asset = assets.find((a) => a.symbol === symbol);

    if (!asset) return { success: false, message: "Asset not found" };

    // 1. Calculate realistic entry price (with slippage)
    const slippage = asset.price * SLIPPAGE_RATE;
    const entryPrice = side === "buy" ? asset.price + slippage : asset.price - slippage;
    
    // 2. Calculate fees
    const tradeValue = entryPrice * quantity;
    const fee = tradeValue * FEE_RATE;
    const totalRequired = side === "buy" ? tradeValue + fee : fee;

    // 3. Balance check (Simplified: for shorting, we just check if they have enough for fees)
    if (totalRequired > state.balance && side === "buy") {
       return { success: false, message: "Insufficient balance" };
    }

    // 4. Realistic Delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

    // 5. Create position
    const newPosition: Position = {
      id: `pos_${Date.now()}`,
      symbol,
      name: asset.name,
      side,
      quantity,
      entryPrice: parseFloat(entryPrice.toFixed(2)),
      currentPrice: asset.price,
      stopLoss: sl,
      takeProfit: tp,
      status: "open",
      pnl: 0,
      category: asset.category,
      image: asset.image,
      openedAt: Date.now()
    };

    const newTrade: Trade = {
      id: `trade_${Date.now()}`,
      type: side === "buy" ? "BUY" : "SELL",
      side,
      symbol,
      quantity,
      price: entryPrice,
      timestamp: Date.now(),
      fee
    };

    this.setState({
      balance: state.balance - totalRequired,
      positions: [...state.positions, newPosition],
      trades: [newTrade, ...state.trades],
      xp: state.xp + 10
    });

    return { 
      success: true, 
      message: `${side === "buy" ? "Bought" : "Sold"} ${quantity} ${symbol} @ $${entryPrice.toFixed(2)}` 
    };
  }

  /**
   * Place a limit order
   */
  placeLimitOrder(
    symbol: string,
    side: OrderSide,
    price: number,
    quantity: number,
    sl?: number,
    tp?: number
  ): TradeResult {
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      symbol,
      side,
      type: "limit",
      price,
      quantity,
      stopLoss: sl,
      takeProfit: tp,
      status: "pending",
      timestamp: Date.now()
    };

    this.setState({
      orders: [...this.getState().orders, newOrder]
    });

    return { success: true, message: `Limit ${side} order placed at $${price}` };
  }

  /**
   * Automated monitoring of SL/TP and Limit Orders
   * Should be called on every price tick from the chart
   */
  async checkTick(symbol: string, price: number, assets: Asset[]) {
    const state = this.getState();
    const { positions, orders, balance, trades } = state;

    let updatedBalance = balance;
    let updatedPositions = [...positions];
    let updatedOrders = [...orders];
    let updatedTrades = [...trades];

    // 1. Check Limit Orders
    for (let i = updatedOrders.length - 1; i >= 0; i--) {
      const order = updatedOrders[i];
      if (order.symbol !== symbol || order.status !== "pending") continue;

      const hit = order.side === "buy" ? price <= order.price : price >= order.price;
      
      if (hit) {
        // Execute limit as market
        const res = await this.executeMarketOrder(symbol, order.side, order.quantity, assets, order.stopLoss, order.takeProfit);
        if (res.success) {
          updatedOrders.splice(i, 1);
        }
      }
    }

    // 2. Check SL / TP for Open Positions
    for (let i = updatedPositions.length - 1; i >= 0; i--) {
      const pos = updatedPositions[i];
      if (pos.symbol !== symbol || pos.status !== "open") continue;

      let trigger = null;
      if (pos.side === "buy") {
        if (pos.stopLoss && price <= pos.stopLoss) trigger = "Stop Loss";
        if (pos.takeProfit && price >= pos.takeProfit) trigger = "Take Profit";
      } else {
        if (pos.stopLoss && price >= pos.stopLoss) trigger = "Stop Loss";
        if (pos.takeProfit && price <= pos.takeProfit) trigger = "Take Profit";
      }

      if (trigger) {
        // Close position
        const { pnl } = this.calculatePnL(pos, price);
        updatedBalance += (pos.side === "buy" ? (pos.quantity * price) : (pos.quantity * (pos.entryPrice + (pos.entryPrice - price)))); // Simplified exit logic
        
        const exitTrade: Trade = {
          id: `trade_exit_${Date.now()}`,
          type: pos.side === "buy" ? "SELL" : "BUY",
          side: pos.side,
          symbol,
          quantity: pos.quantity,
          price,
          timestamp: Date.now(),
          profit: pnl,
          fee: (price * pos.quantity) * FEE_RATE
        };

        updatedBalance -= exitTrade.fee;
        updatedPositions.splice(i, 1);
        updatedTrades = [exitTrade, ...updatedTrades];
      }
    }

    this.setState({
      balance: updatedBalance,
      positions: updatedPositions,
      orders: updatedOrders,
      trades: updatedTrades
    });
  }

  async closePosition(positionId: string, assets: Asset[]): Promise<TradeResult> {
    const state = this.getState();
    const pos = state.positions.find(p => p.id === positionId);
    if (!pos) return { success: false, message: "Position not found" };

    const asset = assets.find(a => a.symbol === pos.symbol);
    const exitPrice = asset ? asset.price : pos.currentPrice;
    
    // Slippage on exit
    const slippage = exitPrice * SLIPPAGE_RATE;
    const finalExitPrice = pos.side === "buy" ? exitPrice - slippage : exitPrice + slippage;

    const { pnl } = this.calculatePnL(pos, finalExitPrice);
    const fee = (finalExitPrice * pos.quantity) * FEE_RATE;

    const exitTrade: Trade = {
      id: `trade_close_${Date.now()}`,
      type: pos.side === "buy" ? "SELL" : "BUY",
      side: pos.side,
      symbol: pos.symbol,
      quantity: pos.quantity,
      price: finalExitPrice,
      timestamp: Date.now(),
      profit: pnl,
      fee
    };

    // For simplicity: balance += (investment + pnl - fees)
    // Buy: cost was (qty * entry + fee). Exit: get (qty * exit - fee). 
    // Profit = (exit - entry) * qty - fees.
    // So new balance = old balance + (exit * qty) - fee? No, shorting is different.
    
    // Let's use a cleaner model:
    // Buy side: Balance already deducted (cost + fee). On exit, add (qty * exit - fee).
    // Sell side: Balance already deducted (fee). On exit, add (qty * (entry - exit) - fee)? No, that's not quite right for shorting without leverage.
    
    // Standard simulator model:
    // Balance is your "cash".
    // Market Buy: balance -= qty * entry + fee. Market Sell (to close): balance += qty * exit - fee.
    // Market Sell (to open): balance -= fee. Market Buy (to close): balance += qty * (entry - exit) - fee.
    
    let balanceChange = 0;
    if (pos.side === "buy") {
      balanceChange = (pos.quantity * finalExitPrice) - fee;
    } else {
      // For shorting: PnL = (entry - exit) * qty - fee
      balanceChange = (pos.entryPrice - finalExitPrice) * pos.quantity - fee;
    }

    this.setState({
      balance: state.balance + balanceChange,
      positions: state.positions.filter(p => p.id !== positionId),
      trades: [exitTrade, ...state.trades]
    });

    return { success: true, message: `Position closed with $${pnl.toFixed(2)} P&L` };
  }

  calculatePnL(position: Position, currentPrice: number): { pnl: number, pnlPct: number } {
    const { side, entryPrice, quantity } = position;
    let pnl = 0;
    
    if (side === "buy") {
      pnl = (currentPrice - entryPrice) * quantity;
    } else {
      pnl = (entryPrice - currentPrice) * quantity;
    }
    
    const pnlPct = (pnl / (entryPrice * quantity)) * 100;
    
    return { 
      pnl: parseFloat(pnl.toFixed(2)), 
      pnlPct: parseFloat(pnlPct.toFixed(2)) 
    };
  }

  calculateTotalPnL(positions: Position[], prices: Record<string, number>): { pnl: number, pnlPct: number } {
    let totalPnL = 0;
    let totalInvested = 0;

    positions.forEach(pos => {
      const price = prices[pos.symbol] || pos.currentPrice;
      const { pnl } = this.calculatePnL(pos, price);
      totalPnL += pnl;
      totalInvested += (pos.entryPrice * pos.quantity);
    });

    const pnlPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
    return { pnl: totalPnL, pnlPct };
  }
}

export function createTradingEngine(
  getState: () => TradingState,
  setState: (partial: Partial<TradingState>) => void
): TradingEngine {
  return new TradingEngine(getState, setState);
}
