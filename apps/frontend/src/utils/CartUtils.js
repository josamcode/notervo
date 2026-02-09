import axios from "axios";
import Cookies from "js-cookie";

export async function addToCart(
  productId,
  quantity = 1,
  color = null,
  size = null
) {
  try {
    const token = Cookies.get("token");

    if (!token) {
      return { success: false, message: "User not authenticated." };
    }

    if (!color || !size) {
      try {
        const productRes = await axios.get(
          `${process.env.REACT_APP_API_URL}/products/${productId}`
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

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/cart/add/${productId}`,
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
      return { success: false, message: "User not authenticated." };
    }

    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/cart/remove/${productId}`,
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

export async function checkProductInCart(productId, color, size) {
  const token = Cookies.get("token");
  if (!token) return false;

  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const cartItems = res.data.cart?.items || [];

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