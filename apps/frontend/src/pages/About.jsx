// src/pages/About.jsx
import React, { useState } from "react";
import axios from "axios";
import { showError, showSuccess } from "../utils/Toast";
import Cookies from "js-cookie";
import { PageHeader, Eyebrow } from "../components/ui/Primitives";
import Pill from "../components/ui/Pill";
import Reveal from "../components/ui/Reveal";
import SmartImage from "../components/ui/SmartImage";
import { ArrowRight, Check, Spinner, Sparkle } from "../components/ui/Icons";
import { EyeIcon, PenIcon, useCategoryImages } from "./info/InfoKit";

/* ───────────── data ───────────── */
const principles = [
  {
    icon: PenIcon,
    title: "Minimal by Design",
    description:
      "Every notebook follows a clear, calm layout with no visual clutter. We design for focus first.",
  },
  {
    icon: Sparkle,
    title: "Premium Writing Feel",
    description:
      "Paper texture, line balance, and cover durability are selected for everyday quality and long-term use.",
  },
  {
    icon: EyeIcon,
    title: "Consistent Identity",
    description:
      "A monochrome system that keeps products timeless and easy to integrate into any workspace.",
  },
];

const highlights = [
  "Curated selection",
  "Premium paper",
  "Consistent design",
  "Calm shopping",
];

/* ───────────── main component ───────────── */
const About = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const images = useCategoryImages();

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

  const storyImage = images[0];
  const newsletterImage = images[1] || images[0];

  return (
    <div className="text-ink">
      {/* ═══════════════ HERO ═══════════════ */}
      <PageHeader
        eyebrow="Est. 2024"
        title="We Are Notervo"
        description="A notebook-focused brand built on clarity, calm visual language, and premium writing essentials."
        actions={
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Pill
              to="/shop"
              variant="solid"
              size="lg"
              arrow
              className="w-full sm:w-auto"
            >
              Shop Notebooks
            </Pill>
            <Pill
              to="/contact"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              Contact Us
            </Pill>
          </div>
        }
        className="[&>div>div:last-child]:w-full sm:[&>div>div:last-child]:w-auto"
      />

      {/* ═══════════════ STORY (two-up) ═══════════════ */}
      <section
        aria-labelledby="story-title"
        className="mt-2 grid md:mt-0 md:grid-cols-2 md:border-b md:border-ink-line"
      >
        <div className="relative mx-4 aspect-[4/3] overflow-hidden rounded-2xl bg-cream-dim md:mx-0 md:aspect-auto md:min-h-[640px] md:rounded-none md:border-r md:border-ink-line">
          <SmartImage
            src={storyImage}
            alt="Notervo notebook workspace"
            width={1400}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Existing brand detail kept from the previous floating card */}
          <div className="absolute bottom-4 left-4 bg-cream px-4 py-3 md:bottom-8 md:left-8 md:px-5 md:py-4">
            <p className="font-serif text-[26px] font-light leading-none md:text-[34px]">
              50+
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.02em] text-muted">
              Notebook designs
            </p>
          </div>
        </div>

        <Reveal className="flex flex-col px-4 pt-8 md:px-[var(--gutter)] md:py-16 lg:px-20 lg:py-20">
          <Eyebrow className="mb-3 text-muted md:mb-5">Our Story</Eyebrow>
          <h2
            id="story-title"
            className="font-serif text-[28px] font-light leading-[1.02] tracking-tight md:text-display"
          >
            Making notebook shopping intentional
          </h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-ink/80 md:mt-8 md:text-[17px]">
            <p>
              Notervo started with one goal: make notebook shopping intentional
              instead of overwhelming. We focus on a refined set of categories,
              practical specifications, and clean product pages.
            </p>
            <p>
              Every release is reviewed for paper quality, binding reliability,
              and visual consistency with our brand system. Customers can choose
              quickly with confidence.
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-2 border-t border-ink/15 md:mt-auto md:border-ink-line">
            {highlights.map((item, i) => (
              <li
                key={item}
                className={`flex items-center gap-2.5 border-b border-ink/15 py-4 text-[13px] uppercase tracking-[0.02em] md:border-ink-line md:py-5 ${i % 2 === 0 ? "pr-3" : "border-l pl-4"}`}
              >
                <Check className="h-4 w-4 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ═══════════════ PRINCIPLES (icons slice) ═══════════════ */}
      <section
        aria-labelledby="principles-title"
        className="mt-10 grid md:mt-0 md:grid-cols-[minmax(320px,38%)_1fr] md:border-b md:border-ink-line lg:grid-cols-[minmax(380px,29%)_1fr]"
      >
        <Reveal className="px-4 pb-5 md:border-r md:border-ink-line md:px-[var(--gutter)] md:py-16">
          <Eyebrow className="mb-2 text-muted md:mb-4">Philosophy</Eyebrow>
          <h2
            id="principles-title"
            className="font-serif text-[28px] font-light leading-none tracking-tight md:text-display"
          >
            Brand Principles
          </h2>
          <p className="mt-3 max-w-sm text-[14px] leading-snug text-muted md:mt-6 md:text-[16px] md:text-ink/80">
            Clear structure, premium calm mood, and a minimal monochrome
            palette.
          </p>
        </Reveal>

        <ul className="mx-4 overflow-hidden rounded-2xl border border-ink/10 bg-white/60 md:mx-0 md:grid md:grid-cols-3 md:rounded-none md:border-0 md:bg-transparent">
          {principles.map(({ icon: Ico, title, description }, i) => (
            <Reveal
              as="li"
              key={title}
              delay={i * 90}
              className="flex gap-4 border-b border-ink/10 p-4 last:border-b-0 md:block md:border-b-0 md:border-r md:border-ink-line md:px-8 md:py-16 md:last:border-r-0"
            >
              <Ico
                className="h-7 w-7 shrink-0 md:h-12 md:w-12"
                strokeWidth={1.2}
              />
              <div className="min-w-0">
                <h3 className="font-sans text-[16px] font-medium md:mt-14 md:font-serif md:text-[28px] md:font-light md:leading-tight">
                  {title}
                </h3>
                <p className="mt-1 text-[14px] leading-snug text-muted md:mt-4 md:text-[15px]">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ═══════════════ NEWSLETTER (two-up feature) ═══════════════ */}
      <section
        aria-labelledby="newsletter-title"
        className="relative mt-10 px-4 pb-6 md:mt-0 md:flex md:min-h-[640px] md:items-center md:justify-center md:overflow-hidden md:bg-ink md:px-[var(--gutter)] md:py-20"
      >
        <SmartImage
          src={newsletterImage}
          alt=""
          width={2000}
          sizes="100vw"
          className="absolute inset-0 hidden h-full w-full scale-105 object-cover blur-[2px] md:block"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-ink/35 md:block"
        />

        <Reveal className="relative z-10 rounded-[28px] bg-ink p-6 text-cream md:w-full md:max-w-[760px] md:rounded-none md:bg-cream md:p-12 md:text-ink lg:p-14">
          <Eyebrow className="text-cream/70 md:text-muted">Newsletter</Eyebrow>
          <h2
            id="newsletter-title"
            className="mt-3 font-serif text-[26px] font-light leading-[1.02] md:mt-6 md:text-display"
          >
            Join the Notervo Newsletter
          </h2>
          <p className="mt-3 max-w-md text-[14px] leading-snug text-cream/75 md:mt-5 md:text-[16px] md:text-ink/80">
            Get updates on new notebook drops, limited editions, and practical
            writing guidance.
          </p>

          <form onSubmit={handleSubscribe} className="mt-6 max-w-md md:mt-10">
            <label htmlFor="about-email" className="sr-only">
              Email address
            </label>
            <div className="flex items-center gap-2 rounded-full bg-cream p-1 md:gap-0 md:rounded-none md:border-b md:border-ink/40 md:bg-transparent md:p-0 md:focus-within:border-ink">
              <input
                id="about-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="h-11 min-w-0 flex-1 bg-transparent px-4 text-[15px] text-ink placeholder:text-muted focus:outline-none md:px-0"
                required
              />
              <button
                type="submit"
                disabled={subscribing}
                aria-label="Subscribe"
                className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[13px] uppercase text-cream disabled:opacity-50 md:w-11 md:bg-transparent md:px-0 md:text-ink md:transition-transform md:hover:translate-x-1"
              >
                {subscribing ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <>
                    <span className="md:sr-only">Subscribe</span>
                    <ArrowRight className="hidden h-5 w-5 md:block" />
                  </>
                )}
              </button>
            </div>
            {subscribed && (
              <p className="mt-3 flex items-center gap-1.5 text-[13px]">
                <Check className="h-4 w-4" />
                You're subscribed!
              </p>
            )}
          </form>
        </Reveal>
      </section>
    </div>
  );
};

export default About;
