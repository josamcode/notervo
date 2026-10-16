import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { showSuccess } from "../utils/Toast";
import { fetchNotebookCategories, openSearch } from "../utils/catalog";
import SmartImage from "./ui/SmartImage";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Close,
  Search,
} from "./ui/Icons";

const ANNOUNCEMENT =
  "Cash on delivery across Egypt · Orders placed before 3 PM ship the same day when in stock";

const navText = "text-[15px] leading-none";

/** Count suffix rendered the Karst way: "Cart (2)". */
const Count = ({ value }) =>
  value > 0 ? (
    <span className="tabular-nums"> ({value > 99 ? "99+" : value})</span>
  ) : null;

export default function Header({ counts }) {
  const { isLoggedIn, cartCount, wishlistCount, messagesCount } = counts;
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/" || location.pathname === "/home";

  const [scrolled, setScrolled] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const accountRef = useRef(null);
  const shopButtonRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setShopOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    fetchNotebookCategories()
      .then((list) => {
        setCategories(list);
        setActiveCategory(list[0]?._id || null);
      })
      .catch(() => setCategories([]));
  }, []);

  const closeShop = useCallback(() => {
    setShopOpen(false);
    shopButtonRef.current?.focus();
  }, []);

  // Drawer: lock scroll, Escape to close, move focus inside.
  useEffect(() => {
    if (!shopOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && closeShop();
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() =>
      drawerRef.current?.querySelector("a, button")?.focus()
    );
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [shopOpen, closeShop]);

  useEffect(() => {
    if (!accountOpen) return undefined;
    const onDown = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target))
        setAccountOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setAccountOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  const handleLogout = () => {
    setAccountOpen(false);
    Swal.fire({
      title: "Log out of Notervo?",
      text: "Your active session will end on this device.",
      showCancelButton: true,
      confirmButtonColor: "#262624",
      cancelButtonColor: "#8a877f",
      confirmButtonText: "Log out",
      background: "#FFFBF2",
      color: "#262624",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("token");
        showSuccess("Logged out successfully.");
        window.location.reload();
      }
    });
  };

  // Transparent over the home hero until the visitor scrolls or opens a menu.
  const solid = !isHome || scrolled || shopOpen || accountOpen;
  const tone = solid ? "text-ink" : "text-cream";
  const featured =
    categories.find((c) => c._id === activeCategory) || categories[0];

  return (
    <>
      <div
        className="fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-in-out"
        style={{
          transform:
            scrolled && !shopOpen
              ? "translateY(calc(-1 * var(--announce-h)))"
              : "none",
        }}
      >
        {/* Announcement bar */}
        <Link
          to="/shipping"
          className="flex h-[var(--announce-h)] items-center justify-center bg-periwinkle px-6 text-center text-[15px] text-ink transition-opacity duration-300 hover:opacity-90"
          style={{ opacity: scrolled && !shopOpen ? 0 : 1 }}
          tabIndex={scrolled ? -1 : 0}
        >
          <span className="truncate">{ANNOUNCEMENT}</span>
        </Link>

        {/* Main bar */}
        <header
          className={`relative h-[var(--bar-h)] border-b transition-[background-color,color,border-color] duration-200 ${
            solid
              ? "border-ink-line/90 bg-cream"
              : "border-transparent bg-transparent"
          } ${tone}`}
        >
          {!solid && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[140%] bg-gradient-to-b from-black/35 to-transparent"
            />
          )}
          <nav
            aria-label="Primary"
            className="container-x relative grid h-full grid-cols-[1fr_auto_1fr] items-center"
          >
            <ul className="flex items-center gap-5 lg:gap-6">
              <li>
                <button
                  ref={shopButtonRef}
                  type="button"
                  onClick={() => setShopOpen((v) => !v)}
                  aria-expanded={shopOpen}
                  aria-controls="shop-drawer"
                  className={`${navText} link-underline py-1`}
                >
                  Shop
                </button>
              </li>
              {[
                ["/about", "About"],
                ["/help-center", "Help"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to} className="hidden lg:block">
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `${navText} link-underline py-1 ${isActive ? "bg-[length:100%_1px]" : ""}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <Link
              to="/"
              aria-label="Notervo home"
              className="flex items-center justify-center"
            >
              <img
                src="/logo-dark.png"
                alt="Notervo"
                width="1080"
                height="300"
                className={`h-[34px] w-auto transition-[filter] duration-200 ${solid ? "" : "brightness-0 invert"}`}
              />
            </Link>

            <ul className="flex items-center justify-end gap-4 lg:gap-6">
              <li>
                <button
                  type="button"
                  onClick={openSearch}
                  className={`${navText} link-underline flex items-center gap-1.5 py-1`}
                >
                  <Search className="h-[18px] w-[18px]" />
                  Search
                </button>
              </li>
              <li className="relative" ref={accountRef}>
                {isLoggedIn ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setAccountOpen((v) => !v)}
                      aria-expanded={accountOpen}
                      aria-haspopup="menu"
                      className={`${navText} link-underline relative flex items-center gap-1 py-1`}
                    >
                      Account
                      {messagesCount > 0 && (
                        <span
                          className="absolute -right-2 top-0 h-1.5 w-1.5 rounded-full bg-ember"
                          aria-label={`${messagesCount} unread messages`}
                        />
                      )}
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      role="menu"
                      className={`absolute right-0 top-[calc(100%+18px)] w-56 border border-ink-line bg-cream text-ink transition-[opacity,transform] duration-200 ${
                        accountOpen
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0"
                      }`}
                    >
                      {[
                        ["/profile", "Profile & orders"],
                        ["/my-messages", "Messages", messagesCount],
                        ["/wishlist", "Wishlist", wishlistCount],
                      ].map(([to, label, n]) => (
                        <Link
                          key={to}
                          role="menuitem"
                          to={to}
                          tabIndex={accountOpen ? 0 : -1}
                          className="flex items-center justify-between border-b border-ink/10 px-4 py-3 text-[14px] hover:bg-cream-deep"
                        >
                          {label}
                          {n > 0 && (
                            <span className="text-[12px] text-muted">{n}</span>
                          )}
                        </Link>
                      ))}
                      <button
                        type="button"
                        role="menuitem"
                        tabIndex={accountOpen ? 0 : -1}
                        onClick={handleLogout}
                        className="block w-full px-4 py-3 text-left text-[14px] hover:bg-cream-deep"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className={`${navText} link-underline py-1`}
                  >
                    Log in
                  </Link>
                )}
              </li>
              <li>
                <Link
                  to="/wishlist"
                  className={`${navText} link-underline py-1`}
                >
                  Wishlist
                  <Count value={wishlistCount} />
                </Link>
              </li>
              <li>
                <Link to="/cart" className={`${navText} link-underline py-1`}>
                  Cart
                  <Count value={cartCount} />
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>

      {/* Shop drawer (Karst sidebar + category imagery) */}
      <div
        className={`fixed inset-0 top-[var(--header-h)] z-40 duration-200 ${
          shopOpen
            ? "visible opacity-100 transition-opacity"
            : "invisible opacity-0 transition-[opacity,visibility]"
        }`}
        aria-hidden={!shopOpen}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close shop menu"
          onClick={closeShop}
          className="absolute inset-0 h-full w-full cursor-default bg-ink/40"
        />

        {featured && (
          <div className="pointer-events-none absolute inset-y-0 left-[360px] right-0 hidden overflow-hidden lg:block">
            {categories.map((c) => (
              <SmartImage
                key={c._id}
                src={c.imageUrl}
                alt=""
                width={1600}
                sizes="70vw"
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                  featured._id === c._id ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent p-10">
              <p className="font-serif text-display font-light text-cream">
                {featured.title}
              </p>
              {featured.description && (
                <p className="mt-3 max-w-md text-[16px] leading-snug text-cream/85">
                  {featured.description}
                </p>
              )}
            </div>
          </div>
        )}

        <aside
          id="shop-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Shop categories"
          className={`absolute inset-y-0 left-0 flex w-[360px] flex-col border-r border-ink-line bg-cream transition-transform duration-[220ms] ease-out ${
            shopOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-8 pb-2 pt-6">
            <p className="eyebrow text-muted">Shop</p>
            <button
              type="button"
              onClick={closeShop}
              className="icon-btn h-9 w-9 rounded-full hover:bg-ink/5"
              aria-label="Close shop menu"
            >
              <Close className="h-5 w-5" />
            </button>
          </div>
          <nav
            aria-label="Categories"
            className="flex-1 overflow-y-auto px-8 pb-8"
          >
            <ul>
              <li>
                <Link
                  to="/shop"
                  className="group flex items-center justify-between py-3 text-[20px]"
                  onMouseEnter={() =>
                    setActiveCategory(categories[0]?._id || null)
                  }
                >
                  All notebooks
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c._id}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(c.categoryKey)}`}
                    onMouseEnter={() => setActiveCategory(c._id)}
                    onFocus={() => setActiveCategory(c._id)}
                    className={`group flex items-center justify-between py-3 text-[20px] transition-colors ${
                      activeCategory === c._id ? "text-ink" : "text-ink/80"
                    }`}
                  >
                    {c.title}
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/shop?discounted=true"
                  className="group flex items-center justify-between py-3 text-[20px] text-ink/80"
                >
                  On sale
                  <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            </ul>
          </nav>
          <button
            type="button"
            onClick={() => navigate("/shop")}
            className="group flex items-center justify-between bg-periwinkle px-8 py-7 text-left text-[20px]"
          >
            Browse the full collection
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </aside>
      </div>
    </>
  );
}
