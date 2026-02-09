// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { showError } from "../utils/Toast";
import { resolveProductImageUrl } from "../utils/imageUrl";
import Currency from "../components/Currency";

/* ───────────────────────── icon helpers ───────────────────────── */
const Icon = ({ children, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-5 h-5 ${className}`}
    >
        {children}
    </svg>
);

const UserIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </Icon>
);
const PhoneIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </Icon>
);
const CalendarIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v9.75" />
    </Icon>
);
const PackageIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </Icon>
);
const HeartIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </Icon>
);
const CartIcon = (p) => (
    <Icon {...p}>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 6H6"
        />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="17" cy="20" r="1.5" />
    </Icon>
);
const TruckIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25m-2.25 0h-2.25m0 0V5.625A1.125 1.125 0 0 0 8.625 4.5H3.375A1.125 1.125 0 0 0 2.25 5.625v8.25" />
    </Icon>
);
const ChevronRightIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </Icon>
);
const CreditCardIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </Icon>
);

/* ───────────────────────── status config ───────────────────────── */
const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        dot: "bg-amber-400",
        progress: "w-1/4",
        barColor: "bg-amber-400",
    },
    processing: {
        label: "Processing",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        dot: "bg-blue-500",
        progress: "w-1/2",
        barColor: "bg-blue-500",
    },
    shipped: {
        label: "Shipped",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-primary/20",
        dot: "bg-yellow-400",
        progress: "w-3/4",
        barColor: "bg-yellow-500",
    },
    delivered: {
        label: "Delivered",
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        dot: "bg-green-500",
        progress: "w-full",
        barColor: "bg-green-500",
    },
    cancelled: {
        label: "Cancelled",
        color: "text-red-500",
        bg: "bg-red-50",
        border: "border-gray-200",
        dot: "bg-red-400",
        progress: "w-0",
        barColor: "bg-gray-300",
    },
};

/* ───────────────────────── stat card ───────────────────────── */
const StatCard = ({ icon: IconComp, label, value, unit, accent }) => (
    <div className={`relative overflow-hidden rounded-2xl border ${accent === "primary" ? "border-primary/10 bg-primary/[0.03]" : accent === "green" ? "border-green-100 bg-green-50/50" : "border-gray-100 bg-gray-50/50"} p-4`}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-2xl font-extrabold tracking-tight ${accent === "primary" ? "text-primary" : accent === "green" ? "text-green-600" : "text-gray-900"}`}>
                    {value}
                    {unit && <span className="text-sm font-semibold ml-1">{unit}</span>}
                </p>
            </div>
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent === "primary" ? "bg-primary/10" : accent === "green" ? "bg-green-100" : "bg-gray-100"}`}>
                <IconComp className={`w-[18px] h-[18px] ${accent === "primary" ? "text-primary" : accent === "green" ? "text-green-600" : "text-gray-500"}`} />
            </span>
        </div>
    </div>
);

/* ───────────────────────── order card ───────────────────────── */
const OrderCard = ({ order, getOrderLinkId, getOrderDisplayId }) => {
    const sc = STATUS_CONFIG[order.state] || STATUS_CONFIG.pending;
    const itemCount = order.items.reduce((s, i) => s + (i.quantity || 1), 0);

    return (
        <Link
            to={`/order-confirmation/${getOrderLinkId(order)}`}
            className="group block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden"
        >
            {/* Top bar — status + progress */}
            {order.state !== "cancelled" && (
                <div className="h-1 w-full bg-gray-100">
                    <div className={`h-full rounded-r-full transition-all duration-500 ${sc.progress} ${sc.barColor}`} />
                </div>
            )}

            <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Left info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                                #{getOrderDisplayId(order)}
                            </h3>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full capitalize ${sc.bg} ${sc.color} ${sc.border} border`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                {sc.label}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <CalendarIcon className="w-3.5 h-3.5" />
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                            <span className="flex items-center gap-1">
                                <CreditCardIcon className="w-3.5 h-3.5" />
                                {order.paymentMethod === "CashOnDelivery" ? "COD" : order.paymentMethod}
                            </span>
                            <span className="flex items-center gap-1">
                                <PackageIcon className="w-3.5 h-3.5" />
                                {itemCount} {itemCount === 1 ? "item" : "items"}
                            </span>
                        </div>
                    </div>

                    {/* Right — price + arrow */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-base font-extrabold text-gray-900">
                                {order.total.toFixed(2)}
                            </p>
                            <p className="text-[11px] text-gray-400 font-medium"><Currency /></p>
                        </div>
                        <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all hidden sm:block" />
                    </div>
                </div>

                {/* Product image strip */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                    <div className="flex -space-x-2 overflow-hidden">
                        {order.items.slice(0, 5).map((item, idx) => (
                            <img
                                key={item._id}
                                src={resolveProductImageUrl(item.image)}
                                alt={item.name || "Product"}
                                className="w-10 h-10 rounded-lg object-cover border-2 border-white flex-shrink-0"
                                style={{ zIndex: 5 - idx }}
                                onError={(e) => {
                                    e.target.src = "/images/fallback-product.png";
                                }}
                            />
                        ))}
                    </div>
                    {order.items.length > 5 && (
                        <span className="text-xs text-gray-400 font-medium ml-1">
                            +{order.items.length - 5} more
                        </span>
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
                const userRes = await axios.get(`${process.env.REACT_APP_API_URL}/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!userRes.data.user) throw new Error("Failed to load user data");
                setUser(userRes.data.user);

                const ordersRes = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (ordersRes.data.status === "success") {
                    setOrders(ordersRes.data.orders || []);
                } else {
                    setOrders([]);
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
                        <div className="grid grid-cols-2 gap-3">
                            <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                            <div className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                        </div>
                    </div>
                    <div className="lg:col-span-3 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    /* ───── Not found ───── */
    if (!user) {
        return (
            <div className="max-w-lg mx-auto px-6 py-28 text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserIcon className="w-7 h-7 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">User Not Found</h2>
                <p className="text-gray-500 text-sm mb-6">We couldn't load your profile.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-black transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const getOrderLinkId = (order) => order?.orderNumber || order?._id;
    const getOrderDisplayId = (order) => {
        if (order?.orderNumber) return order.orderNumber;
        return `NTV-${String(order?._id || "").slice(-6).toUpperCase()}`;
    };

    // Filter tabs
    const tabs = [
        { key: "all", label: "All", count: orders.length },
        { key: "pending", label: "Pending", count: orders.filter((o) => o.state === "pending").length },
        { key: "processing", label: "Processing", count: orders.filter((o) => o.state === "processing").length },
        { key: "shipped", label: "Shipped", count: orders.filter((o) => o.state === "shipped").length },
        { key: "delivered", label: "Delivered", count: orders.filter((o) => o.state === "delivered").length },
    ].filter((t) => t.key === "all" || t.count > 0);

    const filteredOrders = activeTab === "all" ? orders : orders.filter((o) => o.state === activeTab);

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

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* ───── Page header ───── */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    My Account
                </h1>
                <p className="text-gray-500 text-sm mt-1">Manage your profile and orders</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                {/* ───── LEFT: Profile sidebar ───── */}
                <div className="lg:col-span-2">
                    <div className="lg:sticky lg:top-24 space-y-4">
                        {/* Profile card */}
                        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Header band */}
                            <div className="h-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />

                            <div className="px-6 pb-6 -mt-10">
                                {/* Avatar */}
                                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/20 border-4 border-white">
                                    {initials}
                                </div>

                                <div className="mt-4 space-y-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{user.username}</h2>
                                        <p className="text-xs text-gray-400 mt-0.5">Member since {memberSince}</p>
                                    </div>

                                    {/* Info rows */}
                                    <div className="space-y-2.5">
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                            <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                <PhoneIcon className="w-4 h-4 text-gray-500" />
                                            </span>
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-medium">Phone</p>
                                                <p className="text-sm font-semibold text-gray-900">{user.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                            <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                <CalendarIcon className="w-4 h-4 text-gray-500" />
                                            </span>
                                            <div>
                                                <p className="text-[11px] text-gray-400 font-medium">Joined</p>
                                                <p className="text-sm font-semibold text-gray-900">{memberSince}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            <StatCard
                                icon={PackageIcon}
                                label="Orders"
                                value={orders.length}
                                accent="primary"
                            />
                            <StatCard
                                icon={CreditCardIcon}
                                label="Total Spent"
                                value={totalSpent.toFixed(0)}
                                unit={<Currency />}
                                accent="green"
                            />
                        </div>

                        {/* Quick links */}
                        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-3 border-b border-gray-100">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Links</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                <Link
                                    to="/wishlist"
                                    className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors group"
                                >
                                    <span className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                                        <HeartIcon className="w-4 h-4 text-red-500" />
                                    </span>
                                    <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Wishlist</span>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                </Link>
                                <Link
                                    to="/cart"
                                    className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors group"
                                >
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <CartIcon className="w-4 h-4 text-primary" />
                                    </span>
                                    <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Cart</span>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                </Link>
                                <Link
                                    to="/shop"
                                    className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 transition-colors group"
                                >
                                    <span className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                                        <TruckIcon className="w-4 h-4 text-green-600" />
                                    </span>
                                    <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Shop</span>
                                    <ChevronRightIcon className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>

                {/* ───── RIGHT: Orders ───── */}
                <div className="lg:col-span-3 space-y-5">
                    {/* Section header + filter tabs */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <PackageIcon className="w-[18px] h-[18px] text-primary" />
                                <h2 className="text-base font-semibold text-gray-900">My Orders</h2>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">
                                {orders.length} total
                            </span>
                        </div>

                        {/* Filter tabs */}
                        {orders.length > 0 && tabs.length > 1 && (
                            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`
                                            flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200
                                            ${activeTab === tab.key
                                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                                : "bg-white text-gray-600 border border-gray-200 hover:border-primary/30 hover:text-primary"
                                            }
                                        `}
                                    >
                                        {tab.label}
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-white/20" : "bg-gray-100"}`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Orders list */}
                    {orders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <PackageIcon className="w-7 h-7 text-gray-400" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-1">No orders yet</h3>
                            <p className="text-sm text-gray-500 mb-6">Start shopping to see your orders here.</p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-black transition-colors"
                            >
                                Browse Shop
                            </Link>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                            <p className="text-sm text-gray-500">No {activeTab} orders found.</p>
                            <button
                                onClick={() => setActiveTab("all")}
                                className="mt-3 text-sm text-primary font-medium hover:underline"
                            >
                                View all orders
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredOrders.map((order) => (
                                <OrderCard
                                    key={order._id}
                                    order={order}
                                    getOrderLinkId={getOrderLinkId}
                                    getOrderDisplayId={getOrderDisplayId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default Profile;