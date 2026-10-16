import { describe, it, expect } from "vitest";
import { buildSrcSet, optimizeImageUrl } from "./imageUrl";
import { escapeSearchTerm } from "./catalog";

describe("responsive product images", () => {
  const cloudinary =
    "https://res.cloudinary.com/notervo/image/upload/v1712345678/products/linen.jpg";

  it("adds a width-limited, auto-format transform to Cloudinary uploads", () => {
    expect(optimizeImageUrl(cloudinary, 640)).toBe(
      "https://res.cloudinary.com/notervo/image/upload/f_auto,q_auto,c_limit,w_640/v1712345678/products/linen.jpg"
    );
  });

  it("leaves URLs that already carry a Cloudinary transform untouched", () => {
    const transformed =
      "https://res.cloudinary.com/notervo/image/upload/w_300,h_300/v1/products/linen.jpg";
    expect(optimizeImageUrl(transformed, 640)).toBe(transformed);
  });

  it("resizes Unsplash images and leaves other hosts alone", () => {
    const resized = new URL(
      optimizeImageUrl("https://images.unsplash.com/photo-1?w=1400&q=80", 360)
    );
    expect(resized.searchParams.get("w")).toBe("360");
    expect(resized.searchParams.get("q")).toBe("80");
    expect(optimizeImageUrl("https://cdn.example.com/a.jpg", 360)).toBe(
      "https://cdn.example.com/a.jpg"
    );
  });

  it("only builds a srcset for hosts that can resize", () => {
    expect(buildSrcSet(cloudinary)).toContain("w_360/");
    expect(buildSrcSet(cloudinary).split(", ")).toHaveLength(5);
    expect(buildSrcSet("https://cdn.example.com/a.jpg")).toBeUndefined();
    expect(buildSrcSet("")).toBeUndefined();
  });
});

describe("search terms", () => {
  it("escapes regular-expression syntax so the API matches literally", () => {
    expect(escapeSearchTerm("  A5 (dotted)+ ")).toBe("A5 \\(dotted\\)\\+");
    expect(new RegExp(escapeSearchTerm("[grid]*")).test("[grid]*")).toBe(true);
  });
});
