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
        Email:{' '}
        <a
          href="mailto:drabdibiya@gmail.com"
          className="font-bold underline"
        >
          drabdibiya@gmail.com
        </a>
      </p>
      <p>
        Telegram:{' '}
        <a
          href="https://t.me/kunisnidarb"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold underline"
        >
          @kunisnidarb
        </a>
      </p>
    </div>
  );
}
