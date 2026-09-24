export function formatPrice(price: string | number) {
  return price ? price.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1.") : "-";
}

export function formatExchangeRate(rate: number) {
  const r = rate.toLocaleString("en-US");
  if (/\.\d/g.test(r)) return r;
  return r + ".00";
}
