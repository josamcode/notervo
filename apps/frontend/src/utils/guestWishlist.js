const GUEST_WISHLIST_STORAGE_KEY = "guest_wishlist";

function normalizeProductId(productId) {
  return String(productId || "").trim();
}

function sanitizeWishlistItems(rawItems) {
  if (!Array.isArray(rawItems)) {
    return [];
  }

  return rawItems
    .map((item) => normalizeProductId(item))
    .filter(Boolean);
}

export function getGuestWishlistItems() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(GUEST_WISHLIST_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return sanitizeWishlistItems(parsed);
  } catch {
    return [];
  }
}

export function setGuestWishlistItems(items) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = sanitizeWishlistItems(items);
  if (!normalized.length) {
    window.localStorage.removeItem(GUEST_WISHLIST_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(
    GUEST_WISHLIST_STORAGE_KEY,
    JSON.stringify(normalized)
  );
}

export function getGuestWishlistCount() {
  return getGuestWishlistItems().length;
}

export function hasGuestWishlistItem(productId) {
  const normalized = normalizeProductId(productId);
  if (!normalized) {
    return false;
  }
  return getGuestWishlistItems().includes(normalized);
}

export function addGuestWishlistItem(productId) {
  const normalized = normalizeProductId(productId);
  if (!normalized) {
    return { success: false, message: "Invalid product ID" };
  }

  const items = getGuestWishlistItems();
  if (items.includes(normalized)) {
    return { success: false, message: "Product already exists in wishlist" };
  }

  items.push(normalized);
  setGuestWishlistItems(items);
  return { success: true, items };
}

export function removeGuestWishlistItem(productId) {
  const normalized = normalizeProductId(productId);
  const items = getGuestWishlistItems();
  const filtered = items.filter((id) => id !== normalized);

  if (filtered.length === items.length) {
    return { success: false, message: "Product not found in wishlist" };
  }

  setGuestWishlistItems(filtered);
  return { success: true, items: filtered };
}

export function clearGuestWishlist() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(GUEST_WISHLIST_STORAGE_KEY);
}

