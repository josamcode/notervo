// src/pages/CartPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { removeFromCart } from "../utils/CartUtils";
import { resolveProductImageUrl } from "../utils/imageUrl";
import { getDiscountedPrice } from "../utils/pricing";
import Currency from "../components/Currency";

/* ───────────── icons ───────────── */
const Icon = ({ children, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
        {children}
    </svg>
);
const TrashIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
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
const ShieldIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </Icon>
);
const TruckIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25m-2.25 0h-2.25m0 0V5.625A1.125 1.125 0 0 0 8.625 4.5H3.375A1.125 1.125 0 0 0 2.25 5.625v8.25" />
    </Icon>
);
const MinusIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </Icon>
);
const PlusIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </Icon>
);
const ArrowRightIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </Icon>
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
                if (!token) throw new Error("User not authenticated");

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const itemsWithImages = await Promise.all(
                    response.data.cart.items.map(async (item) => {
                        const productRes = await axios.get(
                            `${process.env.REACT_APP_API_URL}/products/${item.productId._id}`
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
        const result = await removeFromCart(item.productId._id, item.color, item.size);
        if (result.success) {
            setCart((prev) => ({
                ...prev,
                items: prev.items.filter((i) => i._id !== item._id),
            }));
        } else {
            alert(result.message);
        }
    };

    const handleQuantityChange = async (item, delta) => {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return;

        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/cart/update/${item.productId._id}`,
                { quantity: newQuantity, color: item.color, size: item.size },
                { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
            );
            setCart((prev) => ({
                ...prev,
                items: prev.items.map((i) =>
                    i._id === item._id ? { ...i, quantity: newQuantity } : i
                ),
            }));
        } catch (err) {
            console.error("Error updating quantity:", err);
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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4">
                                <div className="w-24 h-24 bg-gray-100 rounded-xl animate-pulse flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                                    <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-2">
                        <div className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    /* ───── Empty cart ───── */
    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-lg mx-auto px-6 py-28 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <CartIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 text-sm mb-8">Looks like you haven't added any items yet.</p>
                <button
                    onClick={() => navigate("/shop")}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-black transition-colors duration-200"
                >
                    Browse Shop
                    <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    Shopping Cart
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                {/* ───── LEFT: Cart items ───── */}
                <div className="lg:col-span-3 space-y-3">
                    {cart.items.map((item) => {
                        const product = item.productDetails;
                        const { originalPrice, finalPrice } = getDiscountedPrice(product);
                        const itemTotal = finalPrice * item.quantity;
                        const hasDiscount = originalPrice > finalPrice;

                        return (
                            <div
                                key={item._id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex">
                                    {/* Image */}
                                    <div
                                        onClick={() => navigate(`/products/${product._id}`)}
                                        className="w-28 sm:w-32 flex-shrink-0 bg-gray-50 cursor-pointer relative"
                                    >
                                        <img
                                            src={resolveProductImageUrl(product.images?.[0])}
                                            alt={product.title}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-h-[120px]">
                                        <div>
                                            <h3
                                                onClick={() => navigate(`/products/${product._id}`)}
                                                className="text-sm font-semibold text-gray-900 hover:text-primary cursor-pointer transition-colors leading-snug line-clamp-2"
                                            >
                                                {product.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-x-3 text-xs text-gray-400 mt-1">
                                                {item.size && <span>Size: <span className="text-gray-600 font-medium">{item.size}</span></span>}
                                                {item.color && <span>Color: <span className="text-gray-600 font-medium">{item.color}</span></span>}
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between mt-3">
                                            {/* Quantity */}
                                            <div className="inline-flex items-center rounded-xl border border-gray-200 overflow-hidden">
                                                <button
                                                    onClick={() => handleQuantityChange(item, -1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 disabled:text-gray-300"
                                                >
                                                    <MinusIcon className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="w-9 h-9 flex items-center justify-center text-sm font-bold text-gray-900 border-x border-gray-200">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item, 1)}
                                                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600"
                                                >
                                                    <PlusIcon className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {/* Price + remove */}
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-base font-extrabold text-gray-900">
                                                        {itemTotal.toFixed(2)}
                                                    </p>
                                                    {hasDiscount && (
                                                        <p className="text-[11px] text-gray-400 line-through">
                                                            {(originalPrice * item.quantity).toFixed(2)}
                                                        </p>
                                                    )}
                                                    {item.quantity > 1 && (
                                                        <p className="text-[11px] text-gray-400">
                                                            {finalPrice.toFixed(2)} each
                                                            {hasDiscount && (
                                                                <span className="ml-1 line-through">
                                                                    {originalPrice.toFixed(2)}
                                                                </span>
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item)}
                                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                    title="Remove item"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Continue shopping link */}
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary mt-2 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Continue shopping
                    </Link>
                </div>

                {/* ───── RIGHT: Order summary (sticky) ───── */}
                <div className="lg:col-span-2">
                    <div className="lg:sticky lg:top-24 space-y-4">
                        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>
                            </div>
                            <div className="px-6 py-5 space-y-3">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span>{totalAmount.toFixed(2)} <Currency className="text-xs" /></span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <span className="text-lg font-extrabold text-gray-900">
                                        {totalAmount.toFixed(2)} <Currency className="text-sm font-semibold" />
                                    </span>
                                </div>
                            </div>
                        </section>

                        <button
                            onClick={() => navigate("/checkout")}
                            className="w-full py-4 bg-primary text-white font-bold text-sm rounded-2xl hover:bg-black transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-black/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout
                            <ArrowRightIcon className="w-4 h-4" />
                        </button>

                        <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-1">
                            <span className="flex items-center gap-1">
                                <ShieldIcon className="w-3.5 h-3.5" /> Secure checkout
                            </span>
                            <span className="w-px h-3 bg-gray-200" />
                            <span className="flex items-center gap-1">
                                <TruckIcon className="w-3.5 h-3.5" /> Free shipping
                            </span>
                        </div>

                        <p className="text-[11px] text-gray-400 text-center">
                            Taxes calculated at checkout
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
