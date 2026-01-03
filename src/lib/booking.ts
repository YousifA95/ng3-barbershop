export const TZ = "America/Detroit";

export type Barber = { id: string; name: string };
export const BARBERS: Barber[] = [
  { id: "b_nameer", name: "Nameer" },
  { id: "b_norman", name: "Norman" },
  { id: "b_nino", name: "Nino" },
];

export type Service = { name: string; price: number; minutes: number };
export const SERVICES: Service[] = [
  { name: "Haircut", price: 30, minutes: 20 },
  { name: "Haircut & Beard", price: 50, minutes: 30 },
  { name: "Haircut, Beard & Eyebrow", price: 60, minutes: 40 },
  { name: "Haircut & Eyebrow", price: 45, minutes: 30 },
  { name: "Haircut & Hair Dye", price: 60, minutes: 30 },
  { name: "Beard Trim", price: 20, minutes: 15 },
  { name: "Eyebrow Wax or Blade", price: 15, minutes: 10 },
  { name: "Beard & Eyebrow", price: 35, minutes: 30 },
  { name: "Beard & Beard Dye", price: 35, minutes: 30 },
];

export const SLOT_MINUTES = 15;
export const LEAD_TIME_MINUTES = 120;

// Shop hours (ET). 0=Sun ... 6=Sat
export const HOURS_BY_WEEKDAY: Record<number, { open: string; close: string } | null> = {
  0: { open: "11:00", close: "18:00" },  // Sunday
  1: null,                               // Monday closed
  2: { open: "11:00", close: "20:30" },  // Tuesday
  3: { open: "11:00", close: "20:30" },  // Wednesday
  4: { open: "11:00", close: "20:30" },  // Thursday
  5: { open: "11:00", close: "20:30" },  // Friday
  6: { open: "11:00", close: "20:30" },  // Saturday
};

export function ceilToSlot(minutes: number) {
  return Math.ceil(minutes / SLOT_MINUTES) * SLOT_MINUTES;
}
