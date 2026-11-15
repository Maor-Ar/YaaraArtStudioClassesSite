import {
  effectiveMaxRegistrations,
  evaluateTrialCapacity,
  occupiedSeatCount,
  reservedRegularIds,
  resolveDropInCount,
  resolveSeriesId,
} from './adult-class-capacity';

describe('adult trial capacity', () => {
  it('treats missing reservedRegularUserIds as []', () => {
    expect(reservedRegularIds(undefined)).toEqual([]);
    expect(reservedRegularIds(null)).toEqual([]);
    expect(reservedRegularIds({})).toEqual([]);
    expect(reservedRegularIds({ reservedRegularUserIds: null })).toEqual([]);
  });

  it('reads regulars from the array or from an event-shaped object', () => {
    expect(reservedRegularIds(['a', '', 'b', 3 as unknown as string])).toEqual(['a', 'b']);
    expect(reservedRegularIds({ reservedRegularUserIds: ['u1', 'u2'] })).toEqual(['u1', 'u2']);
  });

  it('does not subtract a uid that is both a regular and a drop-in row', () => {
    expect(occupiedSeatCount(1, ['regular-1'])).toBe(2);
  });

  it('blocks when 0 drop-ins and 6 regulars fill max 6', () => {
    const decision = evaluateTrialCapacity({
      dropInCount: 0,
      reservedRegularUserIds: ['a', 'b', 'c', 'd', 'e', 'f'],
      maxRegistrations: 6,
    });
    expect(decision.available).toBe(0);
    expect(decision.ok).toBe(false);
    expect(decision.reason).toBe('full');
  });

  it('blocks when 3 drop-ins and 3 regulars fill max 6', () => {
    const decision = evaluateTrialCapacity({
      dropInCount: 3,
      reservedRegularUserIds: ['a', 'b', 'c'],
      maxRegistrations: 6,
    });
    expect(decision.available).toBe(0);
    expect(decision.ok).toBe(false);
    expect(decision.reason).toBe('full');
  });

  it('allows a trial when 1 drop-in and 2 regulars leave 3 of 6', () => {
    const before = evaluateTrialCapacity({
      dropInCount: 1,
      reservedRegularUserIds: ['r1', 'r2'],
      maxRegistrations: 6,
    });
    expect(before.ok).toBe(true);
    expect(before.available).toBe(3);
    expect(before.dropIns).toBe(1);
    expect(before.regulars).toBe(2);

    const afterPurchase = evaluateTrialCapacity({
      dropInCount: before.dropIns + 1,
      reservedRegularUserIds: ['r1', 'r2'],
      maxRegistrations: 6,
    });
    expect(afterPurchase.dropIns).toBe(2);
    expect(afterPurchase.regulars).toBe(2);
    expect(afterPurchase.occupied).toBe(4);
    expect(afterPurchase.available).toBe(2);
  });

  it('resolves recurring instance ids to the series document id', () => {
    expect(resolveSeriesId('abc_2026-11-16')).toBe('abc');
    expect(resolveSeriesId('series_with_underscores_2026-11-16')).toBe('series_with_underscores');
    expect(resolveSeriesId('abc')).toBe('abc');
  });

  it('uses a date override maxRegistrations: 4 with 2 regulars + 2 drop-ins is full', () => {
    const decision = evaluateTrialCapacity({
      dropInCount: 2,
      reservedRegularUserIds: ['r1', 'r2'],
      maxRegistrations: 6,
      overrideMaxRegistrations: 4,
    });
    expect(effectiveMaxRegistrations(6, 4)).toBe(4);
    expect(decision.max).toBe(4);
    expect(decision.occupied).toBe(4);
    expect(decision.ok).toBe(false);
    expect(decision.reason).toBe('full');
  });

  it('returns 0 spots when the occurrence is cancelled', () => {
    const decision = evaluateTrialCapacity({
      dropInCount: 0,
      reservedRegularUserIds: [],
      maxRegistrations: 6,
      isCancelled: true,
    });
    expect(decision.available).toBe(0);
    expect(decision.ok).toBe(false);
    expect(decision.reason).toBe('cancelled');
  });

  it('still rejects a sale when occupied is already over max', () => {
    const decision = evaluateTrialCapacity({
      dropInCount: 4,
      reservedRegularUserIds: ['a', 'b', 'c'],
      maxRegistrations: 6,
    });
    expect(decision.occupied).toBe(7);
    expect(decision.available).toBe(-1);
    expect(decision.ok).toBe(false);
  });

  it('prefers the higher of counter vs registration scan for drop-ins', () => {
    expect(resolveDropInCount(2, 5)).toBe(5);
    expect(resolveDropInCount(5, 2)).toBe(5);
    expect(resolveDropInCount(null, 3)).toBe(3);
  });
});
