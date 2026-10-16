import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { removeFromWishlist } from "../utils/WishlistUtils";
import { getGuestWishlistItems } from "../utils/guestWishlist";
import { showError, showSuccess } from "../utils/Toast";
import { getDiscountedPrice } from "../utils/pricing";
import SmartImage from "../components/ui/SmartImage";
import { EmptyState, PageHeader, Price } from "../components/ui/Primitives";
import { ArrowRight, Heart, Spinner, Trash } from "../components/ui/Icons";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          const guestIds = getGuestWishlistItems();
          const guestItems = await Promise.all(
            guestIds.map(async (productId, index) => {
              try {
                const productRes = await axios.get(
                  `${import.meta.env.VITE_API_URL}/products/${productId}`
                );
                return {
                  _id: `guest-${productId}-${index}`,
                  productId: { _id: productId },
                  productDetails: productRes.data,
                };
              } catch (err) {
                console.error(`Failed to load product ${productId}`, err);
                return null;
              }
            })
          );

          setWishlist({
            items: guestItems.filter(Boolean),
          });
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/wishlist`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const wishlistData = response.data.wishlist;

        const itemsWithDetails = await Promise.all(
          wishlistData.items.map(async (item) => {
            try {
              const productRes = await axios.get(
                `${import.meta.env.VITE_API_URL}/products/${item.productId._id}`
              );
              return { ...item, productDetails: productRes.data };
            } catch (err) {
              console.error(
                `Failed to load product ${item.productId._id}`,
                err
              );
              return { ...item, productDetails: null };
            }
          })
        );

        setWishlist({ ...wishlistData, items: itemsWithDetails });
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setWishlist({ items: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    const result = await removeFromWishlist(productId);
    if (result.success) {
      setWishlist((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.productId._id !== productId),
      }));
      showSuccess("Removed from wishlist");
    } else {
      showError(result.message);
    }
    setRemovingId(null);
  };

  /* ───── Loading ───── */
  if (loading) {
    return (
      <div aria-busy="true">
        <div className="container-x pb-6 pt-4 md:border-b md:border-ink-line md:pb-8 md:pt-12">
          <div className="skeleton h-9 w-40 md:h-14 md:w-72" />
        </div>
        <div className="grid gap-3 px-4 md:grid-cols-4 md:gap-0 md:px-0">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-2xl bg-cream-deep p-3 md:block md:rounded-none md:border-b md:border-r md:border-ink-line md:bg-transparent md:p-0"
            >
              <div className="skeleton h-24 w-24 shrink-0 rounded-xl md:aspect-[11/10] md:h-auto md:w-full md:rounded-none" />
              <div className="flex-1 space-y-2 pt-1 md:p-4">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ───── Empty ───── */
  if (!wishlist || wishlist.items.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is empty"
        description="Save notebooks you love and come back to them any time."
        actionLabel="Browse the shop"
        onAction={() => navigate("/shop")}
      />
    );
  }

  const count = wishlist.items.length;

  return (
    <main className="pb-10 md:pb-24">
      <PageHeader
        eyebrow="Saved"
        title="Wishlist"
        description={`${count} ${count === 1 ? "notebook" : "notebooks"} saved`}
        actions={
          <Link
            to="/shop"
            className="link-underline hidden items-center gap-2 text-[14px] uppercase md:flex"
          >
            Continue shopping <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <ul className="grid gap-3 px-4 md:grid-cols-3 md:gap-0 md:px-0 lg:grid-cols-4">
        {wishlist.items.map((item) => {
          const product = item.productDetails || item.productId;
          if (!product) return null;
          const { originalPrice, finalPrice } = getDiscountedPrice(product);
          const isRemoving = removingId === product._id;
          const isAvailable = product.inStock && product.stockQuantity > 0;

          return (
            <li
              key={item._id}
              className="group relative flex gap-3.5 rounded-2xl bg-cream-deep p-3 md:flex-col md:gap-0 md:rounded-none md:border-b md:border-r md:border-ink-line md:bg-transparent md:p-0 md:[&:nth-child(3n)]:border-r-0 lg:[&:nth-child(3n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
            >
              <Link
                to={`/products/${product._id}`}
                className="relative h-[112px] w-[96px] shrink-0 overflow-hidden rounded-xl bg-cream-dim md:aspect-[11/10] md:h-auto md:w-full md:rounded-none"
                aria-label={product.title}
              >
                <SmartImage
                  src={product.images?.[0]}
                  alt=""
                  width={900}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100px"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.03]"
                />
                {!isAvailable && (
                  <span className="badge absolute left-2 top-2 bg-cream/90 text-ink md:left-4 md:top-4">
                    Sold out
                  </span>
                )}
              </Link>

              <div className="flex min-w-0 flex-1 flex-col md:px-4 md:pb-5 md:pt-4">
                {product.brand && (
                  <p className="text-[11px] uppercase text-muted">
                    {product.brand}
                  </p>
                )}
                <h2 className="mt-0.5 font-sans text-[15px] leading-snug tracking-normal md:text-[14px] md:uppercase">
                  <Link
                    to={`/products/${product._id}`}
                    className="line-clamp-2 hover:underline"
                  >
                    {product.title}
                  </Link>
                </h2>
                <Price
                  value={finalPrice}
                  compareAt={originalPrice}
                  className="mt-1.5 text-[14px]"
                  compareClassName="text-[12px] md:text-[14px]"
                />

                <div className="mt-auto flex items-center gap-2 pt-3 md:pt-5">
                  <Link
                    to={`/products/${product._id}`}
                    className="btn btn-solid btn-sm h-10 flex-1 md:flex-none"
                  >
                    <span>View product</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleRemove(product._id)}
                    disabled={isRemoving}
                    aria-label={`Remove ${product.title} from wishlist`}
                    className="icon-btn h-10 w-10 shrink-0 rounded-full border border-ink/25 text-ink hover:border-ink disabled:opacity-50"
                  >
                    {isRemoving ? (
                      <Spinner className="h-4 w-4" />
                    ) : (
                      <Trash className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
