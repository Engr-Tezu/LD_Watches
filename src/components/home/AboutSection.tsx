import { Gem, Sparkles, ShieldCheck } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { AboutBlock, SiteSettings } from "@/types/site";

type AboutRenderItem =
  | { kind: "heading" | "paragraph"; block: AboutBlock; key: string }
  | { kind: "cards"; cards: AboutBlock[]; key: string };

const CARD_ICONS = [Sparkles, Gem, ShieldCheck];

/** Runs of consecutive `card` blocks render as one grid row. */
function groupAboutBlocks(blocks: AboutBlock[]): AboutRenderItem[] {
  const items: AboutRenderItem[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    if (block.type === "card") {
      const cards: AboutBlock[] = [];
      while (i < blocks.length && blocks[i].type === "card") {
        cards.push(blocks[i]);
        i += 1;
      }
      items.push({ kind: "cards", cards, key: `cards-${items.length}` });
      continue;
    }

    items.push({ kind: block.type, block, key: `${block.type}-${i}` });
    i += 1;
  }

  return items;
}

export default function AboutSection({ settings }: { settings: SiteSettings }) {
  const items = groupAboutBlocks(
    Array.isArray(settings.aboutBlocks) ? settings.aboutBlocks : []
  );

  if (!items.length && !settings.aboutTagline) return null;

  const [before, after] = settings.aboutTitle.includes(settings.siteName)
    ? settings.aboutTitle.split(settings.siteName)
    : [settings.aboutTitle, null];

  return (
    <section id="about" className="border-t border-am-line bg-am-bg-alt py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="mb-8 text-center">
            <h2 className="section-heading">
              {after === null ? (
                settings.aboutTitle
              ) : (
                <>
                  {before || "Welcome to "}
                  <span className="text-gradient-gold">{settings.siteName}</span>
                  {after}
                </>
              )}
            </h2>
            <div className="rule-gold mx-auto mt-4 h-px w-16" aria-hidden />
          </div>
        </FadeIn>

        <div className="space-y-6 sm:space-y-8">
          {items.map((item, itemIndex) => {
            if (item.kind === "cards") {
              return (
                <div
                  key={item.key}
                  className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  {item.cards.map((card, cardIndex) => {
                    const Icon = CARD_ICONS[cardIndex % CARD_ICONS.length];
                    return (
                      <FadeIn key={`${item.key}-${cardIndex}`} delay={cardIndex * 0.1}>
                        <div className="flex h-full flex-col items-center rounded-2xl border border-am-line bg-am-card p-6 text-center sm:p-7 gold-glow-hover">
                          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-am-gold-tint text-am-gold">
                            <Icon className="h-6 w-6" />
                          </span>
                          <h3 className="mb-3 font-[family-name:var(--font-display)] text-lg font-semibold text-am-ink">
                            {card.text}
                          </h3>
                          {card.description && (
                            <p className="max-w-sm flex-1 text-sm leading-relaxed text-am-ink-soft sm:text-base">
                              {card.description}
                            </p>
                          )}
                        </div>
                      </FadeIn>
                    );
                  })}
                </div>
              );
            }

            if (item.kind === "heading") {
              return (
                <FadeIn key={item.key} delay={Math.min(itemIndex * 0.05, 0.3)}>
                  <h3 className="mx-auto max-w-3xl text-center font-[family-name:var(--font-display)] text-xl font-semibold text-am-gold-deep sm:text-2xl">
                    {item.block.text}
                  </h3>
                </FadeIn>
              );
            }

            return (
              <FadeIn key={item.key} delay={Math.min(itemIndex * 0.05, 0.3)}>
                <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-am-ink-soft sm:text-base">
                  {item.block.text}
                </p>
              </FadeIn>
            );
          })}
        </div>

        {settings.aboutTagline && (
          <FadeIn delay={0.3}>
            <p className="mt-8 text-center font-[family-name:var(--font-display)] text-base font-semibold text-am-gold-deep sm:mt-10 sm:text-lg">
              {settings.aboutTagline}
            </p>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
