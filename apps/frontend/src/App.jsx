import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StickyTopBar from "./components/StickyTopBar";
import BottomTabBar from "./components/BottomTabBar";
import SearchOverlay from "./components/SearchOverlay";
import ScrollToTop from "./utils/ScrollToTop";
import useNavCounts from "./hooks/useNavCounts";
import { useIsDesktop } from "./hooks/useMediaQuery";
import { Spinner } from "./components/ui/Icons";

const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const ProductPage = lazy(() => import("./pages/Product"));
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const ShippingInfo = lazy(() => import("./pages/ShippingInfo"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const ReturnPolicy = lazy(() => import("./pages/ReturnPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ContactPage = lazy(() => import("./pages/Contact"));
const MyMessages = lazy(() => import("./pages/MyMessages"));

const PageFallback = () => (
  <div
    role="status"
    className="flex min-h-[60vh] items-center justify-center text-muted"
  >
    <Spinner className="h-5 w-5" />
    <span className="sr-only">Loading…</span>
  </div>
);

function Shell() {
  const counts = useNavCounts();
  const isDesktop = useIsDesktop();
  const { pathname } = useLocation();
  // The desktop home hero sits under the transparent header.
  const underHeader = pathname === "/" || pathname === "/home";

  return (
    <>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-cream"
      >
        Skip to content
      </a>
      {isDesktop ? (
        <Header counts={counts} />
      ) : (
        <StickyTopBar counts={counts} />
      )}
      <Toaster
        toastOptions={{
          style: {
            background: "#262624",
            color: "#FFFBF2",
            borderRadius: "999px",
          },
          success: { iconTheme: { primary: "#FFFBF2", secondary: "#262624" } },
          error: { iconTheme: { primary: "#E2552D", secondary: "#FFFBF2" } },
        }}
      />
      <SearchOverlay />
      <main
        id="main"
        className={`pb-tabbar md:pb-0 ${underHeader ? "" : "md:pt-[var(--header-h)]"}`}
      >
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products/:id" element={<ProductPage />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/my-messages" element={<MyMessages />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/order-confirmation/:id"
              element={<OrderConfirmation />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            {/* <Route path="/careers" element={<Careers />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {isDesktop ? <Footer /> : <BottomTabBar counts={counts} />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

export default App;
