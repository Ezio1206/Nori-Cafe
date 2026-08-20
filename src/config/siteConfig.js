// ============================================================================
// NORI COFFEE — SITE CONFIGURATION
//
// This is the ONE place to edit the footer's contact info, social links, and
// shop location. Everything below is imported directly into
// `src/components/common/Footer.jsx` — change a value here and it updates
// everywhere it's used, no need to touch the Footer component itself.
// ============================================================================

/**
 * CONTACT INFORMATION — shown in the footer's "Contact Us" section.
 * Replace these with your real details whenever you're ready.
 */
export const CONTACT_INFO = {
  email: 'sokchhonchim@gmail.com',
  phone: '+855 99 263 387',
  // `phoneHref` is what actually gets dialled — keep it in international
  // format with no spaces/dashes (e.g. "+85512345678").
  phoneHref: '+85599263387',
  telegramHandle: '@sok_chhon',
  telegramUrl: 'https://t.me/sok_chhon',
};

/**
 * SOCIAL MEDIA LINKS — shown in the footer's "Follow Us" section.
 * These are PLACEHOLDER URLs — swap in your real page/channel/profile links.
 */
export const SOCIAL_LINKS = [
  { name: 'Facebook', url: 'https://www.facebook.com/share/19YVcy4vGk/?mibextid=wwXIfr' },
  { name: 'Instagram', url: 'https://www.instagram.com/nori_coffee_?igsh=dGFkYXJxZXA4ZXFt&igsi=dGFkYXJxZXA4ZXFt' },
  { name: 'Telegram', url: 'https://t.me/sok_chhon' },
  { name: 'GitHub', url: 'https://github.com/noricoffee' },
];

/**
 * SHOP LOCATION — used by "Find a store" in the footer to open Google Maps.
 * This is a PLACEHOLDER search link — replace it with your real shop's
 * Google Maps link (open the location on Google Maps, click "Share", and
 * copy the link it gives you).
 */
export const SHOP_LOCATION_URL = 'https://maps.app.goo.gl/bMLrPABRgfmb58qy5';
