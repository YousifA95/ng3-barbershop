export type ServiceCategory = "core" | "addon";

export type Service = {
  name: string;
  price: number;
  minutes: number;
  /**
   * Visual emphasis inside the Core Services card (Signature tier).
   */
  featured?: boolean;
  /**
   * Drives the Core vs Add-ons split in the Services section.
   */
  category?: ServiceCategory;
};

export type GalleryItem = {
  src: string;
  alt: string;
};

export const SHOP = {
  name: "NG3 Barbershop",
  url: "https://ng3barbershop.com",
  address: "45553 Mound Rd, Shelby Township, MI 48317",
  phone: "(586) 884-4280",
  maps: "https://maps.app.goo.gl/Cfv5qyijnuFYV2D6A",
  instagram: "https://www.instagram.com/ng3barbershop/",
  facebook: "https://www.facebook.com/ng3barbershop/",
  hours: [
    ["Wednesday", "11 AM – 8:30 PM"],
    ["Thursday", "11 AM – 8:30 PM"],
    ["Friday", "11 AM – 8:30 PM"],
    ["Saturday", "11 AM – 8:30 PM"],
    ["Sunday", "11 AM – 6 PM"],
    ["Monday", "Closed"],
    ["Tuesday", "11 AM – 8:30 PM"],
  ] as const,
} as const;

export const SERVICES: Service[] = [
  // Core
  { name: "Haircut", price: 30, minutes: 20, featured: true, category: "core" },
  { name: "Haircut & Beard", price: 50, minutes: 30, featured: true, category: "core" },
  { name: "Haircut, Beard & Eyebrow", price: 60, minutes: 40, featured: true, category: "core" },
  { name: "Haircut & Eyebrow", price: 45, minutes: 30, category: "core" },
  { name: "Haircut & Hair Dye", price: 60, minutes: 30, category: "core" },

  // Add-ons
  { name: "Beard Trim", price: 20, minutes: 15, category: "addon" },
  { name: "Eyebrow Wax or Blade", price: 15, minutes: 10, category: "addon" },
  { name: "Beard & Eyebrow", price: 35, minutes: 30, category: "addon" },
  { name: "Beard & Beard Dye", price: 35, minutes: 30, category: "addon" },
];

export const GALLERY: GalleryItem[] = [
  { src: "/images/gallery-01.webp", alt: "High fade with design detail" },
  { src: "/images/gallery-02.webp", alt: "Low fade with design detail" },
  { src: "/images/gallery-03.webp", alt: "Pompadour fade with beard" },
  { src: "/images/gallery-04.webp", alt: "Textured top with clean fade" },
  { src: "/images/gallery-05.webp", alt: "Back taper fade finish" },
  { src: "/images/gallery-06.webp", alt: "Slick back fade profile" },
  { src: "/images/gallery-07.webp", alt: "Curly top with taper fade" },
  { src: "/images/gallery-08.webp", alt: "Modern textured crop fade" },
  { src: "/images/gallery-09.webp", alt: "Clean beard line-up and fade" },
];
