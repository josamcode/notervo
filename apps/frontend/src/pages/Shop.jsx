import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard, {
  ProductCardSkeleton,
  ProductGrid,
} from "../components/ProductCard";
import SmartImage from "../components/ui/SmartImage";
import { EmptyState } from "../components/ui/Primitives";
import {
  ArrowLeft,
  ArrowRight,
  Close,
  Filter,
  Search,
  Tag,
} from "../components/ui/Icons";
import { escapeSearchTerm, fetchNotebookCategories } from "../utils/catalog";

const PAGE_SIZE = 12;

const titleCase = (value = "") =>
  value.charAt(0).toUpperCase() + value.slice(1);

/* ───────────── collection hero with serif marquee (desktop) ───────────── */
const CollectionHero = ({ title, image }) => {
  const words = Array.from({ length: 6 }, () => title);
  return (
    <section
      aria-label={title}
      className="relative hidden h-[min(64vh,620px)] min-h-[420px] overflow-hidden bg-ink md:block"
    >
      {image && (
        <SmartImage
          key={image}
          src={image}
          alt=""
          width={2000}
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full animate-[appear_1.2s_ease_forwards] object-cover"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/20"
      />
      {/* A full 1em line box keeps the capitals unclipped; the -0.2em margin
          drops the unused descender space (caps have no descenders) so the
          baseline rests just above the hero's bottom edge. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 font-serif text-[clamp(88px,10vw,168px)] font-light uppercase leading-none tracking-[-0.02em] text-cream"
      >
        <div className="motion-marquee -mb-[0.2em] flex w-max animate-[marquee_32s_linear_infinite] whitespace-nowrap">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {words.map((word, i) => (
                <span key={`${copy}-${i}`} className="pr-[0.4em]">
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <h1 className="sr-only">{title}</h1>
    </section>
  );
};

/* ───────────── main component ───────────── */
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [notebookCategories, setNotebookCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const initialFilters = {
    brand: "",
    category: "",
    discounted: false,
    minPrice: 0,
    maxPrice: 2000,
    page: 1,
    limit: PAGE_SIZE,
  };

  const [filters, setFilters] = useState(initialFilters);

  const fetchProducts = useCallback(
    async (customFilters = filters) => {
      setLoading(true);
      try {
        const params = { ...customFilters };
        Object.keys(params).forEach((key) => {
          if (params[key] === "" || params[key] === 0 || params[key] === false)
            delete params[key];
        });
        if (searchTerm.trim()) params.q = escapeSearchTerm(searchTerm);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/products`,
          { params }
        );
        const activeProducts = res.data.data.filter((p) => p.isActive === true);
        setProducts(activeProducts || []);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total ?? activeProducts.length);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [filters, searchTerm]
  );

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/products/categories`),
          axios.get(`${import.meta.env.VITE_API_URL}/products/brands`),
        ]);
        setCategories(categoriesRes.data || []);
        setBrands(brandsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch categories or brands:", err);
      }
    };
    fetchCategoriesAndBrands();
    fetchNotebookCategories()
      .then(setNotebookCategories)
      .catch(() => setNotebookCategories([]));
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    setFilters({
      category: params.category || "",
      brand: params.brand || "",
      minPrice: params.minPrice ? Number(params.minPrice) : 0,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : 2000,
      page: params.page ? Number(params.page) : 1,
      limit: params.limit ? Number(params.limit) : PAGE_SIZE,
      discounted: params.discounted === "true",
    });
    setSearchTerm((current) =>
      (params.q || "") === current.trim() ? current : params.q || ""
    );
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchProducts(), 350);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchProducts]);

  // Lock scroll while the mobile filter sheet is open.
  useEffect(() => {
    if (!showFilters) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setShowFilters(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [showFilters]);

  const updateParam = (name, val) => {
    const updatedParams = new URLSearchParams(searchParams);
    if (val && val !== "" && val !== 0 && val !== false) {
      updatedParams.set(name, val);
    } else {
      updatedParams.delete(name);
    }
    if (name !== "page") updatedParams.delete("page");
    setSearchParams(updatedParams);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    const updatedFilters = { ...filters, [name]: val };
    if (name !== "page") updatedFilters.page = 1;
    setFilters(updatedFilters);
    updateParam(name, val);
  };

  const setCategory = (category) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }));
    updateParam("category", category);
  };

  const toggleDiscounted = () => {
    const newDiscounted = !filters.discounted;
    setFilters((prev) => ({ ...prev, discounted: newDiscounted, page: 1 }));
    updateParam("discounted", newDiscounted ? "true" : "");
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    const updatedParams = new URLSearchParams(searchParams);
    if (value.trim()) updatedParams.set("q", value);
    else updatedParams.delete("q");
    updatedParams.delete("page");
    setSearchParams(updatedParams, { replace: true });
  };

  const clearFilter = (name) => {
    if (name === "q") {
      handleSearchChange("");
      return;
    }
    setFilters((prev) => ({ ...prev, [name]: initialFilters[name], page: 1 }));
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete(name);
    updatedParams.delete("page");
    setSearchParams(updatedParams);
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
    setSearchParams({});
  };

  const goToPage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    updateParam("page", page > 1 ? String(page) : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount = [
    filters.category,
    filters.brand,
    filters.discounted,
    searchTerm.trim(),
  ].filter(Boolean).length;

  // Category tabs: admin-managed notebook categories first, then any other product keys.
  const categoryTabs = useMemo(() => {
    const byKey = new Map(notebookCategories.map((c) => [c.categoryKey, c]));
    const ordered = notebookCategories.map((c) => ({
      key: c.categoryKey,
      label: c.title,
    }));
    categories.forEach((key) => {
      if (!byKey.has(key)) ordered.push({ key, label: titleCase(key) });
    });
    return ordered;
  }, [categories, notebookCategories]);

  const activeCategory = notebookCategories.find(
    (c) => c.categoryKey === filters.category
  );
  const heroTitle = searchTerm.trim()
    ? `“${searchTerm.trim()}”`
    : activeCategory?.title ||
      (filters.category
        ? titleCase(filters.category)
        : filters.discounted
          ? "On sale"
          : "Notebooks");
  const heroImage = activeCategory?.imageUrl || notebookCategories[0]?.imageUrl;
  const resultLabel = loading
    ? "Loading…"
    : `${total} ${total === 1 ? "notebook" : "notebooks"}`;

  const pagination = totalPages > 1 && (
    <nav
      aria-label="Pagination"
      className="container-x mt-10 flex items-center justify-center gap-1.5 md:mt-14"
    >
      <button
        type="button"
        disabled={filters.page <= 1}
        onClick={() => goToPage(filters.page - 1)}
        aria-label="Previous page"
        className="icon-btn h-11 w-11 rounded-full border border-ink/25 text-ink hover:border-ink disabled:pointer-events-none disabled:opacity-30"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        const current = filters.page === page;
        if (
          totalPages > 7 &&
          Math.abs(page - filters.page) > 2 &&
          page !== 1 &&
          page !== totalPages
        ) {
          if (page === filters.page - 3 || page === filters.page + 3) {
            return (
              <span
                key={page}
                className="flex h-11 w-8 items-center justify-center text-muted"
              >
                …
              </span>
            );
          }
          return null;
        }
        return (
          <button
            key={page}
            type="button"
            onClick={() => goToPage(page)}
            aria-current={current ? "page" : undefined}
            className={`h-11 min-w-[44px] rounded-full px-3 text-[14px] tabular-nums transition-colors ${
              current ? "bg-ink text-cream" : "text-ink hover:bg-ink/5"
            }`}
          >
            {page}
          </button>
        );
      })}
      <button
        type="button"
        disabled={filters.page >= totalPages}
        onClick={() => goToPage(filters.page + 1)}
        aria-label="Next page"
        className="icon-btn h-11 w-11 rounded-full border border-ink/25 text-ink hover:border-ink disabled:pointer-events-none disabled:opacity-30"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </nav>
  );

  const chip = (active) =>
    `shrink-0 h-9 whitespace-nowrap rounded-full px-4 text-[13px] transition-colors ${
      active ? "bg-ink text-cream" : "bg-cream-deep text-ink active:bg-ink/10"
    }`;

  return (
    <div className="min-h-screen pb-10 md:pb-24">
      <CollectionHero title={heroTitle} image={heroImage} />

      {/* ───── Desktop filter bar ───── */}
      <div className="sticky top-[var(--bar-h)] z-30 hidden border-b border-ink-line bg-cream/95 backdrop-blur md:block">
        <div className="container-x flex h-[60px] items-center gap-8">
          <ul
            className="no-scrollbar flex min-w-0 flex-1 items-center gap-6 overflow-x-auto"
            aria-label="Categories"
          >
            {[{ key: "", label: "All" }, ...categoryTabs].map(
              ({ key, label }) => (
                <li key={key || "all"} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setCategory(key)}
                    aria-pressed={filters.category === key}
                    className={`link-underline py-1 text-[15px] ${
                      filters.category === key
                        ? "bg-[length:100%_1px] text-ink"
                        : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {label}
                  </button>
                </li>
              )
            )}
          </ul>
          <div className="flex shrink-0 items-center gap-6">
            <button
              type="button"
              onClick={toggleDiscounted}
              aria-pressed={filters.discounted}
              className={`flex items-center gap-2 text-[15px] ${filters.discounted ? "text-ink" : "text-ink/70 hover:text-ink"}`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center border border-ink ${filters.discounted ? "bg-ink" : ""}`}
                aria-hidden="true"
              >
                {filters.discounted && (
                  <span className="h-1.5 w-1.5 bg-cream" />
                )}
              </span>
              On sale
            </button>
            {brands.length > 1 && (
              <label className="flex items-center gap-2 text-[15px] text-ink/70">
                <span className="sr-only">Brand</span>
                <select
                  name="brand"
                  onChange={handleChange}
                  value={filters.brand}
                  className="cursor-pointer appearance-none bg-transparent pr-1 text-ink focus:outline-none"
                >
                  <option value="">All brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="flex h-9 w-[220px] items-center gap-2 border-b border-ink/40 focus-within:border-ink">
              <Search className="h-4 w-4 shrink-0" />
              <label htmlFor="shop-search-desktop" className="sr-only">
                Search notebooks
              </label>
              <input
                id="shop-search-desktop"
                type="search"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => clearFilter("q")}
                  aria-label="Clear search"
                  className="text-muted hover:text-ink"
                >
                  <Close className="h-4 w-4" />
                </button>
              )}
            </div>
            <p
              className="min-w-[96px] text-right text-[14px] tabular-nums text-muted"
              aria-live="polite"
            >
              {resultLabel}
            </p>
          </div>
        </div>
      </div>

      {/* ───── Mobile app header ───── */}
      <div className="md:hidden">
        <div className="px-4 pb-3 pt-4">
          <div className="flex items-end justify-between">
            <h1 className="font-serif text-[30px] font-light leading-none">
              {activeCategory?.title ||
                (filters.discounted ? "On sale" : "Shop")}
            </h1>
            <p className="text-[13px] text-muted" aria-live="polite">
              {resultLabel}
            </p>
          </div>
          <div className="mt-4 flex gap-2.5">
            <div className="flex h-12 min-w-0 flex-1 items-center gap-2.5 rounded-full bg-cream-deep px-4">
              <Search className="h-[18px] w-[18px] shrink-0 text-muted" />
              <label htmlFor="shop-search-mobile" className="sr-only">
                Search notebooks
              </label>
              <input
                id="shop-search-mobile"
                type="search"
                placeholder="Search notebooks"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                enterKeyHint="search"
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => clearFilter("q")}
                  aria-label="Clear search"
                  className="icon-btn -mr-1 h-8 w-8 rounded-full text-muted"
                >
                  <Close className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              aria-label={`Filters${activeFilterCount ? `, ${activeFilterCount} active` : ""}`}
              className="icon-btn relative h-12 w-12 shrink-0 rounded-full bg-ink text-cream active:scale-95"
            >
              <Filter className="h-5 w-5" />
              {activeFilterCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-ember px-1 text-[10px] text-cream ring-2 ring-cream">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <ul
          className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-4"
          aria-label="Categories"
        >
          <li>
            <button
              type="button"
              onClick={() => setCategory("")}
              aria-pressed={!filters.category}
              className={chip(!filters.category)}
            >
              All
            </button>
          </li>
          {categoryTabs.map(({ key, label }) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => setCategory(key)}
                aria-pressed={filters.category === key}
                className={chip(filters.category === key)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ───── Active filters ───── */}
      {(filters.brand || filters.discounted || searchTerm.trim()) && (
        <div className="container-x flex flex-wrap items-center gap-2 pb-4 md:py-5">
          {[
            filters.brand && ["brand", filters.brand],
            filters.discounted && ["discounted", "On sale"],
            searchTerm.trim() && ["q", `“${searchTerm.trim()}”`],
          ]
            .filter(Boolean)
            .map(([name, label]) => (
              <button
                key={name}
                type="button"
                onClick={() => clearFilter(name)}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-ink/25 pl-3.5 pr-2.5 text-[13px] hover:border-ink"
                aria-label={`Remove filter ${label}`}
              >
                {label}
                <Close className="h-3.5 w-3.5" />
              </button>
            ))}
          <button
            type="button"
            onClick={clearAllFilters}
            className="link-underline ml-1 text-[13px] text-muted"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ───── Products grid ───── */}
      {loading ? (
        <ProductGrid>
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ProductGrid>
      ) : products.length > 0 ? (
        <ProductGrid>
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} priority={i < 4} />
          ))}
        </ProductGrid>
      ) : (
        <EmptyState
          icon={Search}
          title="No notebooks found"
          description="Try adjusting your filters or search term."
          actionLabel="Clear all filters"
          onAction={clearAllFilters}
        />
      )}

      {pagination}

      {/* ───── Mobile filter sheet ───── */}
      <div
        className={`fixed inset-0 z-[150] duration-200 md:hidden ${
          showFilters
            ? "visible opacity-100 transition-opacity"
            : "invisible opacity-0 transition-[opacity,visibility]"
        }`}
        aria-hidden={!showFilters}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close filters"
          className="absolute inset-0 h-full w-full bg-ink/40"
          onClick={() => setShowFilters(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          className={`absolute inset-x-0 bottom-0 rounded-t-[28px] bg-cream px-5 pb-[calc(20px+env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 ease-out ${
            showFilters ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div
            className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/15"
            aria-hidden="true"
          />
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[24px] font-light">Filters</h2>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="icon-btn h-10 w-10 rounded-full bg-ink/5"
              aria-label="Close filters"
            >
              <Close className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 space-y-6">
            <button
              type="button"
              onClick={toggleDiscounted}
              aria-pressed={filters.discounted}
              className="flex w-full items-center justify-between rounded-2xl bg-cream-deep px-4 py-3.5 text-left"
            >
              <span className="flex items-center gap-3 text-[15px]">
                <Tag className="h-5 w-5" /> On sale only
              </span>
              <span
                aria-hidden="true"
                className={`relative h-7 w-12 rounded-full transition-colors ${filters.discounted ? "bg-ink" : "bg-ink/20"}`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-cream transition-transform ${filters.discounted ? "translate-x-6" : "translate-x-1"}`}
                />
              </span>
            </button>

            {brands.length > 0 && (
              <div>
                <p className="field-label">Brand</p>
                <div className="flex flex-wrap gap-2">
                  {["", ...brands].map((brand) => (
                    <button
                      key={brand || "all"}
                      type="button"
                      onClick={() =>
                        handleChange({
                          target: {
                            name: "brand",
                            value: brand,
                            type: "select",
                          },
                        })
                      }
                      aria-pressed={filters.brand === brand}
                      className={chip(filters.brand === brand)}
                    >
                      {brand || "All brands"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={clearAllFilters}
              className="btn btn-outline btn-md flex-1"
            >
              <span>Clear all</span>
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="btn btn-solid btn-md flex-[1.4]"
            >
              <span>Show {loading ? "" : total} results</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
