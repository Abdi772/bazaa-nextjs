// One place for the seller rating rules.
//
// MIN_REVIEWS   - below this many reviews we show "New seller" instead of a number.
// PRIOR_MEAN /
// PRIOR_WEIGHT  - pulls small samples toward the middle, like big marketplaces do.
//                 1 review of 5 stars -> 4.1 (hidden anyway), 3 x 5 stars -> 4.5,
//                 50 reviews averaging 4.8 -> 4.8
export const MIN_REVIEWS = 3;
const PRIOR_MEAN = 4.0;
const PRIOR_WEIGHT = 3;

export function adjustedRating(sum: number, count: number): number {
  return (PRIOR_MEAN * PRIOR_WEIGHT + sum) / (PRIOR_WEIGHT + count);
}
