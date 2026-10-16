import axios from "axios";
import Cookies from "js-cookie";
import {
  addGuestWishlistItem,
  hasGuestWishlistItem,
  removeGuestWishlistItem,
} from "./guestWishlist";

export async function addToWishlist(productId) {
  try {
    const token = Cookies.get("token");
    if (!token) {
      const result = addGuestWishlistItem(productId);
      if (!result.success) {
        return { success: false, message: result.message };
      }
      window.dispatchEvent(new Event("wishlistUpdated"));
      return { success: true, data: { wishlist: { items: result.items } } };
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/wishlist/add/${productId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    window.dispatchEvent(new Event("wishlistUpdated"));

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong while adding to wishlist",
    };
  }
}

export async function removeFromWishlist(productId) {
  try {
    const token = Cookies.get("token");
    if (!token) {
      const result = removeGuestWishlistItem(productId);
      if (!result.success) {
        return { success: false, message: result.message };
      }
      window.dispatchEvent(new Event("wishlistUpdated"));
      return { success: true, data: { wishlist: { items: result.items } } };
    }

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/wishlist/remove/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    window.dispatchEvent(new Event("wishlistUpdated"));

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong while removing from wishlist",
    };
  }
}

// Share one wishlist GET across the product cards rendered together.
let wishlistLookup = null;
if (typeof window !== "undefined") {
  window.addEventListener("wishlistUpdated", () => {
    wishlistLookup = null;
  });
}

function fetchWishlistItemsShared(token) {
  if (!wishlistLookup || wishlistLookup.token !== token) {
    const request = axios
      .get(`${import.meta.env.VITE_API_URL}/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data.wishlist?.items || []);
    wishlistLookup = { token, request };
    request
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          if (wishlistLookup?.request === request) wishlistLookup = null;
        }, 1500);
      });
  }
  return wishlistLookup.request;
}

export async function checkProductInWishlist(productId) {
  const token = Cookies.get("token");
  if (!token) return hasGuestWishlistItem(productId);

  try {
    const wishlistItems = await fetchWishlistItemsShared(token);

    return wishlistItems.some((item) => item.productId._id === productId);
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
}
