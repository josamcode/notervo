// src/pages/CheckoutPage.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { showSuccess, showError } from "../utils/Toast";
import { resolveProductImageUrl } from "../utils/imageUrl";
import { getDiscountedPrice } from "../utils/pricing";
import Currency from "../components/Currency";

/* ───────────────────────── tiny icon helpers ───────────────────────── */
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
const TagIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </Icon>
);
const CheckIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </Icon>
);
const ShieldIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </Icon>
);
const MapPinIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </Icon>
);

/* ───────────────────────── step indicator ───────────────────────── */
const STEPS = ["Cart", "Shipping", "Payment", "Confirm"];
const StepIndicator = ({ current = 1 }) => (
    <div className="flex items-center justify-center gap-0 mb-10 select-none">
        {STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (
                <React.Fragment key={label}>
                    {i > 0 && (
                        <div
                            className={`h-[2px] w-8 sm:w-14 transition-colors duration-300 ${done ? "bg-primary" : "bg-gray-200"
                                }`}
                        />
                    )}
                    <div className="flex flex-col items-center gap-1.5">
                        <span
                            className={`
                                flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300
                                ${done
                                    ? "bg-primary text-white"
                                    : active
                                        ? "bg-primary/10 text-primary ring-2 ring-primary"
                                        : "bg-gray-100 text-gray-400"
                                }
                            `}
                        >
                            {done ? <CheckIcon className="w-4 h-4" /> : i + 1}
                        </span>
                        <span
                            className={`text-[11px] font-medium tracking-wide ${active ? "text-primary" : done ? "text-gray-600" : "text-gray-400"
                                }`}
                        >
                            {label}
                        </span>
                    </div>
                </React.Fragment>
            );
        })}
    </div>
);

/* ───────────────────────── floating label input ───────────────────────── */
const FloatingInput = ({ label, required, as = "input", rows, ...rest }) => {
    const Tag = as;
    const [focused, setFocused] = useState(false);
    const hasValue = rest.value && rest.value.length > 0;
    const floated = focused || hasValue;

    return (
        <div className="relative group">
            <Tag
                {...rest}
                rows={as === "textarea" ? rows : undefined}
                onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
                onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
                required={required}
                className={`
                    peer w-full px-4 pt-5 pb-2 border rounded-xl bg-white text-gray-900 text-[15px]
                    transition-all duration-200 outline-none
                    ${focused
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-gray-300"
                    }
                    ${as === "textarea" ? "resize-none" : ""}
                `}
                placeholder=" "
            />
            <label
                className={`
                    absolute left-4 transition-all duration-200 pointer-events-none
                    ${floated
                        ? "top-1.5 text-[11px] font-medium text-primary"
                        : "top-3.5 text-sm text-gray-400"
                    }
                `}
            >
                {label}{required && " *"}
            </label>
        </div>
    );
};

/* ───────────────────────── main component ───────────────────────── */
const CheckoutPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [productDetails, setProductDetails] = useState({});
    const [savedShippingAddresses, setSavedShippingAddresses] = useState([]);
    const [selectedSavedAddressIndex, setSelectedSavedAddressIndex] = useState(-1);
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
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        const fetchCartAndProducts = async () => {
            try {
                const [cartRes, userRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${process.env.REACT_APP_API_URL}/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }).catch(() => null),
                ]);
                const cartData = cartRes.data.cart;

                if (!cartData || !cartData.items.length) {
                    showError("Your cart is empty.");
                    navigate("/cart");
                    return;
                }

                setCart(cartData);
                setOrderTotal(cartData.total);

                const productFetchPromises = cartData.items.map(async (item) => {
                    try {
                        const res = await axios.get(
                            `${process.env.REACT_APP_API_URL}/products/${item.productId._id}`
                        );
                        return [item.productId._id, res.data];
                    } catch (err) {
                        console.error(`Failed to load product ${item.productId._id}`, err);
                        return [item.productId._id, null];
                    }
                });

                const results = await Promise.all(productFetchPromises);
                const detailsMap = Object.fromEntries(results.filter(([_, prod]) => prod));
                setProductDetails(detailsMap);

                const addresses = userRes?.data?.user?.shippingAddresses || [];
                setSavedShippingAddresses(addresses);

                if (addresses.length > 0) {
                    const defaultIndex = addresses.findIndex((address) => address.isDefault);
                    const chosenIndex = defaultIndex >= 0 ? defaultIndex : 0;
                    applyAddressToForm(addresses[chosenIndex]);
                    setSelectedSavedAddressIndex(chosenIndex);
                    setSaveShippingAddress(false);
                    setSetAsDefaultAddress(false);
                } else {
                    setSaveShippingAddress(true);
                    setSetAsDefaultAddress(true);
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
    }, [token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["fullName", "phone", "city", "street", "notes"].includes(name)) {
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
        if (!couponCode) {
            showError("Enter a coupon code");
            return;
        }
        setApplying(true);
        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/orders/apply-coupon`,
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
        setRemoving(true);
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/orders/remove-coupon`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
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
                saveShippingAddress,
                setDefaultShippingAddress: saveShippingAddress && setAsDefaultAddress,
                ...(appliedCoupon && { couponCode: appliedCoupon.couponCode }),
            };

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/orders`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.status === "success") {
                showSuccess("Order placed successfully!");
                window.dispatchEvent(new Event("cartUpdated"));
                const orderIdentifier = response.data.order?.orderNumber || response.data.order?._id;
                navigate(`/order-confirmation/${orderIdentifier}`);
            }
        } catch (error) {
            console.error("Order failed:", error);
            const message = error.response?.data?.message || "Failed to place order. Please try again.";
            showError(message);
        } finally {
            setSubmitting(false);
        }
    };

    /* ───────────── Loading skeleton ───────────── */
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 pt-28">
                <div className="flex items-center justify-center gap-0 mb-10">
                    {[0, 1, 2, 3].map((i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <div className="h-[2px] w-8 sm:w-14 bg-gray-200" />}
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                                <div className="w-10 h-3 bg-gray-200 rounded animate-pulse" />
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                    <div className="lg:col-span-2">
                        <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    /* ───────────── Empty cart ───────────── */
    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-lg mx-auto px-6 py-28 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <TruckIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <button
                    onClick={() => navigate("/shop")}
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-black transition-colors duration-200"
                >
                    Browse Shop
                </button>
            </div>
        );
    }

    const itemCount = cart.items.reduce((s, i) => s + i.quantity, 0);

    /* ───────────── Main checkout ───────────── */
    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Header */}
            <div className="text-center mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Checkout
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your order
                </p>
            </div>

            <StepIndicator current={1} />

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
            >
                {/* ───── LEFT: Shipping + Payment ───── */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Saved addresses */}
                    {savedShippingAddresses.length > 0 && (
                        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                                <MapPinIcon className="w-[18px] h-[18px] text-primary" />
                                <h2 className="text-base font-semibold text-gray-900">Saved Addresses</h2>
                            </div>
                            <div className="px-6 py-4 flex flex-wrap gap-2">
                                {savedShippingAddresses.map((address, index) => {
                                    const selected = selectedSavedAddressIndex === index;
                                    return (
                                        <button
                                            key={address._id || index}
                                            type="button"
                                            onClick={() => handleSelectSavedAddress(address, index)}
                                            className={`
                                                relative px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200
                                                ${selected
                                                    ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:bg-primary/5"
                                                }
                                            `}
                                        >
                                            <span className="flex items-center gap-1.5">
                                                {selected && <CheckIcon className="w-3.5 h-3.5" />}
                                                {address.fullName || `Address ${index + 1}`}
                                                {address.isDefault && (
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selected ? "bg-white/20" : "bg-primary/10 text-primary"}`}>
                                                        Default
                                                    </span>
                                                )}
                                            </span>
                                            {address.city && (
                                                <span className={`block text-xs mt-0.5 ${selected ? "text-white/70" : "text-gray-400"}`}>
                                                    {address.city}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Shipping form */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <TruckIcon className="w-[18px] h-[18px] text-primary" />
                            <h2 className="text-base font-semibold text-gray-900">Shipping Details</h2>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            {/* Two-column name + phone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FloatingInput
                                    label="Full Name"
                                    required
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                                <FloatingInput
                                    label="Phone Number"
                                    required
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <FloatingInput
                                label="City"
                                required
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                            />
                            <FloatingInput
                                label="Street Address"
                                required
                                as="textarea"
                                rows={2}
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                            />
                            <FloatingInput
                                label="Order Notes"
                                as="textarea"
                                rows={2}
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                            />

                            {/* Save toggles */}
                            <div className="flex flex-col gap-2 pt-1">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <span
                                        className={`
                                            flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200
                                            ${saveShippingAddress
                                                ? "bg-primary border-primary"
                                                : "border-gray-300 group-hover:border-gray-400"
                                            }
                                        `}
                                    >
                                        {saveShippingAddress && <CheckIcon className="w-3 h-3 text-white" />}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={saveShippingAddress}
                                        onChange={(e) => {
                                            const shouldSave = e.target.checked;
                                            setSaveShippingAddress(shouldSave);
                                            if (!shouldSave) setSetAsDefaultAddress(false);
                                        }}
                                        className="sr-only"
                                    />
                                    <span className="text-sm text-gray-600">Save for next checkout</span>
                                </label>
                                <label
                                    className={`flex items-center gap-2.5 cursor-pointer group ${!saveShippingAddress ? "opacity-40 pointer-events-none" : ""
                                        }`}
                                >
                                    <span
                                        className={`
                                            flex items-center justify-center w-5 h-5 rounded-md border-2 transition-all duration-200
                                            ${setAsDefaultAddress && saveShippingAddress
                                                ? "bg-primary border-primary"
                                                : "border-gray-300 group-hover:border-gray-400"
                                            }
                                        `}
                                    >
                                        {setAsDefaultAddress && saveShippingAddress && (
                                            <CheckIcon className="w-3 h-3 text-white" />
                                        )}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={savedShippingAddresses.length > 0 ? setAsDefaultAddress : false}
                                        disabled={!saveShippingAddress}
                                        onChange={(e) => setSetAsDefaultAddress(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <span className="text-sm text-gray-600">Set as default</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Payment method */}
                    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                            <CreditCardIcon className="w-[18px] h-[18px] text-primary" />
                            <h2 className="text-base font-semibold text-gray-900">Payment</h2>
                        </div>
                        <div className="px-6 py-5">
                            <label
                                className={`
                                    flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                                    ${formData.paymentMethod === "CashOnDelivery"
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200 hover:border-gray-300"
                                    }
                                `}
                            >
                                <span
                                    className={`
                                        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                        ${formData.paymentMethod === "CashOnDelivery"
                                            ? "border-primary"
                                            : "border-gray-300"
                                        }
                                    `}
                                >
                                    {formData.paymentMethod === "CashOnDelivery" && (
                                        <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                                    )}
                                </span>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CashOnDelivery"
                                    checked={formData.paymentMethod === "CashOnDelivery"}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500">Pay when your order arrives</p>
                                </div>
                            </label>
                        </div>
                    </section>
                </div>

                {/* ───── RIGHT: Order summary (sticky) ───── */}
                <div className="lg:col-span-2" ref={summaryRef}>
                    <div className="lg:sticky lg:top-24 space-y-4">
                        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>
                            </div>

                            {/* Items */}
                            <div className="divide-y divide-gray-50 max-h-[340px] overflow-y-auto">
                                {cart.items.map((item) => {
                                    const product = productDetails[item.productId._id];
                                    const title = product?.title || "Unknown Product";
                                    const { originalPrice, finalPrice } = getDiscountedPrice(product || {});
                                    const hasDiscount = originalPrice > finalPrice;
                                    const image = product?.images?.[0];

                                    return (
                                        <div key={item._id} className="flex gap-3 px-6 py-4">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={
                                                        image
                                                            ? resolveProductImageUrl(image)
                                                            : "/images/fallback-product.png"
                                                    }
                                                    alt={title}
                                                    className="w-14 h-14 object-cover rounded-lg bg-gray-50"
                                                    onError={(e) => {
                                                        e.target.src = "/images/fallback-product.png";
                                                    }}
                                                />
                                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-800 text-white text-[10px] font-bold flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                                    {title}
                                                </h3>
                                                <div className="flex flex-wrap gap-x-2 text-xs text-gray-400 mt-0.5">
                                                    {item.color && <span>Color: {item.color}</span>}
                                                    {item.size && <span>Size: {item.size}</span>}
                                                </div>
                                            </div>
                                            <div className="text-right whitespace-nowrap">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {(finalPrice * item.quantity).toFixed(2)}
                                                </p>
                                                {hasDiscount && (
                                                    <p className="text-[11px] text-gray-400 line-through">
                                                        {(originalPrice * item.quantity).toFixed(2)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Coupon */}
                            <div className="border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setCouponOpen((v) => !v)}
                                    className="w-full px-6 py-3 flex items-center justify-between text-sm hover:bg-gray-50 transition-colors"
                                >
                                    <span className="flex items-center gap-2 text-gray-600 font-medium">
                                        <TagIcon className="w-4 h-4" />
                                        {appliedCoupon ? "Coupon applied" : "Have a coupon?"}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${couponOpen ? "rotate-180" : ""}`}
                                        fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${couponOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <div className="px-6 pb-4 space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={handleCouponChange}
                                                placeholder="Enter code"
                                                disabled={appliedCoupon !== null}
                                                className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:bg-gray-50 disabled:text-gray-400"
                                            />
                                            {!appliedCoupon ? (
                                                <button
                                                    type="button"
                                                    onClick={handleApplyCoupon}
                                                    disabled={applying}
                                                    className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-black disabled:bg-gray-300 transition-colors whitespace-nowrap"
                                                >
                                                    {applying ? "..." : "Apply"}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveCoupon}
                                                    disabled={removing}
                                                    className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:bg-gray-300 transition-colors whitespace-nowrap"
                                                >
                                                    {removing ? "..." : "Remove"}
                                                </button>
                                            )}
                                        </div>
                                        {appliedCoupon && (
                                            <p className="text-green-600 text-xs font-medium flex items-center gap-1">
                                                <CheckIcon className="w-3.5 h-3.5" />
                                                You saved {(appliedCoupon.discount || 0).toFixed(2)} <Currency className="text-xs" />
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Totals */}
                            <div className="border-t border-gray-100 px-6 py-5 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>{cart.total.toFixed(2)} <Currency className="text-xs" /></span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Coupon Discount</span>
                                        <span>-{parseFloat(appliedCoupon.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <span className="text-lg font-extrabold text-gray-900">
                                        {orderTotal.toFixed(2)} <Currency className="text-sm font-semibold" />
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Place Order button */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`
                                w-full py-4 text-white font-bold text-base rounded-2xl transition-all duration-200
                                flex items-center justify-center gap-2
                                ${submitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-primary hover:bg-black active:scale-[0.98] shadow-lg shadow-primary/20 hover:shadow-black/20"
                                }
                            `}
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Place Order — {orderTotal.toFixed(2)} <Currency className="text-sm" />
                                </>
                            )}
                        </button>

                        {/* Trust signals */}
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-1">
                            <span className="flex items-center gap-1">
                                <ShieldIcon className="w-3.5 h-3.5" /> Secure checkout
                            </span>
                            <span className="w-px h-3 bg-gray-200" />
                            <span className="flex items-center gap-1">
                                <TruckIcon className="w-3.5 h-3.5" /> Fast delivery
                            </span>
                        </div>
                    </div>
                </div>
            </form>
        </main>
    );
};

export default CheckoutPage;
