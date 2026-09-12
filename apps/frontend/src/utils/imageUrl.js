export function resolveProductImageUrl(image) {
  if (!image || typeof image !== "string") {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${process.env.REACT_APP_API_URL}/public/images/products/${image}`;
}
