import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Orders = lazy(() => import("./pages/Orders"));
const Products = lazy(() => import("./pages/Products"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Users = lazy(() => import("./pages/Users"));
const Coupons = lazy(() => import("./pages/Coupons"));
const Messages = lazy(() => import("./pages/Messages"));
const MessagesToUsers = lazy(() => import("./pages/MessagesToUsers"));
const Subscribers = lazy(() => import("./pages/Subscribers"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Categories = lazy(() => import("./pages/Categories"));

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <p role="status" className="p-8 text-center">
            Loading…
          </p>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/message-to-user" element={<MessagesToUsers />} />
          <Route path="/subscribers" element={<Subscribers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
