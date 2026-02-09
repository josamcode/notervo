import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

const emptyCounts = {
  cartCount: 0,
  wishlistCount: 0,
  messagesCount: 0,
};

export default function useNavCounts() {
  const [counts, setCounts] = useState(emptyCounts);
  const location = useLocation();
  const token = Cookies.get("token");

  const fetchCounts = useCallback(async () => {
    if (!token) {
      setCounts(emptyCounts);
      return;
    }

    try {
      const [cartRes, wishlistRes, myMessagesRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/message-to-user/my`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCounts({
        cartCount: cartRes.data.cart?.items?.length || 0,
        wishlistCount: wishlistRes.data.wishlist?.items?.length || 0,
        messagesCount: myMessagesRes.data.messages?.filter((msg) => !msg.isRead).length || 0,
      });
    } catch {
      setCounts(emptyCounts);
    }
  }, [token]);

  useEffect(() => {
    fetchCounts();
  }, [location.pathname, fetchCounts]);

  useEffect(() => {
    if (!token) return undefined;

    const handleUpdate = () => fetchCounts();
    const handleVisibility = () => {
      if (!document.hidden) fetchCounts();
    };

    window.addEventListener("cartUpdated", handleUpdate);
    window.addEventListener("wishlistUpdated", handleUpdate);
    window.addEventListener("messagesUpdated", handleUpdate);
    window.addEventListener("focus", handleUpdate);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate);
      window.removeEventListener("wishlistUpdated", handleUpdate);
      window.removeEventListener("messagesUpdated", handleUpdate);
      window.removeEventListener("focus", handleUpdate);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [token, fetchCounts]);

  return {
    ...counts,
    isLoggedIn: !!token,
  };
}
