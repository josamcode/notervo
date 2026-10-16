import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SmartImage from "./ui/SmartImage";
import { Price } from "./ui/Primitives";
import { ArrowRight, Close, Search, Spinner } from "./ui/Icons";
import {
  OPEN_SEARCH_EVENT,
  escapeSearchTerm,
  fetchNotebookCategories,
} from "../utils/catalog";
import { getDiscountedPrice } from "../utils/pricing";

/** Full-screen frosted search, modelled on Karst's search popup. */
export default function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const inputRef = useRef(null);
  const lastFocus = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = () => {
      lastFocus.current = document.activeElement;
      setOpen(true);
    };
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) {
      lastFocus.current?.focus?.();
      return undefined;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    fetchNotebookCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  useEffect(() => {
    const q = term.trim();
    if (!open || q.length < 2) {
      setResults([]);
      setLoading(false);
      return undefined;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      axios
        .get(`${import.meta.env.VITE_API_URL}/products`, {
          params: { q: escapeSearchTerm(q), limit: 8 },
          signal: controller.signal,
        })
        .then((res) =>
          setResults((res.data?.data || []).filter((p) => p.isActive === true))
        )
        .catch((err) => {
          if (!axios.isCancel(err)) setResults([]);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term, open]);

  const submit = (e) => {
    e.preventDefault();
    const q = term.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  if (!open) return null;

  const q = term.trim();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      className="fixed inset-0 z-[200] overflow-y-auto bg-cream/85 backdrop-blur-xl animate-[appear_0.25s_ease_forwards]"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <button
        type="button"
        onClick={close}
        className="icon-btn fixed right-4 top-4 h-11 w-11 rounded-full text-ink hover:bg-ink/5 md:right-8 md:top-6"
        aria-label="Close search"
      >
        <Close className="h-6 w-6" />
      </button>

      <div
        className="mx-auto w-full max-w-5xl px-4 pb-24 pt-20 md:pt-24"
        onMouseDown={(e) => e.target === e.currentTarget && close()}
      >
        <form onSubmit={submit} role="search" className="mx-auto max-w-xl">
          <label htmlFor="site-search" className="sr-only">
            Search notebooks
          </label>
          <div className="flex h-14 items-center gap-3 rounded-full border border-ink bg-cream px-5 shadow-[0_10px_40px_-20px_rgba(20,20,18,0.35)]">
            <Search className="h-5 w-5 shrink-0" />
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search notebooks, journals, planners"
              autoComplete="off"
              enterKeyHint="search"
              className="h-full min-w-0 flex-1 bg-transparent text-[16px] text-ink placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {loading ? (
              <Spinner className="h-4 w-4 text-muted" />
            ) : (
              term && (
                <button
                  type="button"
                  onClick={() => {
                    setTerm("");
                    inputRef.current?.focus();
                  }}
                  className="icon-btn h-8 w-8 rounded-full text-cobalt hover:bg-ink/5"
                  aria-label="Clear search"
                >
                  <Close className="h-4 w-4" strokeWidth={2} />
                </button>
              )
            )}
          </div>
        </form>

        {q.length < 2 && categories.length > 0 && (
          <section
            className="mx-auto mt-12 max-w-xl text-center"
            aria-label="Browse categories"
          >
            <p className="eyebrow mb-5 text-muted">Browse</p>
            <ul className="flex flex-wrap justify-center gap-2">
              <li>
                <Link to="/shop" className="btn btn-outline btn-sm">
                  <span>All notebooks</span>
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c._id}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(c.categoryKey)}`}
                    className="btn btn-outline btn-sm"
                  >
                    <span>{c.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {q.length >= 2 && (
          <div className="mt-10 md:mt-12" aria-live="polite">
            <p className="eyebrow mb-5 text-center text-muted">
              {loading
                ? "Searching…"
                : results.length
                  ? "Suggested products"
                  : `No notebooks match “${q}”`}
            </p>

            {results.length > 0 && (
              <ul className="grid grid-cols-2 border-l border-t border-ink-line sm:grid-cols-3 lg:grid-cols-5">
                {results.slice(0, 5).map((p) => {
                  const { originalPrice, finalPrice } = getDiscountedPrice(p);
                  return (
                    <li
                      key={p._id}
                      className="border-b border-r border-ink-line bg-cream/70"
                    >
                      <Link
                        to={`/products/${p._id}`}
                        className="group flex h-full flex-col p-3"
                      >
                        <div className="aspect-square overflow-hidden bg-cream-dim">
                          <SmartImage
                            src={p.images?.[0]}
                            alt=""
                            width={480}
                            sizes="(min-width: 1024px) 200px, 45vw"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                          />
                        </div>
                        <p className="mt-3 line-clamp-2 text-[13px] uppercase leading-tight">
                          {p.title}
                        </p>
                        <Price
                          value={finalPrice}
                          compareAt={originalPrice}
                          className="mt-1 text-[13px] text-ink"
                          compareClassName="text-[12px]"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {!loading && (
              <Link
                to={`/shop?q=${encodeURIComponent(q)}`}
                className="mx-auto mt-8 flex max-w-xl items-center justify-between border-y border-ink-line py-4 text-[13px] uppercase hover:bg-ink/[0.03]"
              >
                <span>View all results for “{q}”</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
