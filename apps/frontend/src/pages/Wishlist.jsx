// src/pages/Wishlist.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { removeFromWishlist } from "../utils/WishlistUtils";
import { showError, showSuccess } from "../utils/Toast";
import { resolveProductImageUrl } from "../utils/imageUrl";
import Currency from "../components/Currency";

/* ───────────── icons ───────────── */
const Icon = ({ children, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
        {children}
    </svg>
);
const HeartIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </Icon>
);
const HeartFilledIcon = ({ className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
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
const ArrowRightIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </Icon>
);
const ArrowLeftIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </Icon>
);
const EyeIcon = (p) => (
    <Icon {...p}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </Icon>
);

/* ───────────── main component ───────────── */
export default function Wishlist() {
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const token = Cookies.get("token");
                if (!token) throw new Error("User not authenticated");

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const wishlistData = response.data.wishlist;

                const itemsWithDetails = await Promise.all(
                    wishlistData.items.map(async (item) => {
                        try {
                            const productRes = await axios.get(
                                `${process.env.REACT_APP_API_URL}/products/${item.productId._id}`
                            );
                            return { ...item, productDetails: productRes.data };
                        } catch (err) {
                            console.error(`Failed to load product ${item.productId._id}`, err);
                            return { ...item, productDetails: null };
                        }
                    })
                );

                setWishlist({ ...wishlistData, items: itemsWithDetails });
            } catch (err) {
                console.error("Error fetching wishlist:", err);
                setWishlist({ items: [] });
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        setRemovingId(productId);
        const result = await removeFromWishlist(productId);
        if (result.success) {
            setWishlist((prev) => ({
                ...prev,
                items: prev.items.filter((item) => item.productId._id !== productId),
            }));
            showSuccess("Removed from wishlist");
        } else {
            showError(result.message);
        }
        setRemovingId(null);
    };

    /* ───── Loading ───── */
    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
                <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
                <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-8" />
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="aspect-[4/5] bg-gray-100 animate-pulse" />
                            <div className="p-4 space-y-2.5">
                                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                                <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
                                <div className="h-9 bg-gray-100 rounded-xl animate-pulse mt-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* ───── Empty state ───── */
    if (!wishlist || wishlist.items.length === 0) {
        return (
            <div className="max-w-md mx-auto px-6 py-28 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
                    <HeartIcon className="w-8 h-8 text-red-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                    Save your favorite items to come back later. Tap the heart icon on any product!
                </p>
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Your Wishlist
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {wishlist.items.length} saved {wishlist.items.length === 1 ? "item" : "items"}
                    </p>
                </div>
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all group"
                >
                    Continue shopping
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {wishlist.items.map((item) => {
                    const product = item.productDetails || item.productId;
                    if (!product) return null;

                    const imageUrl = product?.images?.length
                        ? resolveProductImageUrl(product.images[0])
                        : null;
                    const isRemoving = removingId === product._id;
                    const hasDiscount = product.discount && product.discount.value > 0;
                    const originalPrice = product.price;
                    let salePrice = null;
                    if (hasDiscount) {
                        salePrice = product.discount.type === "percentage"
                            ? originalPrice * (1 - product.discount.value / 100)
                            : originalPrice - product.discount.value;
                    }

                    return (
                        <div
                            key={item._id}
                            className={`
                                group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
                                transition-all duration-300 hover:shadow-lg hover:border-gray-200
                                ${isRemoving ? "opacity-50 scale-95" : ""}
                            `}
                        >
                            {/* Image */}
                            <div
                                onClick={() => navigate(`/products/${product._id}`)}
                                className="aspect-[4/5] w-full max-h-[250px] bg-gray-50 relative cursor-pointer overflow-hidden"
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={product.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <HeartIcon className="w-10 h-10 text-gray-200" />
                                    </div>
                                )}

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Heart badge (always visible) */}
                                <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center">
                                    <HeartFilledIcon className="w-4 h-4 text-red-500" />
                                </span>

                                {/* Discount badge */}
                                {hasDiscount && (
                                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-bold shadow-sm">
                                        {product.discount.type === "percentage"
                                            ? `-${product.discount.value}%`
                                            : `-${product.discount.value}`
                                        }
                                    </span>
                                )}

                                {/* Quick view on hover */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/products/${product._id}`);
                                    }}
                                    className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-900 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-white"
                                >
                                    <EyeIcon className="w-3.5 h-3.5" />
                                    Quick View
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                {/* Brand */}
                                {product.brand && (
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        {product.brand}
                                    </p>
                                )}

                                {/* Title */}
                                <h3
                                    onClick={() => navigate(`/products/${product._id}`)}
                                    className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 cursor-pointer hover:text-primary transition-colors mb-2"
                                >
                                    {product.title}
                                </h3>

                                {/* Price */}
                                <div className="mb-3">
                                    {hasDiscount && salePrice ? (
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-base font-extrabold text-gray-900">
                                                {salePrice.toFixed(2)} <Currency className="text-xs font-semibold" />
                                            </span>
                                            <span className="text-xs text-gray-400 line-through">
                                                {originalPrice.toFixed(2)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-base font-extrabold text-gray-900">
                                            {originalPrice?.toFixed?.(2) || originalPrice} <Currency className="text-xs font-semibold" />
                                        </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/products/${product._id}`)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-black transition-colors duration-200"
                                    >
                                        <CartIcon className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Add to Cart</span>
                                        <span className="sm:hidden">Cart</span>
                                    </button>
                                    <button
                                        onClick={() => handleRemove(product._id)}
                                        disabled={isRemoving}
                                        className="w-10 h-10 flex-shrink-0 rounded-xl flex items-center justify-center border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                                        title="Remove from wishlist"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom continue link */}
            <div className="mt-10 text-center">
                <Link
                    to="/shop"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to shop
                </Link>
            </div>
        </main>
    );
}