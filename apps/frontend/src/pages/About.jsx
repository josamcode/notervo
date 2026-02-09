// src/pages/About.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { showError, showSuccess } from "../utils/Toast";
import Cookies from "js-cookie";

/* ───────────── icons ───────────── */
const Icon = ({ children, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    {children}
  </svg>
);
const PenIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
  </Icon>
);
const SparklesIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
  </Icon>
);
const EyeIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </Icon>
);
const SwatchIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008Z" />
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

/* ───────────── data ───────────── */
const principles = [
  {
    icon: PenIcon,
    title: "Minimal by Design",
    description: "Every notebook follows a clear, calm layout with no visual clutter. We design for focus first.",
  },
  {
    icon: SparklesIcon,
    title: "Premium Writing Feel",
    description: "Paper texture, line balance, and cover durability are selected for everyday quality and long-term use.",
  },
  {
    icon: EyeIcon,
    title: "Consistent Identity",
    description: "A monochrome system that keeps products timeless and easy to integrate into any workspace.",
  },
];

const brandSpecs = [
  { label: "Primary color", value: "#222222", swatch: "#222222" },
  { label: "Secondary color", value: "#D8D8D8", swatch: "#D8D8D8" },
  { label: "Headings", value: "Ahsing (Arabic: DG Ghayaty)", swatch: null },
  { label: "Body font", value: "Poppins", swatch: null },
];

/* ───────────── main component ───────────── */
const About = () => {
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
    <main className="bg-white text-gray-900">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative py-24 sm:py-32 px-6 overflow-hidden bg-surface">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/[0.02] rounded-full -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Est. 2024</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-5">
            We Are{" "}
            <span className="relative">
              Notervo
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C40 2 80 1 100 3C120 5 160 6.5 199 3" stroke="#222222" strokeWidth="2" strokeLinecap="round" opacity="0.15" />
              </svg>
            </span>
          </h1>
          <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mx-auto mb-8">
            A notebook-focused brand built on clarity, calm visual language, and premium writing essentials.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/shop"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-black transition-colors shadow-lg shadow-primary/15"
            >
              Shop Notebooks
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-7 py-3 border-2 border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:border-primary hover:text-primary transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════ STORY ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-primary" />
              Our Story
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-6">
              Making notebook shopping intentional
            </h2>
            <div className="space-y-4 text-gray-500 leading-relaxed">
              <p>
                Notervo started with one goal: make notebook shopping intentional instead of overwhelming. We focus on a refined set of categories, practical specifications, and clean product pages.
              </p>
              <p>
                Every release is reviewed for paper quality, binding reliability, and visual consistency with our brand system. Customers can choose quickly with confidence.
              </p>
            </div>

            {/* Highlights */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {["Curated selection", "Premium paper", "Consistent design", "Calm shopping"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-primary/5 flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 text-primary" />
                  </span>
                  <span className="text-sm text-gray-600 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-gray-200/50">
              <img
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80"
                alt="Notervo notebook workspace"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl border border-gray-100 shadow-xl px-5 py-4 hidden sm:block">
              <p className="text-2xl font-extrabold text-gray-900">50+</p>
              <p className="text-xs text-gray-500 font-medium">Notebook designs</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ PRINCIPLES ═══════════════ */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
              <span className="w-6 h-px bg-primary" />
              Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Brand Principles
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-lg mx-auto">
              Clear structure, premium calm mood, and a minimal monochrome palette.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {principles.map(({ icon: Ico, title, description }, i) => (
              <div
                key={title}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 p-7 transition-all duration-300"
              >
                <span className="w-11 h-11 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center mb-5 transition-colors">
                  <Ico className="w-5 h-5 text-primary" />
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ NEWSLETTER CTA ═══════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 sm:px-14 sm:py-20 text-center">
            {/* Decorative */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                Join the Notervo Newsletter
              </h2>
              <p className="text-sm sm:text-base text-gray-300 max-w-md mx-auto mb-8 leading-relaxed">
                Get updates on new notebook drops, limited editions, and practical writing guidance.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-2.5 justify-center max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 px-5 py-3 rounded-xl text-sm text-white bg-white/10 border border-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-7 py-3 bg-white text-primary font-bold text-sm rounded-xl hover:bg-secondary transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
                >
                  {subscribing ? "..." : "Subscribe"}
                </button>
              </form>
              {subscribed && (
                <p className="text-xs text-green-400 mt-3 flex items-center justify-center gap-1">
                  <CheckIcon className="w-3.5 h-3.5" />
                  You're subscribed!
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;