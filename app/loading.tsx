export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="animate-pulse">
      <div className="mb-6 h-8 w-48 rounded-bazaa bazaa-image-bg" />

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-card border border-line bazaa-surface"
          >
            <div className="aspect-[4/3] bazaa-image-bg" />
            <div className="space-y-2 p-3">
              <div className="h-4 w-1/2 rounded bazaa-image-bg" />
              <div className="h-3 w-full rounded bazaa-image-bg" />
              <div className="h-3 w-2/3 rounded bazaa-image-bg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
