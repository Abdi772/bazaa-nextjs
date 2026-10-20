import Link from 'next/link';
import Image from 'next/image';
import { listingSlug } from '@/lib/listings';
import { CATEGORY_CONFIG } from '@/lib/categories';
import FavoriteButton from './FavoriteButton';

type RowListing = {
  id: number;
  title: string;
  price: number;
  category: string;
  location: string | null;
  image_url: string | null;
  created_at: string;
  // Trending only: true when the ad ranked from real activity.
  hot?: boolean;
};

function ago(iso: string): string {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}

// A horizontally scrolling row of small ad cards (Trending / Just listed).
export default function ListingRow({
  title,
  subtitle,
  icon,
  items,
  badge,
}: {
  title: string;
  subtitle?: string;
  icon?: string;
  items: RowListing[];
  badge: 'trending' | 'new';
}) {
  if (items.length === 0) return null;

  return (
    <section className="mb-6" aria-label={title}>
      <div className="mb-3">
        <h2 className="bazaa-title flex items-center gap-2 text-xl sm:text-2xl">
          {icon && <span aria-hidden="true">{icon}</span>}
          {title}
        </h2>
        {subtitle && <p className="bazaa-muted mt-1">{subtitle}</p>}
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-5 sm:px-5 [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-3">
          {items.map((l) => {
            const showFire = badge === 'trending' && l.hot !== false;

            return (
              <div
                key={l.id}
                className="group relative flex w-[9.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-line bazaa-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-soft active:scale-[0.98] sm:w-48"
              >
                <Link
                  href={`/products/${listingSlug(l)}`}
                  className="flex flex-1 flex-col"
                >
                  <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bazaa-image-bg">
                    {l.image_url ? (
                      <Image
                        src={l.image_url}
                        alt={l.title}
                        fill
                        sizes="(max-width: 640px) 152px, 192px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span className="text-3xl opacity-70">
                        {CATEGORY_CONFIG[l.category]?.icon || '📦'}
                      </span>
                    )}

                    <span
                      className={`absolute bottom-1.5 left-1.5 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold leading-4 shadow-card ${
                        showFire
                          ? 'bg-amber text-black'
                          : 'bg-surface/95 text-fg'
                      }`}
                    >
                      {showFire ? '🔥 Trending' : ago(l.created_at)}
                    </span>
                  </div>

                  <div className="flex flex-col p-2.5">
                    <div className="font-serif text-base font-bold leading-5 tracking-tight bazaa-price">
                      ETB {Number(l.price).toLocaleString()}
                    </div>
                    <div className="mt-0.5 line-clamp-2 min-h-[2.25rem] text-xs font-medium leading-[18px] bazaa-text">
                      {l.title}
                    </div>
                    {l.location && (
                      <div className="mt-1 truncate text-[11px] leading-4 bazaa-muted-text">
                        {l.location}
                      </div>
                    )}
                  </div>
                </Link>

                {/* Sibling of the link (not inside it), so tapping the heart never opens the ad. */}
                <div className="absolute right-1.5 top-1.5 z-20">
                  <FavoriteButton listingId={l.id} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
