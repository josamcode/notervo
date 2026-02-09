// src/pages/ShippingInfo.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ───────────── icons ───────────── */
const Icon = ({ children, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    {children}
  </svg>
);
const TruckIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.079-.504 1.036-1.124a20.916 20.916 0 0 0-1.395-5.88 2.12 2.12 0 0 0-1.81-1.246h-3.362a2.1 2.1 0 0 1-1.27-.432l-.727-.545a2.1 2.1 0 0 0-1.27-.432H9.12a2.1 2.1 0 0 0-1.478.604L6.3 11.25H4.875c-.621 0-1.125.504-1.125 1.125v3.75" />
  </Icon>
);
const MapPinIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </Icon>
);
const ClockIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </Icon>
);
const ArrowRightIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </Icon>
);
const CheckIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </Icon>
);
const ShieldCheckIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
  </Icon>
);
const MagnifyingGlassIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </Icon>
);
const ChevronDownIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </Icon>
);

/* ───────────── data ───────────── */
const deliveryZones = [
  {
    city: "Cairo & Giza",
    time: "1–2 Days",
    details: "Orders before 3 PM ship same day when stock is available.",
    icon: "🏙️",
    highlight: true,
  },
  {
    city: "Major Cities",
    time: "2–4 Days",
    details: "Alexandria, Mansoura, Tanta, and nearby cities via trusted partners.",
    icon: "🏢",
    highlight: false,
  },
  {
    city: "Nationwide",
    time: "3–6 Days",
    details: "Remote destinations may require additional transit time.",
    icon: "🗺️",
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
  { q: "How long does delivery take?", a: "Most orders arrive within 1–4 business days depending on your city." },
  { q: "Do you ship internationally?", a: "At the moment, shipping is available within Egypt only." },
  { q: "Can I change my address after placing an order?", a: "Yes, if the order has not shipped yet. Contact support@notervo.com immediately." },
  { q: "What if I miss delivery?", a: "The courier will call to arrange a second delivery attempt." },
];

/* ───────────── FAQ accordion item ───────────── */
const FaqItem = ({ q, a, open, toggle }) => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 hover:border-gray-200">
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between p-5 text-left"
    >
      <span className="text-sm font-bold text-gray-900 pr-4">{q}</span>
      <span className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-200 ${open ? "bg-primary rotate-180" : "bg-gray-100"}`}>
        <ChevronDownIcon className={`w-3.5 h-3.5 ${open ? "text-white" : "text-gray-500"}`} />
      </span>
    </button>
    <div
      className="overflow-hidden transition-all duration-300"
      style={{ maxHeight: open ? "200px" : "0" }}
    >
      <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{a}</p>
    </div>
  </div>
);

/* ───────────── main component ───────────── */
const ShippingInfo = () => {
  const [orderId, setOrderId] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    navigate(`/order-confirmation/${orderId.trim()}`);
  };

  return (
    <main className="text-gray-900">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden bg-surface py-20 sm:py-24 px-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/[0.02] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
            <TruckIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Shipping</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-4">
            Shipping & Delivery
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            We ship Notervo notebooks with careful packaging and predictable timelines across Egypt.
          </p>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 px-7 py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-black transition-colors shadow-lg shadow-primary/15"
          >
            Start Shopping
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ═══════════════ DELIVERY ZONES ═══════════════ */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-primary" />
              Timelines
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Delivery Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deliveryZones.map(({ city, time, details, icon, highlight }) => (
              <div
                key={city}
                className={`group bg-white rounded-2xl border shadow-sm hover:shadow-lg p-6 text-center transition-all duration-300 ${highlight ? "border-primary/20 ring-1 ring-primary/5" : "border-gray-100 hover:border-gray-200"
                  }`}
              >
                {highlight && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider mb-3">
                    Fastest
                  </span>
                )}
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-1">{city}</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/5 mb-3">
                  <ClockIcon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-sm font-bold text-primary">{time}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SHIPPING RATES ═══════════════ */}
      <section className="py-16 sm:py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-primary" />
              Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Shipping Rates
            </h2>
            <p className="text-gray-500 text-sm mt-2">Clear pricing for every location.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-2 gap-4 px-6 py-3.5 bg-gray-50/80 border-b border-gray-100">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Location</span>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Cost</span>
            </div>

            {/* Rows */}
            {shippingRates.map(({ location, cost, highlight }, i) => (
              <div
                key={location}
                className={`grid grid-cols-2 gap-4 px-6 py-4 items-center ${i < shippingRates.length - 1 ? "border-b border-gray-50" : ""}`}
              >
                <span className="text-sm text-gray-900 font-medium">{location}</span>
                <span className={`text-sm font-bold text-right ${highlight ? "text-green-600" : "text-gray-900"}`}>
                  {highlight && (
                    <span className="inline-flex items-center gap-1">
                      <CheckIcon className="w-3.5 h-3.5" />
                    </span>
                  )}{" "}
                  {cost}
                </span>
              </div>
            ))}
          </div>

          <p className="text-center mt-5 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 border border-green-100 text-green-700 font-semibold text-xs">
              <TruckIcon className="w-3.5 h-3.5" />
              Free shipping on orders over EGP 999
            </span>
          </p>
        </div>
      </section>

      {/* ═══════════════ RETURNS ═══════════════ */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-primary" />
              Returns
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
              Returns & Exchanges
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              You can request a return within <strong className="text-gray-900">14 days</strong> of delivery for eligible notebook items.
            </p>

            <div className="space-y-3 mb-8">
              {returnPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-md bg-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-3 h-3 text-primary" />
                  </span>
                  <span className="text-sm text-gray-600 leading-relaxed">{point}</span>
                </div>
              ))}
            </div>

            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-black transition-colors shadow-lg shadow-primary/15"
            >
              Request Return
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50">
              <img
                src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80"
                alt="Notebook packaging"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl border border-gray-100 shadow-xl px-5 py-4 hidden sm:block">
              <p className="text-2xl font-extrabold text-gray-900">14</p>
              <p className="text-xs text-gray-500 font-medium">Days to return</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TRACK ORDER ═══════════════ */}
      <section className="py-16 sm:py-20 px-6 bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            <span className="w-6 h-px bg-primary" />
            Tracking
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
            Track Your Order
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Enter your order ID to check status, or visit{" "}
            <Link to="/profile" className="text-primary font-medium hover:underline">My Orders</Link>.
          </p>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <MagnifyingGlassIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter order ID"
                className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!orderId.trim()}
              className="px-7 py-3 bg-primary text-white font-bold text-sm rounded-xl hover:bg-black transition-colors shadow-lg shadow-primary/15 disabled:opacity-50 disabled:pointer-events-none flex-shrink-0"
            >
              Track
            </button>
          </form>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-primary" />
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <FaqItem
                key={q}
                q={q}
                a={a}
                open={openFaq === i}
                toggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM CTA ═══════════════ */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 sm:px-14 sm:py-16 text-center">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
                Ready to Order Your Next Notebook?
              </h2>
              <p className="text-sm text-gray-300 max-w-md mx-auto mb-6 leading-relaxed">
                Fast delivery, clear return policy, and consistent notebook quality.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/shop"
                  className="group inline-flex items-center gap-2 px-7 py-3 bg-white text-primary font-bold text-sm rounded-xl hover:bg-gray-100 transition-all shadow-lg shadow-black/20"
                >
                  Browse Notebooks
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3 border-2 border-white/15 text-white/70 font-semibold text-sm rounded-xl hover:border-white/30 hover:text-white transition-all"
                >
                  Contact Support
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 mt-8">
                {[
                  { icon: TruckIcon, text: "Fast delivery" },
                  { icon: ShieldCheckIcon, text: "Secure packaging" },
                  { icon: MapPinIcon, text: "Egypt-wide" },
                ].map(({ icon: Ico, text }) => (
                  <span key={text} className="flex items-center gap-1.5 text-[11px] text-white/40">
                    <Ico className="w-3.5 h-3.5" />
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ShippingInfo;