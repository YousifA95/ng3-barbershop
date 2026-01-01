import type { MetadataRoute } from "next";
import { SHOP } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Single-page site: keep sitemap minimal and accurate.
  return [
    {
      url: SHOP.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
