/**
 * Adult trial capacity: drop-ins + reserved regulars, never double-counting.
 * Regulars occupy a seat via events.reservedRegularUserIds and must not
 * have event_registrations rows.
 */

export type CapacityDecision = {
  ok: boolean;
  occupied: number;
  available: number;
  max: number;
  dropIns: number;
  regulars: number;
  reason: 'ok' | 'full' | 'cancelled';
};

export function resolveSeriesId(eventId: string): string {
  const trimmed = String(eventId || '').trim();
  const match = trimmed.match(/^(.*)_(\d{4}-\d{2}-\d{2})$/);
  return match ? match[1] : trimmed;
}

export function reservedRegularIds(source: unknown): string[] {
  const raw = Array.isArray(source)
    ? source
    : source && typeof source === 'object'
      ? (source as { reservedRegularUserIds?: unknown }).reservedRegularUserIds
      : undefined;
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw.filter((id): id is string => typeof id === 'string' && id.length > 0);
}

/**
 * Prefer the higher of occurrence_counts vs a registration scan so a
 * stale-low counter cannot hide a full class of drop-ins.
 */
export function resolveDropInCount(
  counterCount: number | null | undefined,
  scannedCount: number
): number {
  const scan = Number.isFinite(scannedCount) && scannedCount > 0 ? scannedCount : 0;
  if (counterCount == null || Number.isNaN(Number(counterCount))) {
    return scan;
  }
  return Math.max(Number(counterCount) || 0, scan);
}

export function occupiedSeatCount(dropInCount: number, regularsSource: unknown): number {
  const dropIns = Number(dropInCount);
  const safeDropIns = Number.isFinite(dropIns) && dropIns > 0 ? dropIns : 0;
  return safeDropIns + reservedRegularIds(regularsSource).length;
}

export function effectiveMaxRegistrations(
  seriesMax: unknown,
  overrideMax?: unknown
): number {
  const override = Number(overrideMax);
  if (Number.isFinite(override) && override > 0) {
    return override;
  }
  const series = Number(seriesMax);
  return Number.isFinite(series) && series > 0 ? series : 6;
}

export function evaluateTrialCapacity(input: {
  dropInCount?: number;
  reservedRegularUserIds?: unknown;
  maxRegistrations?: unknown;
  overrideMaxRegistrations?: unknown;
  isCancelled?: boolean;
}): CapacityDecision {
  const dropIns = resolveDropInCount(input.dropInCount, 0);
  const regulars = reservedRegularIds(input.reservedRegularUserIds).length;
  const occupied = dropIns + regulars;
  const max = effectiveMaxRegistrations(
    input.maxRegistrations,
    input.overrideMaxRegistrations
  );

  if (input.isCancelled) {
    return {
      ok: false,
      occupied,
      available: 0,
      max,
      dropIns,
      regulars,
      reason: 'cancelled',
    };
  }

  const available = max - occupied;
  if (occupied >= max) {
    return {
      ok: false,
      occupied,
      available,
      max,
      dropIns,
      regulars,
      reason: 'full',
    };
  }

  return {
    ok: true,
    occupied,
    available,
    max,
    dropIns,
    regulars,
    reason: 'ok',
  };
}
