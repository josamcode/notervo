import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { showError, showSuccess } from "../utils/Toast";
import { fetchNotebookCategories } from "../utils/catalog";
import { ArrowRight, Check, Spinner } from "./ui/Icons";

const FacebookIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 1.092.07 1.594.134v3.23c-.479-.05-.986-.074-1.41-.074-2 0-2.774.758-2.774 2.728v1.54h4.007l-.687 3.667h-3.32v8.15C19.396 22.905 24 18.028 24 12.09 24 5.548 18.627.18 12.09.18S.18 5.548.18 12.09c0 5.41 3.952 9.918 9.12 10.768l-.198.833Z" />
  </svg>
);
const InstagramIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
  </svg>
);
const TikTokIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M21 8.5c-1.9 0-3.6-.7-4.9-1.9v9.1c0 4.1-3.3 7.3-7.3 7.3S1.5 19.8 1.5 15.7c0-4.1 3.3-7.3 7.3-7.3.4 0 .8 0 1.2.1v3.8c-.4-.1-.8-.2-1.2-.2-2 0-3.6 1.6-3.6 3.6S6.8 19 8.8 19s3.6-1.6 3.6-3.6V1h3.7c.2 1.6 1 3.1 2.3 4.1 1.2 1 2.8 1.6 4.5 1.6v1.8Z" />
  </svg>
);

const SOCIALS = [
  ["https://facebook.com/notervo.eg", FacebookIcon, "Facebook"],
  ["https://instagram.com/notervo.eg", InstagramIcon, "Instagram"],
  ["https://www.tiktok.com/@notervo.eg", TikTokIcon, "TikTok"],
];

const Column = ({ title, links }) => (
  <div>
    <h2 className="mb-5 font-sans text-[20px] font-normal">{title}</h2>
    <ul className="space-y-2.5">
      {links.map(([to, label]) => (
        <li key={to + label}>
          <Link
            to={to}
            className="link-underline text-[15px] text-ink/85 hover:text-ink"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchNotebookCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/subscribers`,
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

  const shopLinks = [
    ["/shop", "All notebooks"],
    ...categories
      .slice(0, 4)
      .map((c) => [
        `/shop?category=${encodeURIComponent(c.categoryKey)}`,
        c.title,
      ]),
    ["/shop?discounted=true", "On sale"],
  ];

  return (
    <footer className="overflow-hidden border-t border-ink-line bg-cream-deep text-ink">
      <div className="container-x grid gap-12 pb-16 pt-14 lg:grid-cols-12 lg:gap-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
          <Column title="Shop" links={shopLinks} />
          <Column
            title="About"
            links={[
              ["/about", "Our story"],
              ["/contact", "Contact us"],
              ["/help-center", "Help center"],
            ]}
          />
          <Column
            title="Support"
            links={[
              ["/shipping", "Shipping & delivery"],
              ["/return-policy", "Returns"],
              ["/privacy-policy", "Privacy policy"],
              ["/terms-of-service", "Terms of service"],
            ]}
          />
        </div>

        <div className="lg:col-span-5 lg:pl-8">
          <h2 className="max-w-sm font-sans text-[22px] font-normal leading-tight">
            Join the Notervo community for launches and limited editions.
          </h2>
          <form onSubmit={handleSubscribe} className="mt-6 max-w-md">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <div className="flex items-center border-b border-ink/40 focus-within:border-ink">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email here"
                autoComplete="email"
                required
                className="h-11 min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-muted focus:outline-none"
              />
              <button
                type="submit"
                disabled={subscribing}
                aria-label="Subscribe"
                className="icon-btn h-11 w-11 text-ink transition-transform hover:translate-x-1 disabled:opacity-50"
              >
                {subscribing ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </button>
            </div>
            {subscribed && (
              <p className="mt-3 flex items-center gap-1.5 text-[13px] text-ink">
                <Check className="h-4 w-4" /> You're subscribed. Check your
                inbox.
              </p>
            )}
          </form>
          <ul className="mt-6 flex gap-2.5">
            {SOCIALS.map(([href, Icon, label]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-x flex flex-col gap-2 pb-6 text-[13px] text-ink/70 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Notervo. All rights reserved.</p>
        <p>Cash on delivery · Shipping within Egypt</p>
      </div>

      <div className="border-t border-ink-line">
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 158"
          className="block w-full select-none px-[1.2vw] pb-[1vw] pt-[1.4vw] text-ink"
        >
          <text
            x="0"
            y="150"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="currentColor"
            className="font-serif font-light"
            style={{ fontSize: "196px", letterSpacing: "-0.02em" }}
          >
            NOTERVO
          </text>
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
