export const SHOP = {
  name: "NG3 Barbershop",
  address: "45553 Mound Rd, Shelby Township, MI 48317",
  phone: "(586) 884-4280",
  maps: "https://maps.app.goo.gl/Cfv5qyijnuFYV2D6A",
  hours: [
    ["Wednesday", "11 AM – 8:30 PM"],
    ["Thursday", "11 AM – 8:30 PM"],
    ["Friday", "11 AM – 8:30 PM"],
    ["Saturday", "11 AM – 8:30 PM"],
    ["Sunday", "11 AM – 6 PM"],
    ["Monday", "Closed"],
    ["Tuesday", "11 AM – 8:30 PM"],
  ] as const,
};

export type Service = {
  name: string;
  price: number;
  minutes: number;
  featured?: boolean;
};

export const SERVICES: Service[] = [
  { name: "Haircut", price: 30, minutes: 20, featured: true },
  { name: "Beard Trim", price: 20, minutes: 15 },
  { name: "Haircut & Beard", price: 50, minutes: 30, featured: true },
  { name: "Eyebrow Wax or Blade", price: 15, minutes: 10 },
  { name: "Haircut & Eyebrow", price: 45, minutes: 30 },
  { name: "Beard & Eyebrow", price: 35, minutes: 30 },
  { name: "Haircut, Beard & Eyebrow", price: 60, minutes: 40, featured: true },
  { name: "Haircut & Hair Dye", price: 60, minutes: 30 },
  { name: "Beard & Beard Dye", price: 35, minutes: 30 },
];

export const GALLERY = [
  { src: "/images/gallery-01.webp", alt: "Low fade with design detail" },
  { src: "/images/gallery-02.webp", alt: "Low fade with design detail" },
  { src: "/images/gallery-03.webp", alt: "Pompadour fade with beard" },
  { src: "/images/gallery-04.webp", alt: "Textured top with clean fade" },
  { src: "/images/gallery-05.webp", alt: "Back taper fade finish" },
  { src: "/images/gallery-06.webp", alt: "Slick back fade profile" },
  { src: "/images/gallery-07.webp", alt: "Curly top with taper fade" },
  { src: "/images/gallery-08.webp", alt: "Modern textured crop fade" },
  { src: "/images/gallery-09.webp", alt: "Clean beard line-up and fade" },
];
