export function resolveProductImageUrl(image) {
  if (!image || typeof image !== "string") {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${import.meta.env.VITE_API_URL}/public/images/products/${image}`;
}
