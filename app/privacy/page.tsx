export const metadata = { title: 'Privacy — Bazaa' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-6 text-[15px] leading-7 text-ink">
      <h1 className="font-serif text-2xl font-bold">Privacy</h1>
      <p>
        We collect only what the site needs: your email address, the listings
        and photos you post, your messages with other users, and the listings
        you save.
      </p>
      <p>
        Your listings are public. Your messages and saved items are private
        and only visible to you and the other person in the chat.
      </p>
      <p>We do not sell your personal data.</p>
      <p>
        Your data is stored with our service providers (Supabase and Vercel)
        so the site can work.
      </p>
      <p>
        You can ask us to delete your account and data at any time. See the
        contact page.
      </p>
    </div>
  );
}
