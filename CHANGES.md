# Changes in this version

- manifest.ts: app icons now point to /categories/icon-192.png and icon-512.png (they were 404).
- .gitignore and .env.example added.
- package.json: next is "^14.2.5" so Vercel installs the latest 14.2.x security patches.
- Heartbeat: creates the profile once without overwriting the name, then only updates last_seen_at every 3 minutes while the tab is visible.
- Home page: real Previous/Next pagination (24 per page). Model, condition and budget filters now run in the database. Before, they ran after loading 24 rows, so results could be missing.
- Category counts: 5 cheap COUNT queries instead of downloading every listing.
- Post form: validates title, price, location, phone and email; checks photo type and size; deletes uploaded photos if posting fails.
- Edit page: same phone/email checks; reads contact details from listing_contacts and no longer uses select('*').
- Admin page: removed `any` types.
- supabase-security-checks.sql: steps to verify and lock down phone/email exposure.
