import type { MetadataRoute } from "next";
import { SHOP } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin", "/api/admin", "/api/auth", "/api/booking"],
      },
    ],
    sitemap: `${SHOP.url}/sitemap.xml`,
    host: SHOP.url,
  };
}
