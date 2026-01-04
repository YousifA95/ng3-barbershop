import type { MetadataRoute } from "next";
import { SHOP } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SHOP.url;

  const routes = [
    "",
    "/book",
  ];

  return routes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
