export function resolveProductImageUrl(image) {
  if (!image || typeof image !== "string") {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${import.meta.env.VITE_API_URL}/public/images/products/${image}`;
}

const CLOUDINARY_UPLOAD =
  /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

/**
 * Returns a width-limited, format-negotiated variant for image CDNs that support
 * URL transforms (Cloudinary, Unsplash). Other URLs are returned unchanged.
 */
export function optimizeImageUrl(url, width) {
  if (!url || !width) return url;

  const cloudinary = url.match(CLOUDINARY_UPLOAD);
  if (cloudinary) {
    const [, base, rest] = cloudinary;
    const firstSegment = rest.split("/")[0];
    const hasTransform =
      /[a-z]{1,3}_[^/]+/.test(firstSegment) && !/^v\d+$/.test(firstSegment);
    if (hasTransform) return url;
    return `${base}f_auto,q_auto,c_limit,w_${width}/${rest}`;
  }

  if (url.startsWith("https://images.unsplash.com/")) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set("w", String(width));
      parsed.searchParams.set("auto", "format");
      if (!parsed.searchParams.has("q")) parsed.searchParams.set("q", "75");
      return parsed.toString();
    } catch {
      return url;
    }
  }

  return url;
}

const SRCSET_WIDTHS = [360, 640, 960, 1400, 2000];

/** Builds a srcset when the host supports resizing; otherwise undefined. */
export function buildSrcSet(url, maxWidth = 2000) {
  if (!url) return undefined;
  const resized = optimizeImageUrl(url, 360);
  if (resized === url) return undefined;
  return SRCSET_WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${optimizeImageUrl(url, w)} ${w}w`)
    .join(", ");
}
