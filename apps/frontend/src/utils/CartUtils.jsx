import axios from "axios";
import Cookies from "js-cookie";
import {
  addGuestCartItem,
  hasGuestCartItem,
  removeGuestCartItem,
} from "./guestCart";

export async function addToCart(
  productId,
  quantity = 1,
  color = null,
  size = null
) {
  try {
    const token = Cookies.get("token");

    if (!color || !size) {
      try {
        const productRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${productId}`
        );

        const product = productRes.data;

        if (!color && product.colors && product.colors.length > 0) {
          color = product.colors[0];
        }

        if (!size && product.sizes && product.sizes.length > 0) {
          size = product.sizes[0];
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err);
      }
    }

    if (!token) {
      const result = addGuestCartItem({
        productId,
        quantity,
        color,
        size,
      });

      if (!result.success) {
        return { success: false, message: result.message };
      }

      window.dispatchEvent(new Event("cartUpdated"));
      return { success: true, data: { cart: { items: result.items } } };
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/cart/add/${productId}`,
      {
        quantity,
        color,
        size,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    window.dispatchEvent(new Event("cartUpdated"));

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong while adding to cart",
    };
  }
}

export async function removeFromCart(productId, color = null, size = null) {
  try {
    const token = Cookies.get("token");

    if (!token) {
      const result = removeGuestCartItem(productId, color, size);
      if (!result.success) {
        return { success: false, message: result.message };
      }
      window.dispatchEvent(new Event("cartUpdated"));
      return { success: true, data: { cart: { items: result.items } } };
    }

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/cart/remove/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          color,
          size,
        },
      }
    );

    window.dispatchEvent(new Event("cartUpdated"));

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong while removing from cart",
    };
  }
}

// Product cards each ask "is this in my cart?"; share one GET per burst of checks.
let cartLookup = null;
if (typeof window !== "undefined") {
  window.addEventListener("cartUpdated", () => {
    cartLookup = null;
  });
}

function fetchCartItemsShared(token) {
  if (!cartLookup || cartLookup.token !== token) {
    const request = axios
      .get(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data.cart?.items || []);
    cartLookup = { token, request };
    request
      .catch(() => {})
      .finally(() => {
        setTimeout(() => {
          if (cartLookup?.request === request) cartLookup = null;
        }, 1500);
      });
  }
  return cartLookup.request;
}

export async function checkProductInCart(productId, color, size) {
  const token = Cookies.get("token");
  if (!token) {
    return hasGuestCartItem(productId, color, size);
  }

  try {
    const cartItems = await fetchCartItemsShared(token);

    return cartItems.some(
      (item) =>
        item.productId._id === productId &&
        item.color === color &&
        item.size === size
    );
  } catch (error) {
    console.error("Error checking cart:", error);
    return false;
  }
}
