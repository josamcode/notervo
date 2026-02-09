// src/components/ProductCard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addToCart,
  checkProductInCart,
  removeFromCart,
} from "../utils/CartUtils";
import {
  addToWishlist,
  checkProductInWishlist,
  removeFromWishlist,
} from "../utils/WishlistUtils";
import { showError, showSuccess } from "../utils/Toast";
import { resolveProductImageUrl } from "../utils/imageUrl";
import Currency from "./Currency";

/* ───────────── micro icons ───────────── */
const HeartOutline = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);
const HeartSolid = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
  </svg>
);
const StarSolid = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
  </svg>
);
const CartPlus = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const CartCheck = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [inCart, setInCart] = useState(false);
  const [checkingCart, setCheckingCart] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);
  const [cartAnimating, setCartAnimating] = useState(false);

  const defaultColor = product.colors?.[0] || null;
  const defaultSize = product.sizes?.[0] || null;

  const finalPrice =
    product.discount > 0
      ? product.discountType === "fixed"
        ? product.price - product.discount
        : product.price * (1 - product.discount / 100)
      : product.price;

  const discountPercent =
    product.discount > 0
      ? product.discountType === "fixed"
        ? Math.round((product.discount / product.price) * 100)
        : product.discount
      : 0;

  const imageUrl = resolveProductImageUrl(product.images?.[0]);
  const isAvailable = product.inStock && product.stockQuantity > 0;

  useEffect(() => {
    const check = async () => {
      setCheckingCart(true);
      setCheckingWishlist(true);
      const cartExists = await checkProductInCart(product._id, defaultColor, defaultSize);
      const wishlistExists = await checkProductInWishlist(product._id);
      setInCart(cartExists);
      setInWishlist(wishlistExists);
      setCheckingCart(false);
      setCheckingWishlist(false);
    };
    check();
  }, [product._id, defaultColor, defaultSize]);

  const handleCartToggle = async (e) => {
    e.stopPropagation();
    setCartAnimating(true);
    setTimeout(() => setCartAnimating(false), 400);

    if (inCart) {
      const result = await removeFromCart(product._id, defaultColor, defaultSize);
      if (result.success) {
        setInCart(false);
        showSuccess(`${product.title} removed from cart.`);
      } else showError(result.message);
    } else {
      const result = await addToCart(product._id, 1, null, null);
      if (result.success) {
        setInCart(true);
        showSuccess(`${product.title} added to cart.`);
      } else showError(result.message);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (inWishlist) {
      const result = await removeFromWishlist(product._id);
      if (result.success) {
        setInWishlist(false);
        showSuccess(`${product.title} removed from wishlist.`);
      } else showError(result.message);
    } else {
      const result = await addToWishlist(product._id);
      if (result.success) {
        setInWishlist(true);
        showSuccess(`${product.title} added to wishlist.`);
      } else showError(result.message);
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${product._id}`)}
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* ───── Image section ───── */}
      <div className="relative overflow-hidden bg-gray-50">
        {/* Aspect ratio container */}
        <div className="aspect-[4/5] max-h-[250px] w-full">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.src = "/images/fallback-product.png";
            }}
          />
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-rose-600 text-white text-[11px] font-bold rounded-lg shadow-lg">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleWishlistToggle}
          disabled={checkingWishlist}
          className={`
                        absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center
                        transition-all duration-200 shadow-md backdrop-blur-sm
                        ${inWishlist
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white"
            }
                    `}
          title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {inWishlist ? (
            <HeartSolid className="w-4 h-4" />
          ) : (
            <HeartOutline className="w-4 h-4" />
          )}
        </button>

        {/* Out of stock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ───── Info section ───── */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand */}
        {product.brand && (
          <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-0.5">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1.5 group-hover:text-primary transition-colors duration-200">
          {product.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2.5">
          <StarSolid className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-gray-700">{product.rating.toFixed(1)}</span>
          {product.numReviews > 0 && (
            <span className="text-[11px] text-gray-400">({product.numReviews})</span>
          )}
        </div>

        {/* Price row + cart button */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-lg font-extrabold text-gray-900">
              {finalPrice.toFixed(2)}
            </span>
            <span><Currency className="text-[9px] sm:text-[11px] text-gray-400 font-medium" /></span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Cart button */}
          {isAvailable && (
            <button
              onClick={handleCartToggle}
              disabled={checkingCart}
              className={`
                                flex-shrink-0 w-9 h-9 rounded-xl hidden items-center sm:flex justify-center transition-all duration-200
                                ${cartAnimating ? "scale-125" : "scale-100"}
                                ${inCart
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-gray-100 text-gray-600 hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20"
                }
                            `}
              title={inCart ? "Remove from Cart" : "Add to Cart"}
            >
              {checkingCart ? (
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : inCart ? (
                <CartCheck className="w-4 h-4" />
              ) : (
                <CartPlus className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}