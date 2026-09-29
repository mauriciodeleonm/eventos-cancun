import { parsePrice } from '@/features/events/utils/parsePrice';

describe('parsePrice', () => {
  it('parses "0" as free', () => {
    expect(parsePrice('0')).toBe(0);
  });

  it('parses "gratis" (any case or accent) as free', () => {
    expect(parsePrice('gratis')).toBe(0);
    expect(parsePrice('GRATIS')).toBe(0);
    expect(parsePrice('Grátis')).toBe(0);
  });

  it('parses an empty cell as unknown cost', () => {
    expect(parsePrice('')).toBeNull();
    expect(parsePrice('   ')).toBeNull();
  });

  it('strips $, commas, and spaces before converting to a number', () => {
    expect(parsePrice('$350')).toBe(350);
    expect(parsePrice('1,200')).toBe(1200);
    expect(parsePrice(' $ 1,200 ')).toBe(1200);
  });

  it('parses unrecognized text as unknown cost, never as free', () => {
    expect(parsePrice('a consultar')).toBeNull();
  });
});
