// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { showError } from "../utils/Toast";
import SmartImage from "../components/ui/SmartImage";
import Reveal from "../components/ui/Reveal";
import {
  EmptyState,
  PageHeader,
  formatMoney,
} from "../components/ui/Primitives";
import {
  Bag,
  ChevronRight,
  Heart,
  User as UserIcon,
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

const PackageIcon = (p) => (
  <Icon {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
    />
  </Icon>
);
const GridIcon = (p) => (
  <Icon {...p}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4h6.5v6.5H4zM13.5 4H20v6.5h-6.5zM4 13.5h6.5V20H4zM13.5 13.5H20V20h-6.5z"
    />
  </Icon>
);

/* ───────────────────────── status config ───────────────────────── */
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    badge: "border border-ink/30 text-ink",
    progress: "w-1/4",
  },
  processing: {
    label: "Processing",
    badge: "bg-periwinkle text-ink",
    progress: "w-1/2",
  },
  shipped: {
    label: "Shipped",
    badge: "bg-cream-deep border border-ink/20 text-ink",
    progress: "w-3/4",
  },
  delivered: {
    label: "Delivered",
    badge: "bg-ink text-cream",
    progress: "w-full",
  },
  cancelled: {
    label: "Cancelled",
    badge: "border border-ember/50 text-ember",
    progress: "w-0",
  },
};

/* ───────────────────────── order card ───────────────────────── */
const OrderCard = ({ order, getOrderLinkId, getOrderDisplayId }) => {
  const sc = STATUS_CONFIG[order.state] || STATUS_CONFIG.pending;
  const itemCount = order.items.reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <Link
      to={`/order-confirmation/${getOrderLinkId(order)}`}
      className="group block overflow-hidden rounded-2xl border border-ink/10 bg-white/60 transition-colors duration-200 active:bg-cream-deep md:rounded-none md:border-0 md:border-b md:border-ink/15 md:bg-transparent md:hover:bg-cream-deep/60"
    >
      {/* Progress line */}
      {order.state !== "cancelled" && (
        <div className="h-[2px] w-full bg-ink/10 md:hidden">
          <div className={`h-full bg-ink ${sc.progress}`} />
        </div>
      )}

      <div className="p-4 md:px-0 md:py-6">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-sans text-[15px] tracking-normal text-ink md:text-[16px]">
                #{getOrderDisplayId(order)}
              </h3>
              <span className={`badge ${sc.badge}`}>{sc.label}</span>
            </div>
            <p className="mt-1.5 text-[13px] text-muted">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              {" · "}
              {order.paymentMethod === "CashOnDelivery"
                ? "COD"
                : order.paymentMethod}
              {" · "}
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-right text-[15px] text-ink">
              {formatMoney(order.total)}
            </p>
            <ChevronRight className="h-4 w-4 text-ink/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" />
          </div>
        </div>

        {/* Product image strip */}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex -space-x-2">
            {order.items.slice(0, 5).map((item, idx) => (
              <SmartImage
                key={item._id}
                src={item.image}
                alt={item.name || "Product"}
                width={120}
                sizes="44px"
                className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border-2 border-cream object-cover md:rounded-none"
                fallbackClassName="[&>span]:hidden"
                style={{ zIndex: 5 - idx }}
              />
            ))}
          </div>
          {order.items.length > 5 && (
            <span className="ml-1 text-[12px] text-muted">
              +{order.items.length - 5} more
            </span>
          )}
          {order.state !== "cancelled" && (
            <div className="ml-auto hidden h-[2px] w-32 bg-ink/10 md:block">
              <div className={`h-full bg-ink ${sc.progress}`} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

/* ───────────────────────── main component ───────────────────────── */
const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchProfileData = async () => {
      try {
        const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.data.user) throw new Error("Failed to load user data");
        setUser(userRes.data.user);

        try {
          const ordersRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/orders`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (ordersRes.data.status === "success") {
            setOrders(ordersRes.data.orders || []);
          } else {
            setOrders([]);
          }
        } catch (ordersErr) {
          // Backward compatibility: some API versions return 404 when the user has no orders.
          if (ordersErr?.response?.status === 404) {
            setOrders([]);
          } else {
            throw ordersErr;
          }
        }
      } catch (err) {
        console.error("Error fetching profile or orders:", err);
        showError("Failed to load profile or orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [token]);

  /* ───── Loading ───── */
  if (loading) {
    return (
      <div aria-busy="true">
        <div className="container-x pb-5 pt-4 md:border-b md:border-ink-line md:pb-8 md:pt-12">
          <div className="skeleton h-3 w-20" />
          <div className="skeleton mt-4 h-9 w-56 md:h-14 md:w-80" />
        </div>
        <div className="container-x grid gap-6 py-6 lg:grid-cols-[minmax(320px,29%)_1fr] lg:gap-12 lg:py-12">
          <div className="space-y-4">
            <div className="skeleton h-48 rounded-2xl md:rounded-none" />
            <div className="grid grid-cols-2 gap-3">
              <div className="skeleton h-24 rounded-2xl md:rounded-none" />
              <div className="skeleton h-24 rounded-2xl md:rounded-none" />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="skeleton h-28 rounded-2xl md:rounded-none"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ───── Not found ───── */
  if (!user) {
    return (
      <EmptyState
        icon={UserIcon}
        title="User not found"
        description="We couldn't load your profile."
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const getOrderLinkId = (order) => order?.orderNumber || order?._id;
  const getOrderDisplayId = (order) => {
    if (order?.orderNumber) return order.orderNumber;
    return `NTV-${String(order?._id || "")
      .slice(-6)
      .toUpperCase()}`;
  };

  // Filter tabs
  const tabs = [
    { key: "all", label: "All", count: orders.length },
    {
      key: "pending",
      label: "Pending",
      count: orders.filter((o) => o.state === "pending").length,
    },
    {
      key: "processing",
      label: "Processing",
      count: orders.filter((o) => o.state === "processing").length,
    },
    {
      key: "shipped",
      label: "Shipped",
      count: orders.filter((o) => o.state === "shipped").length,
    },
    {
      key: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.state === "delivered").length,
    },
  ].filter((t) => t.key === "all" || t.count > 0);

  const filteredOrders =
    activeTab === "all" ? orders : orders.filter((o) => o.state === activeTab);

  const initials = user.username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const quickLinks = [
    { to: "/wishlist", label: "Wishlist", icon: Heart },
    { to: "/cart", label: "Cart", icon: Bag },
    { to: "/shop", label: "Shop", icon: GridIcon },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="My account"
        description="Manage your profile and orders"
      />

      <div className="container-x grid items-start gap-6 pb-10 pt-2 md:pt-0 lg:grid-cols-[minmax(320px,29%)_1fr] lg:gap-0">
        {/* ───── LEFT: Profile sidebar ───── */}
        <aside className="space-y-4 md:space-y-0 lg:sticky lg:top-[calc(var(--bar-h)+24px)] lg:border-r lg:border-ink-line lg:pr-10">
          {/* Profile card */}
          <section className="panel p-5 md:border-0 md:px-0 md:pb-8 md:pt-10">
            <div className="flex items-center gap-4">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-[22px] text-cream md:h-16 md:w-16"
              >
                {initials}
              </span>
              <div className="min-w-0">
                <h2 className="truncate font-serif text-[24px] font-light leading-tight md:text-[30px]">
                  {user.username}
                </h2>
                <p className="mt-0.5 text-[13px] text-muted">
                  Member since {memberSince}
                </p>
              </div>
            </div>

            <dl className="mt-5 divide-y divide-ink/10 border-y border-ink/10 md:mt-8">
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-[12px] uppercase text-muted">Phone</dt>
                <dd className="text-[14px] text-ink">{user.phone}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-[12px] uppercase text-muted">Joined</dt>
                <dd className="text-[14px] text-ink">{memberSince}</dd>
              </div>
            </dl>
          </section>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:gap-0 md:border-y md:border-ink-line">
            <div className="rounded-2xl bg-cream-deep p-4 md:rounded-none md:border-r md:border-ink-line md:bg-transparent md:px-0 md:py-6">
              <p className="text-[12px] uppercase text-muted">Orders</p>
              <p className="mt-2 font-serif text-[32px] font-light leading-none">
                {orders.length}
              </p>
            </div>
            <div className="rounded-2xl bg-cream-deep p-4 md:rounded-none md:bg-transparent md:py-6 md:pl-6 md:pr-0">
              <p className="text-[12px] uppercase text-muted">Total spent</p>
              <p className="mt-2 font-serif text-[32px] font-light leading-none">
                {totalSpent.toFixed(0)}
                <span className="ml-1 font-sans text-[13px] text-muted">
                  EGP
                </span>
              </p>
            </div>
          </div>

          {/* Quick links */}
          <nav
            aria-label="Quick links"
            className="panel overflow-hidden md:border-0 md:pt-6"
          >
            <h3 className="px-4 pb-1 pt-4 font-sans text-[12px] uppercase tracking-normal text-muted md:px-0 md:pt-0">
              Quick links
            </h3>
            <ul className="divide-y divide-ink/10">
              {quickLinks.map(({ to, label, icon: LinkIcon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex min-h-[52px] items-center gap-3 px-4 text-[15px] text-ink active:bg-cream-deep md:px-0"
                  >
                    <LinkIcon className="h-[18px] w-[18px]" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight className="h-4 w-4 text-ink/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* ───── RIGHT: Orders ───── */}
        <section
          aria-labelledby="orders-title"
          className="min-w-0 lg:pl-10 lg:pt-10"
        >
          <div className="mb-4 flex items-end justify-between md:mb-6">
            <h2
              id="orders-title"
              className="font-serif text-[26px] font-light leading-none md:text-display"
            >
              My orders
            </h2>
            <span className="text-[13px] text-muted">
              {orders.length} total
            </span>
          </div>

          {/* Filter tabs */}
          {orders.length > 0 && tabs.length > 1 && (
            <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:mb-2 md:px-0">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    aria-pressed={active}
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors duration-200 ${
                      active
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/25 text-ink hover:border-ink"
                    }`}
                  >
                    {tab.label}
                    <span className={active ? "text-cream/70" : "text-muted"}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Orders list */}
          {orders.length === 0 ? (
            <div className="panel md:border-y md:border-ink/15">
              <EmptyState
                icon={PackageIcon}
                title="No orders yet"
                description="Start shopping to see your orders here."
                actionLabel="Browse shop"
                actionTo="/shop"
                className="!py-12 md:!py-16"
              />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="panel py-12 text-center md:border-y md:border-ink/15">
              <p className="text-[14px] text-muted">
                No {activeTab} orders found.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className="link-underline mt-3 text-[13px] uppercase text-ink"
              >
                View all orders
              </button>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-0 md:border-t md:border-ink/15">
              {filteredOrders.map((order, i) => (
                <Reveal key={order._id} delay={Math.min(i, 6) * 50} fade>
                  <OrderCard
                    order={order}
                    getOrderLinkId={getOrderLinkId}
                    getOrderDisplayId={getOrderDisplayId}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Profile;
