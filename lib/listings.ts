    import { createClient } from '@supabase/supabase-js';
import { CATEGORY_CONFIG } from './categories';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Public columns only. Phone and email are NOT here on purpose.
const PUBLIC_COLUMNS =
  'id, title, price, category, subcategory, brand, model, item_type, year, trim, model_number, bedrooms, bathrooms, size_sqm, furnished, negotiable, condition, region, location, description, specs, image_url, image_urls, user_id, created_at, status';

// Server-side client: every query below runs on Vercel's server, not in
// the visitor's browser. The database does the filtering (WHERE clauses),
// so only matching rows are ever sent over the network.
function serverClient() {
  return createClient(supabaseUrl, supabaseKey);
}

export type Listing = {
  id: number;
  title: string;
  price: number;
  category: string;
  subcategory: string | null;
  brand: string | null;
  model: string | null;
  item_type?: string | null;
  year?: number | null;
  trim?: string | null;
  model_number?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size_sqm?: number | null;
  furnished?: string | null;
  negotiable?: boolean | null;
  condition: string | null;
  region: string | null;
  location: string;
  description: string;
  specs?: { label: string; value: string }[] | null;
  email?: string;
  phone?: string | null;
  image_url: string | null;
  image_urls: string[] | null;
  user_id: string | null;
  created_at: string;
  status?: string | null;
};

export type ListingFilters = {
  query?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  itemType?: string;
  region?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  limit?: number;
  offset?: number;
};

export async function getListings(
  filters: ListingFilters = {}
): Promise<Listing[]> {
  const db = serverClient();

  const byPrice =
    filters.sort === 'price_asc' || filters.sort === 'price_desc';

  let q = db
    .from('listings')
    .select(PUBLIC_COLUMNS)
    .or('status.is.null,status.neq.sold')
    .order(byPrice ? 'price' : 'created_at', {
      ascending: filters.sort === 'price_asc',
    })
    .order('id', { ascending: false });

  if (filters.category) {
    q = q.eq('category', filters.category);
  }

  if (filters.subcategory) {
    q = q.eq('subcategory', filters.subcategory);
  }

  if (filters.brand) {
    q = q.eq('brand', filters.brand);
  }

  if (filters.model) {
    q = q.eq('model', filters.model);
  }

  if (filters.itemType) {
    q = q.eq('item_type', filters.itemType);
  }

  if (filters.region) {
    q = q.eq('region', filters.region);
  }

  if (filters.condition) {
    q = q.eq('condition', filters.condition);
  }

  if (filters.minPrice != null) {
    q = q.gte('price', filters.minPrice);
  }

  if (filters.maxPrice != null) {
    q = q.lte('price', filters.maxPrice);
  }

  // Search: every word must match somewhere (title, description, brand,
  // model, subcategory or category), in any order. So "14 iphone" finds
  // "iPhone 14 Pro Max". Characters that could break the filter are
  // removed, and we stop at 5 words.
  const words = (filters.query ?? '')
    .replace(/[,()%*\\_]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5);

  for (const w of words) {
    q = q.or(
      `title.ilike.%${w}%,description.ilike.%${w}%,brand.ilike.%${w}%,model.ilike.%${w}%,subcategory.ilike.%${w}%,category.ilike.%${w}%`
    );
  }

  if (filters.limit) {
    const from = filters.offset ?? 0;
    q = q.range(from, from + filters.limit - 1);
  }

  const { data, error } = await q;

  if (error) {
    console.error('getListings error:', error.message);
    return [];
  }

  return data as Listing[];
}

export async function getListingById(
  id: string | number
): Promise<Listing | null> {
  const db = serverClient();

  const { data, error } = await db
    .from('listings')
    .select(PUBLIC_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('getListingById error:', error.message);
    return null;
  }

  return data as Listing | null;
}

export async function getSimilarListings(
  category: string,
  excludeId: number,
  limit = 4
): Promise<Listing[]> {
  const db = serverClient();

  const { data, error } = await db
    .from('listings')
    .select(PUBLIC_COLUMNS)
    .eq('category', category)
    .or('status.is.null,status.neq.sold')
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) return [];

  return data as Listing[];
}

export async function getCategoryCounts(): Promise<
  Record<string, number>
> {
  const db = serverClient();
  const names = Object.keys(CATEGORY_CONFIG);

  // One cheap COUNT per category (no rows are downloaded).
  const results = await Promise.all(
    names.map((name) =>
      db
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('category', name)
        .or('status.is.null,status.neq.sold')
    )
  );

  const counts: Record<string, number> = {};

  names.forEach((name, i) => {
    counts[name] = results[i].count ?? 0;
  });

  return counts;
}

export async function getSubcategoryCounts(
  category: string
): Promise<Record<string, number>> {
  const db = serverClient();

  const { data, error } = await db
    .from('listings')
    .select('subcategory')
    .eq('category', category)
    .or('status.is.null,status.neq.sold');

  if (error || !data) return {};

  const counts: Record<string, number> = {};

  for (const row of data as {
    subcategory: string | null;
  }[]) {
    if (row.subcategory) {
      counts[row.subcategory] =
        (counts[row.subcategory] || 0) + 1;
    }
  }

  return counts;
}

// Builds a URL-safe slug for a listing, e.g.
// "iphone-15-pro-123".
export function listingSlug(
  listing: Pick<Listing, 'id' | 'title'>
): string {
  const words = listing.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join('-');

  return `${words}-${listing.id}`;
}

// Pulls the numeric id back out of a slug like
// "iphone-15-pro-123".
export function idFromSlug(
  slug: string
): number | null {
  const match = slug.match(/(\d+)$/);

  return match
    ? parseInt(match[1], 10)
    : null;
}

export async function getBrandCounts(
  category: string,
  subcategory: string
): Promise<Record<string, number>> {
  const db = serverClient();

  const { data, error } = await db
    .from('listings')
    .select('brand')
    .eq('category', category)
    .eq('subcategory', subcategory)
    .or('status.is.null,status.neq.sold');

  if (error || !data) return {};

  const counts: Record<string, number> = {};

  for (const row of data as {
    brand: string | null;
  }[]) {
    if (row.brand) {
      counts[row.brand] =
        (counts[row.brand] || 0) + 1;
    }
  }

  return counts;
                     }

// Home rows -----------------------------------------------------------

export type HomeListing = Listing & { hot?: boolean };

// Newest ads for the "Just listed" row (optionally inside one region).
export async function getJustListed(
  region = '',
  limit = 12
): Promise<Listing[]> {
  const db = serverClient();

  let q = db
    .from('listings')
    .select(PUBLIC_COLUMNS)
    .or('status.is.null,status.neq.sold')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(limit);

  if (region) q = q.eq('region', region);

  const { data, error } = await q;

  if (error) {
    console.error('getJustListed error:', error.message);
    return [];
  }

  return data as Listing[];
}

// Ads people are viewing, saving and chatting about (see supabase-trending.sql).
// Returns [] until the SQL has been run and there is some activity.
export async function getTrending(
  region = '',
  limit = 12
): Promise<Listing[]> {
  const db = serverClient();

  const { data: ranked, error } = await db.rpc('trending_listing_ids', {
    p_region: region || null,
    p_limit: limit,
  });

  if (error || !ranked || ranked.length === 0) {
    if (error) console.error('getTrending error:', error.message);
    return [];
  }

  const ids = (ranked as { listing_id: number }[]).map((r) => r.listing_id);

  const { data, error: err2 } = await db
    .from('listings')
    .select(PUBLIC_COLUMNS)
    .in('id', ids);

  if (err2 || !data) return [];

  const byId = new Map((data as Listing[]).map((l) => [Number(l.id), l]));

  return ids
    .map((id) => byId.get(Number(id)))
    .filter((l): l is Listing => !!l);
}

// Both home rows in one go.
// - Trending: real activity first. If fewer than `minTrending` ads have
//   activity (a young site), the row is topped up with the newest ads that
//   have photos, WITHOUT the fire badge, so nothing is falsely labelled hot.
// - Just listed: newest ads, never repeating an ad shown in Trending.
export async function getHomeRows(
  region = '',
  limit = 12,
  minTrending = 6
): Promise<{ trending: HomeListing[]; justListed: HomeListing[] }> {
  const [ranked, newest] = await Promise.all([
    getTrending(region, limit),
    getJustListed(region, limit * 3),
  ]);

  const trending: HomeListing[] = ranked.map((l) => ({ ...l, hot: true }));
  const used = new Set(trending.map((l) => Number(l.id)));

  if (trending.length < minTrending) {
    for (const l of newest) {
      if (trending.length >= minTrending) break;
      if (used.has(Number(l.id)) || !l.image_url) continue;
      trending.push({ ...l, hot: false });
      used.add(Number(l.id));
    }
  }

  const justListed = newest
    .filter((l) => !used.has(Number(l.id)))
    .slice(0, limit);

  return { trending, justListed };
}
