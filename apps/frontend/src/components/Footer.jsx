// src/components/Footer.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "../utils/Toast";
import axios from "axios";
import Cookies from "js-cookie";

/* ───────────── social icons (inline, no react-icons dep) ───────────── */
const FacebookIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.07 1.594.134v3.23c-.479-.05-.986-.074-1.41-.074-2 0-2.774.758-2.774 2.728v1.54h4.007l-.687 3.667h-3.32v8.15C19.396 22.905 24 18.028 24 12.09 24 5.548 18.627.18 12.09.18S.18 5.548.18 12.09c0 5.41 3.952 9.918 9.12 10.768l-.198.833Z" />
  </svg>
);
const InstagramIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
  </svg>
);
const TikTokIcon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21 8.5c-1.9 0-3.6-.7-4.9-1.9v9.1c0 4.1-3.3 7.3-7.3 7.3S1.5 19.8 1.5 15.7c0-4.1 3.3-7.3 7.3-7.3.4 0 .8 0 1.2.1v3.8c-.4-.1-.8-.2-1.2-.2-2 0-3.6 1.6-3.6 3.6S6.8 19 8.8 19s3.6-1.6 3.6-3.6V1h3.7c.2 1.6 1 3.1 2.3 4.1 1.2 1 2.8 1.6 4.5 1.6v1.8Z" />
  </svg>
);

/* ───────────── social link component ───────────── */
const SocialLink = ({ href, icon: Ico, label }) => (
  <a
    href={href}
    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Ico className="w-4 h-4" />
  </a>
);

/* ───────────── footer link ───────────── */
const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-sm text-gray-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group">
      <span className="w-0 group-hover:w-2 h-px bg-secondary transition-all duration-200" />
      {children}
    </Link>
  </li>
);

/* ───────────── main footer ───────────── */
const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/subscribers`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("Subscribed successfully.");
      setEmail("");
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err) {
      showError(err?.response?.data?.message || "Something went wrong.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-primary text-gray-300 relative overflow-hidden">
      {/* Subtle decorative circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.02] rounded-full -translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            {/* Brand column */}
            <div className="lg:col-span-4">
              <img src="/logo.png" alt="Notervo" className="h-7 w-auto mb-5" />
              <p className="text-sm leading-relaxed text-gray-400 max-w-xs mb-6">
                Minimal notebooks for focused work, clear thinking, and premium everyday writing.
              </p>
              <div className="flex gap-2">
                <SocialLink href="https://facebook.com/notervo" icon={FacebookIcon} label="Facebook" />
                <SocialLink href="https://instagram.com/notervo.eg" icon={InstagramIcon} label="Instagram" />
                <SocialLink href="https://www.tiktok.com/@notervo.eg" icon={TikTokIcon} label="Tiktok" />
              </div>
            </div>

            {/* Company links */}
            <div className="lg:col-span-2">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2.5">
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/contact">Contact Us</FooterLink>
                <FooterLink to="/shop">Shop</FooterLink>
              </ul>
            </div>

            {/* Support links */}
            <div className="lg:col-span-2">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-2.5">
                <FooterLink to="/help-center">Help Center</FooterLink>
                <FooterLink to="/shipping">Shipping Info</FooterLink>
                <FooterLink to="/return-policy">Return Policy</FooterLink>
                <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
                <FooterLink to="/terms-of-service">Terms of Service</FooterLink>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Stay Updated</h3>
              <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                Get notebook launches, limited editions, and practical writing tips.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 min-w-0 px-4 py-2.5 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={subscribing}
                    className="px-5 py-2.5 rounded-xl bg-white text-primary text-sm font-semibold hover:bg-secondary transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
                  >
                    {subscribing ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : "Subscribe"}
                  </button>
                </div>
                {subscribed && (
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    You're subscribed! Check your inbox.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Notervo. All rights reserved.
            </p>
            <p className="text-[11px] text-gray-600">
              Built for clean, confident notebook shopping.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;