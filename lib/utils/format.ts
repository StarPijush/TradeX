export function formatCurrency(value: number, compact: boolean = false): string {
  // Handle NaN, Infinity, and null/undefined values
  if (!isFinite(value) || value === null || value === undefined) {
    return "$0.00";
  }

  if (compact && Math.abs(value) < 1000) {
    return `$${value.toFixed(2)}`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number | undefined): string {
  if (value === undefined || value === null || !isFinite(value)) {
    return "0.00%";
  }
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatDate(date: Date | string | number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
