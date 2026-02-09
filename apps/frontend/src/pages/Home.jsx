// src/pages/HomePage.js
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const ArrowRightIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);
const ArrowDownIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5" />
  </svg>
);
const SparklesIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>
);
const TagIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
  </svg>
);
const SearchIcon = ({ className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const AnimatedStat = ({ end, suffix = "", label }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const duration = 1500;
          const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        {count}{suffix}
      </p>
      <p className="text-sm text-gray-300 mt-1">{label}</p>
    </div>
  );
};

const SectionHeader = ({ overline, title, subtitle, action, actionLabel, actionHref }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
    <div>
      {overline && (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
          <span className="w-6 h-px bg-primary" />
          {overline}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm mt-1.5 max-w-lg">{subtitle}</p>}
    </div>
    {action && (
      <Link to={actionHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all group">
        {actionLabel}
        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    )}
  </div>
);

const MobileSectionHeader = ({ title, actionLabel, actionHref }) => (
  <div className="flex items-center justify-between mb-4 px-1">
    <h2 className="text-base font-bold text-gray-900">{title}</h2>
    {actionLabel && (
      <Link to={actionHref} className="text-xs font-semibold text-primary">{actionLabel}</Link>
    )}
  </div>
);

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState([]);
  const [notebookCategories, setNotebookCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products/top-rated`)
      .then((res) => setBestSellers((res.data?.data || []).filter((p) => p.isActive === true)))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/notebook-categories`)
      .then((res) => setNotebookCategories(res.data?.data || []))
      .catch(console.error)
      .finally(() => setCategoriesLoading(false));
  }, []);

  const scrollToCategories = () => {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Local helper styles */}
      <style>{`
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <main className="text-gray-900">
        <div className="md:hidden">
          <div className="px-4 pt-4">
            <div
              className="relative rounded-2xl overflow-hidden h-44"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=70')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
              <div className="relative z-10 h-full flex flex-col justify-end p-4">
                <p className="text-[10px] text-secondary uppercase tracking-widest font-semibold mb-1">New Collection</p>
                <h2 className="text-xl font-extrabold text-white leading-tight mb-2.5">
                  Express your<br />identity
                </h2>
                <Link
                  to="/shop"
                  className="self-start inline-flex items-center gap-1.5 px-4 py-2 bg-white text-primary text-xs font-bold rounded-lg active:scale-95 transition-transform"
                >
                  Shop Now
                  <ArrowRightIcon className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="px-4 mt-5">
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { label: "New", icon: "\u2728", href: "/shop?sort=newest" },
                { label: "Offers", icon: "\uD83C\uDFF7\uFE0F", href: "/shop?discounted=true" },
                { label: "Popular", icon: "\uD83D\uDD25", href: "/shop?sort=popular" },
                { label: "Help", icon: "\uD83D\uDCAC", href: "/help-center" },
              ].map(({ label, icon, href }) => (
                <Link
                  key={label}
                  to={href}
                  className="flex flex-col items-center gap-1.5 py-3.5 bg-gray-50 rounded-2xl active:scale-95 transition-transform"
                >
                  <span className="text-xl leading-none">{icon}</span>
                  <span className="text-[11px] font-semibold text-gray-700">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="px-4">
              <MobileSectionHeader title="Categories" actionLabel="See All" actionHref="/shop" />
            </div>
            <div className="pl-4 overflow-x-auto no-scrollbar">
              <div className="flex gap-3 pr-4">
                {categoriesLoading &&
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-shrink-0 w-[104px]">
                      <div className="w-[104px] h-[104px] rounded-2xl bg-gray-100 animate-pulse" />
                      <div className="h-3 w-16 bg-gray-100 rounded mt-2.5 mx-auto animate-pulse" />
                    </div>
                  ))}
                {!categoriesLoading &&
                  notebookCategories.map(({ _id, title, categoryKey, imageUrl }) => (
                    <button
                      key={_id}
                      onClick={() => navigate(`/shop?category=${encodeURIComponent(categoryKey)}`)}
                      className="flex-shrink-0 w-[104px] text-center active:scale-95 transition-transform"
                    >
                      <div className="w-[104px] h-[104px] rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm">
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <p className="text-[11px] font-semibold text-gray-800 mt-2.5 line-clamp-1">{title}</p>
                    </button>
                  ))}
                {!categoriesLoading && notebookCategories.length === 0 && (
                  <p className="text-xs text-gray-400 py-4">No categories yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-7 px-4">
            <MobileSectionHeader title="Best Sellers" actionLabel="View All" actionHref="/shop" />
            <div className="grid grid-cols-2 gap-3">
              {bestSellers.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {bestSellers.length > 4 && (
              <Link
                to="/shop"
                className="flex items-center justify-center gap-2 mt-4 py-3 bg-gray-50 rounded-2xl text-sm font-semibold text-primary active:bg-gray-100 transition-colors"
              >
                View All Products
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="mt-7 px-4">
            <div className="relative overflow-hidden rounded-2xl bg-primary p-5">
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <TagIcon className="w-4 h-4 text-secondary" />
                  <span className="text-[10px] text-gray-300 uppercase tracking-wider font-semibold">Limited Offer</span>
                </div>
                <h3 className="text-base font-extrabold text-white mb-1.5">Launch Discount</h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-3.5">
                  Save on curated lines designed for focused writing.
                </p>
                <button
                  onClick={() => navigate("/shop?discounted=true")}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-white text-primary text-xs font-bold rounded-lg active:scale-95 transition-transform"
                >
                  Shop Offers
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-7 px-4 mb-4">
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { num: "500+", label: "Customers" },
                { num: "50+", label: "Designs" },
                { num: "99%", label: "Satisfaction" },
              ].map(({ num, label }) => (
                <div key={label} className="bg-gray-50 rounded-2xl py-4 text-center">
                  <p className="text-lg font-extrabold text-gray-900">{num}</p>
                  <p className="text-[10px] text-gray-500 font-medium mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:block mt-[-67px]">

          <section className="relative min-h-screen flex items-center justify-center text-center px-6 overflow-hidden">
            <div
              className="absolute inset-0 bg-center bg-cover scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
            <div className="relative z-10 max-w-3xl mx-auto text-white">
              <p className="uppercase tracking-[0.35em] text-xs mb-6 text-secondary">Notervo</p>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading leading-[1.1] mb-6">
                We don't sell<br /><span className="text-secondary">notebooks</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl max-w-xl mx-auto mb-10 text-gray-300 leading-relaxed">
                When you carry a notebook from Notervo, you express your identity with absolute precision.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/shop" className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary font-bold text-sm rounded-xl hover:bg-secondary transition-colors duration-200 shadow-lg shadow-black/20">
                  Shop Notebooks
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button onClick={scrollToCategories} className="inline-flex items-center gap-2 px-6 py-3.5 text-white/80 hover:text-white font-medium text-sm transition-colors">
                  Explore Categories
                  <ArrowDownIcon className="w-4 h-4 animate-bounce" />
                </button>
              </div>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
                <div className="w-1 h-2.5 rounded-full bg-white/60 animate-bounce" />
              </div>
            </div>
          </section>

          <section id="categories" className="py-20 bg-surface">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <SectionHeader overline="Collections" title="Shop by Notebook Type" subtitle="Choose the format that matches how you think and work." action actionLabel="View All" actionHref="/shop" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categoriesLoading && [1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                    <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                    <div className="p-5 space-y-2.5">
                      <div className="h-6 w-2/3 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                      <div className="h-4 w-4/5 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
                {!categoriesLoading && notebookCategories.map(({ _id, title, description, categoryKey, imageUrl }) => (
                  <button key={_id} type="button" onClick={() => navigate(`/shop?category=${encodeURIComponent(categoryKey)}`)} className="group text-left rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden" aria-label={`Shop ${title}`}>
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={imageUrl} alt={title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute bottom-4 right-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                        <ArrowRightIcon className="w-4 h-4 text-primary" />
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors mb-1.5">{title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{description}</p>
                    </div>
                  </button>
                ))}
                {!categoriesLoading && notebookCategories.length === 0 && (
                  <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-12 text-center">
                    <p className="text-gray-400">Categories are not configured yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <SectionHeader overline="Popular" title="Best Sellers" subtitle="Notebook editions our customers reorder the most." action actionLabel="Shop All" actionHref="/shop" />
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {(showAll ? bestSellers : bestSellers.slice(0, 3)).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
                <button type="button" onClick={() => navigate("/shop")} className="group rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary flex flex-col items-center justify-center text-center p-8 transition-all duration-300 hover:bg-primary/[0.02] min-h-[280px]" aria-label="Go to all notebooks">
                  <span className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors duration-300">
                    <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                  </span>
                  <span className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">View All</span>
                  <p className="text-xs text-gray-400 mt-1.5">Browse the full catalog</p>
                </button>
              </div>
              {bestSellers.length > 3 && (
                <div className="mt-10 text-center">
                  <button type="button" onClick={() => setShowAll((prev) => !prev)} className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-all duration-200">
                    {showAll ? "Show Less" : `Show All ${bestSellers.length} Products`}
                  </button>
                </div>
              )}
            </div>
          </section>

          <section className="bg-primary py-14">
            <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8">
              <AnimatedStat end={500} suffix="+" label="Happy Customers" />
              <AnimatedStat end={50} suffix="+" label="Notebook Designs" />
              <AnimatedStat end={99} suffix="%" label="Satisfaction Rate" />
            </div>
          </section>

          <section className="max-w-6xl mx-auto my-20 px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 sm:px-14 sm:py-20 text-center">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
              <div className="absolute top-8 right-12 opacity-10">
                <SparklesIcon className="w-16 h-16 text-white" />
              </div>
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                  <TagIcon className="w-3.5 h-3.5 text-secondary" />
                  <span className="text-xs font-semibold text-gray-200 uppercase tracking-wider">Limited Offer</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 max-w-2xl mx-auto">
                  Launch Offer on Selected Notebooks
                </h2>
                <p className="text-base sm:text-lg max-w-xl mx-auto mb-8 text-gray-300 leading-relaxed">
                  Save on curated notebook lines designed for calm planning and consistent writing routines.
                </p>
                <button type="button" onClick={() => navigate("/shop?discounted=true")} className="group inline-flex items-center gap-2 bg-white text-primary font-bold text-sm py-3.5 px-10 rounded-xl hover:bg-secondary transition-colors duration-200 shadow-lg shadow-black/20">
                  Shop the Offer
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

    </>
  );
}
