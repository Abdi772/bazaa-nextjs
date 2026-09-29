import Link from 'next/link';

const categories = [
  'Electronics',
  'Vehicles',
  'Property',
  'Fashion',
  'Home & Garden',
  'Jobs',
  'Services',
  'Other',
];

export default function HomePage() {
  return (
    <div className="space-y-10">

      {/* Hero */}
      <section className="pt-8">
        <p className="text-sm font-medium text-amber">
          Ethiopia's marketplace
        </p>

        <h1 className="mt-3 max-w-2xl font-serif text-4xl font-bold leading-tight sm:text-5xl">
          Buy and sell anything, right in your area.
        </h1>

        <p className="mt-4 max-w-xl text-muted">
          Discover products from people and businesses around you.
        </p>

        {/* Search */}
        <div className="mt-6 flex max-w-2xl gap-2">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="min-w-0 flex-1 rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-amber"
          />

          <button className="rounded-xl bg-ink px-5 py-3 font-semibold text-paper">
            Search
          </button>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold">
            Browse categories
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/categories/${category.toLowerCase().replaceAll(' ', '-')}`}
              className="rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5"
            >
              <span className="font-medium">{category}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section>
        <h2 className="font-serif text-2xl font-bold">
          Latest listings
        </h2>

        <div className="mt-4 rounded-2xl border border-line bg-white p-8 text-center">
          <p className="text-muted">
            Products from Supabase will appear here.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-ink p-8 text-paper">
        <h2 className="font-serif text-3xl font-bold">
          Have something to sell?
        </h2>

        <p className="mt-2 text-paper/70">
          Create a listing and reach buyers in your area.
        </p>

        <button className="mt-5 rounded-xl bg-amber px-5 py-3 font-semibold text-ink">
          Post an item
        </button>
      </section>

    </div>
  );
}
