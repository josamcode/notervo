// src/pages/HelpCenter.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

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
const ArrowPathIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
  </Icon>
);
const CreditCardIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </Icon>
);
const UserCircleIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </Icon>
);
const ArrowRightIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </Icon>
);
const QuestionIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
  </Icon>
);
const ChatIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </Icon>
);
const MagnifyingGlassIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </Icon>
);

/* ───────────── data ───────────── */
const helpTopics = [
  {
    icon: TruckIcon,
    title: "Shipping & Delivery",
    description: "Delivery timelines, shipping costs, and tracking details for all Egyptian cities.",
    link: "/shipping",
    linkText: "View Shipping Info",
    accent: "bg-blue-50 text-blue-600 border-blue-100",
    iconBg: "bg-blue-50",
  },
  {
    icon: ArrowPathIcon,
    title: "Returns & Exchanges",
    description: "Return eligibility within 14 days, process steps, and refund timing.",
    link: "/return-policy",
    linkText: "Read Return Policy",
    accent: "bg-amber-50 text-amber-600 border-amber-100",
    iconBg: "bg-amber-50",
  },
  {
    icon: CreditCardIcon,
    title: "Payments",
    description: "Available payment methods, pricing, and order total breakdowns.",
    link: "/contact",
    linkText: "Contact Us",
    accent: "bg-green-50 text-green-600 border-green-100",
    iconBg: "bg-green-50",
  },
  {
    icon: UserCircleIcon,
    title: "Account & Orders",
    description: "Manage your profile, wishlist, order history, and saved addresses.",
    link: "/profile",
    linkText: "Go to Profile",
    accent: "bg-purple-50 text-purple-600 border-purple-100",
    iconBg: "bg-purple-50",
  },
];

const quickFaqs = [
  { q: "How long does delivery take?", a: "1–4 business days depending on your location within Egypt." },
  { q: "Can I return a notebook?", a: "Yes — unused items can be returned within 14 days of delivery." },
  { q: "How do I track my order?", a: "Enter your order ID on our shipping page or check your profile's order history." },
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
    <main className="text-gray-900">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative overflow-hidden bg-surface py-20 sm:py-24 px-6">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/[0.02] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-2xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
            <QuestionIcon className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Help Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            How can we help you?
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Find answers about notebooks, orders, shipping, and account support.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <MagnifyingGlassIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help topics..."
              className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════ TOPICS GRID ═══════════════ */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mb-1">No topics match "<strong>{search}</strong>"</p>
              <button onClick={() => setSearch("")} className="text-sm text-primary font-medium hover:underline">
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map(({ icon: Ico, title, description, link, linkText, iconBg }) => (
                <Link
                  key={title}
                  to={link}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 p-6 transition-all duration-300 flex gap-5"
                >
                  <span className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Ico className="w-5 h-5 text-primary" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3">
                      {description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      {linkText}
                      <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════ QUICK FAQ ═══════════════ */}
      <section className="py-16 sm:py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-primary" />
              Quick Answers
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Common Questions
            </h2>
          </div>

          <div className="space-y-3">
            {quickFaqs.map(({ q, a }) => (
              <div key={q} className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 sm:px-14 sm:py-16 text-center">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <ChatIcon className="w-6 h-6 text-white/70" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
                Still need help?
              </h2>
              <p className="text-sm text-gray-300 max-w-sm mx-auto mb-6 leading-relaxed">
                Our support team is ready to help with any questions about your notebooks or orders.
              </p>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 px-7 py-3 bg-white text-primary font-bold text-sm rounded-xl hover:bg-gray-100 transition-all shadow-lg shadow-black/20"
              >
                Contact Support
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HelpCenter;