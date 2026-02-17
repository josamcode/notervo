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
            `${process.env.REACT_APP_API_URL}/wishlist/add/${productId}`,
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
            `${process.env.REACT_APP_API_URL}/wishlist/remove/${productId}`,
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

export async function checkProductInWishlist(productId) {
    const token = Cookies.get("token");
    if (!token) return hasGuestWishlistItem(productId);

    try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const wishlistItems = res.data.wishlist.items || [];

        return wishlistItems.some(
            (item) => item.productId._id === productId
        );
    } catch (error) {
        console.error("Error checking wishlist:", error);
        return false;
    }
}
