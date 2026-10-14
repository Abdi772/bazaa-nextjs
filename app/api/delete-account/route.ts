import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Permanently deletes the signed-in user's account and data.
// Runs only on the server: the service-role key is never sent to the browser.
export const dynamic = 'force-dynamic';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Turns ".../object/public/listing-images/abc.jpg" into "abc.jpg".
function storagePath(publicUrl: string, bucket: string): string | null {
  const marker = `/${bucket}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(publicUrl.slice(i + marker.length).split('?')[0]);
}

export async function POST(req: Request) {
  if (!serviceKey) {
    return NextResponse.json(
      { error: 'Account deletion is not configured on the server.' },
      { status: 500 },
    );
  }

  // 1. Who is asking? Verify the token the browser sent.
  const token = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!token) {
    return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
  }

  const asUser = createClient(url, anonKey);
  const { data: userData, error: userError } = await asUser.auth.getUser(token);
  const user = userData?.user;
  if (userError || !user) {
    return NextResponse.json({ error: 'Your session has expired. Please log in again.' }, { status: 401 });
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const uid = user.id;

  // 2. Remove listing photos from storage.
  const { data: listings } = await admin
    .from('listings')
    .select('id, image_url, image_urls')
    .eq('user_id', uid);

  const rows = (listings ?? []) as {
    id: number;
    image_url: string | null;
    image_urls: string[] | null;
  }[];

  const photoPaths = new Set<string>();
  for (const r of rows) {
    [r.image_url, ...(r.image_urls ?? [])].forEach((u) => {
      const p = u ? storagePath(u, 'listing-images') : null;
      if (p) photoPaths.add(p);
    });
  }
  if (photoPaths.size > 0) {
    await admin.storage.from('listing-images').remove(Array.from(photoPaths));
  }

  // 3. Remove the avatar.
  await admin.storage.from('avatars').remove([`${uid}/avatar.jpg`]);

  // 4. Remove the user's rows. Each step is best effort: tables that
  //    already cascade from auth.users simply have nothing left to delete.
  const ids = rows.map((r) => r.id);
  if (ids.length > 0) {
    await admin.from('listing_contacts').delete().in('listing_id', ids);
    await admin.from('favorites').delete().in('listing_id', ids);
    await admin.from('reports').delete().in('listing_id', ids);
  }
  await admin.from('listings').delete().eq('user_id', uid);
  await admin.from('favorites').delete().eq('user_id', uid);
  await admin.from('profiles').delete().eq('id', uid);

  // 5. Finally delete the login itself.
  const { error: deleteError } = await admin.auth.admin.deleteUser(uid);
  if (deleteError) {
    return NextResponse.json(
      { error: 'Could not delete the account: ' + deleteError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
