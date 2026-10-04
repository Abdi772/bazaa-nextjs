export const metadata = { title: 'Safety tips — Bazaa' };

const tips = [
  'Meet in a public, busy place and go during the day.',
  'Bring a friend if you can, and tell someone where you are going.',
  'Check the item carefully before you pay. Test phones, electronics, and vehicles.',
  'Never send money in advance, including "deposits" or "delivery fees".',
  'Be careful with prices that are far too low. If it sounds too good to be true, it usually is.',
  'Do not share your passwords or codes with anyone, even if they say they are from Bazaa.',
  'Use the report button on any listing that looks fake or suspicious.',
];

export default function SafetyPage() {
  return (
    <div className="mx-auto max-w-2xl py-6">
      <h1 className="mb-4 font-serif text-2xl font-bold text-ink">
        Safety tips for buyers and sellers
      </h1>
      <ul className="list-disc space-y-3 pl-5 text-[15px] leading-7 text-ink">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}
