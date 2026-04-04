import { Asset, Position, TradeResult } from "@/types/trading";

export interface TradingState {
  balance: number;
  positions: Position[];
}

export interface PnL {
  pnl: number;
  pnlPct: number;
}

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

  buy(symbol: string, quantity: number, assets: Asset[]): TradeResult {
    const state = this.getState();
    const asset = assets.find((a) => a.symbol === symbol);

    if (!asset) {
      return {
        success: false,
        message: `Asset ${symbol} not found`,
      };
    }

    const price = asset.price;
    const totalCost = quantity * price;

    if (totalCost > state.balance) {
      return {
        success: false,
        message: `Insufficient balance. Required: $${totalCost.toFixed(2)}, Available: $${state.balance.toFixed(2)}`,
      };
    }

    // Check if position already exists
    const existingPosition = state.positions.find((p) => p.symbol === symbol);

    if (existingPosition) {
      // Update existing position - average the cost
      const totalQuantity = existingPosition.quantity + quantity;
      const totalValue = existingPosition.quantity * existingPosition.avgPrice + quantity * price;
      const newAveragePrice = totalValue / totalQuantity;

      const updatedPosition: Position = {
        ...existingPosition,
        quantity: totalQuantity,
        avgPrice: parseFloat(newAveragePrice.toFixed(2)),
        currentPrice: price,
      };

      this.setState({
        balance: state.balance - totalCost,
        positions: state.positions.map((p) => (p.symbol === symbol ? updatedPosition : p)),
      });
    } else {
      // Create new position
      const newPosition: Position = {
        id: `pos_${Date.now()}`,
        symbol,
        name: asset.name,
        quantity,
        avgPrice: price,
        currentPrice: price,
        category: asset.category,
        image: asset.image,
      };

      this.setState({
        balance: state.balance - totalCost,
        positions: [...state.positions, newPosition],
      });
    }

    return {
      success: true,
      message: `Bought ${quantity} ${symbol} @ $${price.toFixed(2)}`,
    };
  }

  sell(positionId: string, quantity: number, assets: Asset[]): TradeResult {
    const state = this.getState();
    const position = state.positions.find((p) => p.id === positionId);

    if (!position) {
      return {
        success: false,
        message: "Position not found",
      };
    }

    if (quantity > position.quantity) {
      return {
        success: false,
        message: `Cannot sell ${quantity} units. Only ${position.quantity} available.`,
      };
    }

    // Find current price from assets
    const asset = assets.find((a) => a.symbol === position.symbol);
    const sellPrice = asset?.price || position.currentPrice;
    const totalProceeds = quantity * sellPrice;

    if (quantity === position.quantity) {
      // Close the position entirely
      this.setState({
        balance: state.balance + totalProceeds,
        positions: state.positions.filter((p) => p.id !== positionId),
      });
    } else {
      // Partial close
      const updatedPosition: Position = {
        ...position,
        quantity: position.quantity - quantity,
        currentPrice: sellPrice,
      };

      this.setState({
        balance: state.balance + totalProceeds,
        positions: state.positions.map((p) => (p.id === positionId ? updatedPosition : p)),
      });
    }

    const profit = (sellPrice - position.avgPrice) * quantity;
    const profitPercent = ((sellPrice - position.avgPrice) / position.avgPrice) * 100;

    return {
      success: true,
      message: `Sold ${quantity} ${position.symbol} @ $${sellPrice.toFixed(2)} | Profit: ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)} (${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)`,
    };
  }

  calcPnL(position: Position): PnL {
    // Prevent division by zero
    if (!position.avgPrice || position.avgPrice <= 0) {
      return { pnl: 0, pnlPct: 0 };
    }
    
    const pnl = (position.currentPrice - position.avgPrice) * position.quantity;
    const pnlPct = ((position.currentPrice - position.avgPrice) / position.avgPrice) * 100;
    
    return { 
      pnl: isFinite(pnl) ? pnl : 0, 
      pnlPct: isFinite(pnlPct) ? pnlPct : 0 
    };
  }

  calcTotalPnL(positions: Position[]): PnL {
    let totalPnL = 0;
    let totalInvested = 0;

    positions.forEach((position) => {
      const { pnl } = this.calcPnL(position);
      const invested = position.avgPrice * position.quantity;
      totalPnL += pnl;
      totalInvested += invested;
    });

    const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

    return { 
      pnl: isFinite(totalPnL) ? totalPnL : 0, 
      pnlPct: isFinite(totalPnLPct) ? totalPnLPct : 0 
    };
  }
}

export function createTradingEngine(
  getState: () => TradingState,
  setState: (partial: Partial<TradingState>) => void
): TradingEngine {
  return new TradingEngine(getState, setState);
}
