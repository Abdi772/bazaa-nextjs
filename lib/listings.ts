 import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Public columns only. Phone and email are NOT here on purpose.
const PUBLIC_COLUMNS =
  'id, title, price, category, subcategory, brand, model, year, trim, model_number, bedrooms, bathrooms, size_sqm, furnished, condition, region, location, description, specs, image_url, image_urls, user_id, created_at, status';

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
  year?: number | null;
  trim?: string | null;
  model_number?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size_sqm?: number | null;
  furnished?: string | null;
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
  region?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  limit?: number;
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
    });

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

  // Remove characters that could break the search filter
  const safe = (filters.query ?? '')
    .replace(/[,()%*\\]/g, ' ')
    .trim();

  if (safe) {
    q = q.or(
      `title.ilike.%${safe}%,description.ilike.%${safe}%`
    );
  }

  if (filters.limit) {
    q = q.limit(filters.limit);
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

  const { data, error } = await db
    .from('listings')
    .select('category')
    .or('status.is.null,status.neq.sold');

  if (error || !data) return {};

  const counts: Record<string, number> = {};

  for (const row of data as { category: string }[]) {
    counts[row.category] =
      (counts[row.category] || 0) + 1;
  }

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
