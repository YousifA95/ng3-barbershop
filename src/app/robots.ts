import type { MetadataRoute } from "next";
import { SHOP } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SHOP.url}/sitemap.xml`,
    host: SHOP.url,
  };
}
