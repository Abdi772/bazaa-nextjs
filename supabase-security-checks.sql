 -- Jimma: Supabase security checks. Run in Supabase -> SQL Editor.
-- Run STEP 1 first and read the results before running anything else.

-- STEP 1: is seller contact info readable by everyone?
-- If these return phone/email values, the data is publicly exposed.
set role anon;
select id, phone, email from public.listings limit 3;
reset role;

-- STEP 2: what does listing_contacts look like (table or view) and who can read it?
select table_name, table_type
from information_schema.tables
where table_schema = 'public' and table_name = 'listing_contacts';

select policyname, cmd, roles, qual
from pg_policies
where schemaname = 'public' and tablename in ('listings', 'listing_contacts', 'admins', 'reports');

-- STEP 3 (only if listing_contacts is a TABLE with columns listing_id, phone, email):
-- copy any contact rows that are missing.
-- insert into public.listing_contacts (listing_id, phone, email)
-- select l.id, l.phone, l.email
-- from public.listings l
-- where not exists (select 1 from public.listing_contacts c where c.listing_id = l.id);

-- STEP 4: hide the columns from the public API.
-- The app now reads contacts from listing_contacts and no longer selects
-- phone/email from listings, so this will not break the site.
-- Inserts and updates still work (only SELECT is removed).
-- IMPORTANT: also make sure a trigger or the app keeps listing_contacts in
-- sync when a listing is posted or edited, or contact buttons will be empty.
-- revoke select (phone, email) on public.listings from anon, authenticated;

-- STEP 5: admin actions must be enforced by the database, not the page.
-- A normal user must NOT be able to delete other people's listings.
-- Check the policies from STEP 2: the delete policy on listings should be
-- "auth.uid() = user_id OR exists (select 1 from admins where user_id = auth.uid())".
