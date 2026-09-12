import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductPage from "./pages/Product";
import Shop from "./pages/Shop";
import ScrollToTop from "./utils/ScrollToTop";
import { Toaster } from "react-hot-toast";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Profile from "./pages/Profile";
import About from "./pages/About";
import ShippingInfo from "./pages/ShippingInfo";
import HelpCenter from "./pages/HelpCenter";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContactPage from "./pages/Contact";
import MyMessages from "./pages/MyMessages";
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
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
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
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomTabBar />
    </BrowserRouter>
  );
}

export default App;
