export const metadata = { title: 'Contact — Bazaa' };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 py-6 text-[15px] leading-7 text-ink">
      <h1 className="font-serif text-2xl font-bold">Contact us</h1>
      <p>
        Questions, problems, or reports about a listing? Write to us and we
        will answer as soon as we can.
      </p>
      <p>
        Email: <strong>YOUR-EMAIL-HERE</strong>
      </p>
      <p>
        Telegram: <strong>YOUR-TELEGRAM-HERE</strong>
      </p>
    </div>
  );
}
