import { NextResponse } from 'next/server';
import { adminClient, sendTelegram } from '../../../../lib/telegramServer';

// Telegram calls this when someone writes to the Jimma bot.
// "/start <code>" connects that Telegram chat to the seller's account.
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return new Response('forbidden', { status: 403 });
  }

  const ok = NextResponse.json({ ok: true });
  const admin = adminClient();
  if (!admin) return ok;

  const update = await req.json().catch(() => null);
  const msg = update?.message;
  const chatId = msg?.chat?.id as number | undefined;
  if (!chatId || msg?.chat?.type !== 'private') return ok;

  const text = String(msg?.text ?? '').trim();
  const match = text.match(/^\/start\s+([A-Za-z0-9_-]{8,64})$/);

  if (match) {
    const { data: row } = await admin
      .from('telegram_links')
      .select('user_id')
      .eq('code', match[1])
      .maybeSingle();

    if (row) {
      await admin
        .from('telegram_links')
        .update({
          chat_id: chatId,
          linked_at: new Date().toISOString(),
          code: null,
        })
        .eq('user_id', row.user_id);

      await sendTelegram(
        chatId,
        '✅ Connected! You will get a message here when someone writes to you on Jimma.',
      );
      return ok;
    }

    await sendTelegram(
      chatId,
      'This link has expired. On Jimma, open Profile → Telegram alerts and tap Connect again.',
    );
    return ok;
  }

  await sendTelegram(
    chatId,
    'Hi! To get message alerts from Jimma, open the site → Profile → Telegram alerts.',
  );
  return ok;
}
