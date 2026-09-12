import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
const Home = lazy(() => import("./pages/Home"));
import Header from "./components/Header";
const NotFound = lazy(() => import("./pages/NotFound"));
import Footer from "./components/Footer";
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const ProductPage = lazy(() => import("./pages/Product"));
const Shop = lazy(() => import("./pages/Shop"));
import ScrollToTop from "./utils/ScrollToTop";
import { Toaster } from "react-hot-toast";
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
import StickyTopBar from "./components/StickyTopBar";
import BottomTabBar from "./components/BottomTabBar";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="hidden md:block">
        <Header />
      </div>
      <div className="md:hidden">
        <StickyTopBar />
      </div>
      <Toaster />
      <main className="pb-20 md:pb-0">
        <Suspense
          fallback={
            <p role="status" className="p-8 text-center">
              Loading…
            </p>
          }
        >
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
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomTabBar />
    </BrowserRouter>
  );
}

export default App;
