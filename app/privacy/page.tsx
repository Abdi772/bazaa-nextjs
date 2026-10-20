export const metadata = { title: 'Privacy — Jimma' };

const h2 = 'pt-2 font-serif text-lg font-bold';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-6 text-[15px] leading-7">
      <h1 className="font-serif text-2xl font-bold">Privacy</h1>
      <p>
        This page explains what Jimma collects, why, who can see it, and how
        you can delete it. Last updated: October 2026.
      </p>

      <h2 className={h2}>What we collect</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <b>Account:</b> your email address, your name, and your profile
          photo if you add one.
        </li>
        <li>
          <b>Listings:</b> the title, price, description, photos, location,
          and the phone number and email you enter when you post.
        </li>
        <li>
          <b>Activity:</b> your messages, saved listings, reviews, and
          reports you send.
        </li>
        <li>
          <b>Online status:</b> the time you were last active, so buyers can
          see if a seller is online.
        </li>
        <li>
          <b>Verification (only if you ask for the blue check):</b> your full
          name, a photo of your ID, and optionally a photo of your shop.
        </li>
      </ul>

      <h2 className={h2}>Who can see it</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <b>Public:</b> your listings, photos, seller name, rating, verified
          badge, and online status.
        </li>
        <li>
          <b>Logged-in users only:</b> the phone number and email on your
          listing. Visitors who are not logged in cannot see them.
        </li>
        <li>
          <b>Private:</b> your messages (only you and the other person) and
          your saved listings (only you).
        </li>
        <li>
          <b>Verification documents:</b> only the Jimma team can see your ID
          photo. We use it only to check your name.
        </li>
      </ul>

      <h2 className={h2}>ID photos</h2>
      <p>
        Your ID photo is used only to decide your verification request. We
        delete the photos after we approve or reject the request. If you
        delete your account, any verification photos still stored are deleted
        too.
      </p>

      <h2 className={h2}>What we do not do</h2>
      <p>
        We do not sell your personal data, and we do not show you ads based on
        your data.
      </p>

      <h2 className={h2}>Where your data is stored</h2>
      <p>
        Your data is stored with our service providers, Supabase (database and
        file storage) and Vercel (website hosting), so the site can work.
        These providers may store data on servers outside Ethiopia.
      </p>

      <h2 className={h2}>Your choices</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>You can edit or delete your listings at any time.</li>
        <li>
          You can delete your account in Settings. This removes your profile
          and the data linked to it.
        </li>
        <li>
          You can also ask us to delete your data. See the contact page.
        </li>
      </ul>

      <h2 className={h2}>Safety</h2>
      <p>
        Do not share passwords or payment codes with anyone in chat. Jimma
        staff will never ask for your password.
      </p>

      <h2 className={h2}>Changes and contact</h2>
      <p>
        We may update this page. The date at the top shows the latest
        version. Questions about your data? Use the contact page.
      </p>
    </div>
  );
}
