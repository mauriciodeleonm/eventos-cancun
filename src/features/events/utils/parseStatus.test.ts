import { parseStatus } from '@/features/events/utils/parseStatus';

describe('parseStatus', () => {
  it('returns undefined for an empty or missing cell (defaults to "programado")', () => {
    expect(parseStatus('')).toBeUndefined();
    expect(parseStatus(undefined)).toBeUndefined();
  });

  it('returns the matching status for an exact lowercase value', () => {
    expect(parseStatus('cancelado')).toBe('cancelado');
  });

  it('normalizes case, surrounding whitespace, and accents before matching', () => {
    expect(parseStatus('Cancelado')).toBe('cancelado');
    expect(parseStatus('  agotado  ')).toBe('agotado');
    expect(parseStatus('CANCÉLADO')).toBe('cancelado');
  });

  it('treats an unrecognized value as undefined instead of discarding the whole row', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(parseStatus('agotadoo')).toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('agotadoo'));

    warnSpy.mockRestore();
  });
});
