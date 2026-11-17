import { formatPriceLabel } from '@/features/events/utils/formatPriceLabel';

describe('formatPriceLabel', () => {
  it('formats a price in MXN with thousands separators', () => {
    expect(formatPriceLabel(350)).toBe('$350 MXN');
    expect(formatPriceLabel(1200)).toBe('$1,200 MXN');
  });
});
