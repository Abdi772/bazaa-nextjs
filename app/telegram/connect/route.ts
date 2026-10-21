import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { adminClient, userFromRequest } from '../../../../lib/telegramServer';

// Creates a one-time code and returns the Telegram link that connects
// the signed-in seller's account to the Jimma bot.
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const admin = adminClient();
  const username = process.env.TELEGRAM_BOT_USERNAME;

  if (!admin || !username || !process.env.TELEGRAM_BOT_TOKEN) {
    return NextResponse.json(
      { error: 'Telegram alerts are not set up yet.' },
      { status: 500 },
    );
  }

  const user = await userFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { error: 'Please log in again.' },
      { status: 401 },
    );
  }

  const code = randomBytes(16).toString('hex');
  const { error } = await admin
    .from('telegram_links')
    .upsert({ user_id: user.id, code }, { onConflict: 'user_id' });

  if (error) {
    return NextResponse.json(
      { error: 'Could not start the connection. Please try again.' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    url: `https://t.me/${username.replace(/^@/, '')}?start=${code}`,
  });
}
