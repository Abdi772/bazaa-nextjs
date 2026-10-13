import { supabase } from './supabaseClient';

// Keeps the protected listing_contacts table in sync with the form.
// Tries an update first; if the listing has no contact row yet, inserts one.
export async function saveListingContact(
  listingId: number | string,
  phone: string,
  email: string,
) {
  const { data: updated, error: updateError } = await supabase
    .from('listing_contacts')
    .update({ phone, email })
    .eq('listing_id', listingId)
    .select('listing_id');

  if (!updateError && updated && updated.length > 0) return;

  const { error: insertError } = await supabase
    .from('listing_contacts')
    .insert({ listing_id: listingId, phone, email });

  if (insertError) {
    console.error('Could not save contact details:', insertError.message);
  }
}
