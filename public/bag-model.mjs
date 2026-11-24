const ID = /^[A-Za-z0-9_-]{1,191}$/;
const MAX_LINES = 30;
const MAX_QUANTITY = 99;
const MAX_UNIT_CENTS = 1_000_000_000;

export function normalizeDraftBag(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const result = [];
  for (const entry of value) {
    if (!entry || !ID.test(entry.productId ?? '') ||
      !ID.test(entry.variationId ?? '') ||
      !['pickup', 'shipping'].includes(entry.fulfillment) ||
      !Number.isSafeInteger(entry.quantity) || entry.quantity < 1 ||
      entry.quantity > MAX_QUANTITY) continue;
    const key = `${entry.productId}:${entry.variationId}:${entry.fulfillment}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push({ productId: entry.productId,
      variationId: entry.variationId,
      fulfillment: entry.fulfillment, quantity: entry.quantity });
    if (result.length === MAX_LINES) break;
  }
  return result;
}

export function addDraftBagLine(bag, entry) {
  const incoming = normalizeDraftBag([entry])[0];
  if (!incoming) return null;
  const current = normalizeDraftBag(bag);
  const existing = current.find((line) =>
    line.productId === incoming.productId &&
    line.variationId === incoming.variationId &&
    line.fulfillment === incoming.fulfillment);
  if (existing) {
    if (existing.quantity + incoming.quantity > MAX_QUANTITY) return null;
    existing.quantity += incoming.quantity;
    return current;
  }
  if (current.length >= MAX_LINES) return null;
  return [...current, incoming];
}

export function draftBagPreview(products, bag) {
  const catalogue = new Map(products.map((product) =>
    [product.platformProductId, product]));
  const lines = normalizeDraftBag(bag).map((entry) => {
    const product = catalogue.get(entry.productId);
    const variation = product?.variations.find((value) =>
      value.platformVariationId === entry.variationId);
    const available = Boolean(product && variation?.canOrder &&
      product[entry.fulfillment] &&
      Number.isSafeInteger(variation.priceCents) &&
      variation.priceCents > 0 &&
      variation.priceCents <= MAX_UNIT_CENTS);
    return { ...entry, product: product ?? null,
      variation: variation ?? null, available,
      lineTotalCents: available ?
        variation.priceCents * entry.quantity : null };
  });
  const groups = new Map();
  let subtotalCents = 0;
  for (const line of lines.filter((value) => value.available)) {
    const key = `${line.product.platformMerchantId}:` +
      `${line.product.platformLocationId}:${line.fulfillment}`;
    if (!groups.has(key)) groups.set(key, {
      merchantId: line.product.platformMerchantId,
      locationId: line.product.platformLocationId,
      locationName: line.product.locationName,
      fulfillment: line.fulfillment, lines: [], subtotalCents: 0 });
    const group = groups.get(key);
    group.lines.push(line);
    group.subtotalCents += line.lineTotalCents;
    subtotalCents += line.lineTotalCents;
  }
  return { lines, groups: [...groups.values()], subtotalCents,
    hasUnavailable: lines.some((line) => !line.available) };
}
