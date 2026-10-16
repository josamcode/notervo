import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard, {
  ProductCardSkeleton,
  ProductGrid,
} from "../components/ProductCard";
import Pill from "../components/ui/Pill";
import Reveal from "../components/ui/Reveal";
import SmartImage from "../components/ui/SmartImage";
import { Eyebrow, Price } from "../components/ui/Primitives";
import {
  ArrowLeft,
  ArrowRight,
  Cash,
  ChevronLeft,
  ChevronRight,
  Chat,
  Circle,
  Clock,
  Feather,
  Layout,
  Return,
  Sparkle,
  Spinner,
  Star,
  Tag,
  Truck,
} from "../components/ui/Icons";
import { fetchNotebookCategories } from "../utils/catalog";
import { getDiscountedPrice } from "../utils/pricing";
import { addToCart } from "../utils/CartUtils";
import { showError, showSuccess } from "../utils/Toast";
import { useIsDesktop } from "../hooks/useMediaQuery";

const API = import.meta.env.VITE_API_URL;

// Brand promises sourced from Notervo's About, Shipping and Returns pages.
const PROMISES = [
  { icon: Layout, label: "Calm, clutter-free layouts" },
  { icon: Feather, label: "Selected paper & durable covers" },
  { icon: Circle, label: "Timeless monochrome design" },
  { icon: Clock, label: "Same-day dispatch before 3 PM" },
  { icon: Return, label: "14-day returns on unused items" },
  { icon: Cash, label: "Cash on delivery" },
];

const titleCase = (v = "") => v.charAt(0).toUpperCase() + v.slice(1);

function useHomeData() {
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [onSale, setOnSale] = useState([]);
  const [loading, setLoading] = useState({ products: true, categories: true });

  useEffect(() => {
    axios
      .get(`${API}/products/top-rated`)
      .then((res) =>
        setBestSellers(
          (res.data?.data || []).filter((p) => p.isActive === true)
        )
      )
      .catch(console.error)
      .finally(() => setLoading((s) => ({ ...s, products: false })));

    fetchNotebookCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading((s) => ({ ...s, categories: false })));

    axios
      .get(`${API}/products`, { params: { discounted: true, limit: 4 } })
      .then((res) =>
        setOnSale((res.data?.data || []).filter((p) => p.isActive === true))
      )
      .catch(() => setOnSale([]));
  }, []);

  return { bestSellers, categories, onSale, loading };
}

/* ─────────────────────────── desktop sections ─────────────────────────── */

function Hero({ image }) {
  return (
    <section
      aria-label="Introduction"
      className="relative flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden bg-ink"
    >
      {image && (
        <SmartImage
          src={image}
          alt=""
          width={2000}
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full animate-[appear_1.2s_ease_forwards,slow-zoom_9s_cubic-bezier(0.22,1,0.36,1)_forwards] object-cover motion-reduce:animate-none"
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-ink/30" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent"
      />

      <div className="relative z-10 px-6 text-center opacity-0 animate-[appear_1.75s_ease_0.2s_forwards] motion-reduce:opacity-100">
        <h1 className="font-serif text-[56px] font-light leading-[0.92] tracking-[-0.02em] text-cream lg:text-display-xl">
          We don&rsquo;t sell
          <br />
          notebooks.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-[17px] leading-snug text-cream/85">
          When you carry a notebook from Notervo, you express your identity with
          absolute precision.
        </p>
      </div>

      <div className="absolute bottom-9 left-[var(--gutter)] z-10 opacity-0 animate-[appear_1.75s_ease_0.5s_forwards] motion-reduce:opacity-100">
        <Pill to="/shop" variant="light" size="lg" arrow>
          Shop now
        </Pill>
      </div>
    </section>
  );
}

function FeaturedProduct({ product }) {
  const [index, setIndex] = useState(0);
  const [color, setColor] = useState(product.colors?.[0] || "");
  const [size, setSize] = useState(product.sizes?.[0] || "");
  const [adding, setAdding] = useState(false);
  const images = product.images?.length ? product.images : [null];
  const { originalPrice, finalPrice } = getDiscountedPrice(product);
  const isAvailable = product.inStock && product.stockQuantity > 0;

  const go = (dir) =>
    setIndex((i) => (i + dir + images.length) % images.length);

  const handleAdd = async () => {
    setAdding(true);
    const result = await addToCart(product._id, 1, color || null, size || null);
    setAdding(false);
    if (result.success) showSuccess(`${product.title} added to cart.`);
    else showError(result.message);
  };

  return (
    <section
      aria-labelledby="featured-title"
      className="grid border-b border-ink-line lg:h-[min(90vh,860px)] lg:grid-cols-[minmax(380px,29%)_1fr]"
    >
      <div className="flex flex-col overflow-y-auto border-ink-line px-[var(--gutter)] py-10 lg:border-r lg:py-12">
        <Reveal>
          <Eyebrow className="mb-4">
            {product.category?.length
              ? product.category.map(titleCase).join(" · ")
              : "Best seller"}
          </Eyebrow>
          <h2
            id="featured-title"
            className="font-serif text-[40px] font-light leading-[1] tracking-tight"
          >
            {product.title}
          </h2>
          <Price
            value={finalPrice}
            compareAt={originalPrice}
            className="mt-6 text-[24px] leading-none"
            compareClassName="text-[18px]"
          />
          <p className="mt-5 line-clamp-4 text-[15px] leading-snug text-muted">
            {product.description}
          </p>
          {product.rating > 0 && (
            <p className="mt-4 flex items-center gap-1.5 text-[13px] text-ink">
              <span className="flex" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5"
                    filled={product.rating >= i - 0.25}
                  />
                ))}
              </span>
              <span>
                {Number(product.rating).toFixed(1)}
                {product.numReviews > 0 && ` · ${product.numReviews} reviews`}
              </span>
            </p>
          )}
        </Reveal>

        <Reveal
          delay={120}
          className="mt-8 flex items-start gap-4 bg-ember px-5 py-5 text-cream"
        >
          <Truck className="mt-0.5 h-7 w-7 shrink-0" />
          <div>
            <p className="text-[18px] leading-tight">Same-day dispatch</p>
            <p className="mt-1.5 text-[13px] leading-snug text-cream/90">
              Orders placed before 3 PM ship the same day when stock is
              available. Pay cash on delivery.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-7 space-y-5">
          {product.colors?.length > 0 && (
            <fieldset>
              <legend className="mb-2.5 text-[13px] text-ink">
                Colour{color && !color.startsWith("#") ? `: ${color}` : ""}
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={`Colour ${c}`}
                    aria-pressed={color === c}
                    className={`h-7 w-7 rounded-full border border-ink/20 ring-offset-2 ring-offset-cream transition ${color === c ? "ring-1 ring-ink" : "hover:ring-1 hover:ring-ink/40"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </fieldset>
          )}
          {product.sizes?.length > 0 && (
            <fieldset>
              <legend className="mb-2.5 text-[13px] text-ink">
                Format{size ? `: ${size}` : ""}
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={`h-9 min-w-[52px] rounded-full border px-4 text-[13px] transition-colors ${size === s ? "border-ink bg-ink text-cream" : "border-ink/30 hover:border-ink"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
        </Reveal>

        <Reveal delay={260} className="mt-8">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!isAvailable || adding}
            className="btn btn-solid btn-lg w-full"
          >
            {adding ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <span>{isAvailable ? "Add to cart" : "Sold out"}</span>
            )}
          </button>
          <Link
            to={`/products/${product._id}`}
            className="link-underline mx-auto mt-4 block w-fit text-[13px] uppercase"
          >
            View full details
          </Link>
        </Reveal>
      </div>

      <div className="relative min-h-[520px] overflow-hidden bg-cream-dim">
        {images.map((img, i) => (
          <SmartImage
            key={`${img}-${i}`}
            src={img}
            alt={i === index ? product.title : ""}
            width={1600}
            sizes="(min-width: 1024px) 70vw, 100vw"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-karst ${i === index ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="icon-btn absolute left-5 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-cream/80 text-ink backdrop-blur hover:bg-cream"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="icon-btn absolute right-5 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-cream/80 text-ink backdrop-blur hover:bg-cream"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-current={i === index}
                  className={`h-2 w-2 rounded-full border border-cream transition-colors ${i === index ? "bg-cream" : "bg-transparent"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function CategoryCarousel({ categories }) {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update, categories.length]);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    el.scrollBy({
      left: dir * card.getBoundingClientRect().width,
      behavior: "smooth",
    });
  };

  return (
    <section
      aria-labelledby="collections-title"
      className="grid border-b border-ink-line lg:grid-cols-[minmax(380px,29%)_1fr]"
    >
      <Reveal className="flex flex-col px-[var(--gutter)] pb-10 pt-12 lg:pb-12">
        <Eyebrow className="mb-4">Collections</Eyebrow>
        <h2
          id="collections-title"
          className="font-serif text-[44px] font-light leading-[1] tracking-tight"
        >
          Shop by notebook type
        </h2>
        <p className="mt-6 max-w-sm text-[17px] leading-snug text-ink/85">
          Choose the format that matches how you think and work.
        </p>
        <div className="mt-10 lg:mt-auto">
          <Pill to="/shop" size="lg" arrow>
            Shop all
          </Pill>
        </div>
      </Reveal>

      <div className="relative min-w-0 pt-0 lg:pt-12">
        <ul
          ref={trackRef}
          onScroll={update}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth border-y border-ink-line lg:border-b-0"
        >
          {categories.map((c, i) => (
            <li
              key={c._id}
              className="w-[78vw] shrink-0 snap-start border-r border-ink-line sm:w-[44vw] lg:w-[min(25vw,476px)]"
            >
              <Reveal delay={i * 80} fade>
                <Link
                  to={`/shop?category=${encodeURIComponent(c.categoryKey)}`}
                  className="group block p-1.5"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-cream-dim">
                    <SmartImage
                      src={c.imageUrl}
                      alt=""
                      width={900}
                      sizes="(min-width: 1024px) 25vw, 60vw"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-center justify-between px-1.5 pb-3 pt-3.5">
                    <span className="text-[13px] uppercase">{c.title}</span>
                    <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        {!edges.start && (
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous collections"
            className="icon-btn absolute left-0 top-[42%] h-12 w-12 bg-cobalt text-cream transition-opacity hover:opacity-90"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
        {!edges.end && (
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next collections"
            className="icon-btn absolute right-0 top-[42%] h-12 w-12 bg-cobalt text-cream transition-opacity hover:opacity-90"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        )}

        <div className="relative h-[3px] bg-transparent" aria-hidden="true">
          <div className="absolute inset-x-0 top-px h-px bg-ink/15" />
          <div
            className="absolute left-0 top-0 h-[3px] bg-ink transition-[width] duration-700 ease-out"
            style={{ width: `${Math.max(18, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}

function BestSellers({ products, loading }) {
  return (
    <section aria-labelledby="bestsellers-title">
      <Reveal className="container-x flex items-end justify-between pb-6 pt-14">
        <h2
          id="bestsellers-title"
          className="font-serif text-[44px] font-light leading-none tracking-tight"
        >
          Shop best sellers
        </h2>
        <Link
          to="/shop"
          className="link-underline flex items-center gap-2 pb-1 text-[14px] uppercase"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
      <ProductGrid>
        {loading
          ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
          : products
              .slice(0, 8)
              .map((p) => <ProductCard key={p._id} product={p} />)}
      </ProductGrid>
    </section>
  );
}

function Promises() {
  return (
    <section
      aria-labelledby="promise-title"
      className="border-b border-ink-line"
    >
      <div className="container-x grid gap-14 py-20 lg:grid-cols-[minmax(380px,29%)_1fr] lg:gap-0 lg:px-0">
        <Reveal className="flex flex-col lg:px-[var(--gutter)]">
          <h2
            id="promise-title"
            className="font-serif text-[44px] font-light leading-[1] tracking-tight"
          >
            Why write with Notervo?
          </h2>
          <p className="mt-6 max-w-sm text-[16px] leading-snug text-ink/85">
            Every notebook follows a clear, calm layout with no visual clutter.
            Paper texture, line balance, and cover durability are selected for
            everyday quality and long-term use.
          </p>
          <div className="mt-10">
            <Pill to="/about" size="lg" arrow>
              Our story
            </Pill>
          </div>
        </Reveal>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-12 self-center sm:grid-cols-3 lg:px-[var(--gutter)]">
          {PROMISES.map(({ icon: Icon, label }, i) => (
            <Reveal
              as="li"
              key={label}
              delay={i * 70}
              className="flex flex-col items-center text-center"
            >
              <Icon className="h-14 w-14 text-ink" strokeWidth={1.1} />
              <span className="mt-4 max-w-[12rem] text-[12px] uppercase leading-snug tracking-[0.02em]">
                {label}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function OfferFeature({ background, product }) {
  return (
    <section
      aria-labelledby="offer-title"
      className="relative flex min-h-[760px] items-center justify-center overflow-hidden bg-ink py-20"
    >
      <SmartImage
        src={background}
        alt=""
        width={2000}
        sizes="100vw"
        className="absolute inset-0 h-full w-full scale-105 object-cover blur-[2px]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-ink/35" />
      <Reveal className="relative z-10 mx-[var(--gutter)] grid w-full max-w-[980px] bg-cream md:grid-cols-2">
        <div className="flex flex-col p-10 lg:p-12">
          <Eyebrow>Limited offer</Eyebrow>
          <h2
            id="offer-title"
            className="mt-6 font-serif text-[44px] font-light leading-[1] tracking-tight"
          >
            Launch offer on selected notebooks
          </h2>
          <p className="mt-6 text-[15px] leading-snug text-ink/85">
            Save on curated notebook lines designed for calm planning and
            consistent writing routines.
          </p>
          <div className="mt-12 lg:mt-auto">
            <Pill to="/shop?discounted=true" size="lg" arrow>
              Shop the offer
            </Pill>
          </div>
        </div>
        <Link
          to={`/products/${product._id}`}
          className="group relative block aspect-square overflow-hidden md:aspect-auto"
          aria-label={`View ${product.title}`}
        >
          <SmartImage
            src={product.images?.[0]}
            alt=""
            width={1000}
            sizes="(min-width: 768px) 490px, 100vw"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </Link>
      </Reveal>
    </section>
  );
}

function DesktopHome({ bestSellers, categories, onSale, loading }) {
  const heroImage = categories[0]?.imageUrl || bestSellers[0]?.images?.[0];
  const featured = bestSellers[0];
  const offerBackground =
    categories[1]?.imageUrl ||
    categories[0]?.imageUrl ||
    onSale[0]?.images?.[1];

  return (
    <div>
      <Hero image={heroImage} />
      {featured && <FeaturedProduct product={featured} />}
      {categories.length > 0 && <CategoryCarousel categories={categories} />}
      <BestSellers products={bestSellers} loading={loading.products} />
      <Promises />
      {onSale.length > 0 && (
        <OfferFeature background={offerBackground} product={onSale[0]} />
      )}
    </div>
  );
}

/* ─────────────────────────── mobile app home ─────────────────────────── */

const QUICK_ACTIONS = [
  { label: "New", icon: Sparkle, href: "/shop?sort=newest" },
  { label: "Offers", icon: Tag, href: "/shop?discounted=true" },
  { label: "Popular", icon: Star, href: "/shop?sort=popular" },
  { label: "Help", icon: Chat, href: "/help-center" },
];

const AppSectionHeader = ({ title, actionLabel, actionHref }) => (
  <div className="mb-3.5 flex items-end justify-between px-4">
    <h2 className="font-serif text-[24px] font-light leading-none">{title}</h2>
    {actionLabel && (
      <Link
        to={actionHref}
        className="text-[13px] text-muted underline-offset-4 active:underline"
      >
        {actionLabel}
      </Link>
    )}
  </div>
);

function MobileHome({ bestSellers, categories, onSale, loading }) {
  const heroImage = categories[0]?.imageUrl || bestSellers[0]?.images?.[0];

  return (
    <div className="pb-6">
      <div className="px-4 pt-3">
        <Link
          to="/shop"
          className="relative flex h-[230px] flex-col justify-end overflow-hidden rounded-[28px] bg-ink p-5 active:scale-[0.99] transition-transform"
        >
          {heroImage && (
            <SmartImage
              src={heroImage}
              alt=""
              width={900}
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
          />
          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-[0.06em] text-cream/80">
              Express your identity
            </p>
            <h1 className="mt-1.5 font-serif text-[34px] font-light leading-[0.95] text-cream">
              We don&rsquo;t sell
              <br />
              notebooks.
            </h1>
            <span className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-cream px-4 text-[12px] uppercase text-ink">
              Shop now <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </div>

      <nav
        aria-label="Quick links"
        className="mt-4 grid grid-cols-4 gap-2.5 px-4"
      >
        {QUICK_ACTIONS.map(({ label, icon: Icon, href }) => (
          <Link
            key={label}
            to={href}
            className="flex flex-col items-center gap-2 rounded-2xl bg-cream-deep py-3.5 transition-transform active:scale-95"
          >
            <Icon className="h-[22px] w-[22px]" />
            <span className="text-[12px]">{label}</span>
          </Link>
        ))}
      </nav>

      <section className="mt-7" aria-label="Categories">
        <AppSectionHeader
          title="Categories"
          actionLabel="See all"
          actionHref="/shop"
        />
        <ul className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-4">
          {loading.categories &&
            [1, 2, 3, 4].map((i) => (
              <li key={i} className="w-[108px] shrink-0">
                <div className="skeleton h-[128px] w-[108px] rounded-2xl" />
                <div className="skeleton mx-auto mt-2.5 h-3 w-16" />
              </li>
            ))}
          {!loading.categories &&
            categories.map(({ _id, title, categoryKey, imageUrl }) => (
              <li key={_id} className="w-[108px] shrink-0 snap-start">
                <Link
                  to={`/shop?category=${encodeURIComponent(categoryKey)}`}
                  className="block text-center transition-transform active:scale-95"
                >
                  <div className="h-[128px] w-[108px] overflow-hidden rounded-2xl bg-cream-dim">
                    <SmartImage
                      src={imageUrl}
                      alt=""
                      width={320}
                      sizes="108px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mt-2 line-clamp-1 text-[12px]">{title}</p>
                </Link>
              </li>
            ))}
          {!loading.categories && categories.length === 0 && (
            <li className="py-4 text-[13px] text-muted">No categories yet</li>
          )}
        </ul>
      </section>

      <section className="mt-8" aria-label="Best sellers">
        <AppSectionHeader
          title="Best sellers"
          actionLabel="View all"
          actionHref="/shop"
        />
        <ProductGrid>
          {loading.products
            ? [1, 2, 3, 4].map((i) => <ProductCardSkeleton key={i} />)
            : bestSellers
                .slice(0, 4)
                .map((p, i) => (
                  <ProductCard key={p._id} product={p} priority={i < 2} />
                ))}
        </ProductGrid>
        {bestSellers.length > 4 && (
          <div className="px-4">
            <Link
              to="/shop"
              className="mt-5 flex h-12 items-center justify-center gap-2 rounded-full border border-ink text-[13px] uppercase active:bg-ink active:text-cream"
            >
              View all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      {onSale.length > 0 && (
        <section className="mt-8 px-4" aria-label="Limited offer">
          <Link
            to="/shop?discounted=true"
            className="flex items-stretch overflow-hidden rounded-[28px] bg-ink text-cream transition-transform active:scale-[0.99]"
          >
            <div className="flex flex-1 flex-col p-5">
              <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.06em] text-cream/70">
                <Tag className="h-3.5 w-3.5" /> Limited offer
              </p>
              <h3 className="mt-2 font-serif text-[24px] font-light leading-tight">
                Launch offer
              </h3>
              <p className="mt-1.5 text-[13px] leading-snug text-cream/75">
                Save on curated lines designed for focused writing.
              </p>
              <span className="mt-4 inline-flex h-9 w-fit items-center gap-2 rounded-full bg-cream px-4 text-[12px] uppercase text-ink">
                Shop offers <ArrowRight className="h-4 w-4" />
              </span>
            </div>
            <div className="relative w-[38%] shrink-0">
              <SmartImage
                src={onSale[0].images?.[0]}
                alt=""
                width={400}
                sizes="40vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </Link>
        </section>
      )}

      <section className="mt-8" aria-label="Notervo promises">
        <ul className="no-scrollbar flex gap-2.5 overflow-x-auto px-4">
          {[PROMISES[5], PROMISES[3], PROMISES[4]].map(
            ({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex w-[150px] shrink-0 flex-col gap-3 rounded-2xl border border-ink/10 p-4"
              >
                <Icon className="h-6 w-6" strokeWidth={1.3} />
                <span className="text-[12px] leading-snug">{label}</span>
              </li>
            )
          )}
        </ul>
      </section>
    </div>
  );
}

export default function HomePage() {
  const data = useHomeData();
  const isDesktop = useIsDesktop();
  return isDesktop ? <DesktopHome {...data} /> : <MobileHome {...data} />;
}
