import { SiteSettings } from "@/types/site";

/**
 * Thin marquee strip above the navbar.
 *
 * Content comes from the "Announcement Bar" setting (one message per line).
 * When that is empty it falls back to the store's own contact details, so the
 * strip is never filled with copy the admin cannot edit.
 */
export default function AnnouncementBar({ settings }: { settings: SiteSettings }) {
  const configured = (
    Array.isArray(settings.announcementMessages) ? settings.announcementMessages : []
  )
    .map((message) => String(message || "").trim())
    .filter(Boolean);

  const fallback = [
    settings.contactPhone ? `Order on WhatsApp — ${settings.contactPhone}` : "",
    settings.contactAddress ? `Shipping from ${settings.contactAddress}` : "",
  ]
    .map((message) => message.trim())
    .filter(Boolean);

  const messages = configured.length ? configured : fallback;
  if (!messages.length) return null;

  // Duplicated once so the -50% marquee keyframe loops seamlessly.
  const track = [...messages, ...messages];

  return (
    /* z-0 keeps it painting *under* the sticky navbar as it scrolls away. */
    <div className="relative z-0 overflow-hidden bg-am-dark text-am-gold-bright">
      <div className="flex w-max animate-marquee whitespace-nowrap py-2">
        {track.map((message, index) => (
          <span
            key={`${message}-${index}`}
            className="flex items-center gap-6 px-6 text-[11px] sm:text-xs font-medium uppercase tracking-[0.18em]"
          >
            {message}
            <span aria-hidden className="text-am-gold-bright/40">
              &#9670;
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
