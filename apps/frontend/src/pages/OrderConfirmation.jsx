// src/pages/OrderConfirmation.js
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
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

const TruckIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25m-2.25 0h-2.25m0 0V5.625A1.125 1.125 0 0 0 8.625 4.5H3.375A1.125 1.125 0 0 0 2.25 5.625v8.25" />
    </Icon>
);
const CreditCardIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
    </Icon>
);
const MapPinIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </Icon>
);
const ShieldIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </Icon>
);
const ClipboardIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
    </Icon>
);
const PackageIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </Icon>
);

/* ───────────────────────── step indicator ───────────────────────── */
const STEPS = ["Cart", "Shipping", "Payment", "Confirmed"];
const StepIndicator = () => (
    <div className="flex items-center justify-center gap-0 mb-10 select-none">
        {STEPS.map((label, i) => (
            <React.Fragment key={label}>
                {i > 0 && (
                    <div className="h-[2px] w-8 sm:w-14 bg-primary transition-colors duration-300" />
                )}
                <div className="flex flex-col items-center gap-1.5">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold bg-primary text-white transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                    </span>
                    <span className={`text-[11px] font-medium tracking-wide ${i === 3 ? "text-primary" : "text-gray-600"}`}>
                        {label}
                    </span>
                </div>
            </React.Fragment>
        ))}
    </div>
);

/* ───────────────────────── order status timeline ───────────────────────── */
const StatusTimeline = ({ state, createdAt }) => {
    if (state === "cancelled") {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white">
                        <XCircleIcon className="h-5 w-5" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
                        <p className="text-xs text-red-600">This order was cancelled and will not be delivered.</p>
                    </div>
                </div>
            </div>
        );
    }

    const steps = [
        { key: "pending", label: "Order Placed", icon: ClipboardIcon, desc: "We've received your order" },
        { key: "processing", label: "Processing", icon: PackageIcon, desc: "Your order is being prepared" },
        { key: "shipped", label: "Shipped", icon: TruckIcon, desc: "On the way to you" },
        { key: "delivered", label: "Delivered", icon: CheckCircleIconOutline, desc: "Successfully delivered" },
    ];

    const currentIndex = steps.findIndex((s) => s.key === state);
    const activeIdx = currentIndex >= 0 ? currentIndex : 0;

    return (
        <div className="flex items-start gap-0">
            {steps.map((step, i) => {
                const done = i <= activeIdx;
                const active = i === activeIdx;
                const StepIcon = step.icon;
                return (
                    <div key={step.key} className="flex-1 flex flex-col items-center text-center relative">
                        {/* connector line */}
                        {i > 0 && (
                            <div
                                className={`absolute top-4 right-1/2 w-full h-[2px] -z-10 transition-colors duration-500 ${done ? "bg-primary" : "bg-gray-200"}`}
                            />
                        )}
                        <span
                            className={`
                                relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
                                ${done
                                    ? active
                                        ? "bg-primary text-white ring-4 ring-primary/20"
                                        : "bg-primary text-white"
                                    : "bg-gray-100 text-gray-400"
                                }
                            `}
                        >
                            <StepIcon className="w-4 h-4" />
                        </span>
                        <span className={`text-[11px] font-semibold mt-2 ${done ? "text-gray-900" : "text-gray-400"}`}>
                            {step.label}
                        </span>
                        <span className={`text-[10px] mt-0.5 hidden sm:block ${done ? "text-gray-500" : "text-gray-300"}`}>
                            {step.desc}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const CheckCircleIconOutline = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Icon>
);
const XCircleIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </Icon>
);

/* ───────────────────────── copy to clipboard ───────────────────────── */
const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch { }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-primary transition-colors"
            title="Copy order number"
        >
            {copied ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-green-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-green-500">Copied</span>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                    <span>Copy</span>
                </>
            )}
        </button>
    );
};

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
                const requestConfig = token
                    ? { headers: { Authorization: `Bearer ${token}` } }
                    : {};

                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/orders/${id}`,
                    requestConfig
                );

                if (res.data.status === "success") {
                    const fetchedOrder = res.data.order;
                    console.log(res.data.order);

                    setOrder(fetchedOrder[0]);
                } else {
                    setError("Order not found.");
                }
            } catch (err) {
                console.error("Failed to fetch order:", err);
                setError(err.response?.data?.message || "Could not load order details.");
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
            <div className="min-h-[70vh] flex justify-center items-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">Loading your order...</p>
                </div>
            </div>
        );
    }

    /* ───── Error ───── */
    if (error) {
        return (
            <div className="max-w-lg mx-auto px-6 py-28 text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-black transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    /* ───── Not found ───── */
    if (!order) {
        return (
            <div className="max-w-lg mx-auto px-6 py-28 text-center">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <PackageIcon className="w-7 h-7 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-500 text-sm mb-6">We couldn't find this order.</p>
                <Link
                    to={isLoggedIn ? "/profile" : "/shop"}
                    className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-black transition-colors inline-block"
                >
                    {isLoggedIn ? "View All Orders" : "Continue Shopping"}
                </Link>
            </div>
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

    const displayOrderId = order.orderNumber || `NTV-${String(order._id || "").slice(-6).toUpperCase()}`;
    const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = order.couponCode ? subtotal - order.total : 0;

    const stateMessage = {
        pending: "Your order has been placed successfully. We’ll start processing it shortly.",
        processing: "Your order is being processed and prepared for shipment.",
        shipped: "Good news! Your order has been shipped and is on the way to you.",
        delivered: "Delivered! We hope you enjoy your purchase.",
        cancelled: "This order has been cancelled. If you need help, contact support.",
    };

    const confirmationText =
        stateMessage?.[order.state] || "Your order has been confirmed and is being processed.";
    const isCancelled = order.state === "cancelled";


    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Step indicator — all complete */}
            <StepIndicator />

            {/* ───── Success hero ───── */}
            <div
                className={`
                    text-center mb-10 transition-all duration-700 ease-out
                    ${confettiDone ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                `}
            >
                {/* Animated status icon */}
                <div className="relative inline-flex items-center justify-center mb-5">
                    <span className={`absolute w-20 h-20 rounded-full animate-ping opacity-20 ${isCancelled ? "bg-red-100" : "bg-green-100"}`} />
                    <span className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${isCancelled ? "bg-gradient-to-br from-red-400 to-red-600 shadow-red-200" : "bg-gradient-to-br from-green-400 to-green-600 shadow-green-200"}`}>
                        {isCancelled ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9 9 6 6m0-6-6 6" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        )}
                    </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Thank You, {order.shippingAddress.fullName.split(" ")[0]}!
                </h1>
                <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
                    {confirmationText}
                </p>

                {/* Order ID badge */}
                <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full">
                    <span className="text-xs text-gray-400">Order</span>
                    <span className="text-sm font-mono font-bold text-gray-900">{displayOrderId}</span>
                    <CopyButton text={displayOrderId} />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Placed on {formatDate(order.createdAt)}
                </p>
            </div>

            {/* ───── Order state timeline ───── */}
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
                <StatusTimeline state={order.state} createdAt={order.createdAt} />
            </section>

            {/* ───── Main content grid ───── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                {/* LEFT: Items + Payment */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Items */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <PackageIcon className="w-[18px] h-[18px] text-primary" />
                                <h2 className="text-base font-semibold text-gray-900">
                                    Items Ordered
                                </h2>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">
                                {itemCount} {itemCount === 1 ? "item" : "items"}
                            </span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items.map((item) => {
                                const originalPrice = Number(item.originalPrice);
                                const finalPrice = Number(item.price);
                                const hasDiscount = Number.isFinite(originalPrice) && originalPrice > finalPrice;

                                return (
                                <div key={item._id} className="flex gap-4 px-6 py-4">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={resolveProductImageUrl(item.image)}
                                            alt={item.name || "Product"}
                                            className="w-16 h-16 object-cover rounded-xl bg-gray-50"
                                            onError={(e) => {
                                                e.target.src = "/images/fallback-product.png";
                                            }}
                                        />
                                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-800 text-white text-[10px] font-bold flex items-center justify-center">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                                            {item.name || "Product"}
                                        </h3>
                                        <div className="flex flex-wrap gap-x-3 text-xs text-gray-400 mt-1">
                                            {item.size && (
                                                <span className="inline-flex items-center gap-1">
                                                    Size: <span className="capitalize text-gray-600">{item.size}</span>
                                                </span>
                                            )}
                                            {item.color && (
                                                <span className="inline-flex items-center gap-1">
                                                    Color: <span className="capitalize text-gray-600">{item.color}</span>
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {finalPrice.toFixed(2)} <Currency className="text-xs" /> each
                                            {hasDiscount && (
                                                <span className="ml-1 line-through text-gray-300">
                                                    {originalPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="text-right self-center">
                                        <p className="text-sm font-bold text-gray-900">
                                            {(finalPrice * item.quantity).toFixed(2)} <Currency className="text-xs font-semibold" />
                                        </p>
                                        {hasDiscount && (
                                            <p className="text-[11px] text-gray-300 line-through">
                                                {(originalPrice * item.quantity).toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                            })}
                        </div>
                    </section>

                    {/* Payment */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <CreditCardIcon className="w-[18px] h-[18px] text-primary" />
                            <h2 className="text-base font-semibold text-gray-900">Payment</h2>
                        </div>
                        <div className="px-6 py-5">
                            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                                <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <CreditCardIcon className="w-5 h-5 text-primary" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {order.paymentMethod === "CashOnDelivery" ? "Cash on Delivery" : order.paymentMethod}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {order.paymentMethod === "CashOnDelivery"
                                            ? "You will pay upon delivery"
                                            : "Payment confirmed"
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* RIGHT: Shipping + Summary + Actions (sticky) */}
                <div className="lg:col-span-2">
                    <div className="lg:sticky lg:top-24 space-y-6">
                        {/* Shipping address */}
                        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <MapPinIcon className="w-[18px] h-[18px] text-primary" />
                                <h2 className="text-base font-semibold text-gray-900">Delivery Address</h2>
                            </div>
                            <div className="px-6 py-5">
                                <div className="space-y-1.5">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {order.shippingAddress.fullName}
                                    </p>
                                    <p className="text-sm text-gray-600">{order.shippingAddress.phone}</p>
                                    <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                                    <p className="text-sm text-gray-600">{order.shippingAddress.city}</p>
                                    {order.shippingAddress.notes && (
                                        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                                            <p className="text-xs text-amber-700">
                                                <span className="font-semibold">Note:</span> {order.shippingAddress.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Order summary */}
                        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-base font-semibold text-gray-900">Order Total</h2>
                            </div>
                            <div className="px-6 py-5 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span>{subtotal.toFixed(2)} <Currency className="text-xs" /></span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                {order.couponCode && discount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="flex items-center gap-1.5 text-green-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                                            </svg>
                                            Coupon ({order.couponCode})
                                        </span>
                                        <span className="text-green-600 font-medium">-{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <span className="text-lg font-extrabold text-gray-900">
                                        {order.total.toFixed(2)} <Currency className="text-sm font-semibold" />
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Action buttons */}
                        <div className="space-y-3">
                            <Link
                                to={isLoggedIn ? "/profile" : "/shop"}
                                className="flex items-center justify-center gap-2 w-full py-3.5 bg-primary text-white font-semibold rounded-2xl hover:bg-black transition-colors duration-200 shadow-lg shadow-primary/20 hover:shadow-black/20"
                            >
                                <ClipboardIcon className="w-4 h-4" />
                                {isLoggedIn ? "View All Orders" : "Continue Shopping"}
                            </Link>
                            {isLoggedIn && (
                                <Link
                                    to="/shop"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-primary hover:text-primary transition-all duration-200"
                                >
                                    Continue Shopping
                                </Link>
                            )}
                        </div>

                        {/* Trust footer */}
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <ShieldIcon className="w-3.5 h-3.5" /> Secure order
                            </span>
                            <span className="w-px h-3 bg-gray-200" />
                            <span className="flex items-center gap-1">
                                <TruckIcon className="w-3.5 h-3.5" /> Fast delivery
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default OrderConfirmation;
