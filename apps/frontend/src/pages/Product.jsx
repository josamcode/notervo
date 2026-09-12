// src/pages/ProductPage.js
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

import { addToCart, checkProductInCart, removeFromCart } from "../utils/CartUtils";
import { showError, showSuccess } from "../utils/Toast";
import { addToWishlist, checkProductInWishlist, removeFromWishlist } from "../utils/WishlistUtils";
import { resolveProductImageUrl } from "../utils/imageUrl";
import Currency from "../components/Currency";

/* ───────────────────────── icon helpers ───────────────────────── */
const Icon = ({ children, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    {children}
  </svg>
);

const HeartIconOutline = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </Icon>
);
const HeartIconSolid = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
  </svg>
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
const CartIconSolid = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
  </svg>
);
const TruckIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25m-2.25 0h-2.25m0 0V5.625A1.125 1.125 0 0 0 8.625 4.5H3.375A1.125 1.125 0 0 0 2.25 5.625v8.25" />
  </Icon>
);
const ShieldIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </Icon>
);
const ReturnIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
  </Icon>
);
const CheckIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
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

/* ───────────────────────── star rating ───────────────────────── */
const StarRating = ({ rating, numReviews }) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = rating >= i ? 1 : rating >= i - 0.5 ? 0.5 : 0;
          return (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
              <defs>
                <linearGradient id={`star-grad-${i}`}>
                  <stop offset={`${fill * 100}%`} stopColor="#FBBF24" />
                  <stop offset={`${fill * 100}%`} stopColor="#E5E7EB" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#star-grad-${i})`}
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              />
            </svg>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
      <span className="text-sm text-gray-400">({numReviews} reviews)</span>
    </div>
  );
};

/* ───────────────────────── breadcrumb ───────────────────────── */
const Breadcrumb = ({ product }) => (
  <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
    <a href="/shop" className="hover:text-primary transition-colors">Shop</a>
    <span>/</span>
    {product.brand && (
      <>
        <span className="capitalize">{product.brand}</span>
        <span>/</span>
      </>
    )}
    <span className="text-gray-700 font-medium truncate max-w-[200px]">{product.title}</span>
  </nav>
);

/* ───────────────────────── main component ───────────────────────── */
export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [inWishlist, setInWishlist] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);
  const [inCart, setInCart] = useState(false);
  const [checkingCart, setCheckingCart] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageZoom, setImageZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainImageRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/top-rated`)
      .then((res) => setRecommended(res.data?.data || []))
      .catch((err) => console.error("Error fetching top-rated products:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setMainImage(res.data.images[0]);
        setSelectedSize(res.data.sizes[0] || "");
        setSelectedColor(res.data.colors[0] || "");
        setQuantity(1);
      })
      .catch((err) => {
        setError("Failed to load product");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const runCheck = async () => {
      setCheckingCart(true);
      if (product && (product.colors.length === 0 || selectedColor) && (product.sizes.length === 0 || selectedSize)) {
        const exists = await checkProductInCart(product._id, selectedColor || null, selectedSize || null);
        setInCart(exists);
      }
      setCheckingCart(false);
    };
    runCheck();
  }, [product, selectedColor, selectedSize]);

  useEffect(() => {
    const runWishlistCheck = async () => {
      setCheckingWishlist(true);
      if (product) {
        const exists = await checkProductInWishlist(product._id);
        setInWishlist(exists);
      }
      setCheckingWishlist(false);
    };
    runWishlistCheck();
  }, [product]);

  // Image zoom handler
  const handleImageMouseMove = (e) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  /* ───── Loading skeleton ───── */
  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="h-4 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
            <div className="flex mt-3 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-16 h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
          <div className="space-y-4 py-2">
            <div className="h-8 bg-gray-200 rounded-lg w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
            <div className="flex gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            <div className="h-10 bg-gray-200 rounded-lg w-32 animate-pulse mt-4" />
            <div className="flex gap-3 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-14 h-10 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <div className="h-14 flex-1 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-14 w-14 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-6 py-28 text-center">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-50 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-red-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load product</h2>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-black transition-colors">
          Retry
        </button>
      </div>
    );
  }

  if (!product) return null;

  const finalPrice =
    product.discountType === "fixed"
      ? product.price - product.discount
      : product.price - (product.price * product.discount) / 100;

  const discountPercent =
    product.discount > 0
      ? product.discountType === "fixed"
        ? Math.round((product.discount / product.price) * 100)
        : product.discount
      : 0;

  const isAvailable = product.inStock && product.stockQuantity > 0;

  const handleCartToggle = async (e) => {
    e.stopPropagation();
    if (inCart) {
      const result = await removeFromCart(product._id, selectedColor || null, selectedSize || null);
      if (result.success) {
        showSuccess(`${product.title} was removed from your cart!`);
        setInCart(false);
      } else showError(result.message);
    } else {
      const result = await addToCart(product._id, quantity, selectedColor || null, selectedSize || null);
      if (result.success) {
        showSuccess(`${product.title} was added to your cart!`);
        setInCart(true);
      } else showError(result.message);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (inWishlist) {
      const result = await removeFromWishlist(product._id);
      if (result.success) {
        showSuccess(`${product.title} was removed from your wishlist!`);
        setInWishlist(false);
      } else showError(result.message);
    } else {
      const result = await addToWishlist(product._id);
      if (result.success) {
        showSuccess(`${product.title} was added to your wishlist!`);
        setInWishlist(true);
      } else showError(result.message);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <Breadcrumb product={product} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* ───── LEFT: Image gallery ───── */}
        <div className="lg:sticky lg:top-24">
          {/* Main image */}
          <div
            ref={mainImageRef}
            className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm cursor-zoom-in group"
            onMouseEnter={() => setImageZoom(true)}
            onMouseLeave={() => setImageZoom(false)}
            onMouseMove={handleImageMouseMove}
          >
            <img
              src={resolveProductImageUrl(mainImage)}
              alt={product.title}
              className={`w-full h-full object-cover transition-transform duration-300 ${imageZoom ? "scale-150" : "scale-100"}`}
              style={imageZoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
            />

            {/* Discount badge */}
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-xl shadow-lg">
                -{discountPercent}%
              </span>
            )}

            {/* Out of stock overlay */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
                <span className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => setMainImage(img)}
                  className={`
                                        flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200
                                        ${mainImage === img
                      ? "border-primary shadow-md shadow-primary/20 ring-1 ring-primary/20"
                      : "border-transparent hover:border-gray-300 opacity-70 hover:opacity-100"
                    }
                                    `}
                >
                  <img
                    src={resolveProductImageUrl(img)}
                    alt={`${product.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ───── RIGHT: Product details ───── */}
        <div className="py-1">
          {/* Title + collection */}
          <div className="mb-4">
            {product.brand && (
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
                {product.brand}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Rating */}
          <div className="mb-5">
            <StarRating rating={product.rating} numReviews={product.numReviews} />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-extrabold text-gray-900">
              {finalPrice.toFixed(2)}
            </span>
            <span className="text-lg text-gray-400 font-medium"><Currency /></span>
            {product.discount > 0 && (
              <span className="text-lg text-gray-400 line-through font-medium">
                {product.price.toFixed(2)}
              </span>
            )}
            {product.discount > 0 && (
              <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-lg">
            {product.description}
          </p>

          {/* Divider */}
          <div className="border-t border-gray-100 pt-6 space-y-6">
            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Format
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                                                px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                                ${selectedSize === size
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
                        }
                                            `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Color
                  {selectedColor && (
                    <span className="ml-2 text-gray-600 capitalize font-medium normal-case">{selectedColor}</span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                                                relative w-9 h-9 rounded-full transition-all duration-200
                                                ${selectedColor === color
                          ? "ring-2 ring-primary ring-offset-2 scale-110"
                          : "ring-1 ring-gray-200 hover:ring-gray-400 hover:scale-105"
                        }
                                            `}
                      style={{ backgroundColor: color }}
                      aria-label={color}
                    >
                      {selectedColor === color && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <CheckIcon className={`w-4 h-4 ${["white", "#fff", "#ffffff", "beige", "ivory", "lightyellow", "lightyellow"].includes(color.toLowerCase()) ? "text-gray-800" : "text-white"}`} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Quantity
              </h3>
              <div className="inline-flex items-center rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 disabled:text-gray-300"
                  disabled={quantity <= 1}
                  type="button"
                >
                  <MinusIcon className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={product.stockQuantity}
                  onChange={(e) => {
                    let val = Number(e.target.value);
                    if (isNaN(val) || val < 1) val = 1;
                    else if (val > product.stockQuantity) val = product.stockQuantity;
                    setQuantity(val);
                  }}
                  className="w-12 h-11 text-center text-sm font-bold text-gray-900 border-x border-gray-200 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600 disabled:text-gray-300"
                  disabled={quantity >= product.stockQuantity}
                  type="button"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              {isAvailable && (
                <span className="ml-3 text-xs text-gray-400">
                  {product.stockQuantity} available
                </span>
              )}
            </div>
          </div>

          {/* Stock status */}
          <div className="mt-6 mb-4">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Out of Stock
              </span>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <button
              disabled={!isAvailable}
              onClick={handleCartToggle}
              type="button"
              className={`
                                flex-1 py-4 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2
                                ${!isAvailable
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : inCart
                    ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200 active:scale-[0.98]"
                    : "bg-primary hover:bg-black text-white shadow-lg shadow-primary/20 hover:shadow-black/20 active:scale-[0.98]"
                }
                            `}
            >
              {checkingCart ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Checking...
                </>
              ) : inCart ? (
                <>
                  <CartIconSolid className="w-4 h-4" />
                  Remove from Cart
                </>
              ) : (
                <>
                  <CartIcon className="w-4 h-4" />
                  Add to Cart — {finalPrice.toFixed(2)} <Currency className="text-xs" />
                </>
              )}
            </button>
            <button
              onClick={handleWishlistToggle}
              type="button"
              className={`
                                w-14 h-14 flex items-center justify-center rounded-2xl border-2 transition-all duration-200
                                ${inWishlist
                  ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                  : "border-gray-200 text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5"
                }
                            `}
            >
              {checkingWishlist ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : inWishlist ? (
                <HeartIconSolid className="w-5 h-5" />
              ) : (
                <HeartIconOutline className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Trust signals */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: TruckIcon, label: "Fast Delivery" },
              { icon: ShieldIcon, label: "Secure Payment" },
              { icon: ReturnIcon, label: "Easy Returns" },
            ].map(({ icon: Ic, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <Ic className="w-4 h-4 text-gray-500" />
                <span className="text-[11px] font-medium text-gray-500 text-center">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───── Recommended products ───── */}
      {recommended.length > 0 && (
        <section className="mt-16 pt-10 border-t border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                You May Also Like
              </h2>
              <p className="text-sm text-gray-400 mt-1">Our top-rated picks</p>
            </div>
            <a href="/shop" className="text-sm font-medium text-primary hover:underline">
              View All
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommended.slice(0, 4).map((rec) => (
              <ProductCard key={rec._id} product={rec} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}