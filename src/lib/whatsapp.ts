const DEFAULT_WA_ADMIN = "6282331555431";

export function getWhatsAppNumber() {
  const raw = process.env.NEXT_PUBLIC_WA_ADMIN || DEFAULT_WA_ADMIN;
  return raw
    .trim()
    .replace(/^https?:\/\/wa\.me\//i, "")
    .replace(/^wa\.me\//i, "")
    .replace(/[^\d]/g, "");
}

export function buildWhatsAppLink(message: string) {
  const phone = getWhatsAppNumber();
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
