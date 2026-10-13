'use client';
import { useEffect, useState } from 'react';

const ONLINE_WINDOW_MS = 3 * 60 * 1000;

export default function OnlineDot({ lastSeen }: { lastSeen?: string | null }) {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (!lastSeen) return;
    setOnline(Date.now() - new Date(lastSeen).getTime() < ONLINE_WINDOW_MS);
  }, [lastSeen]);

  if (!online) return null;

  return (
    <span className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white sm:left-2.5 sm:top-2.5">
      <span className="h-2 w-2 rounded-full bg-green-400" />
      online
    </span>
  );
}
