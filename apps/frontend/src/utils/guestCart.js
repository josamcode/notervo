const GUEST_CART_STORAGE_KEY = "guest_cart";

function normalizeVariantValue(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  return String(value);
}

function sanitizeGuestCartItems(rawItems) {
  if (!Array.isArray(rawItems)) {
    return [];
  }

  return rawItems
    .map((item) => ({
      productId: String(item?.productId || ""),
      quantity: Math.max(1, Number(item?.quantity) || 1),
      color: normalizeVariantValue(item?.color),
      size: normalizeVariantValue(item?.size),
    }))
    .filter((item) => item.productId);
}

export function getGuestCartItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return sanitizeGuestCartItems(parsed);
  } catch {
    return [];
  }
}

export function setGuestCartItems(items) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = sanitizeGuestCartItems(items);
  if (normalized.length === 0) {
    window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    GUEST_CART_STORAGE_KEY,
    JSON.stringify(normalized)
  );
}

export function clearGuestCart() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(GUEST_CART_STORAGE_KEY);
}

export function getGuestCartCount() {
  return getGuestCartItems().reduce((sum, item) => sum + item.quantity, 0);
}

function sameVariant(item, productId, color = null, size = null) {
  return (
    String(item.productId) === String(productId) &&
    normalizeVariantValue(item.color) === normalizeVariantValue(color) &&
    normalizeVariantValue(item.size) === normalizeVariantValue(size)
  );
}

export function hasGuestCartItem(productId, color = null, size = null) {
  return getGuestCartItems().some((item) =>
    sameVariant(item, productId, color, size)
  );
}

export function addGuestCartItem({
  productId,
  quantity = 1,
  color = null,
  size = null,
}) {
  const items = getGuestCartItems();
  const exists = items.some((item) =>
    sameVariant(item, productId, color, size)
  );

  if (exists) {
    return { success: false, message: "Product already exists in cart" };
  }

  items.push({
    productId: String(productId),
    quantity: Math.max(1, Number(quantity) || 1),
    color: normalizeVariantValue(color),
    size: normalizeVariantValue(size),
  });
  setGuestCartItems(items);

  return { success: true, items };
}

export function removeGuestCartItem(productId, color = null, size = null) {
  const items = getGuestCartItems();
  const filtered = items.filter(
    (item) => !sameVariant(item, productId, color, size)
  );

  if (filtered.length === items.length) {
    return { success: false, message: "Product not found in cart" };
  }

  setGuestCartItems(filtered);
  return { success: true, items: filtered };
}

export function updateGuestCartItemQuantity(
  productId,
  quantity,
  color = null,
  size = null
) {
  const nextQuantity = Number(quantity);
  if (!Number.isFinite(nextQuantity) || nextQuantity < 1) {
    return { success: false, message: "Invalid quantity" };
  }

  const items = getGuestCartItems();
  const index = items.findIndex((item) =>
    sameVariant(item, productId, color, size)
  );

  if (index < 0) {
    return { success: false, message: "Item not in cart" };
  }

  items[index].quantity = Math.max(1, Math.round(nextQuantity));
  setGuestCartItems(items);
  return { success: true, items };
}

