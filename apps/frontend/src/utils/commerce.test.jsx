import { describe, it, expect, beforeEach, vi } from "vitest";
import { getDiscountedPrice } from "./pricing";
import {
  getGuestCartItems,
  setGuestCartItems,
  getGuestCartCount,
} from "./guestCart";

describe("display pricing", () => {
  it("calculates percentage discounts and caps fixed discounts at zero", () => {
    expect(
      getDiscountedPrice({
        price: 100,
        discount: 25,
        discountType: "percentage",
      }).finalPrice
    ).toBe(75);
    expect(getDiscountedPrice({ price: 100, discount: 120 }).finalPrice).toBe(
      0
    );
  });
});
describe("guest cart persistence", () => {
  beforeEach(() => {
    const data = new Map();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: (key) => data.get(key),
        setItem: (key, value) => data.set(key, value),
        removeItem: (key) => data.delete(key),
      },
    });
  });
  it("recovers from malformed storage", () => {
    window.localStorage.setItem("guest_cart", "broken JSON");
    expect(getGuestCartItems()).toEqual([]);
  });
  it("normalizes quantities and preserves separate product variants", () => {
    setGuestCartItems([
      { productId: "one", quantity: 2.8, color: "black" },
      { productId: "one", quantity: 0, color: "white" },
      { quantity: 1 },
    ]);
    expect(getGuestCartItems()).toHaveLength(2);
    expect(getGuestCartCount()).toBe(3);
  });
});
