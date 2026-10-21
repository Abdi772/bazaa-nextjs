import { createClient } from '@supabase/supabase-js';

// Server-only helpers for Telegram alerts. Never import this in a client page.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const botToken = process.env.TELEGRAM_BOT_TOKEN;

export function adminClient() {
  if (!serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Who is calling? Verify the login token the browser sent.
export async function userFromRequest(req: Request) {
  const token = (req.headers.get('authorization') ?? '').replace(
    /^Bearer\s+/i,
    '',
  );
  if (!token) return null;
  const { data, error } = await createClient(url, anonKey).auth.getUser(token);
  return error ? null : data.user;
}

export async function sendTelegram(chatId: number, text: string) {
  if (!botToken) return false;
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
        }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
