import type { MetadataRoute } from "next";
import { SHOP } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SHOP.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
