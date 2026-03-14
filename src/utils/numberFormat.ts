export function formatCompactNumber(num: number): string {
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(num);
  }
  