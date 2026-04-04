export function calculateSMA(data: { close: number }[], period: number) {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j].close;
    }
    result.push(sum / period);
  }
  return result;
}

export function calculateEMA(data: { close: number }[], period: number) {
  const result: (number | null)[] = [];
  const k = 2 / (period + 1);
  let ema = data[0].close;
  
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push(ema);
      continue;
    }
    ema = (data[i].close - ema) * k + ema;
    if (i < period - 1) {
      result.push(null); // Return null for initial unstable values
    } else {
      result.push(ema);
    }
  }
  return result;
}

export function calculateRSI(data: { close: number }[], period: number = 14) {
  const result: (number | null)[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      result.push(null);
      continue;
    }
    const change = data[i].close - data[i - 1].close;
    if (i <= period) {
      if (change >= 0) gains += change;
      else losses -= change;
      if (i < period) {
        result.push(null);
      } else {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / (avgLoss === 0 ? 1e-10 : avgLoss);
        result.push(100 - (100 / (1 + rs)));
      }
      continue;
    }

    const prevAvgGain = gains;
    const prevAvgLoss = losses;
    
    gains = ((prevAvgGain * (period - 1)) + (change >= 0 ? change : 0)) / period;
    losses = ((prevAvgLoss * (period - 1)) + (change < 0 ? -change : 0)) / period;

    const rs = gains / (losses === 0 ? 1e-10 : losses);
    result.push(100 - (100 / (1 + rs)));
  }
  return result;
}

export function calculateMACD(data: { close: number }[], shortPeriod: number = 12, longPeriod: number = 26, signalPeriod: number = 9) {
  const shortEma = calculateEMA(data, shortPeriod);
  const longEma = calculateEMA(data, longPeriod);
  
  const macdLine: (number | null)[] = [];
  const validMacdForSignal: { close: number }[] = [];

  for (let i = 0; i < data.length; i++) {
    const sEma = shortEma[i];
    const lEma = longEma[i];
    if (sEma !== null && lEma !== null) {
      const macd = sEma - lEma;
      macdLine.push(macd);
      validMacdForSignal.push({ close: macd });
    } else {
      macdLine.push(null);
    }
  }

  const signalLineEma = calculateEMA(validMacdForSignal, signalPeriod);
  const signalLine: (number | null)[] = [];
  const histogram: (number | null)[] = [];

  let signalIdx = 0;
  for (let i = 0; i < data.length; i++) {
    if (macdLine[i] !== null) {
        const signal = signalLineEma[signalIdx] !== undefined ? signalLineEma[signalIdx] : null;
        signalLine.push(signal);
        histogram.push(signal !== null ? macdLine[i]! - signal : null);
        signalIdx++;
    } else {
      signalLine.push(null);
      histogram.push(null);
    }
  }

  return { macdLine, signalLine, histogram };
}
