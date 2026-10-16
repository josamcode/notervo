import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { getDiscountedPrice } from "../utils/pricing";
import SmartImage from "./ui/SmartImage";
import { Price } from "./ui/Primitives";
import { Check, Heart, HeartSolid, Plus, Spinner, Star } from "./ui/Icons";

const titleCase = (value = "") =>
  value.charAt(0).toUpperCase() + value.slice(1);

/** Variant line under the name (Karst shows the colourway/format). */
const subtitleFor = (product) => {
  if (product.sizes?.length) return product.sizes.join(" · ");
  if (product.category?.length)
    return product.category.map(titleCase).join(" · ");
  return product.brand || "";
};

/**
 * Grid wrapper: hairline-bordered editorial grid on desktop, gapped two-column
 * app grid on phones. `columns` controls the desktop column count.
 */
export function ProductGrid({ children, columns = 4, className = "" }) {
  const desktopCols =
    columns === 3 ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-4";
  return (
    <ul
      className={`grid grid-cols-2 gap-x-3 gap-y-5 px-4 sm:grid-cols-3 md:gap-0 md:border-t md:border-ink-line md:px-0 ${desktopCols} ${className}`}
    >
      {React.Children.map(children, (child) =>
        child ? (
          <li className="min-w-0 md:border-b md:border-r md:border-ink-line md:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(4n)]:border-r-0">
            {child}
          </li>
        ) : null
      )}
    </ul>
  );
}

/** Loading placeholder matching the card footprint. */
export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="md:p-0">
      <div className="skeleton aspect-[4/5] rounded-2xl md:aspect-[11/10] md:rounded-none" />
      <div className="space-y-2 px-1 pt-3 md:px-4 md:pb-5">
        <div className="skeleton h-3.5 w-3/4" />
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-3.5 w-1/4" />
      </div>
    </div>
  );
}

export default function ProductCard({ product, priority = false }) {
  const [inCart, setInCart] = useState(false);
  const [checkingCart, setCheckingCart] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [checkingWishlist, setCheckingWishlist] = useState(true);
  const [busy, setBusy] = useState(false);

  const defaultColor = product.colors?.[0] || null;
  const defaultSize = product.sizes?.[0] || null;
  const { originalPrice, finalPrice, discountAmount } =
    getDiscountedPrice(product);
  const discountPercent =
    discountAmount > 0 && originalPrice > 0
      ? Math.round((discountAmount / originalPrice) * 100)
      : 0;
  const isAvailable = product.inStock && product.stockQuantity > 0;
  const [primaryImage, hoverImage] = product.images || [];
  const href = `/products/${product._id}`;

  useEffect(() => {
    let active = true;
    const check = async () => {
      setCheckingCart(true);
      setCheckingWishlist(true);
      const [cartExists, wishlistExists] = await Promise.all([
        checkProductInCart(product._id, defaultColor, defaultSize),
        checkProductInWishlist(product._id),
      ]);
      if (!active) return;
      setInCart(cartExists);
      setInWishlist(wishlistExists);
      setCheckingCart(false);
      setCheckingWishlist(false);
    };
    check();
    return () => {
      active = false;
    };
  }, [product._id, defaultColor, defaultSize]);

  const handleCartToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      if (inCart) {
        const result = await removeFromCart(
          product._id,
          defaultColor,
          defaultSize
        );
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
    } finally {
      setBusy(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
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

  const cartLabel = inCart
    ? `Remove ${product.title} from cart`
    : `Add ${product.title} to cart`;

  return (
    <article className="group relative flex h-full flex-col">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-dim md:aspect-[11/10] md:rounded-none md:bg-transparent">
        <SmartImage
          src={primaryImage}
          alt={product.title}
          width={900}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          loading={priority ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[150ms,400ms] ease-in-out md:group-hover:scale-[1.02] ${
            hoverImage ? "md:group-hover:opacity-0" : ""
          }`}
        />
        {hoverImage && (
          <SmartImage
            src={hoverImage}
            alt=""
            width={900}
            sizes="(min-width: 1024px) 25vw, 33vw"
            aria-hidden="true"
            className="absolute inset-0 hidden h-full w-full scale-[1.02] object-cover opacity-0 transition-[opacity,transform] duration-[150ms,400ms] ease-in-out md:block md:group-hover:scale-100 md:group-hover:opacity-100"
          />
        )}

        {discountPercent > 0 && isAvailable && (
          <span className="badge absolute left-2.5 top-2.5 z-10 bg-ink text-cream md:left-4 md:top-4">
            −{discountPercent}%
          </span>
        )}
        {!isAvailable && (
          <span className="badge absolute left-2.5 top-2.5 z-10 bg-cream/90 text-ink md:hidden">
            Sold out
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={checkingWishlist}
          aria-pressed={inWishlist}
          aria-label={
            inWishlist
              ? `Remove ${product.title} from wishlist`
              : `Save ${product.title} to wishlist`
          }
          className={`icon-btn absolute right-2.5 top-2.5 z-20 h-9 w-9 rounded-full bg-cream/90 text-ink shadow-sm backdrop-blur-sm transition-[opacity,transform] duration-200 active:scale-90 md:right-3 md:top-3 md:shadow-none md:focus-visible:opacity-100 ${
            inWishlist ? "" : "md:opacity-0 md:group-hover:opacity-100"
          }`}
        >
          {inWishlist ? (
            <HeartSolid className="h-[18px] w-[18px] text-ember" />
          ) : (
            <Heart className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col px-1 pt-3 md:px-4 md:pb-5 md:pt-4">
        {!isAvailable && (
          <p className="mb-1 hidden text-[12px] uppercase text-muted md:block">
            Sold out
          </p>
        )}
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 font-sans text-[14px] leading-snug tracking-normal text-ink md:uppercase md:leading-[1.25]">
            <Link
              to={href}
              className="line-clamp-2 after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:outline-none"
            >
              {product.title}
            </Link>
          </h3>
          {isAvailable && (
            <button
              type="button"
              onClick={handleCartToggle}
              disabled={checkingCart || busy}
              aria-label={cartLabel}
              aria-pressed={inCart}
              className={`icon-btn relative z-20 hidden h-[22px] w-[22px] shrink-0 border border-ink transition-colors duration-200 md:inline-flex ${
                inCart
                  ? "bg-ink text-cream"
                  : "text-ink hover:bg-ink hover:text-cream"
              }`}
            >
              {checkingCart || busy ? (
                <Spinner className="h-3 w-3" />
              ) : inCart ? (
                <Check className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              )}
            </button>
          )}
        </div>
        <p className="mt-0.5 hidden truncate text-[14px] text-ink/80 md:block">
          {subtitleFor(product)}
        </p>

        {product.rating > 0 && (
          <p className="mt-1 flex items-center gap-1 text-[12px] text-muted md:hidden">
            <Star className="h-3.5 w-3.5 text-ink" />
            <span className="text-ink">
              {Number(product.rating).toFixed(1)}
            </span>
            {product.numReviews > 0 && <span>({product.numReviews})</span>}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2 md:pt-3">
          <Price
            value={finalPrice}
            compareAt={originalPrice}
            className="text-[14px] font-medium text-ink md:font-normal"
            compareClassName="text-[12px] md:text-[14px] font-normal"
          />
          {isAvailable && (
            <button
              type="button"
              onClick={handleCartToggle}
              disabled={checkingCart || busy}
              aria-label={cartLabel}
              aria-pressed={inCart}
              className={`icon-btn relative z-20 h-9 w-9 shrink-0 rounded-full transition-[background-color,transform] duration-200 active:scale-90 md:hidden ${
                inCart ? "bg-ink text-cream" : "bg-ink/[0.06] text-ink"
              }`}
            >
              {checkingCart || busy ? (
                <Spinner className="h-3.5 w-3.5" />
              ) : inCart ? (
                <Check className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Plus className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
