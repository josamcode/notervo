import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { removeFromCart } from "../utils/CartUtils";
import {
  getGuestCartItems,
  updateGuestCartItemQuantity,
} from "../utils/guestCart";
import { getDiscountedPrice } from "../utils/pricing";
import { showError } from "../utils/Toast";
import SmartImage from "../components/ui/SmartImage";
import {
  EmptyState,
  PageHeader,
  SummaryRow,
  formatMoney,
} from "../components/ui/Primitives";
import {
  ArrowLeft,
  ArrowRight,
  Bag,
  Cash,
  Minus,
  Plus,
  Trash,
} from "../components/ui/Icons";

const isHex = (value = "") => value.startsWith("#");

const VariantMeta = ({ item }) => (
  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
    {item.size && <span>Format: {item.size}</span>}
    {item.color && (
      <span className="inline-flex items-center gap-1.5">
        Colour:
        {isHex(item.color) ? (
          <span
            className="inline-block h-3 w-3 rounded-full border border-ink/20"
            style={{ backgroundColor: item.color }}
            aria-label={item.color}
          />
        ) : (
          <span>{item.color}</span>
        )}
      </span>
    )}
  </p>
);

const QuantityStepper = ({ item, onChange }) => (
  <div
    className="inline-flex h-10 items-center rounded-full border border-ink/25"
    role="group"
    aria-label={`Quantity for ${item.productDetails?.title || "item"}`}
  >
    <button
      type="button"
      onClick={() => onChange(item, -1)}
      disabled={item.quantity <= 1}
      aria-label="Decrease quantity"
      className="icon-btn h-full w-10 rounded-l-full text-ink disabled:text-ink/25"
    >
      <Minus className="h-3.5 w-3.5" />
    </button>
    <span
      className="w-7 text-center text-[14px] tabular-nums"
      aria-live="polite"
    >
      {item.quantity}
    </span>
    <button
      type="button"
      onClick={() => onChange(item, 1)}
      aria-label="Increase quantity"
      className="icon-btn h-full w-10 rounded-r-full text-ink"
    >
      <Plus className="h-3.5 w-3.5" />
    </button>
  </div>
);

/* ───────────── main component ───────────── */
export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          const guestItems = getGuestCartItems();
          if (!guestItems.length) {
            setCart({ items: [], total: 0 });
            return;
          }

          const itemsWithImages = await Promise.all(
            guestItems.map(async (item, index) => {
              const productRes = await axios.get(
                `${import.meta.env.VITE_API_URL}/products/${item.productId}`
              );

              return {
                _id: `${item.productId}-${item.color || "no-color"}-${item.size || "no-size"}-${index}`,
                productId: { _id: item.productId },
                quantity: item.quantity,
                color: item.color || null,
                size: item.size || null,
                productDetails: productRes.data,
              };
            })
          );

          setCart({ items: itemsWithImages, total: 0 });
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/cart`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const itemsWithImages = await Promise.all(
          response.data.cart.items.map(async (item) => {
            const productRes = await axios.get(
              `${import.meta.env.VITE_API_URL}/products/${item.productId._id}`
            );
            return { ...item, productDetails: productRes.data };
          })
        );

        setCart({ ...response.data.cart, items: itemsWithImages });
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleRemove = async (item) => {
    const result = await removeFromCart(
      item.productId._id,
      item.color,
      item.size
    );
    if (result.success) {
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i._id !== item._id),
      }));
    } else {
      showError(result.message);
    }
  };

  const handleQuantityChange = async (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;

    const token = Cookies.get("token");
    if (!token) {
      const result = updateGuestCartItemQuantity(
        item.productId._id,
        newQuantity,
        item.color,
        item.size
      );

      if (!result.success) {
        console.error(result.message);
        return;
      }

      setCart((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i._id === item._id ? { ...i, quantity: newQuantity } : i
        ),
      }));
      window.dispatchEvent(new Event("cartUpdated"));
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/cart/update/${item.productId._id}`,
        { quantity: newQuantity, color: item.color, size: item.size },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i._id === item._id ? { ...i, quantity: newQuantity } : i
        ),
      }));
    } catch (err) {
      console.error("Error updating quantity:", err);
      showError(err.response?.data?.message || "Could not update quantity.");
    }
  };

  const totalAmount =
    cart?.items.reduce((acc, item) => {
      const product = item.productDetails;
      if (!product) return acc;
      const { finalPrice } = getDiscountedPrice(product);
      return acc + finalPrice * item.quantity;
    }, 0) || 0;

  const itemCount = cart?.items.reduce((s, i) => s + i.quantity, 0) || 0;

  /* ───── Loading ───── */
  if (loading) {
    return (
      <div aria-busy="true">
        <div className="container-x pb-6 pt-4 md:border-b md:border-ink-line md:pb-8 md:pt-12">
          <div className="skeleton h-9 w-48 md:h-14 md:w-80" />
        </div>
        <div className="grid gap-4 px-4 py-4 md:grid-cols-[1fr_minmax(360px,30%)] md:gap-0 md:p-0">
          <div className="space-y-3 md:space-y-0">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex gap-4 rounded-2xl bg-cream-deep p-3 md:rounded-none md:border-b md:border-ink-line md:bg-transparent md:px-[var(--gutter)] md:py-6"
              >
                <div className="skeleton h-24 w-24 shrink-0 rounded-xl md:h-32 md:w-32 md:rounded-none" />
                <div className="flex-1 space-y-2.5 pt-1">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/3" />
                  <div className="skeleton h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
          <div className="skeleton h-56 rounded-2xl md:m-[var(--gutter)] md:rounded-none" />
        </div>
      </div>
    );
  }

  /* ───── Empty cart ───── */
  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        icon={Bag}
        title="Your cart is empty"
        description="Looks like you haven't added any items yet."
        actionLabel="Browse the shop"
        actionTo="/shop"
      />
    );
  }

  const summary = (
    <div className="space-y-3">
      <SummaryRow
        label={`Subtotal (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
      >
        {formatMoney(totalAmount)}
      </SummaryRow>
      <SummaryRow label="Shipping">Free</SummaryRow>
      <div className="border-t border-ink/15 pt-4 md:border-ink-line">
        <SummaryRow label="Total" strong>
          {formatMoney(totalAmount)}
        </SummaryRow>
      </div>
    </div>
  );

  return (
    <main>
      <PageHeader
        eyebrow="Shopping cart"
        title="Your cart"
        description={`${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`}
        actions={
          <Link
            to="/shop"
            className="link-underline hidden items-center gap-2 text-[14px] uppercase md:flex"
          >
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </Link>
        }
      />

      <div className="grid items-start md:grid-cols-[1fr_minmax(360px,30%)]">
        {/* ───── Items ───── */}
        <ul
          className="space-y-3 px-4 md:space-y-0 md:px-0"
          aria-label="Cart items"
        >
          {cart.items.map((item) => {
            const product = item.productDetails;
            const { originalPrice, finalPrice } = getDiscountedPrice(product);
            const itemTotal = finalPrice * item.quantity;
            const hasDiscount = originalPrice > finalPrice;

            return (
              <li
                key={item._id}
                className="flex gap-3.5 rounded-2xl bg-cream-deep p-3 md:gap-6 md:rounded-none md:border-b md:border-ink-line md:bg-transparent md:px-[var(--gutter)] md:py-6"
              >
                <Link
                  to={`/products/${product._id}`}
                  className="relative h-[104px] w-[88px] shrink-0 overflow-hidden rounded-xl bg-cream-dim md:h-[150px] md:w-[136px] md:rounded-none"
                  aria-label={product.title}
                >
                  <SmartImage
                    src={product.images?.[0]}
                    alt=""
                    width={320}
                    sizes="140px"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={`/products/${product._id}`}
                        className="line-clamp-2 text-[15px] leading-snug hover:underline md:text-[15px] md:uppercase"
                      >
                        {product.title}
                      </Link>
                      <VariantMeta item={item} />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      aria-label={`Remove ${product.title} from cart`}
                      className="icon-btn -mr-1 -mt-1 h-10 w-10 shrink-0 rounded-full text-muted hover:bg-ink/5 hover:text-ink md:hidden"
                    >
                      <Trash className="h-[18px] w-[18px]" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                    <QuantityStepper
                      item={item}
                      onChange={handleQuantityChange}
                    />
                    <div className="text-right">
                      <p className="text-[15px] tabular-nums">
                        {formatMoney(itemTotal)}
                      </p>
                      {hasDiscount && (
                        <p className="text-[12px] tabular-nums text-muted line-through">
                          {formatMoney(originalPrice * item.quantity)}
                        </p>
                      )}
                      {item.quantity > 1 && (
                        <p className="text-[12px] text-muted">
                          {formatMoney(finalPrice)} each
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="link-underline mt-3 hidden w-fit text-[13px] uppercase text-muted hover:text-ink md:inline-block"
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {/* ───── Summary ───── */}
        <aside
          aria-label="Order summary"
          className="mx-4 mt-6 rounded-2xl border border-ink/10 p-5 md:sticky md:top-[var(--bar-h)] md:mx-0 md:mt-0 md:min-h-[calc(100vh-var(--header-h))] md:rounded-none md:border-0 md:border-l md:border-ink-line md:px-[var(--gutter)] md:py-10"
        >
          <h2 className="mb-6 hidden font-serif text-[32px] font-light leading-none md:block">
            Summary
          </h2>
          {summary}
          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="btn btn-solid btn-lg mt-8 hidden w-full !px-5 md:inline-flex"
          >
            <span>Proceed to checkout</span>
            <ArrowRight className="btn-icon h-[18px] w-[18px]" />
          </button>
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-cream-deep p-4 text-[13px] leading-snug text-ink/80 md:rounded-none">
            <Cash className="h-5 w-5 shrink-0" />
            <p>Pay cash on delivery. Taxes calculated at checkout.</p>
          </div>
        </aside>
      </div>

      {/* Mobile checkout bar above the tab bar */}
      <div className="bottom-tabbar fixed inset-x-0 z-40 border-t border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur-lg md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase text-muted">Total</p>
            <p className="text-[17px] leading-tight tabular-nums">
              {formatMoney(totalAmount)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="btn btn-solid btn-md h-12 flex-1"
          >
            <span>Checkout</span>
            <ArrowRight className="btn-icon h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="h-24 md:hidden" aria-hidden="true" />
    </main>
  );
}
