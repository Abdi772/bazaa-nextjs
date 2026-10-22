import * as Sentry from '@sentry/nextjs';

export const dynamic = 'force-dynamic';

// TEMPORARY: sends one test error to Sentry. Delete this file after testing.
export async function GET() {
  Sentry.captureException(new Error('Jimma Sentry test error'));
  await Sentry.flush(2000);
  return new Response('Test error sent. Check Sentry > Issues.');
}
