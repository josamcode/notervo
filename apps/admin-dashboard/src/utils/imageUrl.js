export function resolveProductImageUrl(baseURL, image) {
  if (!image || typeof image !== "string") {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${baseURL}/public/images/products/${image}`;
}
