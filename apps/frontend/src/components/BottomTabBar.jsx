import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useNavCounts from "../hooks/useNavCounts";

/* ═══════════════════════════════════════════════════════
   TAB ICONS
   ═══════════════════════════════════════════════════════ */
const TabHomeIcon = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke={active ? "none" : "currentColor"} strokeWidth={1.5} className="w-6 h-6">
    {active ? (
      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689ZM12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    )}
  </svg>
);
const TabShopIcon = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke={active ? "none" : "currentColor"} strokeWidth={1.5} className="w-6 h-6">
    {active ? (
      <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    )}
  </svg>
);
const TabCartIcon = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke={active ? "none" : "currentColor"} strokeWidth={1.5} className="w-6 h-6">
    {active ? (
      <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    )}
  </svg>
);
const TabWishIcon = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke={active ? "none" : "currentColor"} strokeWidth={1.5} className="w-6 h-6">
    {active ? (
      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    )}
  </svg>
);
const MoreDotsIcon = ({ active }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
    {[6, 12, 18].map((cy) =>
      [6, 12, 18].map((cx) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={active ? 2 : 1.5} fill={active ? "currentColor" : "none"} stroke={active ? "none" : "currentColor"} strokeWidth={1.5} />
      ))
    )}
  </svg>
);

/* ═══════════════════════════════════════════════════════
   MENU ICONS
   ═══════════════════════════════════════════════════════ */
const MI = ({ children, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-[18px] h-[18px] ${className}`}>{children}</svg>
);
const ProfileIco = (p) => <MI {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></MI>;
const OrdersIco = (p) => <MI {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-11.048 0c-1.131.094-1.976 1.057-1.976 2.192V16.5A2.25 2.25 0 0 0 7.5 18.75h.75" /></MI>;
const MessagesIco = (p) => <MI {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></MI>;
const AboutIco = (p) => <MI {...p}><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 .92.876l.474-.144a.75.75 0 0 1 .773.32l.29.462a.75.75 0 0 1-.837 1.112l-.976-.325a.75.75 0 0 0-.891.396l-.29.578a.75.75 0 0 1-1.341.004" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></MI>;
const ShippingIco = (p) => <MI {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.079-.504 1.036-1.124a20.916 20.916 0 0 0-1.395-5.88 2.12 2.12 0 0 0-1.81-1.246h-3.362" /></MI>;
const HelpIco = (p) => <MI {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" /></MI>;
const ContactIco = (p) => <MI {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></MI>;
const ReturnIco = (p) => <MI {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" /></MI>;
const LoginIco = (p) => <MI {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></MI>;
const RegisterIco = (p) => <MI {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" /></MI>;
const LogoutIco = (p) => <MI {...p}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" /></MI>;

/* ═══════════════════════════════════════════════════════
   MENU CONFIG
   ═══════════════════════════════════════════════════════ */
const getMenuSections = (isLoggedIn) => [
  {
    title: "Account",
    items: isLoggedIn
      ? [
        { label: "My Profile", icon: ProfileIco, href: "/profile" },
        { label: "My Orders", icon: OrdersIco, href: "/profile" },
        { label: "Messages", icon: MessagesIco, href: "/my-messages" },
      ]
      : [
        { label: "Login", icon: LoginIco, href: "/login" },
        { label: "Create Account", icon: RegisterIco, href: "/register" },
      ],
  },
  {
    title: "Explore",
    items: [
      { label: "About Notervo", icon: AboutIco, href: "/about" },
      { label: "Shipping & Delivery", icon: ShippingIco, href: "/shipping" },
      { label: "Return Policy", icon: ReturnIco, href: "/return-policy" },
      { label: "Help Center", icon: HelpIco, href: "/help-center" },
      { label: "Contact Us", icon: ContactIco, href: "/contact" },
    ],
  },
];

/* ═══════════════════════════════════════════════════════
   BOTTOM TAB BAR
   ═══════════════════════════════════════════════════════ */
const BottomTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef = useRef(null);
  const { isLoggedIn, cartCount, wishlistCount, messagesCount } = useNavCounts();
  const menuSections = getMenuSections(isLoggedIn);

  /* close on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  /* close on outside tap */
  useEffect(() => {
    if (!menuOpen) return;
    const handle = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("touchstart", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("touchstart", handle);
    };
  }, [menuOpen]);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => {
    Cookies.remove("token");
    setMenuOpen(false);
    navigate("/login");
  };

  /* all tab items that appear in the more menu for active-state matching */
  const morePagePaths = menuSections.flatMap((s) => s.items.map((i) => i.href));

  const tabs = [
    { label: "Home", icon: TabHomeIcon, href: "/", match: "/", count: 0 },
    { label: "Shop", icon: TabShopIcon, href: "/shop", match: "/shop", count: 0 },
    { label: "Cart", icon: TabCartIcon, href: "/cart", match: "/cart", count: cartCount },
    { label: "Wishlist", icon: TabWishIcon, href: "/wishlist", match: "/wishlist", count: wishlistCount },
    { label: "More", icon: MoreDotsIcon, href: null, match: null, count: 0 },
  ];

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 z-[98] bg-black/40 backdrop-blur-[2px] md:hidden transition-opacity duration-300 ${menuOpen ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Floating Menu Panel ── */}
      <div
        ref={panelRef}
        className={`fixed left-3 right-3 z-[99] md:hidden transition-all duration-300 ease-out ${menuOpen ? "bottom-[76px] opacity-100 translate-y-0" : "bottom-[68px] opacity-0 translate-y-6 pointer-events-none"
          }`}
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/15 border border-gray-100 overflow-hidden">
          <div
            className="max-h-[65vh] overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >

            {/* header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-lg px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-900 tracking-tight">Menu</h3>
              <button onClick={() => setMenuOpen(false)} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-500">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>

            {/* sections */}
            <div className="px-2.5 py-2.5">
              {menuSections.map((section, si) => (
                <div key={section.title}>
                  {si > 0 && <div className="my-1.5 mx-2 border-t border-gray-100" />}
                  <p className="px-3 pt-2.5 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{section.title}</p>
                  {section.items.map(({ label, icon: Ico, href }) => {
                    const active = path === href;
                    const isMessagesItem = label === "Messages";
                    return (
                      <Link
                        key={label}
                        to={href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3.5 px-3 py-2.5 rounded-2xl transition-colors active:bg-gray-50 ${active ? "bg-primary/[0.04]" : ""}`}
                      >
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${active ? "bg-primary text-white" : "bg-gray-50 text-gray-500"}`}>
                          <Ico />
                        </span>
                        <span className={`text-[13px] font-semibold flex-1 ${active ? "text-primary" : "text-gray-800"}`}>{label}</span>
                        {isMessagesItem && messagesCount > 0 && !active && (
                          <span className="min-w-[20px] h-5 rounded-full bg-primary px-1.5 text-[10px] font-bold text-white flex items-center justify-center">
                            {messagesCount > 99 ? "99+" : messagesCount}
                          </span>
                        )}
                        {active && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                        {!active && !(isMessagesItem && messagesCount > 0) && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-gray-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                          </svg>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}

              {/* Logout */}
              {isLoggedIn && (
                <>
                  <div className="my-1.5 mx-2 border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl active:bg-red-50 transition-colors"
                  >
                    <span className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                      <LogoutIco className="text-red-500" />
                    </span>
                    <span className="text-[13px] font-semibold text-red-500">Log Out</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* brand footer */}
          <div className="border-t border-gray-100 px-5 py-2.5 text-center">
            <span className="text-[10px] font-bold text-gray-300 tracking-[3px] uppercase">Notervo</span>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <nav className="mobile-tab-bar fixed bottom-0 inset-x-0 z-[100] bg-white/95 backdrop-blur-lg border-t border-gray-100 md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {tabs.map(({ label, icon: Ico, href, match, count }) => {
            const isMore = label === "More";
            const active = isMore
              ? menuOpen || morePagePaths.includes(path)
              : path === match;

            if (isMore) {
              return (
                <button
                  key="more"
                  onClick={() => setMenuOpen((o) => !o)}
                  className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors ${active ? "text-primary" : "text-gray-400"}`}
                >
                  <div className="relative">
                    <Ico active={active} />
                  </div>
                  <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-gray-400"}`}>{label}</span>
                </button>
              );
            }

            return (
              <Link
                key={label}
                to={href}
                onClick={() => menuOpen && setMenuOpen(false)}
                className={`flex flex-col items-center justify-center gap-0.5 w-14 h-full transition-colors ${active ? "text-primary" : "text-gray-400"}`}
              >
                <div className="relative">
                  <Ico active={active} />
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] rounded-full bg-primary px-1 text-[9px] font-bold text-white flex items-center justify-center">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-semibold ${active ? "text-primary" : "text-gray-400"}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default BottomTabBar;
