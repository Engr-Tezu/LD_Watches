"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
  siteName?: string;
}

/**
 * Persistent contact shortcut. Appears after a short scroll so it never covers
 * the hero. Product detail pages carry their own sticky order bar on mobile, so
 * the button lifts above it there instead of overlapping.
 */
export default function FloatingWhatsApp({ whatsappNumber, siteName }: FloatingWhatsAppProps) {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const digits = (whatsappNumber || "").replace(/[^0-9]/g, "");
  const hasMobileOrderBar = /^\/products\/[^/]+$/.test(pathname);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!digits) return null;

  const message = encodeURIComponent(
    `Hello${siteName ? ` ${siteName}` : ""}! I'd like to know more about your products.`
  );

  return (
    <a
      href={`https://wa.me/${digits}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-am-whatsapp text-white shadow-lg shadow-black/25 transition-all duration-300 hover:bg-[#0f7f3d] sm:right-6 ${
        hasMobileOrderBar ? "bottom-24 lg:bottom-6" : "bottom-5 sm:bottom-6"
      } ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
