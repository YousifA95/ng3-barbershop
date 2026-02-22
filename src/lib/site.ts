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
  embeddedMap: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2935.5367274725427!2d-83.05580512256151!3d42.628780271169184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824dd862446df3f%3A0x1d39a558937dca23!2sNG3!5e0!3m2!1sen!2sus!4v1771800627596!5m2!1sen!2sus",
  phone: "(586) 884-4280",
  placeidDesk: "https://search.google.com/local/writereview?placeid=ChIJP99GJIbdJIgRI8p9k1ilOR0",
  placeidMobile: "https://maps.google.com/?cid=ChIJP99GJIbdJIgRI8p9k1ilOR0",
  booksy: "https://booksy.com/en-us/825980_ng3-barbershop_barber-shop_23451_utica#ba_s=seo",
  maps: "https://maps.app.goo.gl/Cfv5qyijnuFYV2D6A",
  instagram: "https://www.instagram.com/ng3barbershop/",
  facebook: "https://www.facebook.com/ng3barbershop/",
  tiktok: "https://www.tiktok.com/@ng3barbershop",
  hours: [
    ["Monday", "Closed"],
    ["Tuesday", "11 AM – 8 PM"],
    ["Wednesday", "11 AM – 8 PM"],
    ["Thursday", "11 AM – 8 PM"],
    ["Friday", "10 AM – 8 PM"],
    ["Saturday", "10 AM – 8 PM"],
    ["Sunday", "Closed"]
  ] as const,
} as const;

export const SERVICES: Service[] = [
  // Core
  { name: "Haircut", price: 30, minutes: 20, featured: true, category: "core" },
  { name: "Haircut & Beard", price: 50, minutes: 30, featured: true, category: "core" },
  { name: "Haircut, Beard & Eyebrow", price: 60, minutes: 40, featured: true, category: "core" },
  { name: "Kids", price: 25, minutes: 20, featured: true, category: "core" },
  { name: "", price: 80, minutes: 45, category: "core" },

  // Add-ons
  { name: "Beard Line-up", price: 20, minutes: 15, category: "addon" },
  { name: "Eyebrow Wax", price: 15, minutes: 10, category: "addon" },
  { name: "Hair Color", price: 30, minutes: 30, category: "addon" },
  { name: "Beard Dye", price: 15, minutes: 30, category: "addon" },
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
  { src: "/images/gallery-10.webp", alt: "High fade with design detail" },
  { src: "/images/gallery-11.webp", alt: "Low fade with design detail" },
  { src: "/images/gallery-12.webp", alt: "Pompadour fade with beard" },
  { src: "/images/gallery-13.webp", alt: "Textured top with clean fade" },
  { src: "/images/gallery-14.webp", alt: "Back taper fade finish" },
  { src: "/images/gallery-15.webp", alt: "Slick back fade profile" },
  { src: "/images/gallery-16.webp", alt: "Curly top with taper fade" },
  { src: "/images/gallery-17.webp", alt: "Modern textured crop fade" },
  { src: "/images/gallery-18.webp", alt: "Clean beard line-up and fade" },
  { src: "/images/gallery-19.webp", alt: "Back taper fade finish" },
  { src: "/images/gallery-20.webp", alt: "Slick back fade profile" },
  { src: "/images/gallery-21.webp", alt: "Curly top with taper fade" },
  { src: "/images/gallery-22.webp", alt: "Modern textured crop fade" },
  { src: "/images/gallery-23.webp", alt: "Clean beard line-up and fade" },
];
