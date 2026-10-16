// src/pages/ShippingInfo.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader, Eyebrow } from "../components/ui/Primitives";
import Pill from "../components/ui/Pill";
import Reveal from "../components/ui/Reveal";
import SmartImage from "../components/ui/SmartImage";
import {
  ArrowRight,
  Check,
  Clock,
  Search,
  Truck,
} from "../components/ui/Icons";
import {
  AccordionItem,
  PinIcon,
  ShieldIcon,
  useCategoryImages,
} from "./info/InfoKit";

/* ───────────── data ───────────── */
const deliveryZones = [
  {
    city: "Cairo & Giza",
    time: "1–2 Days",
    details: "Orders before 3 PM ship same day when stock is available.",
    highlight: true,
  },
  {
    city: "Major Cities",
    time: "2–4 Days",
    details:
      "Alexandria, Mansoura, Tanta, and nearby cities via trusted partners.",
    highlight: false,
  },
  {
    city: "Nationwide",
    time: "3–6 Days",
    details: "Remote destinations may require additional transit time.",
    highlight: false,
  },
];

const shippingRates = [
  { location: "Cairo & Giza", cost: "Free", highlight: true },
  { location: "Alexandria & Major Cities", cost: "EGP 49", highlight: false },
  { location: "Nationwide (Other)", cost: "EGP 79", highlight: false },
];

const returnPoints = [
  "Items should be unused and in original packaging.",
  "Refunds are processed within 3–5 business days after inspection.",
  "Contact support@notervo.com to start a return request.",
];

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Most orders arrive within 1–4 business days depending on your city.",
  },
  {
    q: "Do you ship internationally?",
    a: "At the moment, shipping is available within Egypt only.",
  },
  {
    q: "Can I change my address after placing an order?",
    a: "Yes, if the order has not shipped yet. Contact support@notervo.com immediately.",
  },
  {
    q: "What if I miss delivery?",
    a: "The courier will call to arrange a second delivery attempt.",
  },
];

/* Left editorial column used by the Karst-style split sections. */
const SectionIntro = ({ eyebrow, title, id, children, className = "" }) => (
  <Reveal
    className={`px-4 pb-4 md:border-r md:border-ink-line md:px-[var(--gutter)] md:py-16 ${className}`}
  >
    <Eyebrow className="mb-2 text-muted md:mb-4">{eyebrow}</Eyebrow>
    <h2
      id={id}
      className="font-serif text-[26px] font-light leading-none tracking-tight md:text-display"
    >
      {title}
    </h2>
    {children}
  </Reveal>
);

const splitGrid =
  "grid md:grid-cols-[minmax(320px,38%)_1fr] md:border-b md:border-ink-line lg:grid-cols-[minmax(380px,29%)_1fr]";

/* ───────────── main component ───────────── */
const ShippingInfo = () => {
  const [orderId, setOrderId] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();
  const images = useCategoryImages();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    navigate(`/order-confirmation/${orderId.trim()}`);
  };

  return (
    <div className="text-ink">
      {/* ═══════════════ HERO ═══════════════ */}
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Truck className="h-3.5 w-3.5" /> Shipping
          </span>
        }
        title="Shipping & Delivery"
        description="We ship Notervo notebooks with careful packaging and predictable timelines across Egypt."
        actions={
          <Pill to="/shop" size="lg" arrow className="w-full sm:w-auto">
            Start Shopping
          </Pill>
        }
        className="[&>div>div:last-child]:w-full sm:[&>div>div:last-child]:w-auto"
      />

      {/* ═══════════════ DELIVERY ZONES ═══════════════ */}
      <section aria-labelledby="timelines-title" className={splitGrid}>
        <SectionIntro
          eyebrow="Timelines"
          title="Delivery Information"
          id="timelines-title"
        />
        <ul className="mx-4 overflow-hidden rounded-2xl border border-ink/10 bg-white/60 md:mx-0 md:grid md:grid-cols-3 md:rounded-none md:border-0 md:bg-transparent">
          {deliveryZones.map(({ city, time, details, highlight }, i) => (
            <Reveal
              as="li"
              key={city}
              delay={i * 80}
              className="flex flex-col border-b border-ink/10 p-4 last:border-b-0 md:border-b-0 md:border-r md:border-ink-line md:px-8 md:py-16 md:last:border-r-0"
            >
              <div className="hidden items-center justify-between gap-3 md:flex">
                <span className="font-serif text-[15px] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {highlight && (
                  <span className="badge bg-ink text-cream">Fastest</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 md:block">
                <h3 className="flex items-center gap-2 font-sans text-[16px] font-medium md:mt-12 md:font-serif md:text-[30px] md:font-light md:leading-tight">
                  {city}
                  {highlight && (
                    <span className="badge bg-ink text-cream md:hidden">
                      Fastest
                    </span>
                  )}
                </h3>
                <p className="flex shrink-0 items-center gap-1.5 text-[14px] md:mt-4 md:gap-2 md:text-[18px]">
                  <Clock className="h-4 w-4" />
                  {time}
                </p>
              </div>
              <p className="mt-1.5 text-[13px] leading-snug text-muted md:mt-4 md:text-[15px]">
                {details}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ═══════════════ SHIPPING RATES ═══════════════ */}
      <section
        aria-labelledby="rates-title"
        className={`mt-10 md:mt-0 ${splitGrid}`}
      >
        <SectionIntro eyebrow="Pricing" title="Shipping Rates" id="rates-title">
          <p className="mt-3 text-[14px] text-muted md:mt-6 md:text-[16px] md:text-ink/80">
            Clear pricing for every location.
          </p>
        </SectionIntro>

        <Reveal className="px-4 md:px-[var(--gutter)] md:py-16 lg:px-20">
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white/60 md:rounded-none md:border-0 md:bg-transparent">
            <div className="grid grid-cols-2 gap-4 border-b border-ink/10 px-4 py-3 md:border-ink-line md:px-0">
              <span className="text-[12px] uppercase tracking-[0.02em] text-muted">
                Location
              </span>
              <span className="text-right text-[12px] uppercase tracking-[0.02em] text-muted">
                Cost
              </span>
            </div>
            {shippingRates.map(({ location, cost, highlight }) => (
              <div
                key={location}
                className="grid grid-cols-2 items-center gap-4 border-b border-ink/10 px-4 py-4 last:border-b-0 md:border-ink-line md:px-0 md:py-6 md:last:border-b"
              >
                <span className="text-[15px] md:font-serif md:text-[24px] md:font-light">
                  {location}
                </span>
                <span className="inline-flex items-center justify-end gap-1.5 text-right text-[15px] font-medium md:text-[18px] md:font-normal">
                  {highlight && <Check className="h-4 w-4" />}
                  {cost}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-periwinkle px-4 py-2 text-[13px] md:mt-8">
            <Truck className="h-4 w-4" />
            Free shipping on orders over EGP 999
          </p>
        </Reveal>
      </section>

      {/* ═══════════════ RETURNS (two-up) ═══════════════ */}
      <section
        aria-labelledby="returns-title"
        className="mt-10 grid md:mt-0 md:grid-cols-2 md:border-b md:border-ink-line"
      >
        <Reveal className="flex flex-col px-4 md:px-[var(--gutter)] md:py-16 lg:px-20 lg:py-20">
          <Eyebrow className="mb-2 text-muted md:mb-5">Returns</Eyebrow>
          <h2
            id="returns-title"
            className="font-serif text-[26px] font-light leading-none tracking-tight md:text-display"
          >
            Returns & Exchanges
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/80 md:mt-6 md:text-[17px]">
            You can request a return within{" "}
            <strong className="font-medium text-ink">14 days</strong> of
            delivery for eligible notebook items.
          </p>

          <ul className="mt-5 border-t border-ink/15 md:mt-8 md:border-ink-line">
            {returnPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 border-b border-ink/15 py-3.5 text-[14px] leading-snug md:border-ink-line md:py-4 md:text-[15px]"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0" />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-6 md:mt-10">
            <Pill
              to="/contact"
              variant="outline"
              size="lg"
              arrow
              className="w-full sm:w-auto"
            >
              Request Return
            </Pill>
          </div>
        </Reveal>

        <div className="relative order-first mx-4 mb-6 aspect-[4/3] overflow-hidden rounded-2xl bg-cream-dim md:order-none md:mx-0 md:mb-0 md:aspect-auto md:min-h-[600px] md:rounded-none md:border-l md:border-ink-line">
          <SmartImage
            src={images[2] || images[0]}
            alt="Notebook packaging"
            width={1400}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute bottom-4 right-4 bg-cream px-4 py-3 text-right md:bottom-8 md:right-8 md:px-5 md:py-4">
            <p className="font-serif text-[26px] font-light leading-none md:text-[34px]">
              14
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.02em] text-muted">
              Days to return
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════ TRACK ORDER ═══════════════ */}
      <section
        aria-labelledby="track-title"
        className="mx-4 mt-10 rounded-2xl bg-cream-deep p-5 md:mx-0 md:mt-0 md:rounded-none md:border-b md:border-ink-line md:px-[var(--gutter)] md:py-20"
      >
        <Reveal className="md:mx-auto md:max-w-2xl md:text-center">
          <Eyebrow className="mb-2 text-muted md:mb-4">Tracking</Eyebrow>
          <h2
            id="track-title"
            className="font-serif text-[26px] font-light leading-none tracking-tight md:text-display"
          >
            Track Your Order
          </h2>
          <p className="mt-3 text-[14px] text-muted md:mt-5 md:text-[16px]">
            Enter your order ID to check status, or visit{" "}
            <Link
              to="/profile"
              className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              My Orders
            </Link>
            .
          </p>

          <form
            onSubmit={handleTrack}
            className="mt-5 flex flex-col gap-3 sm:flex-row md:mx-auto md:mt-10 md:max-w-lg"
          >
            <label htmlFor="track-order-id" className="sr-only">
              Order ID
            </label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="track-order-id"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter order ID"
                className="field pl-11"
              />
            </div>
            <button
              type="submit"
              disabled={!orderId.trim()}
              className="btn btn-solid btn-md shrink-0"
            >
              <span>Track</span>
            </button>
          </form>
        </Reveal>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section
        aria-labelledby="faq-title"
        className={`mt-10 md:mt-0 ${splitGrid}`}
      >
        <SectionIntro
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          id="faq-title"
        />
        <div className="mx-4 rounded-2xl border border-ink/10 bg-white/60 px-4 md:mx-0 md:rounded-none md:border-0 md:bg-transparent md:px-[var(--gutter)] md:py-12 lg:px-20">
          {faqs.map(({ q, a }, i) => (
            <AccordionItem
              key={q}
              question={q}
              answer={a}
              open={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section
        aria-labelledby="cta-title"
        className="px-4 py-8 md:px-0 md:py-0"
      >
        <Reveal className="rounded-[28px] bg-ink p-6 text-cream md:rounded-none md:px-[var(--gutter)] md:py-20 lg:py-24">
          <div className="lg:flex lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <h2
                id="cta-title"
                className="font-serif text-[26px] font-light leading-[1.02] md:text-display-lg"
              >
                Ready to Order Your Next Notebook?
              </h2>
              <p className="mt-3 text-[14px] leading-snug text-cream/75 md:mt-5 md:text-[17px]">
                Fast delivery, clear return policy, and consistent notebook
                quality.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8 lg:mt-0 lg:shrink-0">
              <Link to="/shop" className="btn btn-cream btn-lg">
                <span>Browse Notebooks</span>
                <ArrowRight className="btn-icon h-[18px] w-[18px]" />
              </Link>
              <Pill to="/contact" variant="light" size="lg">
                Contact Support
              </Pill>
            </div>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-cream/15 pt-6 md:mt-14">
            {[
              { icon: Truck, text: "Fast delivery" },
              { icon: ShieldIcon, text: "Secure packaging" },
              { icon: PinIcon, text: "Egypt-wide" },
            ].map(({ icon: Ico, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 text-[12px] uppercase tracking-[0.02em] text-cream/70"
              >
                <Ico className="h-4 w-4" />
                {text}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </div>
  );
};

export default ShippingInfo;
