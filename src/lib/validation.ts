import { parsePhoneNumberFromString } from "libphonenumber-js";

export function normalizeUSPhone(input: string) {
  const trimmed = input.trim();
  const parsed = parsePhoneNumberFromString(trimmed, "US");
  if (!parsed || !parsed.isValid() || parsed.country !== "US") {
    return null;
  }
  return {
    e164: parsed.number,                 // +1XXXXXXXXXX
    national: parsed.formatNational(),   // (000) 000-0000
  };
}

export function cleanName(name: string) {
  const n = name.trim().replace(/\s+/g, " ");
  if (n.length < 2 || n.length > 60) return null;
  return n;
}
