'use client';

import { useLanguage } from './LanguageProvider';

export default function LanguageText({
  k,
}: {
  k: string;
}) {
  const { t } = useLanguage();

  return <>{t(k)}</>;
}
