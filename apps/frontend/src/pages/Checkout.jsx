import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { showSuccess, showError } from "../utils/Toast";
import { getDiscountedPrice } from "../utils/pricing";
import { clearGuestCart, getGuestCartItems } from "../utils/guestCart";
import SmartImage from "../components/ui/SmartImage";
import {
  EmptyState,
  SummaryRow,
  formatMoney,
} from "../components/ui/Primitives";
import {
  ArrowLeft,
  Bag,
  Cash,
  Check,
  ChevronDown,
  Spinner,
  Tag,
} from "../components/ui/Icons";

/* ───────────────────────── step indicator ───────────────────────── */
const STEPS = ["Cart", "Shipping", "Payment", "Confirm"];
const StepIndicator = ({ current = 1 }) => (
  <ol
    className="flex items-center gap-2 text-[12px] uppercase tracking-[0.02em] md:gap-3 md:text-[13px]"
    aria-label="Checkout progress"
  >
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={label}>
          {i > 0 && (
            <li aria-hidden="true" className="h-px w-4 bg-ink/25 md:w-8" />
          )}
          <li
            aria-current={active ? "step" : undefined}
            className={`flex items-center gap-1.5 ${active ? "text-ink" : done ? "text-ink/70" : "text-ink/40"}`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                done
                  ? "border-ink bg-ink text-cream"
                  : active
                    ? "border-ink"
                    : "border-ink/30"
              }`}
            >
              {done ? <Check className="h-3 w-3" strokeWidth={2.2} /> : i + 1}
            </span>
            <span className={active ? "" : "hidden sm:inline"}>{label}</span>
          </li>
        </React.Fragment>
      );
    })}
  </ol>
);

/* ───────────────────────── labelled field ───────────────────────── */
const Field = ({ label, required, as = "input", rows, name, ...rest }) => {
  const Element = as;
  const id = `checkout-${name}`;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <Element
        id={id}
        name={name}
        rows={as === "textarea" ? rows : undefined}
        required={required}
        className={`field ${as === "textarea" ? "resize-none" : ""}`}
        {...rest}
      />
    </div>
  );
};

const Section = ({ number, title, children }) => (
  <section className="rounded-2xl border border-ink/10 bg-white/50 p-5 md:rounded-none md:border-0 md:border-b md:border-ink-line md:bg-transparent md:px-[var(--gutter)] md:py-10">
    <h2 className="mb-5 flex items-baseline gap-3 font-serif text-[24px] font-light leading-none md:mb-7 md:text-[32px]">
      <span className="font-sans text-[12px] tabular-nums text-muted md:text-[13px]">
        {number}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

const Checkbox = ({ checked, disabled, onChange, children }) => (
  <label
    className={`flex min-h-[44px] cursor-pointer items-center gap-3 ${disabled ? "pointer-events-none opacity-40" : ""}`}
  >
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      className="peer sr-only"
    />
    <span
      aria-hidden="true"
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 ${
        checked ? "border-ink bg-ink text-cream" : "border-ink/40"
      }`}
    >
      {checked && <Check className="h-3.5 w-3.5" strokeWidth={2.2} />}
    </span>
    <span className="text-[14px]">{children}</span>
  </label>
);

/* ───────────────────────── main component ───────────────────────── */
const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [productDetails, setProductDetails] = useState({});
  const [savedShippingAddresses, setSavedShippingAddresses] = useState([]);
  const [selectedSavedAddressIndex, setSelectedSavedAddressIndex] =
    useState(-1);
  const [saveShippingAddress, setSaveShippingAddress] = useState(true);
  const [setAsDefaultAddress, setSetAsDefaultAddress] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [applying, setApplying] = useState(false);
  const [removing, setRemoving] = useState(false);

  // Coupon section expand
  const [couponOpen, setCouponOpen] = useState(false);

  const token = Cookies.get("token");
  const isLoggedIn = Boolean(token);
  const navigate = useNavigate();
  const summaryRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    street: "",
    notes: "",
    paymentMethod: "CashOnDelivery",
  });

  const applyAddressToForm = (address) => {
    if (!address) return;
    setFormData((prev) => ({
      ...prev,
      fullName: address.fullName || "",
      phone: address.phone || "",
      city: address.city || "",
      street: address.street || "",
      notes: address.notes || "",
    }));
  };

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      try {
        let rawItems = [];
        let addresses = [];

        if (isLoggedIn) {
          const [cartRes, userRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/cart`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios
              .get(`${import.meta.env.VITE_API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .catch(() => null),
          ]);
          rawItems = cartRes?.data?.cart?.items || [];
          addresses = userRes?.data?.user?.shippingAddresses || [];
        } else {
          rawItems = getGuestCartItems().map((item, index) => ({
            _id: `${item.productId}-${item.color || "no-color"}-${item.size || "no-size"}-${index}`,
            productId: { _id: item.productId },
            quantity: item.quantity,
            color: item.color || null,
            size: item.size || null,
          }));
        }

        if (!rawItems.length) {
          showError("Your cart is empty.");
          navigate("/cart");
          return;
        }

        const productFetchPromises = rawItems.map(async (item) => {
          const productId = item.productId?._id || item.productId;
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_API_URL}/products/${productId}`
            );
            return [productId, res.data];
          } catch (err) {
            console.error(`Failed to load product ${productId}`, err);
            return [productId, null];
          }
        });

        const results = await Promise.all(productFetchPromises);
        const detailsMap = Object.fromEntries(
          results.filter(([_, prod]) => prod)
        );
        setProductDetails(detailsMap);

        const normalizedItems = rawItems.map((item, index) => {
          const productId = item.productId?._id || item.productId;
          return {
            _id:
              item._id ||
              `${productId}-${item.color || "no-color"}-${item.size || "no-size"}-${index}`,
            productId: { _id: productId },
            quantity: item.quantity,
            color: item.color || null,
            size: item.size || null,
          };
        });

        const computedTotal = normalizedItems.reduce((sum, item) => {
          const product = detailsMap[item.productId._id];
          if (!product) {
            return sum;
          }
          const { finalPrice } = getDiscountedPrice(product);
          return sum + finalPrice * item.quantity;
        }, 0);

        setCart({ items: normalizedItems, total: computedTotal });
        setOrderTotal(computedTotal);

        setSavedShippingAddresses(addresses);
        if (addresses.length > 0) {
          const defaultIndex = addresses.findIndex(
            (address) => address.isDefault
          );
          const chosenIndex = defaultIndex >= 0 ? defaultIndex : 0;
          applyAddressToForm(addresses[chosenIndex]);
          setSelectedSavedAddressIndex(chosenIndex);
          setSaveShippingAddress(false);
          setSetAsDefaultAddress(false);
        } else {
          setSelectedSavedAddressIndex(-1);
          setSaveShippingAddress(isLoggedIn);
          setSetAsDefaultAddress(isLoggedIn);
        }
      } catch (err) {
        console.error("Error loading cart or products:", err);
        showError("Could not load cart or product data.");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndProducts();
  }, [isLoggedIn, navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      isLoggedIn &&
      ["fullName", "phone", "city", "street", "notes"].includes(name)
    ) {
      setSelectedSavedAddressIndex(-1);
      setSaveShippingAddress(true);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectSavedAddress = (address, index) => {
    applyAddressToForm(address);
    setSelectedSavedAddressIndex(index);
    setSaveShippingAddress(false);
    setSetAsDefaultAddress(false);
  };

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value.trim());
  };

  const handleApplyCoupon = async () => {
    if (!isLoggedIn) {
      showError("Please login to apply coupons.");
      return;
    }

    if (!couponCode) {
      showError("Enter a coupon code");
      return;
    }
    setApplying(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/apply-coupon`,
        { couponCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const { discount, totalAfterDiscount, message } = res.data;
      setAppliedCoupon({ couponCode, discount, totalAfterDiscount });
      setOrderTotal(parseFloat(totalAfterDiscount));
      showSuccess(message);
    } catch (error) {
      showError(error.response?.data?.message || "Invalid or expired coupon");
      setCouponCode("");
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveCoupon = async () => {
    if (!isLoggedIn) {
      showError("Please login to manage coupons.");
      return;
    }

    setRemoving(true);
    try {
      // Coupon previews belong to this checkout; saved orders are immutable here.
      setAppliedCoupon(null);
      setCouponCode("");
      setOrderTotal(cart.total);
      showSuccess("Coupon removed");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to remove coupon");
    } finally {
      setRemoving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.items.length === 0) {
      showError("Your cart is empty!");
      return;
    }
    setSubmitting(true);
    try {
      const orderItems = cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        color: item.color || null,
        size: item.size || null,
      }));

      const payload = {
        items: orderItems,
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          street: formData.street,
          notes: formData.notes,
        },
        ...(isLoggedIn
          ? {
              saveShippingAddress,
              setDefaultShippingAddress:
                saveShippingAddress && setAsDefaultAddress,
            }
          : {}),
        ...(appliedCoupon && { couponCode: appliedCoupon.couponCode }),
      };

      const headers = {
        "Content-Type": "application/json",
      };
      if (isLoggedIn) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders`,
        payload,
        {
          headers,
        }
      );

      if (response.data.status === "success") {
        showSuccess("Order placed successfully!");
        if (!isLoggedIn) {
          clearGuestCart();
        }
        window.dispatchEvent(new Event("cartUpdated"));
        const orderIdentifier =
          response.data.order?.orderNumber || response.data.order?._id;
        if (response.data.guestAccessToken)
          sessionStorage.setItem(
            `notervo:order:${orderIdentifier}`,
            response.data.guestAccessToken
          );
        navigate(`/order-confirmation/${orderIdentifier}`);
      }
    } catch (error) {
      console.error("Order failed:", error);
      const message =
        error.response?.data?.message ||
        "Failed to place order. Please try again.";
      showError(message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ───────────── Loading skeleton ───────────── */
  if (loading) {
    return (
      <div aria-busy="true">
        <div className="container-x pb-6 pt-4 md:border-b md:border-ink-line md:pb-8 md:pt-12">
          <div className="skeleton h-9 w-40 md:h-14 md:w-72" />
          <div className="skeleton mt-5 h-5 w-64" />
        </div>
        <div className="grid gap-4 px-4 md:grid-cols-[1fr_minmax(380px,34%)] md:gap-0 md:px-0">
          <div className="space-y-4 md:space-y-0 md:px-[var(--gutter)] md:py-10">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="skeleton h-12 rounded-xl md:mb-4 md:rounded-none"
              />
            ))}
          </div>
          <div className="skeleton h-72 rounded-2xl md:rounded-none" />
        </div>
      </div>
    );
  }

  /* ───────────── Empty cart ───────────── */
  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        icon={Bag}
        title="Your cart is empty"
        description="Looks like you haven't added anything yet."
        actionLabel="Browse the shop"
        onAction={() => navigate("/shop")}
      />
    );
  }

  const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);

  const placeOrderLabel = submitting ? (
    <>
      <Spinner className="h-4 w-4" />
      <span>Processing…</span>
    </>
  ) : (
    <span>Place order — {formatMoney(orderTotal)}</span>
  );

  /* ───────────── Main checkout ───────────── */
  return (
    <main>
      <header className="container-x pb-5 pt-4 md:flex md:items-end md:justify-between md:border-b md:border-ink-line md:pb-8 md:pt-12">
        <div>
          <Link
            to="/cart"
            className="mb-3 inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink md:mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to cart
          </Link>
          <h1 className="font-serif text-[30px] font-light leading-none tracking-tight md:text-display-lg">
            Checkout
          </h1>
          <p className="mt-2 text-[14px] text-muted md:mt-4 md:text-[17px]">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your order
          </p>
        </div>
        <div className="mt-5 md:mt-0">
          <StepIndicator current={1} />
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid items-start gap-4 px-4 md:grid-cols-[1fr_minmax(380px,34%)] md:gap-0 md:px-0"
      >
        {/* ───── LEFT: Shipping + Payment ───── */}
        <div className="space-y-4 md:space-y-0">
          {savedShippingAddresses.length > 0 && (
            <Section number="01" title="Saved addresses">
              <div className="grid gap-2.5 sm:grid-cols-2">
                {savedShippingAddresses.map((address, index) => {
                  const selected = selectedSavedAddressIndex === index;
                  return (
                    <button
                      key={address._id || index}
                      type="button"
                      onClick={() => handleSelectSavedAddress(address, index)}
                      aria-pressed={selected}
                      className={`relative rounded-xl border p-4 text-left transition-colors md:rounded-none ${
                        selected
                          ? "border-ink bg-ink text-cream"
                          : "border-ink/20 hover:border-ink"
                      }`}
                    >
                      <span className="flex items-center gap-2 text-[15px]">
                        {selected && (
                          <Check className="h-4 w-4" strokeWidth={2} />
                        )}
                        {address.fullName || `Address ${index + 1}`}
                        {address.isDefault && (
                          <span
                            className={`badge ml-auto ${selected ? "bg-cream/15 text-cream" : "bg-ink/5 text-ink"}`}
                          >
                            Default
                          </span>
                        )}
                      </span>
                      {address.city && (
                        <span
                          className={`mt-1 block text-[13px] ${selected ? "text-cream/70" : "text-muted"}`}
                        >
                          {address.city}
                          {address.street ? ` · ${address.street}` : ""}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Section>
          )}

          <Section
            number={savedShippingAddresses.length > 0 ? "02" : "01"}
            title="Shipping details"
          >
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full name"
                  required
                  name="fullName"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
                <Field
                  label="Phone number"
                  required
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <Field
                label="City"
                required
                name="city"
                autoComplete="address-level2"
                value={formData.city}
                onChange={handleChange}
              />
              <Field
                label="Street address"
                required
                as="textarea"
                rows={2}
                name="street"
                autoComplete="street-address"
                value={formData.street}
                onChange={handleChange}
              />
              <Field
                label="Order notes"
                as="textarea"
                rows={2}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />

              {isLoggedIn && (
                <div className="pt-1">
                  <Checkbox
                    checked={saveShippingAddress}
                    onChange={(e) => {
                      const shouldSave = e.target.checked;
                      setSaveShippingAddress(shouldSave);
                      if (!shouldSave) setSetAsDefaultAddress(false);
                    }}
                  >
                    Save for next checkout
                  </Checkbox>
                  <Checkbox
                    checked={
                      savedShippingAddresses.length > 0
                        ? setAsDefaultAddress
                        : false
                    }
                    disabled={!saveShippingAddress}
                    onChange={(e) => setSetAsDefaultAddress(e.target.checked)}
                  >
                    Set as default
                  </Checkbox>
                </div>
              )}
            </div>
          </Section>

          <Section
            number={savedShippingAddresses.length > 0 ? "03" : "02"}
            title="Payment"
          >
            <label
              className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors md:rounded-none md:p-5 ${
                formData.paymentMethod === "CashOnDelivery"
                  ? "border-ink"
                  : "border-ink/20 hover:border-ink/50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="CashOnDelivery"
                checked={formData.paymentMethod === "CashOnDelivery"}
                onChange={handleChange}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2"
              >
                {formData.paymentMethod === "CashOnDelivery" && (
                  <span className="h-2.5 w-2.5 rounded-full bg-ink" />
                )}
              </span>
              <span className="flex-1">
                <span className="block text-[15px]">Cash on delivery</span>
                <span className="block text-[13px] text-muted">
                  Pay when your order arrives
                </span>
              </span>
              <Cash className="h-6 w-6 shrink-0" />
            </label>
          </Section>
        </div>

        {/* ───── RIGHT: Order summary ───── */}
        <aside
          ref={summaryRef}
          aria-label="Order summary"
          className="rounded-2xl border border-ink/10 bg-white/50 md:sticky md:top-[var(--bar-h)] md:min-h-[calc(100vh-var(--header-h))] md:rounded-none md:border-0 md:border-l md:border-ink-line md:bg-cream-deep/60"
        >
          <h2 className="px-5 pb-2 pt-5 font-serif text-[24px] font-light leading-none md:px-[var(--gutter)] md:pt-10 md:text-[32px]">
            Order summary
          </h2>

          <ul className="max-h-[340px] divide-y divide-ink/10 overflow-y-auto px-5 md:px-[var(--gutter)]">
            {cart.items.map((item) => {
              const product = productDetails[item.productId._id];
              const title = product?.title || "Unknown Product";
              const { originalPrice, finalPrice } = getDiscountedPrice(
                product || {}
              );
              const hasDiscount = originalPrice > finalPrice;
              const image = product?.images?.[0];

              return (
                <li key={item._id} className="flex gap-3.5 py-4">
                  <div className="relative shrink-0">
                    <SmartImage
                      src={image}
                      alt={title}
                      width={160}
                      sizes="64px"
                      className="h-16 w-16 rounded-lg object-cover md:rounded-none"
                    />
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-1 text-[10px] text-cream">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-sans text-[14px] tracking-normal">
                      {title}
                    </h3>
                    <p className="mt-0.5 flex flex-wrap gap-x-2 text-[12px] text-muted">
                      {item.color && !item.color.startsWith("#") && (
                        <span>Colour: {item.color}</span>
                      )}
                      {item.size && <span>Format: {item.size}</span>}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right">
                    <p className="text-[14px] tabular-nums">
                      {formatMoney(finalPrice * item.quantity)}
                    </p>
                    {hasDiscount && (
                      <p className="text-[12px] tabular-nums text-muted line-through">
                        {formatMoney(originalPrice * item.quantity)}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Coupon */}
          <div className="border-t border-ink/10 md:border-ink-line">
            <button
              type="button"
              onClick={() => setCouponOpen((v) => !v)}
              aria-expanded={couponOpen}
              className="flex min-h-[52px] w-full items-center justify-between px-5 text-[14px] md:px-[var(--gutter)]"
            >
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {appliedCoupon ? "Coupon applied" : "Have a coupon?"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${couponOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                couponOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-2 px-5 pb-5 md:px-[var(--gutter)]">
                  <div className="flex gap-2">
                    <label htmlFor="coupon-code" className="sr-only">
                      Coupon code
                    </label>
                    <input
                      id="coupon-code"
                      type="text"
                      value={couponCode}
                      onChange={handleCouponChange}
                      placeholder={
                        isLoggedIn ? "Enter code" : "Log in to use coupons"
                      }
                      disabled={appliedCoupon !== null || !isLoggedIn}
                      className="field min-w-0 flex-1"
                    />
                    {!appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={applying || !isLoggedIn}
                        className="btn btn-outline btn-md shrink-0 !h-12"
                      >
                        <span>{applying ? "…" : "Apply"}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        disabled={removing}
                        className="btn btn-outline btn-md shrink-0 !h-12"
                      >
                        <span>{removing ? "…" : "Remove"}</span>
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <p className="flex items-center gap-1.5 text-[13px] text-ink">
                      <Check className="h-4 w-4" strokeWidth={2} />
                      You saved {formatMoney(appliedCoupon.discount || 0)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-3 border-t border-ink/10 px-5 py-5 md:border-ink-line md:px-[var(--gutter)] md:py-7">
            <SummaryRow label="Subtotal">{formatMoney(cart.total)}</SummaryRow>
            <SummaryRow label="Shipping">Free</SummaryRow>
            {appliedCoupon && (
              <SummaryRow label="Coupon discount">
                −{formatMoney(parseFloat(appliedCoupon.discount))}
              </SummaryRow>
            )}
            <div className="border-t border-ink/15 pt-4">
              <SummaryRow label="Total" strong>
                {formatMoney(orderTotal)}
              </SummaryRow>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-solid btn-lg mt-5 hidden w-full !px-5 md:inline-flex"
            >
              {placeOrderLabel}
            </button>
            <p className="pt-1 text-center text-[12px] text-muted">
              Secure checkout · Cash on delivery
            </p>
          </div>
        </aside>

        {/* Mobile: docked place-order bar above the tab bar */}
        <div className="bottom-tabbar fixed inset-x-0 z-40 border-t border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur-lg md:hidden">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-solid btn-md h-12 w-full"
          >
            {placeOrderLabel}
          </button>
        </div>
        <div className="h-20 md:hidden" aria-hidden="true" />
      </form>
    </main>
  );
};

export default CheckoutPage;
