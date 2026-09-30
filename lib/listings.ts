import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client: every query below runs on Vercel's server, not in
// the visitor's browser. The database does the filtering (WHERE clauses),
// so only matching rows are ever sent over the network. This is the fix
// for "downloads everything, then filters in the browser."
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
  condition: string | null;
  region: string | null;
  location: string;
  description: string;
  email: string;
  phone: string | null;
  image_url: string | null;
  image_urls: string[] | null;
  user_id: string | null;
  created_at: string;
};

export type ListingFilters = {
  query?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  region?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
};

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const db = serverClient();
  let q = db.from('listings').select('*').order('created_at', { ascending: false });

  if (filters.category) q = q.eq('category', filters.category);
  if (filters.subcategory) q = q.eq('subcategory', filters.subcategory);
  if (filters.brand) q = q.eq('brand', filters.brand);
  if (filters.region) q = q.eq('region', filters.region);
  if (filters.condition) q = q.eq('condition', filters.condition);
  if (filters.minPrice != null) q = q.gte('price', filters.minPrice);
  if (filters.maxPrice != null) q = q.lte('price', filters.maxPrice);
  if (filters.query) q = q.or(`title.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
  if (filters.limit) q = q.limit(filters.limit);

  const { data, error } = await q;
  if (error) {
    console.error('getListings error:', error.message);
    return [];
  }
  return data as Listing[];
}

export async function getListingById(id: string | number): Promise<Listing | null> {
  const db = serverClient();
  const { data, error } = await db.from('listings').select('*').eq('id', id).maybeSingle();
  if (error) {
    console.error('getListingById error:', error.message);
    return null;
  }
  return data as Listing | null;
}

export async function getSimilarListings(category: string, excludeId: number, limit = 4): Promise<Listing[]> {
  const db = serverClient();
  const { data, error } = await db
    .from('listings')
    .select('*')
    .eq('category', category)
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data as Listing[];
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const db = serverClient();
  const { data, error } = await db.from('listings').select('category');
  if (error || !data) return {};
  const counts: Record<string, number> = {};
  for (const row of data as { category: string }[]) {
    counts[row.category] = (counts[row.category] || 0) + 1;
  }
  return counts;
}

// Builds a URL-safe slug for a listing, e.g. "iphone-15-pro-123".
// The trailing id is what actually gets looked up — the words before it
// are just for readability and SEO, so they don't need to be unique.
export function listingSlug(listing: Pick<Listing, 'id' | 'title'>): string {
  const words = listing.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join('-');
  return `${words}-${listing.id}`;
}

// Pulls the numeric id back out of a slug like "iphone-15-pro-123".
export function idFromSlug(slug: string): number | null {
  const match = slug.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}
