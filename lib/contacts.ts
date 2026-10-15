 import { supabase } from './supabaseClient';

// Keeps the protected listing_contacts table in sync with the form.
// Tries an update first; if the listing has no contact row yet, inserts one.
// Returns true when the contact details were saved, false when they were not,
// so the page can tell the seller instead of failing silently.
async function trySave(
  listingId: number | string,
  phone: string,
  email: string,
): Promise<boolean> {
  const { data: updated, error: updateError } = await supabase
    .from('listing_contacts')
    .update({ phone, email })
    .eq('listing_id', listingId)
    .select('listing_id');

  if (!updateError && updated && updated.length > 0) return true;

  const { error: insertError } = await supabase
    .from('listing_contacts')
    .insert({ listing_id: listingId, phone, email });

  if (insertError) {
    console.error('Could not save contact details:', insertError.message);
    return false;
  }
  return true;
}

export async function saveListingContact(
  listingId: number | string,
  phone: string,
  email: string,
): Promise<boolean> {
  // One retry covers a brief network drop on mobile data.
  if (await trySave(listingId, phone, email)) return true;
  return trySave(listingId, phone, email);
}
