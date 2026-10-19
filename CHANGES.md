  # Changes in this version

- manifest.ts: app icons now point to /categories/icon-192.png and icon-512.png (they were 404).
- .gitignore and .env.example added.
- package.json: next is "^14.2.5" so Vercel installs the latest 14.2.x security patches.
- Heartbeat: creates the profile once without overwriting the name, then only updates last_seen_at about once a minute while the tab is visible (the "online" badge lasts 3 minutes after the last ping).
- Home page: real Previous/Next pagination (24 per page). Model, condition and budget filters now run in the database. Before, they ran after loading 24 rows, so results could be missing.
- Category counts: 5 cheap COUNT queries instead of downloading every listing.
- Post form: validates title, price, location, phone and email; checks photo type and size; deletes uploaded photos if posting fails.
- Edit page: same phone/email checks; reads contact details from listing_contacts and no longer uses select('*').
- Admin page: removed `any` types.
- supabase-security-checks.sql: steps to verify and lock down phone/email exposure.

## Review fixes (October 15, 2026)

- lib/contacts.ts: saveListingContact now retries once and returns true/false instead of failing silently.
- Post page: if contact details cannot be saved, the new listing is removed and the seller sees a clear error, so no listing is left without Call/WhatsApp buttons.
- Edit page: shows an error if the contact details were not saved.
- ContactButtons: emoji icons replaced with SVG icons.
- Removed tsconfig.tsbuildinfo from the project.

## Polish pass (October 19, 2026)

- Hero slideshow and listing thumbnails (my-listings, messages) now use next/image: faster loads, no layout jump.
- Wider desktop layout (max-w-6xl) and 5 columns of listings on extra-large screens.
- SEO: Twitter cards, canonical URL, Product structured data (JSON-LD) on listing pages, default share image (app/opengraph-image.tsx).
- New footer with brand, tagline and dynamic year.
- Removed tsconfig.tsbuildinfo.
- 
