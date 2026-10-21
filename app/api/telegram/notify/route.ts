import { NextResponse } from 'next/server';
import {
  adminClient,
  sendTelegram,
  userFromRequest,
} from '../../../../lib/telegramServer';
import { SITE_URL } from '../../../../lib/siteUrl';

// Called by the chat page right after a message is sent.
// Tells the other person on Telegram, once per run of unread messages.
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const admin = adminClient();
  if (!admin) return NextResponse.json({ sent: false });

  const user = await userFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Please log in.' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const messageId = Number(body?.messageId);
  if (!messageId) {
    return NextResponse.json({ error: 'Missing message.' }, { status: 400 });
  }

  // The message must be the caller's own.
  const { data: msg } = await admin
    .from('messages')
    .select('id, conversation_id, sender_id, body, created_at')
    .eq('id', messageId)
    .maybeSingle();
  if (!msg || msg.sender_id !== user.id) {
    return NextResponse.json({ error: 'Not allowed.' }, { status: 403 });
  }

  const { data: conv } = await admin
    .from('conversations')
    .select('id, buyer_id, seller_id, listings(title)')
    .eq('id', msg.conversation_id)
    .maybeSingle();
  if (!conv) return NextResponse.json({ sent: false });

  const recipient =
    conv.buyer_id === user.id
      ? conv.seller_id
      : conv.seller_id === user.id
        ? conv.buyer_id
        : null;
  if (!recipient) {
    return NextResponse.json({ error: 'Not allowed.' }, { status: 403 });
  }

  // Already told them about earlier unread messages from this sender? Stay quiet.
  const { count } = await admin
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('conversation_id', msg.conversation_id)
    .eq('sender_id', user.id)
    .is('read_at', null)
    .lt('created_at', msg.created_at);
  if ((count ?? 0) > 0) return NextResponse.json({ sent: false });

  const { data: link } = await admin
    .from('telegram_links')
    .select('chat_id')
    .eq('user_id', recipient)
    .maybeSingle();
  if (!link?.chat_id) return NextResponse.json({ sent: false });

  const { data: prof } = await admin
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .maybeSingle();

  const listing = Array.isArray(conv.listings) ? conv.listings[0] : conv.listings;
  const snippet = String(msg.body ?? '').slice(0, 80);
  const lines = [
    '💬 New message on Jimma',
    `${prof?.name ?? 'Someone'}: ${snippet}`,
    listing?.title ? `About: ${listing.title}` : '',
    `${SITE_URL}/messages/${msg.conversation_id}`,
  ].filter(Boolean);

  const sent = await sendTelegram(Number(link.chat_id), lines.join('\n'));
  return NextResponse.json({ sent });
}
