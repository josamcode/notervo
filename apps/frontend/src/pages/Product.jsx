import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ProductCard, { ProductGrid } from "../components/ProductCard";
import {
  addToCart,
  checkProductInCart,
  removeFromCart,
} from "../utils/CartUtils";
import { showError, showSuccess } from "../utils/Toast";
import {
  addToWishlist,
  checkProductInWishlist,
  removeFromWishlist,
} from "../utils/WishlistUtils";
import { getDiscountedPrice } from "../utils/pricing";
import { useIsDesktop } from "../hooks/useMediaQuery";
import SmartImage from "../components/ui/SmartImage";
import Reveal from "../components/ui/Reveal";
import { EmptyState, Price, formatMoney } from "../components/ui/Primitives";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  HeartSolid,
  Minus,
  Plus,
  Spinner,
  Star,
} from "../components/ui/Icons";

const titleCase = (value = "") =>
  value.charAt(0).toUpperCase() + value.slice(1);

const isHex = (value = "") => value.startsWith("#");

/* ───────────────────────── rating ───────────────────────── */
const StarRating = ({ rating, numReviews }) => (
  <div className="flex items-center gap-2 text-[13px]">
    <span className="flex text-ink" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className="h-3.5 w-3.5" filled={rating >= i - 0.25} />
      ))}
    </span>
    <span>
      {Number(rating).toFixed(1)}
      <span className="text-muted"> · {numReviews} reviews</span>
    </span>
  </div>
);

/* ───────────────────────── details accordion ───────────────────────── */
const DETAILS = [
  {
    title: "Shipping & delivery",
    body: "Orders placed before 3 PM ship the same day when stock is available. Most orders arrive within 1–4 business days depending on your city. Shipping is currently available within Egypt only.",
    link: ["/shipping", "Shipping information"],
  },
  {
    title: "Returns",
    body: "Unused items in their original packaging can be returned within 14 days of delivery. Refunds are processed within 3–5 business days after inspection.",
    link: ["/return-policy", "Return policy"],
  },
  {
    title: "Payment",
    body: "Pay cash on delivery when your order arrives.",
  },
];

const Accordion = () => {
  const [open, setOpen] = useState(null);
  return (
    <div className="border-t border-ink/15 md:border-ink-line">
      {DETAILS.map((item, i) => {
        const expanded = open === i;
        return (
          <div
            key={item.title}
            className="border-b border-ink/15 md:border-ink-line"
          >
            <h3 className="font-sans text-[15px] tracking-normal">
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                aria-controls={`detail-${i}`}
                className="flex w-full items-center justify-between py-4 text-left"
              >
                {item.title}
                {expanded ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </button>
            </h3>
            <div
              id={`detail-${i}`}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="pb-4 text-[14px] leading-snug text-muted">
                  {item.body}
                </p>
                {item.link && (
                  <Link
                    to={item.link[0]}
                    className="link-underline mb-4 inline-block text-[13px] uppercase"
                  >
                    {item.link[1]}
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ───────────────────────── main component ───────────────────────── */
export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
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
  const [submitting, setSubmitting] = useState(false);
  const mainImageRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/top-rated`)
      .then((res) => setRecommended(res.data?.data || []))
      .catch((err) => console.error("Error fetching top-rated products:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/${id}`)
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
      if (
        product &&
        (product.colors.length === 0 || selectedColor) &&
        (product.sizes.length === 0 || selectedSize)
      ) {
        const exists = await checkProductInCart(
          product._id,
          selectedColor || null,
          selectedSize || null
        );
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

  useEffect(() => {
    if (product?.title) document.title = `${product.title} · Notervo`;
    return () => {
      document.title = "Notervo";
    };
  }, [product?.title]);

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
      <main
        aria-busy="true"
        className="md:grid md:min-h-[calc(100vh-var(--header-h))] md:grid-cols-[1fr_minmax(380px,30%)]"
      >
        <div className="skeleton aspect-[4/5] rounded-none md:aspect-auto" />
        <div className="space-y-4 px-4 py-6 md:border-l md:border-ink-line md:px-[var(--gutter)] md:py-14">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-9 w-3/4" />
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          <div className="skeleton mt-8 h-14 w-full rounded-full" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Failed to load product"
        description={error}
        actionLabel="Retry"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (!product) return null;

  const { originalPrice, finalPrice, discountAmount } =
    getDiscountedPrice(product);
  const discountPercent =
    discountAmount > 0 && originalPrice > 0
      ? Math.round((discountAmount / originalPrice) * 100)
      : 0;

  const isAvailable = product.inStock && product.stockQuantity > 0;
  const images = product.images.length ? product.images : [null];
  const activeIndex = Math.max(0, images.indexOf(mainImage));
  const related = recommended.filter(
    (p) => p._id !== product._id && p.isActive !== false
  );

  const handleCartToggle = async (e) => {
    e.stopPropagation();
    setSubmitting(true);
    try {
      if (inCart) {
        const result = await removeFromCart(
          product._id,
          selectedColor || null,
          selectedSize || null
        );
        if (result.success) {
          showSuccess(`${product.title} was removed from your cart!`);
          setInCart(false);
        } else showError(result.message);
      } else {
        const result = await addToCart(
          product._id,
          quantity,
          selectedColor || null,
          selectedSize || null
        );
        if (result.success) {
          showSuccess(`${product.title} was added to your cart!`);
          setInCart(true);
        } else showError(result.message);
      }
    } finally {
      setSubmitting(false);
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

  const goToImage = (index) => {
    const next = images[(index + images.length) % images.length];
    setMainImage(next);
    const track = trackRef.current;
    if (track) {
      track.scrollTo({
        left: track.clientWidth * images.indexOf(next),
        behavior: "smooth",
      });
    }
  };

  const cartButtonLabel = checkingCart ? (
    "Checking…"
  ) : !isAvailable ? (
    "Sold out"
  ) : inCart ? (
    <>
      Remove<span className="hidden xs:inline"> from cart</span>
    </>
  ) : (
    "Add to cart"
  );

  const renderCartButton = (className = "") => (
    <button
      disabled={!isAvailable || submitting}
      onClick={handleCartToggle}
      type="button"
      className={`btn btn-lg w-full !px-5 ${inCart ? "btn-outline" : "btn-solid"} ${className}`}
    >
      {checkingCart || submitting ? (
        <Spinner className="h-4 w-4" />
      ) : inCart ? (
        <Check className="h-4 w-4" />
      ) : null}
      <span>
        {cartButtonLabel}
        {isAvailable && !inCart && !checkingCart && (
          <span className="hidden xl:inline">
            {" "}
            — {formatMoney(finalPrice * quantity)}
          </span>
        )}
      </span>
    </button>
  );

  /* ───── Option pickers (shared by both layouts) ───── */
  const options = (
    <div className="space-y-6">
      {product.colors.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-[13px]">
            Colour
            {selectedColor && !isHex(selectedColor) && (
              <span className="text-muted">: {titleCase(selectedColor)}</span>
            )}
          </legend>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                aria-label={`Colour ${color}`}
                aria-pressed={selectedColor === color}
                className={`h-9 w-9 rounded-full border border-ink/20 ring-offset-2 ring-offset-cream transition md:h-8 md:w-8 ${
                  selectedColor === color
                    ? "ring-1 ring-ink"
                    : "hover:ring-1 hover:ring-ink/40"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </fieldset>
      )}

      {product.sizes.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-[13px]">
            Format
            {selectedSize && (
              <span className="text-muted">: {selectedSize}</span>
            )}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
                className={`h-11 min-w-[60px] rounded-full border px-5 text-[14px] transition-colors md:h-10 ${
                  selectedSize === size
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/30 text-ink hover:border-ink"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <p className="mb-3 text-[13px]" id="qty-label">
          Quantity
        </p>
        <div className="flex items-center gap-4">
          <div
            className="inline-flex h-12 items-center rounded-full border border-ink/30 md:h-11"
            role="group"
            aria-labelledby="qty-label"
          >
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="icon-btn h-full w-12 rounded-l-full text-ink disabled:text-ink/25"
              disabled={quantity <= 1}
              type="button"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              value={quantity}
              min={1}
              max={product.stockQuantity}
              aria-label="Quantity"
              onChange={(e) => {
                let val = Number(e.target.value);
                if (isNaN(val) || val < 1) val = 1;
                else if (val > product.stockQuantity)
                  val = product.stockQuantity;
                setQuantity(val);
              }}
              className="h-full w-10 bg-transparent text-center text-[15px] tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              onClick={() =>
                setQuantity((q) => Math.min(product.stockQuantity, q + 1))
              }
              className="icon-btn h-full w-12 rounded-r-full text-ink disabled:text-ink/25"
              disabled={quantity >= product.stockQuantity}
              type="button"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="flex items-center gap-2 text-[13px]">
            <span
              className={`h-2 w-2 rounded-full ${isAvailable ? "bg-[#3f8f5a]" : "bg-ember"}`}
              aria-hidden="true"
            />
            {isAvailable
              ? `In stock · ${product.stockQuantity} available`
              : "Out of stock"}
          </span>
        </div>
      </div>
    </div>
  );

  const header = (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mb-5 hidden text-[13px] text-muted md:block"
      >
        <Link to="/shop" className="link-underline hover:text-ink">
          Shop
        </Link>
        {product.category?.[0] && (
          <>
            <span className="mx-2">/</span>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category[0])}`}
              className="link-underline hover:text-ink"
            >
              {titleCase(product.category[0])}
            </Link>
          </>
        )}
      </nav>
      {product.brand && (
        <p className="eyebrow mb-2 text-muted md:mb-3">{product.brand}</p>
      )}
      <h1 className="font-serif text-[30px] font-light leading-[1.02] tracking-tight md:text-[38px]">
        {product.title}
      </h1>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Price
          value={finalPrice}
          compareAt={originalPrice}
          className="text-[22px] leading-none md:text-[24px]"
          compareClassName="text-[16px] md:text-[18px]"
        />
        {discountPercent > 0 && (
          <span className="badge bg-ink text-cream">
            Save {discountPercent}%
          </span>
        )}
      </div>
      {product.rating > 0 && (
        <div className="mt-4">
          <StarRating rating={product.rating} numReviews={product.numReviews} />
        </div>
      )}
      <p className="mt-5 text-[15px] leading-snug text-ink/80">
        {product.description}
      </p>
    </>
  );

  const relatedSection = related.length > 0 && (
    <section aria-labelledby="related-title" className="mt-12 md:mt-0">
      <Reveal className="flex items-end justify-between px-4 pb-4 md:container-x md:border-t md:border-ink-line md:pb-6 md:pt-14">
        <h2
          id="related-title"
          className="font-serif text-[24px] font-light leading-none md:text-[44px]"
        >
          You may also like
        </h2>
        <Link
          to="/shop"
          className="link-underline flex items-center gap-2 text-[13px] text-muted md:pb-1 md:text-[14px] md:uppercase md:text-ink"
        >
          View all <ArrowRight className="hidden h-4 w-4 md:block" />
        </Link>
      </Reveal>
      <ProductGrid>
        {related.slice(0, 4).map((rec) => (
          <ProductCard key={rec._id} product={rec} />
        ))}
      </ProductGrid>
    </section>
  );

  /* ───────────────────────── desktop ───────────────────────── */
  if (isDesktop) {
    return (
      <main>
        <div className="grid grid-cols-[1fr_minmax(380px,30%)] border-b border-ink-line">
          <div className="relative">
            <div className="sticky top-[var(--bar-h)] h-[calc(100vh-var(--bar-h))] min-h-[560px]">
              <div
                ref={mainImageRef}
                className="relative h-full cursor-zoom-in overflow-hidden bg-cream-dim"
                onMouseEnter={() => setImageZoom(true)}
                onMouseLeave={() => setImageZoom(false)}
                onMouseMove={handleImageMouseMove}
              >
                {images.map((img, i) => (
                  <SmartImage
                    key={`${img}-${i}`}
                    src={img}
                    alt={i === activeIndex ? product.title : ""}
                    width={2000}
                    sizes="70vw"
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : undefined}
                    className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-300 ${
                      i === activeIndex ? "opacity-100" : "opacity-0"
                    } ${imageZoom && i === activeIndex ? "scale-150" : "scale-100"}`}
                    style={
                      imageZoom && i === activeIndex
                        ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                        : undefined
                    }
                  />
                ))}
                {!isAvailable && (
                  <span className="badge absolute left-6 top-6 z-10 bg-cream text-ink">
                    Sold out
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => goToImage(activeIndex - 1)}
                    aria-label="Previous image"
                    className="icon-btn absolute left-6 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-cream/85 text-ink backdrop-blur hover:bg-cream"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goToImage(activeIndex + 1)}
                    aria-label="Next image"
                    className="icon-btn absolute right-6 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-cream/85 text-ink backdrop-blur hover:bg-cream"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 flex gap-px border-r border-t border-ink-line bg-ink-line">
                    {images.map((img, idx) => (
                      <button
                        key={`${img}-${idx}`}
                        type="button"
                        onClick={() => setMainImage(img)}
                        aria-label={`Show image ${idx + 1}`}
                        aria-current={activeIndex === idx}
                        className={`relative h-[68px] w-[68px] overflow-hidden bg-cream transition-opacity ${
                          activeIndex === idx
                            ? "opacity-100"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <SmartImage
                          src={img}
                          alt=""
                          width={160}
                          sizes="68px"
                          className="h-full w-full object-cover"
                        />
                        {activeIndex === idx && (
                          <span
                            className="absolute inset-x-0 bottom-0 h-[2px] bg-ink"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <aside className="border-l border-ink-line">
            <div className="sticky top-[var(--bar-h)] px-[var(--gutter)] pb-14 pt-12">
              {header}
              <div className="mt-8">{options}</div>
              <div className="mt-8 flex gap-3">
                {renderCartButton("flex-1")}
                <button
                  onClick={handleWishlistToggle}
                  type="button"
                  disabled={checkingWishlist}
                  aria-pressed={inWishlist}
                  aria-label={
                    inWishlist ? "Remove from wishlist" : "Save to wishlist"
                  }
                  className="icon-btn h-14 w-14 shrink-0 rounded-full border border-ink text-ink transition-colors hover:bg-ink hover:text-cream"
                >
                  {checkingWishlist ? (
                    <Spinner className="h-4 w-4" />
                  ) : inWishlist ? (
                    <HeartSolid className="h-5 w-5 text-ember" />
                  ) : (
                    <Heart className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="mt-10">
                <Accordion />
              </div>
            </div>
          </aside>
        </div>
        {relatedSection}
      </main>
    );
  }

  /* ───────────────────────── mobile app ───────────────────────── */
  return (
    <main className="pb-28">
      <div className="relative">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            const index = Math.round(el.scrollLeft / el.clientWidth);
            if (images[index] !== undefined && images[index] !== mainImage)
              setMainImage(images[index]);
          }}
        >
          {images.map((img, i) => (
            <div
              key={`${img}-${i}`}
              className="aspect-[4/5] max-h-[78svh] w-full shrink-0 snap-center bg-cream-dim"
            >
              <SmartImage
                src={img}
                alt={`${product.title}${images.length > 1 ? ` — image ${i + 1}` : ""}`}
                width={900}
                sizes="100vw"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            window.history.length > 1 ? navigate(-1) : navigate("/shop")
          }
          aria-label="Go back"
          className="icon-btn absolute left-4 top-4 h-10 w-10 rounded-full bg-cream/90 text-ink shadow-sm backdrop-blur active:scale-95"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleWishlistToggle}
          type="button"
          disabled={checkingWishlist}
          aria-pressed={inWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Save to wishlist"}
          className="icon-btn absolute right-4 top-4 h-10 w-10 rounded-full bg-cream/90 text-ink shadow-sm backdrop-blur active:scale-95"
        >
          {inWishlist ? (
            <HeartSolid className="h-5 w-5 text-ember" />
          ) : (
            <Heart className="h-5 w-5" />
          )}
        </button>
        {!isAvailable && (
          <span className="badge absolute bottom-4 left-4 bg-cream text-ink">
            Sold out
          </span>
        )}
        {images.length > 1 && (
          <div
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-ink/30 px-2.5 py-1.5 backdrop-blur"
            aria-hidden="true"
          >
            {images.map((img, i) => (
              <span
                key={`${img}-dot-${i}`}
                className={`h-1.5 rounded-full bg-cream transition-all duration-300 ${i === activeIndex ? "w-4" : "w-1.5 opacity-60"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pt-5">
        {header}
        <div className="mt-7">{options}</div>
        <div className="mt-8">
          <Accordion />
        </div>
      </div>

      {relatedSection}

      {/* Sticky purchase bar, docked above the app tab bar */}
      <div className="bottom-tabbar fixed inset-x-0 z-40 border-t border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-[11px] uppercase text-muted">Total</p>
            <p className="text-[17px] leading-tight tabular-nums">
              {formatMoney(finalPrice * quantity)}
            </p>
          </div>
          {renderCartButton("!h-12 flex-1 !px-5 !text-[14px]")}
        </div>
      </div>
    </main>
  );
}
