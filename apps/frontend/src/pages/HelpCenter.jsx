// src/pages/HelpCenter.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Eyebrow, EmptyState } from "../components/ui/Primitives";
import Pill from "../components/ui/Pill";
import Reveal from "../components/ui/Reveal";
import {
  ArrowRight,
  ChevronRight,
  Close,
  Return,
  Search,
  Truck,
} from "../components/ui/Icons";
import { CardIcon, PersonIcon } from "./info/InfoKit";

/* ───────────── data ───────────── */
const helpTopics = [
  {
    icon: Truck,
    title: "Shipping & Delivery",
    description:
      "Delivery timelines, shipping costs, and tracking details for all Egyptian cities.",
    link: "/shipping",
    linkText: "View Shipping Info",
  },
  {
    icon: Return,
    title: "Returns & Exchanges",
    description:
      "Return eligibility within 14 days, process steps, and refund timing.",
    link: "/return-policy",
    linkText: "Read Return Policy",
  },
  {
    icon: CardIcon,
    title: "Payments",
    description:
      "Available payment methods, pricing, and order total breakdowns.",
    link: "/contact",
    linkText: "Contact Us",
  },
  {
    icon: PersonIcon,
    title: "Account & Orders",
    description:
      "Manage your profile, wishlist, order history, and saved addresses.",
    link: "/profile",
    linkText: "Go to Profile",
  },
];

const quickFaqs = [
  {
    q: "How long does delivery take?",
    a: "1–4 business days depending on your location within Egypt.",
  },
  {
    q: "Can I return a notebook?",
    a: "Yes — unused items can be returned within 14 days of delivery.",
  },
  {
    q: "How do I track my order?",
    a: "Enter your order ID on our shipping page or check your profile's order history.",
  },
];

/* ───────────── component ───────────── */
const HelpCenter = () => {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? helpTopics.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      )
    : helpTopics;

  return (
    <div className="text-ink">
      <PageHeader
        eyebrow="Help Center"
        title="How can we help you?"
        description="Find answers about notebooks, orders, shipping, and account support."
        actions={
          <div role="search" className="w-full md:w-[380px]">
            <label htmlFor="help-search" className="sr-only">
              Search help topics
            </label>
            <div className="flex h-12 items-center gap-3 rounded-full border border-ink/25 bg-white/70 px-4 focus-within:border-ink md:h-14 md:border-ink md:bg-transparent md:px-5">
              <Search className="h-5 w-5 shrink-0" />
              <input
                id="help-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search help topics..."
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-muted focus:outline-none"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="icon-btn h-8 w-8 rounded-full hover:bg-ink/5"
                >
                  <Close className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        }
        className="[&>div>div:last-child]:w-full md:[&>div>div:last-child]:w-auto"
      />

      {/* ═══════════════ TOPICS GRID ═══════════════ */}
      <section aria-label="Help topics">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title={`No topics match "${search}"`}
            description="Try a different keyword or browse all help topics."
            actionLabel="Clear search"
            onAction={() => setSearch("")}
          />
        ) : (
          <ul className="mx-4 overflow-hidden rounded-2xl border border-ink/10 bg-white/60 md:mx-0 md:grid md:grid-cols-2 md:rounded-none md:border-0 md:border-b md:border-ink-line md:bg-transparent lg:grid-cols-4">
            {filtered.map(
              ({ icon: Ico, title, description, link, linkText }, i) => (
                <Reveal
                  as="li"
                  key={title}
                  delay={i * 70}
                  className="border-b border-ink/10 last:border-b-0 md:border-b-0 md:border-r md:border-ink-line md:last:border-r-0 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0 md:[&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0"
                >
                  <Link
                    to={link}
                    className="group flex h-full items-center gap-4 p-4 md:flex-col md:items-start md:gap-0 md:p-8 lg:min-h-[340px]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 md:h-14 md:w-14 md:border-ink">
                      <Ico className="h-5 w-5 md:h-6 md:w-6" />
                    </span>
                    <div className="min-w-0 flex-1 md:mt-10 md:flex md:flex-1 md:flex-col">
                      <h2 className="font-sans text-[16px] md:font-serif md:text-[30px] md:font-light md:leading-[1.05]">
                        {title}
                      </h2>
                      <p className="mt-1 text-[13px] leading-snug text-muted md:mt-4 md:text-[15px]">
                        {description}
                      </p>
                      <span className="mt-6 hidden items-center gap-2 text-[13px] uppercase md:mt-auto md:inline-flex md:pt-6">
                        <span className="link-underline group-hover:bg-[length:100%_1px]">
                          {linkText}
                        </span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-ink/40 md:hidden" />
                  </Link>
                </Reveal>
              )
            )}
          </ul>
        )}
      </section>

      {/* ═══════════════ QUICK FAQ ═══════════════ */}
      <section
        aria-labelledby="quick-answers-title"
        className="mt-10 grid md:mt-0 md:grid-cols-[minmax(320px,38%)_1fr] md:border-b md:border-ink-line lg:grid-cols-[minmax(380px,29%)_1fr]"
      >
        <Reveal className="px-4 pb-3 md:border-r md:border-ink-line md:px-[var(--gutter)] md:py-16">
          <Eyebrow className="mb-2 text-muted md:mb-4">Quick Answers</Eyebrow>
          <h2
            id="quick-answers-title"
            className="font-serif text-[24px] font-light leading-none md:text-display"
          >
            Common Questions
          </h2>
        </Reveal>
        <dl className="mx-4 overflow-hidden rounded-2xl border border-ink/10 bg-white/60 md:mx-0 md:rounded-none md:border-0 md:bg-transparent md:px-[var(--gutter)] md:py-10 lg:px-20">
          {quickFaqs.map(({ q, a }, i) => (
            <Reveal
              key={q}
              delay={i * 70}
              className="border-b border-ink/10 p-4 last:border-b-0 md:border-ink-line md:px-0 md:py-7"
            >
              <dt className="text-[15px] font-medium md:font-serif md:text-[24px] md:font-light md:leading-tight">
                {q}
              </dt>
              <dd className="mt-1.5 text-[14px] leading-snug text-muted md:mt-3 md:text-[16px]">
                {a}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section
        aria-labelledby="still-need-help"
        className="px-4 py-8 md:px-0 md:py-0"
      >
        <Reveal className="flex flex-col items-start gap-6 rounded-[28px] bg-ink p-6 text-cream md:flex-row md:items-end md:justify-between md:rounded-none md:bg-cream-deep md:px-[var(--gutter)] md:py-20 md:text-ink">
          <div className="max-w-xl">
            <h2
              id="still-need-help"
              className="font-serif text-[26px] font-light leading-none md:text-display-lg"
            >
              Still need help?
            </h2>
            <p className="mt-3 text-[14px] leading-snug text-cream/75 md:mt-5 md:text-[17px] md:text-ink/80">
              Our support team is ready to help with any questions about your
              notebooks or orders.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-cream px-5 text-[13px] uppercase text-ink md:hidden"
          >
            Contact Support <ArrowRight className="h-4 w-4" />
          </Link>
          <Pill to="/contact" size="lg" arrow className="hidden md:inline-flex">
            Contact Support
          </Pill>
        </Reveal>
      </section>
    </div>
  );
};

export default HelpCenter;
