// src/components/Header.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import Cookies from "js-cookie";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { showSuccess } from "../utils/Toast";
import { getGuestCartCount } from "../utils/guestCart";

/* ───────────── inline icons (no heroicons dependency) ───────────── */
const CartIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 6H6"
    />
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="17" cy="20" r="1.5" />
  </svg>
);
const HeartIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);
const BellIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
  </svg>
);
const UserIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);
const ChevronDownIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);
const LogoutIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
  </svg>
);

/* ───────────── icon button ───────────── */
const IconButton = ({ to, label, icon: Ico, count, dot }) => (
  <Link
    to={to}
    className="relative p-2 rounded-xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all duration-200"
    aria-label={label}
  >
    <Ico className="w-[22px] h-[22px]" />
    {count > 0 && (
      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-primary px-1 text-[10px] font-bold text-white flex items-center justify-center shadow-sm">
        {count > 99 ? "99+" : count}
      </span>
    )}
    {dot && (
      <span className="absolute top-0.5 right-0.5 flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
      </span>
    )}
  </Link>
);

/* ───────────── main header ───────────── */
export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const token = Cookies.get("token");

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  // Scroll detection for header style change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const fetchCounts = useCallback(async () => {
    if (!token) {
      setCartCount(getGuestCartCount());
      setWishlistCount(0);
      setMessagesCount(0);
      return;
    }

    try {
      const [cartRes, wishlistRes, myMessagesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/message-to-user/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setCartCount(cartRes.data.cart?.items?.length || 0);
      setWishlistCount(wishlistRes.data.wishlist?.items?.length || 0);
      setMessagesCount(myMessagesRes.data.messages?.filter((msg) => !msg.isRead).length || 0);
    } catch {
      setCartCount(getGuestCartCount());
      setWishlistCount(0);
      setMessagesCount(0);
    }
  }, [token]);

  useEffect(() => {
    fetchCounts();
  }, [isLoggedIn, fetchCounts]);

  useEffect(() => {
    const handleUpdate = () => fetchCounts();
    window.addEventListener("cartUpdated", handleUpdate);
    window.addEventListener("wishlistUpdated", handleUpdate);
    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
      window.removeEventListener("wishlistUpdated", handleUpdate);
    };
  }, [isLoggedIn, fetchCounts]);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout from Notervo?",
      text: "Your active session will end on this device.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#222222",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        Cookies.remove("token");
        setIsLoggedIn(false);
        setMobileMenuOpen(false);
        setCartCount(0);
        setWishlistCount(0);
        showSuccess("Logged out successfully.");
        window.location.reload();
      }
    });
  };

  // Outside click for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`
                fixed w-full top-0 left-0 z-50 transition-all duration-300
                ${scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-white/95 backdrop-blur-sm border-b border-secondary"
        }
            `}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-[67px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0" aria-label="Go to Notervo home">
          <img src="/logo-dark.png" alt="Notervo" className="h-7 w-auto" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1.5">
          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <IconButton to="/cart" label="Cart" icon={CartIcon} count={cartCount} />
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors rounded-xl hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm font-semibold bg-primary text-white rounded-xl hover:bg-black transition-colors"
              >
                Register
              </Link>
            </div>
          ) : (
            <>
              <IconButton to="/my-messages" label="Messages" icon={BellIcon} dot={messagesCount > 0} />
              <IconButton to="/wishlist" label="Wishlist" icon={HeartIcon} count={wishlistCount} />
              <IconButton to="/cart" label="Cart" icon={CartIcon} count={cartCount} />

              <div className="w-px h-6 bg-gray-200 mx-2" />

              {/* Account dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`
                                        flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                                        ${dropdownOpen
                      ? "bg-primary/5 text-primary"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    }
                                    `}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <UserIcon className="w-[18px] h-[18px]" />
                  <span>Account</span>
                  <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown menu */}
                <div
                  className={`
                                        absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-gray-100 shadow-xl overflow-hidden
                                        transition-all duration-200 origin-top-right
                                        ${dropdownOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                    }
                                    `}
                >
                  <div className="p-1.5">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      type="button"
                      className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogoutIcon className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 w-5 bg-current rounded transition-all duration-300 origin-center ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current rounded transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current rounded transition-all duration-300 origin-center ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 top-[67px] bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-40 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`
                    md:hidden fixed top-[67px] right-0 h-[calc(100vh-67px)] w-72 bg-white border-l border-gray-100 shadow-2xl z-50
                    transition-transform duration-300 ease-out
                    ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
                `}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/cart"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CartIcon className="w-5 h-5 text-gray-400" />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto min-w-[20px] h-5 rounded-full bg-primary px-1.5 text-[10px] font-bold text-white flex items-center justify-center">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-black transition-colors mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <MobileMenuItem to="/profile" icon={UserIcon} label="Profile" onClick={() => setMobileMenuOpen(false)} />
                <MobileMenuItem to="/my-messages" icon={BellIcon} label="Messages" count={messagesCount} dot onClick={() => setMobileMenuOpen(false)} />
                <MobileMenuItem to="/wishlist" icon={HeartIcon} label="Wishlist" count={wishlistCount} onClick={() => setMobileMenuOpen(false)} />
                <MobileMenuItem to="/cart" icon={CartIcon} label="Cart" count={cartCount} onClick={() => setMobileMenuOpen(false)} />

                <div className="border-t border-gray-100 my-3" />

                <button
                  type="button"
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  onClick={handleLogout}
                >
                  <LogoutIcon className="w-5 h-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ───────────── mobile menu item ───────────── */
function MobileMenuItem({ to, icon: Ico, label, count, dot, onClick }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Ico className="w-5 h-5 text-gray-400" />
        {label}
      </div>
      {count > 0 && (
        <span className={`min-w-[20px] h-5 rounded-full ${dot ? "bg-red-500" : "bg-primary"} px-1.5 text-[10px] font-bold text-white flex items-center justify-center`}>
          {count}
        </span>
      )}
    </Link>
  );
}
