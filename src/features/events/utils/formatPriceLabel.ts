export function formatPriceLabel(price: number): string {
  return `$${new Intl.NumberFormat('es-MX').format(price)} MXN`;
}
