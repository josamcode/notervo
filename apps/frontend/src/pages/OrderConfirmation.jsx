// src/pages/OrderConfirmation.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import SmartImage from "../components/ui/SmartImage";
import Pill from "../components/ui/Pill";
import {
  EmptyState,
  Eyebrow,
  SummaryRow,
  formatMoney,
} from "../components/ui/Primitives";
import {
  Cash,
  Check,
  Close,
  Spinner,
  Tag,
  Truck,
} from "../components/ui/Icons";

/* ───────────────────────── icon helpers ───────────────────────── */
const Icon = ({ children, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
    className={`w-5 h-5 ${className}`}
  >
    {children}
  </svg>
);

const ShieldIcon = (p) => (
  <Icon {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
    />
  </Icon>
);
const ClipboardIcon = (p) => (
  <Icon {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
    />
  </Icon>
);
const PackageIcon = (p) => (
  <Icon {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
    />
  </Icon>
);
const CheckCircleIconOutline = (p) => (
  <Icon {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </Icon>
);
const AlertIcon = (p) => (
  <Icon {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
    />
  </Icon>
);
const CopyIcon = (p) => (
  <Icon {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
    />
  </Icon>
);

/* ───────────────────────── step indicator ───────────────────────── */
const STEPS = ["Cart", "Shipping", "Payment", "Confirmed"];
const StepIndicator = () => (
  <ol
    aria-label="Checkout progress"
    className="mx-auto mb-8 flex max-w-md select-none items-center justify-center md:mb-12"
  >
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        {i > 0 && (
          <li aria-hidden="true" className="mx-2 h-px w-6 bg-ink sm:w-12" />
        )}
        <li className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-cream">
            <Check className="h-3 w-3" strokeWidth={2.5} />
          </span>
          <span
            className={`text-[11px] uppercase tracking-[0.02em] ${i === 3 ? "text-ink" : "text-muted"}`}
          >
            {label}
          </span>
        </li>
      </React.Fragment>
    ))}
  </ol>
);

/* ───────────────────────── order status timeline ───────────────────────── */
const StatusTimeline = ({ state, createdAt: _createdAt }) => {
  if (state === "cancelled") {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-ember/40 bg-ember/10 px-4 py-4 md:rounded-none md:px-5 md:py-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ember text-cream">
          <Close className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-[15px] text-ink">Order Cancelled</p>
          <p className="text-[13px] text-muted">
            This order was cancelled and will not be delivered.
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    {
      key: "pending",
      label: "Order Placed",
      icon: ClipboardIcon,
      desc: "We've received your order",
    },
    {
      key: "processing",
      label: "Processing",
      icon: PackageIcon,
      desc: "Your order is being prepared",
    },
    {
      key: "shipped",
      label: "Shipped",
      icon: Truck,
      desc: "On the way to you",
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: CheckCircleIconOutline,
      desc: "Successfully delivered",
    },
  ];

  const currentIndex = steps.findIndex((s) => s.key === state);
  const activeIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <ol className="flex items-start">
      {steps.map((step, i) => {
        const done = i <= activeIdx;
        const active = i === activeIdx;
        const StepIcon = step.icon;
        return (
          <li
            key={step.key}
            aria-current={active ? "step" : undefined}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {/* connector line */}
            {i > 0 && (
              <span
                aria-hidden="true"
                className={`absolute right-1/2 top-[18px] h-px w-full ${done ? "bg-ink" : "bg-ink/15"}`}
              />
            )}
            <span
              className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300 ${
                done
                  ? "bg-ink text-cream"
                  : "border border-ink/15 bg-cream text-ink/40"
              } ${active ? "ring-4 ring-ink/10" : ""}`}
            >
              <StepIcon className="h-4 w-4" />
            </span>
            <span
              className={`mt-2.5 text-[11px] uppercase leading-tight tracking-[0.02em] md:text-[12px] ${done ? "text-ink" : "text-muted"}`}
            >
              {step.label}
            </span>
            <span
              className={`mt-1 hidden text-[12px] md:block ${done ? "text-muted" : "text-ink/30"}`}
            >
              {step.desc}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

/* ───────────────────────── copy to clipboard ───────────────────────── */
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard may be unavailable outside a secure browser context. */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-[12px] uppercase text-muted transition-colors hover:text-ink"
      title="Copy order number"
      aria-label={copied ? "Order number copied" : "Copy order number"}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-ink" strokeWidth={2} />
          <span className="text-ink">Copied</span>
        </>
      ) : (
        <>
          <CopyIcon className="h-3.5 w-3.5" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
};

const SectionTitle = ({ icon: SectionIcon, children, aside }) => (
  <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-3.5 md:border-ink/15 md:px-0 md:pb-4 md:pt-0">
    <h2 className="flex items-center gap-2 font-sans text-[13px] uppercase tracking-[0.02em] text-ink">
      {SectionIcon && <SectionIcon className="h-[18px] w-[18px]" />}
      {children}
    </h2>
    {aside}
  </div>
);

/* ───────────────────────── main component ───────────────────────── */
const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confettiDone, setConfettiDone] = useState(false);

  const token = Cookies.get("token");
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const guestToken = sessionStorage.getItem(`notervo:order:${id}`);
        const requestConfig = {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(guestToken && { "X-Order-Token": guestToken }),
          },
        };

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/${id}`,
          requestConfig
        );

        if (res.data.status === "success") {
          const fetchedOrder = res.data.order;

          setOrder(fetchedOrder[0]);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError(
          err.response?.data?.message || "Could not load order details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Trigger confetti entrance animation
    const timer = setTimeout(() => setConfettiDone(true), 100);
    return () => clearTimeout(timer);
  }, [id, token]);

  /* ───── Loading ───── */
  if (loading) {
    return (
      <div
        role="status"
        className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-muted"
      >
        <Spinner className="h-6 w-6" />
        <p className="text-[14px]">Loading your order...</p>
      </div>
    );
  }

  /* ───── Error ───── */
  if (error) {
    return (
      <EmptyState
        icon={AlertIcon}
        title="Something went wrong"
        description={error}
        actionLabel="Go back"
        onAction={() => window.history.back()}
      />
    );
  }

  /* ───── Not found ───── */
  if (!order) {
    return (
      <EmptyState
        icon={PackageIcon}
        title="Order not found"
        description="We couldn't find this order."
        actionLabel={isLoggedIn ? "View all orders" : "Continue shopping"}
        actionTo={isLoggedIn ? "/profile" : "/shop"}
      />
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayOrderId =
    order.orderNumber ||
    `NTV-${String(order._id || "")
      .slice(-6)
      .toUpperCase()}`;
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = order.couponCode ? subtotal - order.total : 0;

  const stateMessage = {
    pending:
      "Your order has been placed successfully. We’ll start processing it shortly.",
    processing: "Your order is being processed and prepared for shipment.",
    shipped: "Good news! Your order has been shipped and is on the way to you.",
    delivered: "Delivered! We hope you enjoy your purchase.",
    cancelled:
      "This order has been cancelled. If you need help, contact support.",
  };

  const confirmationText =
    stateMessage?.[order.state] ||
    "Your order has been confirmed and is being processed.";
  const isCancelled = order.state === "cancelled";
  const isCod = order.paymentMethod === "CashOnDelivery";

  return (
    <div className="pb-10 pt-6 md:pb-20 md:pt-12">
      <div className="container-x">
        {/* Step indicator — all complete */}
        <StepIndicator />

        {/* ───── Success hero ───── */}
        <div
          className={`mx-auto mb-8 max-w-2xl text-center transition-[opacity,transform] duration-700 ease-out md:mb-14 ${
            confettiDone
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          <span
            className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full md:mb-7 md:h-16 md:w-16 ${
              isCancelled ? "bg-ember text-cream" : "bg-ink text-cream"
            }`}
          >
            {isCancelled ? (
              <Close className="h-7 w-7" strokeWidth={2} />
            ) : (
              <Check className="h-7 w-7" strokeWidth={2} />
            )}
          </span>

          <Eyebrow className="mb-3 text-muted">
            {isCancelled ? "Order cancelled" : "Order confirmed"}
          </Eyebrow>
          <h1 className="font-serif text-[34px] font-light leading-[1] tracking-tight md:text-display-lg">
            Thank You, {order.shippingAddress.fullName.split(" ")[0]}!
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-snug text-muted md:text-[17px]">
            {confirmationText}
          </p>

          {/* Order ID badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink/20 py-1 pl-4 pr-1">
            <span className="text-[12px] uppercase text-muted">Order</span>
            <span className="font-mono text-[14px] text-ink">
              {displayOrderId}
            </span>
            <CopyButton text={displayOrderId} />
          </div>
          <p className="mt-3 text-[12px] text-muted">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        {/* ───── Order state timeline ───── */}
        <section
          aria-label="Order status"
          className="panel mb-6 px-3 py-5 md:mb-12 md:border-x-0 md:border-y md:border-ink-line md:px-0 md:py-10"
        >
          <StatusTimeline state={order.state} createdAt={order.createdAt} />
        </section>

        {/* ───── Main content grid ───── */}
        <div className="grid items-start gap-4 md:gap-12 lg:grid-cols-[1fr_minmax(340px,36%)]">
          {/* LEFT: Items + Payment */}
          <div className="space-y-4 md:space-y-12">
            {/* Items */}
            <section className="panel overflow-hidden md:overflow-visible md:border-0">
              <SectionTitle
                icon={PackageIcon}
                aside={
                  <span className="text-[13px] text-muted">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                }
              >
                Items ordered
              </SectionTitle>
              <ul className="divide-y divide-ink/10">
                {order.items.map((item) => {
                  const originalPrice = Number(item.originalPrice);
                  const finalPrice = Number(item.price);
                  const hasDiscount =
                    Number.isFinite(originalPrice) &&
                    originalPrice > finalPrice;

                  return (
                    <li
                      key={item._id}
                      className="flex gap-4 px-4 py-4 md:px-0 md:py-5"
                    >
                      <div className="relative shrink-0">
                        <SmartImage
                          src={item.image}
                          alt={item.name || "Product"}
                          width={240}
                          sizes="80px"
                          className="h-16 w-16 overflow-hidden rounded-xl object-cover md:h-20 md:w-20 md:rounded-none"
                          fallbackClassName="[&>span]:text-[11px]"
                        />
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ink px-1 text-[10px] text-cream">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-sans text-[14px] uppercase tracking-normal text-ink md:text-[15px]">
                          {item.name || "Product"}
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-x-3 text-[13px] text-muted">
                          {item.size && (
                            <span>
                              Size:{" "}
                              <span className="capitalize text-ink">
                                {item.size}
                              </span>
                            </span>
                          )}
                          {item.color && (
                            <span className="inline-flex items-center gap-1.5">
                              Color:{" "}
                              {item.color.startsWith("#") ? (
                                <span
                                  className="inline-block h-3 w-3 rounded-full border border-ink/20"
                                  style={{ backgroundColor: item.color }}
                                  aria-label={item.color}
                                />
                              ) : (
                                <span className="capitalize text-ink">
                                  {item.color}
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[13px] text-muted">
                          {formatMoney(finalPrice)} each
                          {hasDiscount && (
                            <span className="ml-1.5 line-through">
                              {originalPrice.toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="self-center text-right">
                        <p className="whitespace-nowrap text-[14px] text-ink md:text-[15px]">
                          {formatMoney(finalPrice * item.quantity)}
                        </p>
                        {hasDiscount && (
                          <p className="text-[12px] text-muted line-through">
                            {(originalPrice * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Payment */}
            <section className="panel overflow-hidden md:overflow-visible md:border-0">
              <SectionTitle icon={Cash}>Payment</SectionTitle>
              <div className="flex items-center gap-3 px-4 py-4 md:px-0 md:py-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-deep">
                  <Cash className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[15px] text-ink">
                    {isCod ? "Cash on Delivery" : order.paymentMethod}
                  </p>
                  <p className="text-[13px] text-muted">
                    {isCod ? "You will pay upon delivery" : "Payment confirmed"}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT: Shipping + Summary + Actions (sticky) */}
          <div className="space-y-4 md:space-y-8 lg:sticky lg:top-[calc(var(--bar-h)+24px)]">
            {/* Shipping address */}
            <section className="panel overflow-hidden md:border md:border-ink/15 md:p-6">
              <SectionTitle icon={Truck}>Delivery address</SectionTitle>
              <address className="space-y-1 px-4 py-4 text-[14px] not-italic leading-snug text-muted md:px-0 md:pb-0 md:pt-5">
                <p className="text-[15px] text-ink">
                  {order.shippingAddress.fullName}
                </p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}</p>
                {order.shippingAddress.notes && (
                  <p className="!mt-3 rounded-lg bg-cream-deep px-3 py-2.5 text-[13px] text-ink md:rounded-none">
                    <span className="uppercase text-muted">Note:</span>{" "}
                    {order.shippingAddress.notes}
                  </p>
                )}
              </address>
            </section>

            {/* Order summary */}
            <section className="panel overflow-hidden md:border md:border-ink/15 md:p-6">
              <SectionTitle>Order total</SectionTitle>
              <div className="space-y-3 px-4 py-4 md:px-0 md:pb-0 md:pt-5">
                <SummaryRow label={`Subtotal (${itemCount} items)`}>
                  {formatMoney(subtotal)}
                </SummaryRow>
                <SummaryRow label="Shipping">Free</SummaryRow>
                {order.couponCode && discount > 0 && (
                  <SummaryRow
                    label={
                      <span className="inline-flex items-center gap-1.5">
                        <Tag className="h-4 w-4" />
                        Coupon ({order.couponCode})
                      </span>
                    }
                  >
                    -{discount.toFixed(2)}
                  </SummaryRow>
                )}
                <SummaryRow
                  label="Total"
                  strong
                  className="border-t border-ink/15 pt-4"
                >
                  {formatMoney(order.total)}
                </SummaryRow>
              </div>
            </section>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              <Pill
                to={isLoggedIn ? "/profile" : "/shop"}
                variant="solid"
                size="lg"
                arrow
                className="w-full"
              >
                {isLoggedIn ? "View all orders" : "Continue shopping"}
              </Pill>
              {isLoggedIn && (
                <Pill to="/shop" variant="outline" size="lg" className="w-full">
                  Continue shopping
                </Pill>
              )}
            </div>

            {/* Trust footer */}
            <div className="flex items-center justify-center gap-4 text-[12px] text-muted">
              <span className="flex items-center gap-1.5">
                <ShieldIcon className="h-3.5 w-3.5" /> Secure order
              </span>
              <span className="h-3 w-px bg-ink/15" />
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" /> Fast delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
