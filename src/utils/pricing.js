import { SIZES, DEFAULT_SIZE } from './constants';

/**
 * Resolve the price for a given drink + size.
 * Falls back to the drink's base `price` for any drink created before
 * per-size pricing existed, or for a size that was left blank on the form.
 */
export function getSizePrice(drink, size = DEFAULT_SIZE) {
  const base = Number(drink?.price) || 0;
  const perSize = drink?.sizePricing?.[size];
  return typeof perSize === 'number' && !Number.isNaN(perSize) ? perSize : base;
}

/** Returns { min, max, sameForAll } across S/M/L for display on cards & tables. */
export function getDrinkPriceRange(drink) {
  const prices = SIZES.map((s) => getSizePrice(drink, s));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return { min, max, sameForAll: min === max };
}

/** Build a clean sizePricing object from raw form input (strings, possibly blank). */
export function normalizeSizePricing(basePrice, rawSizePricing) {
  const base = Number(basePrice) || 0;
  const result = {};
  SIZES.forEach((s) => {
    const raw = rawSizePricing?.[s];
    const num = Number(raw);
    result[s] = raw !== '' && raw !== undefined && raw !== null && !Number.isNaN(num) ? num : base;
  });
  return result;
}
